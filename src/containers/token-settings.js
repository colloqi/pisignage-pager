import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {List, ListItem, Button, Icon, CheckBox, InputGroup, Input,
        Text, Row, Card, CardItem, H3, Container, Content} from 'native-base';
import {ToastAndroid, View, Slider, StyleSheet, ScrollView, Dimensions, KeyboardAvoidingView, Modal} from 'react-native';

import {clearTokens, generateTokens, setVolume, addCounter, delCounter, setUser, clearAllSettings, editCounter, deleteOnShow, uploadSoundFile} from "../actions/token-settings"

var {height, width} = Dimensions.get('window');
var style = StyleSheet.create({
    scrollView: {
        height: height - 120
    }
})

let VolumeLevel = React.createClass({

    handleChange(value) {
        this.props.cb(value);
    },

    render() {
        return (
            <View>
                <Text>Volume Level</Text>
                <Slider
                    name="volume"
                    minimumValue={0}
                    maximumValue={100}
                    step={1}
                    value={this.props.volume}
                    onValueChange={this.handleChange}
                />
            </View>
        );
    }
})

VolumeLevel.propTypes = {
    volume: PropTypes.number.isRequired,
    cb: PropTypes.func.isRequired,
};

let RolloverTimer = React.createClass({
    getInitialState: function() {
        return {setTimer: this.props.counter.rollOverTime ? true : false, rollOverTime:this.props.counter.rollOverTime}
    },
    editTimer: function() {
        let counter = this.props.counter;
        counter.rollOverTime = this.state.rollOverTime;
        this.props.editCounter(counter);
    },
    unsetTimer: function(evt) {
        var counter = this.props.counter;
        counter.rollOverTime = null;
        this.props.editCounter(counter);
        this.setState({setTimer: !this.state.setTimer, rollOverTime:null});
    },
    render: function() {
        var timer = <Text></Text>;
        if (this.state.setTimer) {
            timer = <InputGroup iconRight success>
                        <Input onChange={(evt) => {this.setState({rollOverTime: evt.nativeEvent.text})}}
                            value={this.state.rollOverTime} placeholder='Display next token after (seconds)' />
                        <Icon onPress={this.editTimer} name='check-circle' />
                    </InputGroup>;
        }
        return <View>
            <Row>
                <CheckBox onPress={this.unsetTimer} checked={this.state.setTimer} />
                <Text>Auto-display tokens one after another</Text>
            </Row>
            {timer}
        </View>
    }
})

let LifeTimer = React.createClass({
    getInitialState: function() {
        return {setTimer: this.props.counter.lifeTime ? true : false, lifeTime:this.props.counter.lifeTime}
    },
    editTimer: function() {
        let counter = this.props.counter;
        counter.lifeTime = this.state.setTimer ? this.state.lifeTime : null;
        this.props.editCounter(counter);
    },
    unsetTimer: function(evt) {
        var counter = this.props.counter;
        counter.lifeTime = null;
        this.props.editCounter(counter);
        this.setState({setTimer: !this.state.setTimer, lifeTime:null});
    },
    render: function() {
        var timer = <Text></Text>;
        if (this.state.setTimer) {
            timer = <InputGroup iconRight success>
                        <Input onChange={(evt) => {this.setState({lifeTime: evt.nativeEvent.text})}}
                            value={this.state.lifeTime} placeholder='Delete all tokens after (seconds)' />
                        <Icon onPress={this.editTimer} name='check-circle' />
                    </InputGroup>;
        }
        return <View>
                <Row>
                    <CheckBox onPress={this.unsetTimer} checked={this.state.setTimer} />
                    <Text>Delete tokens after pre-set time</Text>
                </Row>
                {timer}
            </View>
    }
})

