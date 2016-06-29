import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

import {Tabs, Tab} from 'material-ui/Tabs';

import TvIcon from 'material-ui/svg-icons/hardware/tv';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import PlayIcon from 'material-ui/svg-icons/av/play-circle-filled';

import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import Dialog from 'material-ui/Dialog';
//import SettingsIcon from 'material-ui/svg-icons/action/account-circle';
import PeopleIcon from 'material-ui/svg-icons/social/people';
import EngagementIcon from 'material-ui/svg-icons/action/assignment';
import TaskIcon from 'material-ui/svg-icons/action/toc';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import urls from '../constants/urls';

import Players from  './players';
import TokenSettings from './token-settings';
import Tokens from './tokens';

let Layout = React.createClass({
    getChildContext: function () {
        return {muiTheme: getMuiTheme(baseTheme)};
    },
    componentDidMount: function () {
        const {dispatch} = this.props;
    },
    getInitialState: function () {
        return {value: 0};
    },
    handleChange: function(value) {
        this.setState({
            value: value
        });
    },
    render: function () {
        return (
            <div>
                <Tabs onChange={this.handleChange} value={this.state.slideIndex}>
                    <Tab icon={<PlayIcon />} label="Tokens" value={0}>
                        <Tokens/>
                    </Tab>
                    <Tab icon={<SettingsIcon />} label="Settings" value={1}>
                        <TokenSettings/>
                    </Tab>
                    <Tab icon={<TvIcon />} label="Displays" value={2} >
                        <Players/>
                    </Tab>
                </Tabs>
            </div>
        );
    }
})

Layout.childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
};

function mapStateToProps(state) {
    return {
        error: state.message,
    };
}

export default connect(mapStateToProps)(Layout);