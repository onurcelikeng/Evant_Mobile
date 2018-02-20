import React, { Component } from 'react';
import { View, Image, Dimensions, Keyboard, AsyncStorage } from 'react-native';
import { RkButton, RkText, RkTextInput, RkAvoidKeyboard, RkStyleSheet, RkTheme } from 'react-native-ui-kitten';
import {Actions} from 'react-native-router-flux';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import OneSignal from 'react-native-onesignal';

import App from '../../App';
import * as deviceProvider from '../providers/devices';
import * as accountProvider from '../providers/account';
import { FontAwesome } from '../assets/icon';
import {scale, scaleModerate, scaleVertical} from '../utils/scale';

var appId = '';
export default class Login extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
        email: '',
        password: ''
    };
  }

  static currentUser = {
    name: '',
    photo: '',
    followersCount: 0,
    followingsCount: 0,
    userId: '',
    settings: {
      language: '',
      theme: ''
    }
  };

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

  login() {
    var credentials = {
      email: this.state.email,
      password: this.state.password
    };

    return accountProvider.login(credentials)
		.then((responseJson) => {
			if(responseJson.isSuccess) {
				this.setState({
					token: responseJson.data,
				  }, function() {
            console.log(this.state.token)
            AsyncStorage.setItem("token", this.state.token);
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
                    console.log(responseJson.data)
                    Login.currentUser.userId = responseJson.data.userId;
                    Login.currentUser.name = responseJson.data.firstName + ' ' + responseJson.data.lastName;
                    Login.currentUser.photo = responseJson.data.photoUrl;
                    Login.currentUser.followersCount = responseJson.data.followersCount;
                    Login.currentUser.followingsCount = responseJson.data.followingsCount;
                    Login.currentUser.settings.theme = responseJson.data.settings.theme;
                    Login.currentUser.settings.language = responseJson.data.settings.language;
                    Actions.home();
                  }
                });
              }
              else {
                alert(this.state.appId);
              }
            })
            .catch(error => console.log(error));
				});
			} else {
				console.error("cannot login");
			}
		})
		.catch((error) => {
		  console.error(error);
		});
  }

  static getCurrentUser() {
    return Login.currentUser;
  }

  _renderImage(image) {
    let contentHeight = scaleModerate(375, 1);
    let height = Dimensions.get('window').height - contentHeight;
    let width = Dimensions.get('window').width;

    if (RkTheme.current.name === 'light')
      image = (<Image style={[styles.image, {height, width}]}
        source={require('../assets/images/backgroundLoginV1.png')}/>);
    else
      image = (<Image style={[styles.image, {height, width}]}
        source={require('../assets/images/backgroundLoginV1DarkTheme.png')}/>);
    return image;
  }

	render() {
    let image = this._renderImage();
    
    return (
      <RkAvoidKeyboard
        onStartShouldSetResponder={ (e) => true}
        onResponderRelease={ (e) => Keyboard.dismiss()}
        style={styles.screen}>
        {image}
        <View style={styles.container}>
          <View style={styles.buttons}>
            <RkButton style={styles.button} rkType='social'>
              <RkText rkType='awesome hero accentColor'>{FontAwesome.twitter}</RkText>
            </RkButton>
            <RkButton style={styles.button} rkType='social'>
              <RkText rkType='awesome hero accentColor'>{FontAwesome.google}</RkText>
            </RkButton>
            <RkButton style={styles.button} rkType='social'>
              <RkText rkType='awesome hero accentColor'>{FontAwesome.facebook}</RkText>
            </RkButton>
          </View>
          <RkTextInput autoCapitalize='none' value={this.state.email} onChangeText={(text) => this.setState({ email: text })} autoCorrect={false} style={{marginHorizontal: 10, marginBottom: -3}} rkType='rounded' placeholder='Email'/>
          <RkTextInput autoCapitalize='none' value={this.state.password} onChangeText={(text) => this.setState({ password: text })} autoCorrect={false} style={{marginHorizontal: 10}} rkType='rounded' placeholder='Password' secureTextEntry={true}/>
          <RkButton onPress={() => { 
              if(this.state.email != '' && this.state.password != '') {
                this.login()
              }
            }} rkType='medium stretch rounded' style={styles.save}>LOGIN</RkButton>
          <View style={styles.footer}>
            <View style={styles.textRow}>
              <RkText rkType='primary3'>Don’t have an account?</RkText>
              <RkButton rkType='clear' onPress={() => Actions.signup()}>
                <RkText rkType='header6'> Sign up now </RkText>
              </RkButton>
            </View>
          </View>
        </View>
      </RkAvoidKeyboard>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  screen: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.colors.screen.base
  },
  image: {
    resizeMode: 'cover',
    marginBottom: scaleVertical(10),
  },
  container: {
    paddingHorizontal: 17,
    paddingBottom: scaleVertical(22),
    alignItems: 'center',
    flex: -1
  },
  footer: {
    justifyContent: 'flex-end',
    flex: 1
  },
  buttons: {
    flexDirection: 'row',
    marginBottom: scaleVertical(24)
  },
  button: {
    marginHorizontal: 14
  },
  save: {
    marginVertical: 9,
    backgroundColor: '#FF5E20',
    marginHorizontal: 10
  },
  textRow: {
    justifyContent: 'center',
    flexDirection: 'row',
  }
}));