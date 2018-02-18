import React, { Component } from 'react';
import { StyleSheet, View, StatusBar, AsyncStorage } from 'react-native';
import OneSignal from 'react-native-onesignal';

import {bootstrap} from './src/config/bootstrap';
import Routes from './src/Routes';
import {data} from './src/data'

bootstrap();
data.populateData();

export default class App extends React.Component {

  static deviceId = "";

  componentWillMount() {
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('registered', this.onRegistered);
    OneSignal.addEventListener('ids', this.onIds);
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('registered', this.onRegistered);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onReceived(notification) {
      console.log("Notification received: ", notification);
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  onRegistered(notifData) {
      console.log("Device had been registered for push notifications!", notifData);
  }

  onIds(device) {
    AsyncStorage.setItem("deviceId", device.userId);
    App.deviceId = device.userId;
    console.log(App.deviceId);
    console.log('Device info: ', device);
  }

  static getId() {
    return App.deviceId;
  }

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