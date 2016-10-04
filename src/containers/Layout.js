import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

import {Tabs, Icon, View, Header, Title, Container, Content} from 'native-base';
import {ScrollView, StyleSheet} from 'react-native';

import urls from '../constants/urls';
import {displayToken} from '../actions/token';

import Players from  './players';
import TokenSettings from './token-settings';
import Tokens from './tokens';
import customTheme from '../styles/Themes/customTheme';

var style = StyleSheet.create({
    tab: {
        backgroundColor: '#4169E1'
    }
})

let Layout = React.createClass({
    componentDidMount: function () {
        const {dispatch, counters} = this.props;
        
        for(var counter of this.props.counters) {
            counter.rollOverTime ? dispatch(displayToken(null,counter)) : '';
        }
    },
    getInitialState: function () {
        return {value: "tokens"};
    },
    handleChange: function (value) {
        if (typeof value == "string")
            this.setState({
                value: value
            });
        else
            console.log("value is not of string type")
    },
    render: function () {
        return (
            <Tabs onChangeTab={(obj) => this.setState({value: obj.ref})} theme={customTheme}>
                <Tokens tabLabel='Tokens' ref='tokens'/>
                <TokenSettings tabLabel='Settings' ref='settings'/>
                <Players tabLabel='Players' ref='players'/>
            </Tabs>
        );
    }
})

function mapStateToProps(state) {
    return {
        error: state.message,
        counters: state.token.counters
    };
}

export default connect(mapStateToProps)(Layout);