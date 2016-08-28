import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import Toggle from 'material-ui/Toggle'

import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton'
import IconButton from 'material-ui/IconButton';
import {List, ListItem} from 'material-ui/List'

import Dialog from 'material-ui/Dialog';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';

import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';
import DeleteIcon from 'material-ui/svg-icons/action/delete';

import {checkPlayer, delPlayer, updatePlayer, scanNetwork, assignCounter} from "../actions/player";

let PlayerList = React.createClass({
    render: function () {
        let players = [], countersList = [];
        for(var counter of this.props.counters) {
            countersList.push(<MenuItem value={counter} primaryText={counter.name} key={counter.name} />);
        }
        for (let entry of this.props.players) {
            let props = {
                key: entry.ip,
                primaryText: <h3>{entry.ip}</h3>,
                leftIcon: <DeleteIcon onTouchTap={this.props.deleteCb.bind(null,entry)} />,
                rightToggle:<Toggle toggled={entry.enabled} onToggle={this.props.enableCb.bind(null,entry)}/>
            }
            if (entry.active) {
                props.secondaryText = <h4>{entry.name}</h4>
                props.style = {"backgroundColor": "lightGreen"}
            }
            if (entry.enabled) {
                props.children = <ListItem>
                                    <SelectField floatingLabelText='Select counter for the player' value={entry.counter}
                                                onChange={this.props.counterCb.bind(null, entry)} >
                                        {countersList}
                                    </SelectField>
                                    <FlatButton />
                                </ListItem>;
            }
            players.push(
                <ListItem {...props} />
            )
        }

        return (
            <div>
                {players}
            </div>
        )
    }
})

PlayerList.propTypes = {
    players: PropTypes.array.isRequired,
    deleteCb: PropTypes.func.isRequired,
    enableCb: PropTypes.func.isRequired,
    counterCb: PropTypes.func.isRequired
};


let Players = React.createClass({
    componentDidMount: function() {
        const {players,dispatch} = this.props
        setInterval(function(){
            for (let entry of players) {
                dispatch(checkPlayer(entry.ip))
            }
        },30000)
    },
    getInitialState: function () {
        for (let entry of this.props.players) {
            this.props.dispatch(checkPlayer(entry.ip))
        }
        return ({
            playerText: "",
            modalOpen: false,
            startip: this.props.lan.startip,
            endip: this.props.lan.endip,
            players: this.props.players
        })
    },
    displayModalOpen: function () {
        this.setState({modalOpen: true});
    },
    displayModalClose: function () {
        this.setState({modalOpen: false});
    },
    addPlayer: function () {
        this.props.dispatch(checkPlayer(this.state.playerText))
        this.setState({playerText: ""});
    },
    setCounter: function(player, evt, index, item) {
        this.props.dispatch(assignCounter(player,item));
    },
    delPlayer: function (player, e) {
        this.props.dispatch(delPlayer(player))
    },
    enablePlayer: function (player, e) {
        e.stopPropagation();
        player.enabled = !player.enabled
        this.props.dispatch(updatePlayer(player))
    },
    scanNetwork: function() {
        this.props.dispatch(scanNetwork(this.state.startip, this.state.endip))
        this.displayModalClose()    
    },
    render: function () {
        const modelActions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={this.displayModalClose}
            />,
            <RaisedButton
                label="Scan"
                primary={true}
                onTouchTap={this.scanNetwork}
            />
        ];

        return (
            <div>
                <List>
                    <ListItem>
                        <TextField
                            style={{width: "60%"}} type="text"
                            hintText="Add a player IP"
                            value={this.state.playerText}
                            onChange={(e) => {e.stopPropagation();this.setState({playerText: e.target.value})}}
                        />
                        <FlatButton primary={true}
                                    disabled={!this.state.playerText}
                                    onTouchTap={this.addPlayer}
                                    primary={true}
                                    label="Add"
                        />
                        <IconButton onTouchTap={this.displayModalOpen}>
                            <RefreshIcon />
                        </IconButton>
                    </ListItem>
                    <PlayerList players={this.props.players} counterCb={this.setCounter} counters={this.props.counters} enableCb={this.enablePlayer} deleteCb={this.delPlayer}/>
                </List>
                <Dialog
                    title="Select Address Range"
                    actions={modelActions}
                    modal={false}
                    open={this.state.modalOpen}
                    onRequestClose={this.displayModalClose}
                >
                    <TextField
                        type="text"
                        name="startip"
                        hintText="192.168.1.1"
                        value={this.state.startip}
                        floatingLabelText="Start Address"
                        onChange={(e) => {e.stopPropagation();this.setState({startip: e.target.value})}}
                    />
                    <TextField
                        type="text"
                        name="endip"
                        hintText="254"
                        value={this.state.endip}
                        floatingLabelText="Till"
                        onChange={(e) => {e.stopPropagation();this.setState({endip: e.target.value})}}
                    />
                </Dialog>
            </div>
        )
    }
})

Players.propTypes = {
    players: PropTypes.array.isRequired
};

function mapStateToProps(state) {
    return {
        players: state.token.players,
        lan: state.token.settings.lan,
        counters: state.token.counters
    };
}

export default connect(mapStateToProps, null, null, {pure: false})(Players);
