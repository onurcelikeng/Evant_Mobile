import React, { Component } from 'react';
import { StyleSheet, View, StatusBar, AsyncStorage } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import DropDownHolder from './src/providers/dropdownHolder';

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
        <DropdownAlert ref={ref => {DropDownHolder.setDropDown(ref)}} renderImage={() => {}} successColor="#00a65a" errorColor="#dd4b39" warnColor="#f39c12"/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
  }
});