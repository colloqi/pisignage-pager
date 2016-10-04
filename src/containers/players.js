import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {List, ListItem, CheckBox, Row, Button, Text, Icon, Switch, InputGroup, Input,
        Card, CardItem, Container, Content, H3} from 'native-base';
import {View, StyleSheet, Picker, ScrollView, Dimensions, KeyboardAvoidingView, Modal} from 'react-native';

import {checkPlayer, delPlayer, updatePlayer, scanNetwork, assignCounter} from "../actions/player";

var {height, width} = Dimensions.get('window');
var style = StyleSheet.create({
    active: {
        backgroundColor: '#90EE90'
    },
    inactive: {
        
    },
    scroll: {
        height: height - 60
    }
});

let Settings = React.createClass({
    render: function () {
        var entry = this.props.entry;
        return (
            <CardItem>
                <Text note>{entry.active ? entry.name : ''}</Text>
                <Picker iosHeader='Select counter for the player' selectedValue={entry.counter}
                            mode='dropdown' enabled={entry.active}
                            onValueChange={this.props.counterCb.bind(null, entry)} >
                    {this.props.countersList}
                </Picker>
                <Text>{entry.errorMessage || ''}</Text>
            </CardItem>
        )
    }
})

let PlayerList = React.createClass({
    render: function () {
        let players = [],  props = this.props;
        this.props.players.forEach(function(entry) {
            var counter = props.counters.find(function(obj) { return obj.name == entry.counter.name}),
                countersList = [], children = <View></View>;
            for(var counter of props.counters) {
                countersList.push(<Picker.Item value={counter} label={counter.name} key={counter.name} />);
            }
            players.push(
                <View key={entry.ip} style={entry.active ? style.active : style.inactive} iconLeft>
                    <CardItem header>
                        <Icon name='delete' onPress={props.deleteCb.bind(null,entry)} />
                        <Text>{entry.ip}</Text>
                        <Switch value={entry.enabled} onValueChange={props.enableCb.bind(null,entry)}/>
                    </CardItem>
                    {entry.enabled ? <Settings entry={entry} counterCb={props.counterCb} countersList={countersList}/> : <View></View>}
                </View>
            )
        })

        return (
            <ScrollView style={style.scroll}>
                {players}
            </ScrollView>
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
    setCounter: function(player, item, index) {
        this.props.dispatch(assignCounter(player,item));
    },
    delPlayer: function (player, e) {
        this.props.dispatch(delPlayer(player))
    },
    enablePlayer: function (player, e) {
        player.enabled = !player.enabled
        this.props.dispatch(updatePlayer(player))
    },
    scanNetwork: function() {
        this.props.dispatch(scanNetwork(this.state.startip, this.state.endip))
        this.displayModalClose()    
    },
    render: function () {
        
        return (
            <Container>
                <Content>
                    <InputGroup success>
                        <Icon name='refresh' onPress={this.displayModalOpen} />
                        <Input
                            keyboardType='numeric'
                            placeholder="Add a player IP"
                            value={this.state.playerText}
                            onChange={(evt) => {this.setState({playerText: evt.nativeEvent.text})}}
                        />
                        <Icon disabled={!this.state.playerText} onPress={this.addPlayer} name='add' />
                    </InputGroup>
                    <PlayerList players={this.props.players} counterCb={this.setCounter} counters={this.props.counters} enableCb={this.enablePlayer} deleteCb={this.delPlayer}/>
                    <KeyboardAvoidingView behavior='position'>
                        <Modal
                            style={{height: height * 0.3}} visible={this.state.modalOpen}
                            onRequestClose={this.displayModalClose} transparent={true}
                        >
                            <View style={{height: 200, flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)'}}>
                                <View style={{backgroundColor:'#fff'}}>
                                    <InputGroup success>
                                        <Input
                                            keyboardType='numeric'
                                            name="startip"
                                            value={this.state.startip}
                                            placeholder="Start Address"
                                            onChange={(evt) => {this.setState({startip: evt.nativeEvent.text})}}
                                        />
                                    </InputGroup>
                                    <InputGroup success>
                                        <Input
                                            keyboardType="numeric"
                                            name="endip"
                                            value={this.state.endip}
                                            placeholder="Till"
                                            onChange={(evt) => {this.setState({endip: evt.nativeEvent.text})}}
                                        />
                                    </InputGroup>
                                    <View style={{flex: 2, flexDirection: 'row', justifyContent:'space-between'}}>
                                        <Button bordered success onPress={this.scanNetwork}>Scan</Button>
                                        <Button bordered info onPress={this.displayModalClose}>Cancel</Button>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </KeyboardAvoidingView>
                </Content>
            </Container>
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
