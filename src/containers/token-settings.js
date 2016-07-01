import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import Subheader from 'material-ui/Subheader';
import {List, ListItem} from 'material-ui/List';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';
import RaisedButton from 'material-ui/RaisedButton'

import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import Slider from 'material-ui/Slider';

import DeleteIcon from 'material-ui/svg-icons/action/delete';

import {clearTokens, generateTokens, setVolume, addCounter, delCounter, setUser} from "../actions/token-settings"

let VolumeLevel = React.createClass({

    handleChange(event, value) {
        this.props.cb(value);
    },

    render() {
        return (
            <div>
                <small>Volume Level</small>
                <Slider
                    name="volume"
                    min={0}
                    max={10}
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

let CounterList = React.createClass({
    render: function () {
        let counters = [];
        for (let entry of this.props.counters) {
            counters.push(
                <ListItem key={entry} primaryText={entry}
                          rightIcon={<DeleteIcon onTouchTap={this.props.cb.bind(null,entry)} />
                }/>
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
            counterText: "",
            volume: this.props.sound.volume,
            user: this.props.credentials.user,
            password: this.props.credentials.password,
            from: this.props.counter.from,
            till: this.props.counter.till
        })
    },
    displayModalOpen: function () {
        this.setState({modalOpen: true});
    },
    displayModalClose: function () {
        this.setState({modalOpen: false});
    },
    snackbarModalOpen: function () {
        this.setState({snackbarOpen: true});
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
        this.snackbarModalOpen();
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
    saveUser: function () {
        this.props.dispatch(setUser(this.state.user,this.state.password))
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
                        primaryText="Clear All"
                        secondaryText="Clear All tokens"
                        onTouchTap={this.clearTokens}
                    />
                    <Divider />
                    <Subheader>Counters</Subheader>
                    <CounterList counters={this.props.counters} cb={this.delCounter}/>
                    <ListItem>
                        <TextField
                            style={{width: "70%"}} type="text"
                            hintText="Add counters"
                            value={this.state.counterText}
                            onChange={(e) => {this.setState({counterText: e.target.value})}}
                        />
                        <FlatButton primary={true}
                                    disabled={!this.state.counterText}
                                    onTouchTap={this.addCounter}
                                    label="Add"
                        />
                    </ListItem>
                    <Divider />
                    <Subheader>Sound</Subheader>
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
                            onChange={(e) => {this.setState({user: e.target.value})}}
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
                            onChange={(e) => {this.setState({password: e.target.value})}}
                        />
                        <FlatButton primary={true}
                                    disabled={!this.state.user || !this.state.password}
                                    onTouchTap={this.saveUser}
                                    label="Save"
                        />
                    </ListItem>

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
                        onChange={(e) => {this.setState({from: e.target.value})}}
                    /><br/>
                    <TextField
                        type="number"
                        name="till"
                        hintText=""
                        floatingLabelText="Till"
                        value= {this.state.till}
                        onChange={(e) => {this.setState({till: e.target.value})}}
                    />
                </Dialog>
                <Snackbar
                    open={this.state.snackbarOpen}
                    message="Cleared all the Tokens"
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
        counters: state.token.counters
    };
}

export default connect(mapStateToProps, null, null, {pure: false})(TokenSettings);
