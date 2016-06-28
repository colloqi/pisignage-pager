import React from 'react';
import Subheader from 'material-ui/Subheader';
import {List, ListItem} from 'material-ui/List';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton'

import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import Divider from 'material-ui/Divider';
import Slider from 'material-ui/Slider';

let VolumeLevel = React.createClass ({

    getInitialState: function () {
        return {volume: this.props.volume || 5};
    },

    handleChange(event, value) {
        this.setState({volume: value});
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

export default React.createClass({
    render: function () {
        return (
            <div>
                <List>
                    <Subheader>Token Settings</Subheader>
                    <ListItem
                        primaryText="Generate Tokens"
                        secondaryText="Creates tokens between 2 values"
                    />
                    <ListItem
                        primaryText="Clear All"
                        secondaryText="Clear All tokens"
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
                    <ListItem><VolumeLevel/></ListItem>
                </List>
            </div>
        )
    }
})