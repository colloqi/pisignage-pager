import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import Subheader from 'material-ui/Subheader';
import {List, ListItem} from 'material-ui/List';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';

import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import Slider from 'material-ui/Slider';

import DeleteIcon from 'material-ui/svg-icons/action/delete';

import {clearTokens, generateTokens, setVolume, addCounter, delCounter, setUser, clearAllSettings, editCounter, deleteOnShow, uploadSoundFile} from "../actions/token-settings"

let VolumeLevel = React.createClass({

    handleChange(event, value) {
        event.stopPropagation();
        this.props.cb(value);
    },

    render() {
        return (
            <div>
                <small>Volume Level</small>
                <Slider
                    name="volume"
                    min={0}
                    max={100}
                    step={1}
                    value={this.props.volume}
                    onChange={this.handleChange}
                />
            </div>
        );
    }
})

VolumeLevel.propTypes = {
    volume: PropTypes.number.isRequired,
    cb: PropTypes.func.isRequired,
};

let RolloverTimer = React.createClass({
    getInitialState: function() {
        return {setTimer: this.props.counter.rollOverTime ? true : false, rollOverTime:this.props.counter.rollOverTime}
    },
    editTimer: function() {
        let counter = this.props.counter;
        counter.rollOverTime = this.state.rollOverTime;
        this.props.editCounter(counter);
    },
    unsetTimer: function(evt, isChecked) {
        var counter = this.props.counter;
        counter.rollOverTime = null;
        this.props.editCounter(counter);
        this.setState({setTimer: isChecked, rollOverTime:null});
    },
    render: function() {
        var timer = <div></div>;
        if (this.state.setTimer) {
            timer = <ListItem><TextField onChange={(evt) => {this.setState({rollOverTime: evt.target.value})}}
                            value={this.state.rollOverTime} floatingLabelText='Display next token after (seconds)' />
                            <FlatButton label='Set timer' onTouchTap={this.editTimer} /></ListItem>;
        }
        return <div>
            <Checkbox onCheck={this.unsetTimer}
                defaultChecked={this.state.setTimer} label='Auto-display tokens one after another' />
            {timer}
        </div>
    }
})

let LifeTimer = React.createClass({
    getInitialState: function() {
        return {setTimer: this.props.counter.lifeTime ? true : false, lifeTime:this.props.counter.lifeTime}
    },
    editTimer: function() {
        let counter = this.props.counter;
        counter.lifeTime = this.state.setTimer ? this.state.lifeTime : null;
        this.props.editCounter(counter);
    },
    render: function() {
        var timer = <div></div>;
        if (this.state.setTimer) {
            timer = <ListItem>
                        <TextField onChange={(evt) => {this.setState({lifeTime: evt.target.value})}}
                            value={this.state.lifeTime} floatingLabelText='Delete all tokens after (seconds)' />
                        <FlatButton label='Set timer' onTouchTap={this.editTimer} />
                    </ListItem>;
        }
        return <div>
            <Checkbox onCheck={(evt, isChecked) => {this.setState({setTimer: isChecked});this.editTimer()}}
                defaultChecked={this.state.setTimer} label='Delete tokens after a pre-set time' />
            {timer}
        </div>
    }
})

let CounterList = React.createClass({
    render: function () {
        let counters = [];
        for (let entry of this.props.counters) {
            let timers = [
                    <Checkbox onCheck={(evt, isChecked) => {entry.deleteOnShow=isChecked; this.props.editCounter(entry)}} defaultChecked={entry.deleteOnShow} label='Delete token after display' />,
                    <RolloverTimer counter={entry} editCounter={this.props.editCounter}/>,
                    <LifeTimer counter={entry} editCounter={this.props.editCounter}/>
                ];
            counters.push(
                <ListItem key={entry.name} primaryText={entry.name} primaryTogglesNestedList={true} 
                          rightIcon={<DeleteIcon onTouchTap={this.props.cb.bind(null,entry)}/>}
                          nestedItems={timers}
                />
            )
        }
        return (
            <div>
                {counters}
            </div>
        )
    }
})

CounterList.propTypes = {
    counters: PropTypes.array.isRequired,
    cb: PropTypes.func.isRequired
};

