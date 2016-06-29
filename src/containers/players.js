import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import Toggle from 'material-ui/Toggle'

import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import {List, ListItem} from 'material-ui/List'

import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';
import DeleteIcon from 'material-ui/svg-icons/action/delete';

import {addPlayer, delPlayer} from "../actions/player"

let PlayerList = React.createClass({
    render: function () {
        let players = []
        for (let entry of this.props.players) {
            players.push(
                <ListItem key={entry} primaryText={entry}
                          leftIcon={<DeleteIcon onTouchTap={this.props.cb.bind(this,entry)} />}
                          rightToggle={<Toggle />}
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
    cb: PropTypes.func.isRequired
};


let Players = React.createClass({
    getInitialState: function () {
        return ({
            playerText: ""
        })
    },
    addPlayer: function () {
        console.log("adding Player")
        this.props.dispatch(addPlayer(this.state.playerText))
        this.state.playerText = "";
    },
    delPlayer: function (player, e) {
        this.props.dispatch(delPlayer(player))
    },
    render: function () {
        return (
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
                    <IconButton>
                        {<RefreshIcon onTouchTap={this.addPlayer}/>}
                    </IconButton>
                </ListItem>
                <PlayerList players={this.props.players} cb={this.delPlayer}/>
            </List>
        )
    }
})

Players.propTypes = {
    players: PropTypes.array.isRequired
};

function mapStateToProps(state) {
    return {
        players: state.token.players,
    };
}

export default connect(mapStateToProps)(Players);
