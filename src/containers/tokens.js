import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import immutable,{List as ImmutableList} from 'immutable';

import {Icon, InputGroup, Input, Row, List, ListItem, Text, Button, Textarea, Content, H3, Container} from 'native-base';
import {View, StyleSheet, ScrollView, Dimensions, Modal, ListView, RecyclerViewBackedScrollView} from 'react-native';

import {newToken, displayToken, removeToken} from "../actions/token"

const {height, width} = Dimensions.get('window');
const style = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom:150,
        right: 150,
        backgroundColor: '#FF69B4',
    },
    scroll: {
        height: height - 150
    }
});

const generateRow = function(data) {
    return (<ListItem key={data.entry} {...data.props} onPress={data.cbShow.bind(null, data.entry)} iconRight >
       <Icon name='delete' onPress={data.cbDelete.bind(null,data.entry)} />
       <Text note>{data.counters.length > 0 ? 'Now Showing for Counters: '+data.counters.toString() : ''}</Text>
       <H3>{data.entry}</H3>
   </ListItem>)
};

class TokenList extends Component {
    _tokens = []
    _dataSource
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({
            rowHasChanged: (r1,r2) => (r1.props.ref !== r2.props.ref || r1.entry !== r2.entry ||
                                                r1.counters.length !== r2.counters.length)
        });
        this._dataSource = ds.cloneWithRows(this._tokens)
        this.state = {ds: ds};
    }
    shouldComponentUpdate(props) {
        var updated = false;
        if (Object.values(this.props.showingTokens).filter(x => Object.values(props.showingTokens).indexOf(x) == -1).length > 0) {
            updated = true;
        } else if (Object.values(props.showingTokens).filter(x => Object.values(this.props.showingTokens).indexOf(x) == -1).length > 0) {
            updated = true;
        }
        return (this.props.tokens.length !== props.tokens.length || !updated)
    }
    componentWillReceiveProps(nextProps) {
        this._tokens = [];
        for (let entry of nextProps.tokens) {
            let props = {}, counters = [],
                data = {
                    props,
                    entry,
                    counters,
                    cbShow: nextProps.cbShow,
                    cbDelete: nextProps.cbDelete
                };
            if (nextProps.selectedToken == entry || (nextProps.showingTokens && Object.values(nextProps.showingTokens).indexOf(entry) >= 0)) {
                for(var key in nextProps.showingTokens) {
                    nextProps.showingTokens[key] == entry ? data.counters.push(key) : '';
                }
                data.props.ref = "active"
                data.props.style = {"backgroundColor": "#ADD8E6"}
            }
            this._tokens.push(data);
        }
        this._dataSource = this.state.ds.cloneWithRows(this._tokens)
    }
    render () {
        return (
            <ListView dataSource={this._dataSource} initialListSize={10}
                                        renderRow={generateRow} enableEmptySections={true} pageSize={1}
                                        renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}/>
        )
    }
}

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
            selectedCounter: this.props.selectedCounter,
            updateTokensList: false
        })
    },
    showPopover: function(event) {
        // This prevents ghost click.
        event ? event.preventDefault() : '';

        this.setState({
            openPopover: true
        });
    },

    handleMenuClose: function() {
        this.setState({
            openPopover: false,
        });
    },

    addToken: function () {
        this.props.dispatch(newToken(this.state.tokenText))
        this.setState({tokenText: "", updateTokensList: true});
    },
    selectCounter: function(token,e) {
        if (this.props.counters.length) {
            this.showPopover(e)
        } else {
            this.props.dispatch(displayToken(token))
        }
    },
    dispatchToken: function(counter,e) {
        this.handleMenuClose()
        this.setState({selectedCounter: counter, updateTokensList: true})
        this.props.dispatch(displayToken(this.state.selectedToken,counter))
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
        this.props.dispatch(removeToken(token))
        this.setState({updateTokensList: true})
    },
    changeToken: function(evt) {
        this.setState({tokenText: evt.nativeEvent.text});
    },
    render: function () {
        let counters = [];
        for (let entry of this.props.counters) {
            counters.push(
                <ListItem key = {entry.name} onPress= {this.dispatchToken.bind(null,entry)} button>
                    <Text>{entry.name}</Text>
                </ListItem>
            )
        }

        return (
            <View style={{flex:1}}>
                <InputGroup borderType='underline' iconRight success>
                    <Input placeholder="Add a token" keyboardType='numeric'
                        value={this.state.tokenText}
                        onChange={this.changeToken}
                    />
                    <Icon name='add' onPress={this.addToken}/>
                </InputGroup>
                <TokenList tokens={this.props.tokens}
                       selectedToken={this.props.selectedToken}
                       selectedCounter={this.props.selectedCounter}
                       showingTokens={this.props.showingTokens}
                       cbShow={this.showToken}
                       cbDelete={this.delToken}
                />
                <Button style={style.fab} onPress={this.showNextToken} rounded large>
                    <Icon name='skip-next' />
                </Button>
                <Modal
                    visible={this.state.openPopover} ref={'Modal'} transparent={true}
                    onRequestClose={this.handleMenuClose}
                >
                    <ScrollView contentContainerStyle={{height: 200, flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)'}}>
                        <View style={{backgroundColor: '#fff'}}>
                            {counters}
                        </View>
                    </ScrollView>
                </Modal>
            </View>
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
        showingTokens: state.token.showingTokens
    };
}

export default connect(mapStateToProps)(Tokens);
