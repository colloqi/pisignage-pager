import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import Subheader from 'material-ui/Subheader';
import {List, ListItem} from 'material-ui/List';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton'

import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import Divider from 'material-ui/Divider';
import Slider from 'material-ui/Slider';

import {clearTokens,generateTokens,setVolume} from "../actions/token-settings"

let VolumeLevel = React.createClass ({

    getInitialState: function () {
        return {volume: this.props.volume || 5};
    },

    handleChange(event, value) {
        this.setState({volume: value});
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
                    defaultValue={5}
                    value={this.state.volume}
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


let TokenSettings = React.createClass({
    getInitialState: function(){
        return({
            modalOpen: false,
            from: 1,
            till: 100,
            counters: [],
            tokens: [],
            volume: 5
        })
    },
    displayModal: function(){
        //console.log('modal open');
        this.setState({modalOpen: true});
    },
    displayModalClose: function(){
        this.setState({modalOpen: false});
    },
    generateTokens: function(){
        //console.log('range change');
        //send an Action to generate Tokens
        let tokens = []
        for (let i=parseInt(this.state.from);i<=parseInt(this.state.till);i++) {
            tokens.push(i);
        }
        const {dispatch} = this.props;
        this.displayModalClose()
        dispatch(generateTokens(tokens))
    },
    clearTokens: function(){
        console.log('clear tokens');
        //send an Action to clear Token
        const {dispatch} = this.props;
        dispatch(clearTokens())
    },
    setVolume: function(value){
        console.log('set volume');
        //send an Action to volume
        const {dispatch} = this.props;
        dispatch(setVolume(value))
    },
    render: function () {
        let modelActions = [
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
        ]
        return (
            <div>
                <List>
                    <Subheader>Token Settings</Subheader>
                    <ListItem
                        primaryText="Generate Tokens"
                        secondaryText="Creates tokens between 2 values"
                        onTouchTap={this.displayModal}
                    >
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
                                onChange = {(e) => {this.setState({from: e.target.value})}}
                            /><br/>
                            <TextField
                                type="number"
                                name="till"
                                hintText=""
                                floatingLabelText="Till"
                                onChange = {(e) => {this.setState({till: e.target.value})}}
                            />
                        </Dialog>
                    </ListItem>
                    <ListItem
                        primaryText="Clear All"
                        secondaryText="Clear All tokens"
                        onTouchTap={this.clearTokens}
                    />
                    <Divider />
                    <Subheader>Counters</Subheader>
                    <ListItem
                        primaryText="Default"
                        secondaryText="Touch to Edit"
                    />
                    <ListItem>
                        <TextField
                            style={{width: "70%"}} type="text"
                            hintText="Add more counters"
                        />
                        <FlatButton primary={true} onMouseUp={this.search} label="Add"/>
                    </ListItem>
                    <Divider />
                    <Subheader>Sound</Subheader>
                    <ListItem><VolumeLevel volume={this.props.volume} cb={this.setVolume} /></ListItem>
                </List>
            </div>
        )
    }
})

TokenSettings.propTypes = {
    volume: PropTypes.number.isRequired,
    counters: PropTypes.array.isRequired,
    tokens: PropTypes.array.isRequired
};

function mapStateToProps(state) {
    return {
        volume: state.token.volume,
        counters: state.token.counters,
        tokens: state.token.tokens,
    };
}

export default connect(mapStateToProps)(TokenSettings);