let TokenSettings = React.createClass({
    getInitialState: function () {
        return ({
            modalOpen: false,
            snackbarOpen: false,
            snackbarText: "",
            counterText: "",
            volume: this.props.sound.volume,
            user: this.props.credentials.user,
            password: this.props.credentials.password,
            from: this.props.counter.from,
            till: this.props.counter.till,
        })
    },
    displayModalOpen: function () {
        this.setState({modalOpen: true});
    },
    displayModalClose: function () {
        this.setState({modalOpen: false});
    },
    snackbarModalOpen: function (text) {
        this.setState({snackbarOpen: true, snackbarText: text});
    },
    snackbarModalClose: function () {
        this.setState({snackbarOpen: false});
    },
    generateTokens: function () {
        let tokens = []
        for (let i = parseInt(this.state.from); i <= parseInt(this.state.till); i++) {
            tokens.push(i);
        }
        this.props.dispatch(generateTokens(tokens))
        this.displayModalClose()
    },
    clearTokens: function () {
        this.props.dispatch(clearTokens())
        this.snackbarModalOpen("Cleared all the Tokens");
    },
    addCounter: function () {
        this.props.dispatch(addCounter(this.state.counterText))
        this.setState({counterText: ""});
    },
    delCounter: function (counter, e) {
        this.props.dispatch(delCounter(counter))
    },
    setVolume: function (value) {
        this.setState({volume:value})
        this.props.dispatch(setVolume(value))
    },
    uploadFile: function (evt) {
        console.log(evt.target);
        this.props.dispatch(uploadSoundFile(evt.target.files[0]));
    },
    saveUser: function () {
        this.props.dispatch(setUser(this.state.user,this.state.password))
    },
    clearAllSettings: function () {
        this.props.dispatch(clearAllSettings())
        this.snackbarModalOpen("Cleared all the Settings");
    },
    editCounter: function (counter) {
        this.props.dispatch(editCounter(counter));
    },
    deleteOnShow: function (evt, isChecked) {
        this.props.dispatch(deleteOnShow(isChecked));
    },
    render: function () {
        const modelActions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={this.displayModalClose}
            />,
            <RaisedButton
                label="Ok"
                primary={true}
                onTouchTap={this.generateTokens}
            />
        ];
        
        let counterNames = [];
        for(var counter of this.props.counters) {
            counterNames.push(counter.name);
        }

        let timer;
        if (this.state.setTimer) {
            timer = <ListItem><TextField onChange={(evt) => {this.setState({rollOverTime: evt.target.value})}}
                            value={this.state.rollOverTime}
                            floatingLabelText='Display next token after (seconds)' />
                            <FlatButton label='Set timer' onTouchTap={this.setRollOverTime} /></ListItem>;
        } else {
            timer = <div></div>;
        }
        
        let changed = this.state.user != this.props.credentials.user || this.state.password != this.props.credentials.password;
        return (
            <div>
                <List>
                    <Subheader>Token Settings</Subheader>
                    <ListItem
                        primaryText="Generate Tokens"
                        secondaryText="Creates tokens between 2 values"
                        onTouchTap={this.displayModalOpen}
                    />
                    <ListItem
                        primaryText="Clear All Tokens"
                        secondaryText="Clears existing Tokens"
                        onTouchTap={this.clearTokens}
                    />
                    
                    <Divider />
                    <Subheader>Counters</Subheader>
                    <CounterList counters={this.props.counters} cb={this.delCounter} editCounter={this.editCounter}/>
                    <ListItem>
                        <TextField
                            style={{width: "70%"}} type="text"
                            hintText="Add counters"
                            errorText={counterNames.indexOf(this.state.counterText) >= 0 ? 'Counter already exists' : null}
                            value={this.state.counterText}
                            onChange={(e) => {e.stopPropagation();this.setState({counterText: e.target.value})}}
                        />
                        <FlatButton primary={true}
                                    disabled={!this.state.counterText || counterNames.indexOf(this.state.counterText) >= 0}
                                    onTouchTap={this.addCounter}
                                    label="Add"
                        />
                    </ListItem>
                    <Divider />
                    <Subheader>Sound</Subheader>
                    <ListItem>
                        <label>Upload audio file to play when a token gets displayed:  
                                        <input type='file' onChange={this.uploadFile} /></ label>
                    </ListItem>
                    <ListItem><VolumeLevel volume={this.state.volume} cb={this.setVolume}/></ListItem>
                    <Divider />
                    <Subheader>Player Credentials</Subheader>
                    <ListItem>
                        <TextField
                            style={{width: "70%"}}
                            type="text"
                            name="user"
                            hintText=""
                            floatingLabelText="User Name"
                            value={this.state.user}
                            onChange={(e) => {e.stopPropagation();this.setState({user: e.target.value})}}
                        />
                    </ListItem>
                    <ListItem>
                        <TextField
                            style={{width: "70%"}}
                            type="password"
                            name="password"
                            hintText=""
                            floatingLabelText="Password"
                            value={this.state.password}
                            onChange={(e) => {e.stopPropagation();this.setState({password: e.target.value})}}
                        />
                        <FlatButton primary={true}
                                    disabled={!this.state.user || !this.state.password || !changed}
                                    onTouchTap={this.saveUser}
                                    label="Save"
                        />
                    </ListItem>
                    <Divider />
                    <ListItem
                        primaryText="Clear All Settings"
                        secondaryText="Delete all settings and goes to default"
                        onTouchTap={this.clearAllSettings}
                    />


                </List>
                <Dialog
                    title="Auto Generate"
                    actions={modelActions}
                    modal={false}
                    open={this.state.modalOpen}
                    onRequestClose={this.displayModalClose}
                >
                    <TextField
                        type="number"
                        name="from"
                        hintText=""
                        floatingLabelText="From"
                        value= {this.state.from}
                        onChange={(e) => {e.stopPropagation();this.setState({from: e.target.value})}}
                    /><br/>
                    <TextField
                        type="number"
                        name="till"
                        hintText=""
                        floatingLabelText="Till"
                        value= {this.state.till}
                        onChange={(e) => {e.stopPropagation();this.setState({till: e.target.value})}}
                    />
                </Dialog>
                <Snackbar
                    open={this.state.snackbarOpen}
                    message={this.state.snackbarText}
                    autoHideDuration={2000}
                    onRequestClose={this.snackbarModalClose}
                />
            </div>
        )
    }
})

TokenSettings.propTypes = {
    sound: PropTypes.object.isRequired,
    credentials: PropTypes.object.isRequired,
    counter: PropTypes.object.isRequired,
    counters: PropTypes.array.isRequired
};

function mapStateToProps(state) {
    return {
        sound: state.token.settings.sound,
        credentials: state.token.settings.credentials,
        counter: state.token.settings.counter,
        counters: state.token.counters,
        rollOverTime: state.token.settings.rollOverTime,
        deleteOnShow: state.token.settings.deleteOnShow
    };
}

export default connect(mapStateToProps, null, null, {pure: false})(TokenSettings);