let DeleteOnShow = React.createClass({
    getInitialState: function() {
        return {counter: this.props.counter};
    },
    toggle: function() {
        var counter = this.props.counter;
        counter.deleteOnShow = !counter.deleteOnShow;
        this.props.editCounter(counter);
        this.setState({counter: counter});
    },
    render: function() {
        var entry = this.state.counter;
        return (
            <View>
                <Row>
                    <CheckBox onPress={this.toggle} checked={entry.deleteOnShow} />
                    <Text>Delete tokens after display</Text>
                </Row>
            </View>
        )
    }
})

let CounterList = React.createClass({
    render() {
        let counters = [];
        for (let entry of this.props.counters) {
            var timers = [
                    <DeleteOnShow counter={entry} editCounter={this.props.editCounter} key={'deleteOnShow'} />,
                    <RolloverTimer counter={entry} editCounter={this.props.editCounter} key='rollOver'/>,
                    <LifeTimer counter={entry} editCounter={this.props.editCounter} key='lifeTime'/>
                ];
            counters.push(
                <ListItem key={entry.name} iconRight>
                    <H3>{entry.name}</H3>
                    {timers}
                    <Icon name='delete' onPress={this.props.cb.bind(null,entry)}/>
                </ListItem>
            )
        }
        return (
            <List>
                {counters}
            </List>
        )
    }
})

CounterList.propTypes = {
    counters: PropTypes.array.isRequired,
    cb: PropTypes.func.isRequired
};

