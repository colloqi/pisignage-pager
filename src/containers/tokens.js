import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';

import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import {List, ListItem} from 'material-ui/List'
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

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
                props.secondaryText = <h3>Now Showing for Counter {this.props.selectedCounter}</h3>
                props.ref = "active"
                props.style = {"backgroundColor": "lightBlue"}
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
            openPopover: false,
            anchorEl: null,
            tokenText: "",
            selectedToken: this.props.selectedToken,
            selectedCounter: this.props.selectedCounter
        })
    },
    showPopover: function(event) {
        // This prevents ghost click.
        event.preventDefault();

        this.setState({
            openPopover: true,
            anchorEl: event.currentTarget,
        });
    },

    handleMenuClose: function() {
        this.setState({
            openPopover: false,
        });
    },

    addToken: function () {
        this.props.dispatch(addToken(this.state.tokenText))
        this.setState({tokenText: ""});
    },
    selectCounter: function(token,e) {
        if (this.props.counters.length) {
            this.showPopover(e)
        } else {
            this.props.dispatch(showToken(token))
        }
    },
    dispatchToken: function(counter,e) {
        this.setState({selectedCounter: counter})
        this.props.dispatch(showToken(this.state.selectedToken,counter))
        this.handleMenuClose()
    },
    showToken: function (token, e) {
        this.setState({selectedToken: token})
        this.selectCounter(token,e)
    },
    showNextToken: function (e) {
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
        this.selectCounter(nextToken,e)
    },
    delToken: function (token, e) {
        this.props.dispatch(delToken(token))
    },
    render: function () {
        let counters = [];
        for (let entry of this.props.counters) {
            counters.push(
                <MenuItem
                    key = {entry}
                    primaryText= {<h1>{entry}</h1>}
                    onTouchTap= {this.dispatchToken.bind(null,entry)}
                />
            )
        }

        return (
            <div><List>
                <ListItem>
                    <TextField
                        style={{width: "70%"}} type="number"
                        hintText="Add a token"
                        value={this.state.tokenText}
                        onChange={(e) => {e.stopPropagation();this.setState({tokenText: e.target.value})}}
                    />
                    <FlatButton primary={true}
                                disabled={!this.state.tokenText}
                                onTouchTap={this.addToken}
                                label="Add"
                    />
                </ListItem>
                <TokenList tokens={this.props.tokens}
                           selectedToken={this.props.selectedToken}
                           selectedCounter={this.props.selectedCounter}
                           cbShow={this.showToken}
                           cbDelete={this.delToken}
                />
                {this.props.showFloatingButton ?
                    <FloatingActionButton
                        style={style}
                        secondary={true}
                        onTouchTap={this.showNextToken}
                    >
                        <SkipNext />
                    </FloatingActionButton> : null}
            </List>
            <Popover
                open={this.state.openPopover}
                anchorEl={this.state.anchorEl}
                anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                targetOrigin={{horizontal: 'left', vertical: 'top'}}
                onRequestClose={this.handleRequestClose}
            >
                <Menu>
                    {counters}
                </Menu>
            </Popover>
        </div>

        )
    }
})

Tokens.propTypes = {
    counters: PropTypes.array.isRequired,
    tokens: PropTypes.array.isRequired
};

function mapStateToProps(state, ownProps) {
    //console.log(ownProps)
    return {
        counters: state.token.counters,
        tokens: state.token.tokens,
        selectedToken: state.token.selectedToken,
        selectedCounter: state.token.selectedCounter,
        showFloatingButton: ownProps.showFloatingButton
    };
}

export default connect(mapStateToProps)(Tokens);
