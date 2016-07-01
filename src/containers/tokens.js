import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';

import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import {List, ListItem} from 'material-ui/List'
import Divider from 'material-ui/Divider';

import AddIcon from 'material-ui/svg-icons/content/add-circle-outline';
import SkipNext from 'material-ui/svg-icons/av/skip-next';

import DeleteIcon from 'material-ui/svg-icons/action/delete';

import {addToken, showToken, delToken} from "../actions/token"

const style = {
    bottom: 20,
    right: 20,
    position: "fixed"
};


let TokenList = React.createClass({
    componentDidUpdate(prevProps) {
        if (this.props.selectedToken !== prevProps.selectedToken) {
            this.scrollToTop();
        }
    },
    scrollToTop() {
        var itemComponent = this.refs.active;
        if (itemComponent) {
            var domNode = ReactDOM.findDOMNode(itemComponent);
            domNode.scrollIntoView(true)
        }
    },
    render: function () {
        let tokens = [];
        for (let entry of this.props.tokens) {
            let props = {
                key: entry,
                primaryText: <h1>{entry}</h1>,
                onTouchTap: this.props.cbShow.bind(null, entry),
                rightIcon: <DeleteIcon onTouchTap={this.props.cbDelete.bind(null,entry)}/>
            }
            if (this.props.selectedToken == entry) {
                props.secondaryText = "Now Showing"
                props.ref = "active"
            }
            tokens.push(
                <ListItem {...props} />
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
    cbShow: PropTypes.func.isRequired,
    cbDelete: PropTypes.func.isRequired
};


let Tokens = React.createClass({
    getInitialState: function () {
        return ({
            tokenText: "",
            selectedToken: this.props.selectedToken
        })
    },
    addToken: function () {
        this.props.dispatch(addToken(this.state.tokenText))
        this.setState({tokenText: ""});
    },
    showToken: function (token, e) {
        this.setState({selectedToken: token})
        this.props.dispatch(showToken(token))
    },
    showNextToken: function () {
        const index = this.props.tokens.indexOf(this.state.selectedToken)
        let nextToken;
        if (index == -1) {
            nextToken = this.props.tokens[0];
        } else if (index < (this.props.tokens.length - 1)) {
            nextToken = this.props.tokens[index + 1];
        } else {
            return;
        }
        this.setState({selectedToken: nextToken})
        this.props.dispatch(showToken(nextToken))
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
                <TokenList tokens={this.props.tokens}
                           selectedToken={this.props.selectedToken}
                           cbShow={this.showToken}
                           cbDelete={this.delToken}
                />
                {this.props.showFloatingButton?
                    <FloatingActionButton
                        style={style}
                        onTouchTap={this.showNextToken}
                    >
                        <SkipNext />
                    </FloatingActionButton> : null}
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
        selectedToken: state.token.selectedToken
    };
}

export default connect(mapStateToProps)(Tokens);
