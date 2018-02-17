import React from 'react';
import { View, Image, Keyboard, AsyncStorage } from 'react-native';
import { RkButton, RkText, RkTextInput, RkStyleSheet, RkTheme, RkAvoidKeyboard } from 'react-native-ui-kitten';
import {Actions} from 'react-native-router-flux';
import axios from 'axios';

import * as accountProvider from '../providers/account';
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
                token: responseJson.data,
                }, function() {
                  AsyncStorage.setItem('token', this.state.token);
                  axios.defaults.headers.common['Authorization'] = `Bearer ${this.state.token}`;
            
                  accountProvider.getMe().then((responseJson) => {
                    if(responseJson.isSuccess) {
                      Login.currentUser.name = responseJson.data.firstName + ' ' + responseJson.data.lastName;
                      Login.currentUser.photo = responseJson.data.photoUrl;
                      Actions.home();
                    }
                  })
              });
            }
            else {
              console.error("cannot login");
            }
          }) 
        } else {
          console.error("cannot register");
        }
      })
      .catch((error) => {
        console.error(error);
      });
    }
    else {
      console.log("passwords are not same");
    }
  }

	render() {
    let renderIcon = () => {
      if (RkTheme.current.name === 'light')
        return <Image style={styles.image} source={require('../assets/images/evant_logo.png')}/>;
      return <Image style={styles.image} source={require('../assets/images/logoDark.png')}/>
    };
    return (
      <RkAvoidKeyboard
        style={styles.screen}
        onStartShouldSetResponder={ (e) => true}
        onResponderRelease={ (e) => Keyboard.dismiss()}>
        <View style={{alignItems: 'center'}}>
          {renderIcon()}
          <RkText rkType='h1'>Registration</RkText>
        </View>
        <View style={styles.content}>
          <View>
            <RkTextInput autoCapitalize='none' value={this.state.firstName} onChangeText={(text) => this.setState({ firstName: text })} autoCorrect={false} style={{marginHorizontal: 10, marginBottom: -3}} rkType='rounded' placeholder='Name'/>
            <RkTextInput autoCapitalize='none' value={this.state.lastName} onChangeText={(text) => this.setState({ lastName: text })} autoCorrect={false} style={{marginHorizontal: 10, marginBottom: -3}} rkType='rounded' placeholder='Surname'/>
            <RkTextInput autoCapitalize='none' value={this.state.email} onChangeText={(text) => this.setState({ email: text })} autoCorrect={false} style={{marginHorizontal: 10, marginBottom: -3}} rkType='rounded' placeholder='Email'/>
            <RkTextInput autoCapitalize='none' value={this.state.password} onChangeText={(text) => this.setState({ password: text })} autoCorrect={false} style={{marginHorizontal: 10, marginBottom: -3}} rkType='rounded' placeholder='Password' secureTextEntry={true}/>
            <RkTextInput autoCapitalize='none' value={this.state.passwordRepeat} onChangeText={(text) => this.setState({ passwordRepeat: text })} autoCorrect={false} style={{marginHorizontal: 10}} rkType='rounded' placeholder='Confirm Password' secureTextEntry={true}/>
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
      </RkAvoidKeyboard>
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