import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import Toggle from 'material-ui/Toggle'

import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton'
import IconButton from 'material-ui/IconButton';
import {List, ListItem} from 'material-ui/List'

import Dialog from 'material-ui/Dialog';

import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';
import DeleteIcon from 'material-ui/svg-icons/action/delete';

import {addPlayer, delPlayer, enablePlayer} from "../actions/player"

let PlayerList = React.createClass({
    render: function () {
        let players = []
        for (let entry of this.props.players) {
            players.push(
                <ListItem key={entry.ip} primaryText={entry.ip}
                          leftIcon={<DeleteIcon onTouchTap={this.props.deleteCb.bind(null,entry)} />}
                          rightToggle={<Toggle  toggled={entry.enabled} onToggle={this.props.enableCb.bind(null,entry)}/>}
                />
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
    enableCb: PropTypes.func.isRequired
};


let Players = React.createClass({
    getInitialState: function () {
        return ({
            playerText: "",
            modalOpen: false,
            startip: this.props.lan.startip,
            endip: this.props.lan.endip
        })
    },
    displayModalOpen: function () {
        this.setState({modalOpen: true});
    },
    displayModalClose: function () {
        this.setState({modalOpen: false});
    },
    addPlayer: function () {
        this.props.dispatch(addPlayer(this.state.playerText))
        this.setState({playerText: ""});
    },
    delPlayer: function (player, e) {
        this.props.dispatch(delPlayer(player.ip))
    },
    enablePlayer: function (player, e) {
        player.enabled = !player.enabled
        this.props.dispatch(enablePlayer(player.ip, player.enabled))
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
                            onChange={(e) => {this.setState({playerText: e.target.value})}}
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
                    <PlayerList players={this.props.players} enableCb={this.enablePlayer} deleteCb={this.delPlayer}/>
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
                        onChange={(e) => {this.setState({startip: e.target.value})}}
                    />
                    <TextField
                        type="text"
                        name="endip"
                        hintText="254"
                        value={this.state.endip}
                        floatingLabelText="Till"
                        onChange={(e) => {this.setState({endip: e.target.value})}}
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
        lan: state.token.settings.lan
    };
}

export default connect(mapStateToProps)(Players);
