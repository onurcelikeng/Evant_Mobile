import React from 'react';
import { View, Image, Keyboard, AsyncStorage } from 'react-native';
import { RkButton, RkText, RkTextInput, RkStyleSheet, RkTheme } from 'react-native-ui-kitten';
import {Actions} from 'react-native-router-flux';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import OneSignal from 'react-native-onesignal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import DropdownHolder from '../providers/dropdownHolder';
import * as accountProvider from '../providers/account';
import * as deviceProvider from '../providers/devices';
import {scale, scaleModerate, scaleVertical} from '../utils/scale';
import Login from './login'

export default class Signup extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordRepeat: ''
    };
  }

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
    playerId = device.userId;
  }

  signup() {
    var credentials = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      password: this.state.password
    };

    if(this.state.password == this.state.passwordRepeat) {
      return accountProvider.register(credentials)
      .then((responseJson) => {
        if(responseJson.isSuccess) {
          var loginCredentials = {
            email: this.state.email,
            password: this.state.password
          }
          accountProvider.login(loginCredentials).then((responseJson) => {
            if(responseJson.isSuccess) {
              this.setState({
                token: responseJson.data.token,
                }, function() {
                  AsyncStorage.setItem('token', this.state.token);
                  axios.defaults.headers.common['Authorization'] = `Bearer ${this.state.token}`;
                  
                  const brand = DeviceInfo.getBrand();
                  const model = DeviceInfo.getModel();
                  const systemName = DeviceInfo.getSystemName();
                  const systemVersion = DeviceInfo.getSystemVersion();

                  let deviceProperties = {
                    deviceId: playerId,
                    brand: brand,
                    model: model,
                    os: systemName + " " + systemVersion
                  }
                  
                  deviceProvider.addUserDevice(deviceProperties).then((responseJson) => {
                    console.log(responseJson);
                    if(responseJson.isSuccess) {
                      accountProvider.getMe().then((responseJson) => {
                        if(responseJson.isSuccess) {
                          Login.setCurrentUser(responseJson.data);
                          Actions.tabbar();
                        } else {
                          DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
                        }
                      });
                    }
                    else {
                      DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
                    }
                  })
                  .catch(error => console.log(error));
              });
            }
            else {
              DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
            }
          }) 
        } else {
          DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    }
    else {
      DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
    }
  }

  _scrollToInput (reactNode) {
    // Add a 'scroll' ref to your ScrollView
    this.scroll.props.scrollToFocusedInput(reactNode)
  }

	render() {
    let renderIcon = () => {
      if (RkTheme.current.name === 'light')
        return <Image style={styles.image} source={require('../assets/images/evant_logo.png')}/>;
      return <Image style={styles.image} source={require('../assets/images/logoDark.png')}/>
    };
    return (
      <KeyboardAwareScrollView innerRef={ref => {this.scroll = ref}}
        resetScrollToCoords={{ x: 0, y: 0 }}
        onStartShouldSetResponder={ (e) => true}
        contentContainerStyle={[styles.screen, {alignItems:"stretch"}]}
        onResponderRelease={ (e) => Keyboard.dismiss()}>
        <View style={{alignItems: 'center'}}>
          {renderIcon()}
          <RkText rkType='h1'>Registration</RkText>
        </View>
        <View style={styles.content}>
          <View>
            <RkTextInput 
              onFocus={(event) => {
                this._scrollToInput(ReactNative.findNodeHandle(event.target))
              }} 
              autoCapitalize='none' 
              value={this.state.firstName} 
              onChangeText={(text) => this.setState({ firstName: text })} 
              autoCorrect={false} 
              style={{marginHorizontal: 10, marginBottom: -3}} 
              rkType='rounded' 
              placeholder='Name'/>
            <RkTextInput 
              onFocus={(event) => {
                this._scrollToInput(ReactNative.findNodeHandle(event.target))
              }} 
              autoCapitalize='none' 
              value={this.state.lastName} 
              onChangeText={(text) => this.setState({ lastName: text })} 
              autoCorrect={false} 
              style={{marginHorizontal: 10, marginBottom: -3}} 
              rkType='rounded' 
              placeholder='Surname'/>
            <RkTextInput 
              onFocus={(event) => {
                this._scrollToInput(ReactNative.findNodeHandle(event.target))
              }} 
              autoCapitalize='none' 
              value={this.state.email} 
              onChangeText={(text) => this.setState({ email: text })} 
              autoCorrect={false} 
              style={{marginHorizontal: 10, marginBottom: -3}} 
              rkType='rounded' 
              placeholder='Email'/>
            <RkTextInput 
              onFocus={(event) => {
                this._scrollToInput(ReactNative.findNodeHandle(event.target))
              }} 
              autoCapitalize='none' 
              value={this.state.password} 
              onChangeText={(text) => this.setState({ password: text })} 
              autoCorrect={false} 
              style={{marginHorizontal: 10, marginBottom: -3}} 
              rkType='rounded' 
              placeholder='Password' 
              secureTextEntry={true}/>
            <RkTextInput 
              onFocus={(event) => {
                this._scrollToInput(ReactNative.findNodeHandle(event.target))
              }} 
              autoCapitalize='none' 
              value={this.state.passwordRepeat} 
              onChangeText={(text) => this.setState({ passwordRepeat: text })} 
              autoCorrect={false} 
              style={{marginHorizontal: 10}} 
              rkType='rounded' 
              placeholder='Confirm Password' 
              secureTextEntry={true}/>
            <RkButton onPress={ () => this.signup() } rkType='medium stretch rounded' style={styles.save}>SIGN UP</RkButton>
          </View>
          <View style={styles.footer}>
            <View style={styles.textRow}>
              <RkText rkType='primary3'>Already have an account?</RkText>
              <RkButton rkType='clear'  onPress={() => Actions.pop() }>
                <RkText rkType='header6'> Sign in now </RkText>
              </RkButton>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  screen: {
    padding: 16,
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: theme.colors.screen.base
  },
  image: {
    marginBottom: 10,
    height:scaleVertical(77),
    resizeMode:'contain'
  },
  content: {
    justifyContent: 'space-between'
  },
  save: {
    marginVertical: 20,
    backgroundColor: '#FF5E20',
    marginHorizontal: 10
  },
  buttons: {
    flexDirection: 'row',
    marginBottom: 24,
    marginHorizontal: 24,
    justifyContent: 'space-around'
  },
  footer:{
    justifyContent:'flex-end'
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
}));