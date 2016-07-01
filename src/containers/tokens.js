import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List'
import Divider from 'material-ui/Divider';

import AddIcon from 'material-ui/svg-icons/content/add-circle-outline';

import DeleteIcon from 'material-ui/svg-icons/action/delete';

import {addToken, delToken} from "../actions/token"

let TokenList = React.createClass({
    render: function () {
        let tokens = [];
        for (let entry of this.props.tokens) {
            tokens.push(
                <ListItem key={entry} primaryText={entry}
                          rightIcon={<DeleteIcon onTouchTap={this.props.cb.bind(this,entry)} />}
                />
            )
        }

        return (
            <div>
                {tokens}
            </div>
        )
    }
})

TokenList.propTypes = {
    tokens: PropTypes.array.isRequired,
    cb: PropTypes.func.isRequired
};




let Tokens = React.createClass({
    getInitialState: function () {
        return ({
            tokenText: ""
        })
    },
    addToken: function () {
        this.props.dispatch(addToken(this.state.tokenText))
        this.setState({tokenText : ""});
    },
    delToken: function (token, e) {
        this.props.dispatch(delToken(token))
    },
    render: function () {
        return (
            <List>
                <ListItem>
                    <TextField
                        style={{width: "70%"}} type="number"
                        hintText="Add a token"
                        value={this.state.tokenText}
                        onChange={(e) => {this.setState({tokenText: e.target.value})}}
                    />
                    <FlatButton primary={true}
                                disabled={!this.state.tokenText}
                                onTouchTap={this.addToken}
                                label="Add"
                    />
                </ListItem>
                <TokenList tokens={this.props.tokens} cb={this.delToken}/>
            </List>
        )
    }
})

Tokens.propTypes = {
    counters: PropTypes.array.isRequired,
    tokens: PropTypes.array.isRequired
};

function mapStateToProps(state) {
    return {
        counters: state.token.counters,
        tokens: state.token.tokens,
    };
}

export default connect(mapStateToProps)(Tokens);
