import React, {Component, PropTypes} from 'react';
import {Provider} from 'react-redux';
import App from './App';
import {View} from 'react-native';

export default class Root extends Component {
    render() {
        const {store} = this.props;
        return (
            /**
             * Provider is a component provided to us by the 'react-redux' bindings that
             * wraps our app - thus making the Redux store/state available to our 'connect()'
             * calls in component hierarchy below.
             */
            <Provider store={store}>
                <View>
                    <App />
                </View>
            </Provider>
        );
    }
};

Root.propTypes = {
    store: PropTypes.object.isRequired
}
