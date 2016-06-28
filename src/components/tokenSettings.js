import React from 'react';
import Subheader from 'material-ui/Subheader';
import {List, ListItem} from 'material-ui/List';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton'

import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import Divider from 'material-ui/Divider';

let PlayerAdd = React.createClass({
    search: function (e) {
        console.log(e);
    },
    render: function () {
        let style = {width: "70%"};
        return (
            <div>
                <ListItem>
                    <TextField
                        style={style} type="text"
                        hintText="Add only if there are more than 1"
                    />
                    <RaisedButton primary={true} onMouseUp={this.search} label="Add"/>
                </ListItem>
            </div>
        )
    }
})

export default React.createClass({
    getInitialState: function(){
        return({modalOpen: false})
    },
    displayModal: function(){
        console.log('modal open');
        this.setState({modalOpen: true});
    },
    displayModalClose: function(){
        this.setState({modalOpen: false});
    },
    changeRange: function(){
        console.log('range change');
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
                onTouchTap={this.changeRange}
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
                                hintText=""
                                floatingLabelText="From"
                            /><br/>
                            <TextField
                                type="number"
                                hintText=""
                                floatingLabelText="Till"
                            />
                        </Dialog>
                    </ListItem>
                    <ListItem
                        primaryText="Clear All"
                        secondaryText="Clear All tokens"
                    />
                    <Divider />
                    <Subheader>Counters</Subheader>
                    <PlayerAdd />
                    <ListItem
                        primaryText="Default"
                        secondaryText="Touch to Edit"
                    />
                </List>
                <Divider />
                <List>
                    <Subheader>Token Actions</Subheader>
                    <ListItem
                        primaryText="Generate Tokens"
                        secondaryText="Creates tokens between 2 values"
                    />
                    <ListItem
                        primaryText="Clear All"
                        secondaryText="Clear All tokens"
                    />
                </List>
                <Divider />
                <List>
                    <Subheader>Token Actions</Subheader>
                    <ListItem
                        primaryText="Generate Tokens"
                        secondaryText="Creates tokens between 2 values"
                    />
                    <ListItem
                        primaryText="Clear All"
                        secondaryText="Clear All tokens"
                    />
                </List>
                <Divider />
            </div>
        )
    }
})