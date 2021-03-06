import React, { Component } from 'react';
import { View, Image, Dimensions, Keyboard, AsyncStorage, ActivityIndicator } from 'react-native';
import { RkButton, RkText, RkTextInput, RkStyleSheet, RkTheme } from 'react-native-ui-kitten';
import {Actions} from 'react-native-router-flux';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import OneSignal from 'react-native-onesignal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import I18n from 'react-native-i18n';

import DropdownHolder from '../providers/dropdownHolder';
import * as deviceProvider from '../providers/userDevices';
import * as accountProvider from '../providers/account';
import { FontAwesome } from '../assets/icon';
import {scale, scaleModerate, scaleVertical} from '../utils/scale';
import {strings} from '../locales/i18n'

var appId = '';
export default class Login extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
        email: '',
        password: '',
        isLoading: false
    };
  }

  static currentUser = {
    firstName: '',
    lastName: '',
    name: '',
    photo: '',
    email: '',
    followersCount: 0,
    followingsCount: 0,
    userId: '',
    isBusiness: false,
    settings: {
      language: '',
      theme: '',
      
    },
    business: {
      expireAt: '',
      isAgeAnalysis: false,
      isAttendedUserAnalysis: false,
      isChatBotSupport: false,
      isCommentAnalysis: false,
      isSendNotificationUsers: false,
      type: null
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
    this.setState({
      isLoading: true
    }, () => {
    return accountProvider.login(credentials)
		.then((responseJson) => {
      console.log(responseJson)
      if(responseJson == null || responseJson == "" || responseJson == undefined) {
        DropdownHolder.getDropDown().alertWithType("error", "", strings('common.error_occured'));
      } else {
        if(responseJson.isSuccess) {
          this.setState({
            token: responseJson.data.token,
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
                if(responseJson == null || responseJson == "" || responseJson == undefined) {
                  DropdownHolder.getDropDown().alertWithType("error", "", strings('common.error_occured'));
                } else {
                  if(responseJson.isSuccess) {
                    accountProvider.getMe().then((responseJson) => {
                      if(responseJson.isSuccess) {
                        if(responseJson.data.settings.language != "")
                          I18n.locale = responseJson.data.settings.language;
                        Login.setCurrentUser(responseJson.data);
                        this.setState({
                          isLoading: false
                        }, () => Actions.tabbar());
                      } else {
                        DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
                      }
                    });
                  }
                  else {
                    DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
                  }
                }
              }).catch(error => console.log(error));
          });
        } else {
          DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
        }
      }
		})
		.catch((error) => {
		  console.error(error);
    })});
  }

  static getCurrentUser() {
    return Login.currentUser;
  }

  static setCurrentUser(user) {
    Login.currentUser.userId = user.userId;
    Login.currentUser.name = user.firstName + ' ' + user.lastName;
    Login.currentUser.firstName = user.firstName;
    Login.currentUser.lastName = user.lastName;
    Login.currentUser.email = user.email;
    Login.currentUser.photo = user.photoUrl;
    Login.currentUser.isBusiness = user.isBusiness;
    Login.currentUser.followersCount = user.followersCount;
    Login.currentUser.followingsCount = user.followingsCount;
    Login.currentUser.settings.theme = user.settings.theme;
    Login.currentUser.settings.language = user.settings.language;
    Login.currentUser.business.type = user.business.type;
    Login.currentUser.business.expireAt = user.business.expireAt;
    Login.currentUser.business.isAgeAnalysis = user.business.isAgeAnalysis;
    Login.currentUser.business.isAttendedUserAnalysis = user.business.isAttendedUserAnalysis;
    Login.currentUser.business.isChatBotSupport = user.business.isChatBotSupport;
    Login.currentUser.business.isCommentAnalysis = user.business.isCommentAnalysis;
    Login.currentUser.business.isSendNotificationUsers = user.business.isSendNotificationUsers;
  }

  _renderImage(image) {

    if (RkTheme.current.name === 'light')
      image = (<Image style={[styles.image]}
        source={require('../assets/images/evant_logo.png')}/>);
    else
      image = (<Image style={[styles.image]}
        source={require('../assets/images/evant_logo.png')}/>);
    return image;
  }

  _scrollToInput (reactNode) {
    // Add a 'scroll' ref to your ScrollView
    this.scroll.props.scrollToFocusedInput(reactNode)
  }

	render() {
    let image = this._renderImage();
    let contentHeight = scaleModerate(275, 1);
    let height = Dimensions.get('window').height - contentHeight;
    let width = Dimensions.get('window').width;
    const animating = this.state.isLoading;

    return (
      <KeyboardAwareScrollView innerRef={ref => {this.scroll = ref}}
        resetScrollToCoords={{ x: 0, y: 0 }}
        onStartShouldSetResponder={ (e) => true}
        contentContainerStyle={[styles.screen, {alignItems:"center"}]}
        onResponderRelease={ (e) => Keyboard.dismiss()}>
        
        <View style={{alignItems: 'center', justifyContent: 'center', height: height, width: width}}>
        {image}
        </View>
        <View style={styles.container}>
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
            placeholder={strings('login.email')}/>
          <RkTextInput 
            onFocus={(event) => {
              this._scrollToInput(ReactNative.findNodeHandle(event.target))
            }} 
            autoCapitalize='none' 
            value={this.state.password} 
            onChangeText={(text) => this.setState({ password: text })} 
            autoCorrect={false} 
            style={{marginHorizontal: 10}} 
            rkType='rounded' 
            placeholder={strings('login.password')}
            secureTextEntry={true}/>
          <RkButton onPress={() => { 
              if(this.state.email != '' && this.state.password != '') {
                this.login()
              } else {
                DropdownHolder.getDropDown().alertWithType("warn", "", strings('common.fill_error'));
              }
            }} rkType='medium stretch rounded' style={styles.save}>{strings('login.login_button')}</RkButton>
          <View style={styles.footer}>
            <View style={styles.textRow}>
              <RkText rkType='primary3'>{strings('login.ask_account')}</RkText>
              <RkButton rkType='clear' onPress={() => Actions.signup()}>
                <RkText rkType='header6'>{strings('login.signup_button')}</RkText>
              </RkButton>
            </View>
          </View>
        </View>
        {
          this.state.isLoading ? 
          <View style = {styles.indContainer}>
            <ActivityIndicator
            animating = {animating}
            color = '#bc2b78'
            size = "large"
            style = {styles.activityIndicator}/>
          </View>
          :
          null
        }
      </KeyboardAwareScrollView>
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
    marginVertical: scaleVertical(10),
    height:scaleVertical(200),
    width:scale(200)
  },
  indContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
    marginTop: 70,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
	 },
	 activityIndicator: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: 30
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
    backgroundColor: '#da6954',
    marginHorizontal: 10
  },
  textRow: {
    justifyContent: 'center',
    flexDirection: 'row',
  }
}));