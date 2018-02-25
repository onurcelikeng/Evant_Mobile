import React from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';
import { Pages } from 'react-native-pages';

const { height: deviceHeight } = Dimensions.get("window");

export default class AddEvent extends React.Component {

    constructor(props) {
        super(props);
    
    }

    render() {
        return (
            <Pages>
                <View style={{ flex: 1, backgroundColor: 'red' }} />
                <View style={{ flex: 1, backgroundColor: 'green' }} />
                <View style={{ flex: 1, backgroundColor: 'blue' }} />
            </Pages>
        );
    }
}