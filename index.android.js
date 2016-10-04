/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {AppRegistry} from 'react-native';
import {Container, Header, Content, Title, View} from 'native-base';
import App from './src';

class piSignagePagerApp extends Component {
  render() {
    return (
      <Container>
        <Header>
          <Title>piSignage Pager App</Title>
        </Header>
        <View>
          <App />
        </View>
      </Container>
    );
  }
}

AppRegistry.registerComponent('piSignagePagerApp', () => piSignagePagerApp);