let TokenSettings = React.createClass({
    getInitialState: function () {
        return ({
            modalOpen: false,
            snackbarOpen: false,
            snackbarText: "",
            counterText: "",
            volume: this.props.sound.volume,
            user: this.props.credentials.user,
            password: this.props.credentials.password,
            from: this.props.counter.from,
            till: this.props.counter.till,
        })
    },
    displayModalOpen: function () {
        this.setState({modalOpen: true});
    },
    displayModalClose: function () {
        this.setState({modalOpen: false});
    },
    snackbarModalOpen: function (text) {
        ToastAndroid.showWithGravity(text,ToastAndroid.SHORT,ToastAndroid.TOP);
    },
    generateTokens: function () {
        let tokens = []
        for (let i = parseInt(this.state.from); i <= parseInt(this.state.till); i++) {
            tokens.push(i);
        }
        this.props.dispatch(generateTokens(tokens))
        this.displayModalClose();
    },
    clearTokens: function () {
        this.props.dispatch(clearTokens())
        this.snackbarModalOpen("Cleared all the Tokens");
    },
    addCounter: function () {
        this.props.dispatch(addCounter(this.state.counterText))
        this.setState({counterText: ""});
    },
    delCounter: function (counter, e) {
        this.props.dispatch(delCounter(counter))
    },
    setVolume: function (value) {
        this.setState({volume:value})
        this.props.dispatch(setVolume(value))
    },
    uploadFile: function (evt) {
        console.log(evt.target);
        this.props.dispatch(uploadSoundFile(evt.target.files[0]));
    },
    saveUser: function () {
        this.props.dispatch(setUser(this.state.user,this.state.password))
    },
    clearAllSettings: function () {
        this.props.dispatch(clearAllSettings())
        this.snackbarModalOpen("Cleared all the Settings");
    },
    editCounter: function (counter) {
        this.props.dispatch(editCounter(counter));
    },
    deleteOnShow: function (evt, isChecked) {
        this.props.dispatch(deleteOnShow(isChecked));
    },
    render: function () {
        let counterNames = [];
        for(var counter of this.props.counters) {
            counterNames.push(counter.name);
        }

        let changed = this.state.user != this.props.credentials.user || this.state.password != this.props.credentials.password;
        return (
            <KeyboardAvoidingView behavior='position' style={{flex: 1}}>
                <ScrollView style={style.scrollView} >
                    <ListItem itemDivider><Text>Token Settings</Text></ListItem>
                    <ListItem onPress={this.displayModalOpen} iconLeft>
                        <Text>Generate Tokens</Text>
                        <Text note>Create tokens between 2 values</Text>
                        <Icon name='create' />
                    </ListItem>
                    <ListItem onPress={this.clearTokens} iconLeft>
                        <Text>Clear all Tokens</Text>
                        <Text note>Clears existing Tokens</Text>
                        <Icon name='clear-all' />
                    </ListItem>
                    <ListItem itemDivider><Text>Counters</Text></ListItem>
                    <CounterList counters={this.props.counters} cb={this.delCounter} editCounter={this.editCounter}/>
                    <InputGroup iconRight>
                        <Input placeholder="Add counters"
                            errorText={counterNames.indexOf(this.state.counterText) >= 0 ? 'Counter already exists' : null}
                            value={this.state.counterText}
                            onChange={(e) => {this.setState({counterText: e.nativeEvent.text})}}
                        />
                        <Icon disabled={!this.state.counterText || counterNames.indexOf(this.state.counterText) >= 0}
                                    onPress={this.addCounter} name='add' />
                    </InputGroup>
                    <ListItem itemDivider><Text>Sound</Text></ListItem>
                    <VolumeLevel volume={this.state.volume || 0} cb={this.setVolume}/>
                    <ListItem itemDivider><Text>Player Credentials</Text></ListItem>
                    <InputGroup iconLeft>
                        <Icon name='account-circle' />
                        <Input
                            name="user"
                            hintText=""
                            placeholder="User Name"
                            value={this.state.user}
                            onChange={(e) => {this.setState({user: e.nativeEvent.text})}}
                        />
                    </InputGroup>
                    <InputGroup iconLeft>
                        <Icon name='lock' />
                        <Input
                            name="password"
                            hintText=""
                            placeholder="Password"
                            value={this.state.password}
                            onChange={(e) => {this.setState({password: e.nativeEvent.text})}}
                            secureTextEntry={true}
                        />
                    </InputGroup>
                    <Button disabled={!this.state.user || !this.state.password || !changed} onPress={this.saveUser} block info>
                        <Text>Save</Text>
                    </Button>
                    <ListItem onPress={this.clearAllSettings} iconLeft>
                        <Text>Clear All Settings</Text>
                        <Text note>Delete all settings and goes to default</Text>
                        <Icon name='settings-backup-restore' />
                    </ListItem>
                </ScrollView>
                <Modal
                    visible={this.state.modalOpen} style={{height: height * 0.3}} transparent={true}
                    onRequestClose={this.displayModalClose}
                >
                    <View style={{height: 200, flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)'}}>
                        <View style={{backgroundColor:'#fff'}}>
                            <InputGroup iconLeft success>
                                <Input
                                    keyboardType="numeric"
                                    name="from"
                                    hintText=""
                                    placeholder="From"
                                    value= {this.state.from.toString()}
                                    onChange={(e) => {this.setState({from: e.nativeEvent.text})}}
                                />
                            </InputGroup>
                            <InputGroup iconLeft success >
                                <Input
                                    keyboardType="numeric"
                                    name="till"
                                    hintText=""
                                    placeholder="Till"
                                    value= {this.state.till.toString()}
                                    onChange={(e) => {this.setState({till: e.nativeEvent.text})}}
                                />
                            </InputGroup>
                            <View style={{flex: 2, flexDirection: 'row', justifyContent:'space-between'}}>
                                <Button bordered success onPress={this.generateTokens}>OK</Button>
                                <Button bordered info onPress={this.displayModalClose}>Cancel</Button>
                            </View>
                        </View>
                    </View>
                </Modal>
            </KeyboardAvoidingView>
        )
    }
})

TokenSettings.propTypes = {
    sound: PropTypes.object.isRequired,
    credentials: PropTypes.object.isRequired,
    counter: PropTypes.object.isRequired,
    counters: PropTypes.array.isRequired
};

function mapStateToProps(state) {
    return {
        sound: state.token.settings.sound,
        credentials: state.token.settings.credentials,
        counter: state.token.settings.counter,
        counters: state.token.counters,
        rollOverTime: state.token.settings.rollOverTime,
        deleteOnShow: state.token.settings.deleteOnShow
    };
}

export default connect(mapStateToProps, null, null, {pure: false})(TokenSettings);
