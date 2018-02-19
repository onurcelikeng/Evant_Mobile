import React, { Component } from 'react';
import { StyleSheet, View, StatusBar, AsyncStorage } from 'react-native';

import {bootstrap} from './src/config/bootstrap';
import Routes from './src/Routes';
import {data} from './src/data'

bootstrap();
data.populateData();

export default class App extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <Routes/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
  }
});