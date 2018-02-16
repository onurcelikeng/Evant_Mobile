import React, { Component } from 'react';
import { View, Image, Dimensions, Keyboard } from 'react-native';
import { RkButton, RkText, RkTextInput, RkAvoidKeyboard, RkStyleSheet, RkTheme } from 'react-native-ui-kitten';
import {Actions} from 'react-native-router-flux';
import axios from 'axios';

import * as accountProvider from '../providers/account';
import { FontAwesome } from '../assets/icon';
import {scale, scaleModerate, scaleVertical} from '../utils/scale';

export default class Login extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
        email: '',
        password: ''
    };
  }

  login() {
    var credentials = {
      email: this.state.email,
      password: this.state.password
    };

    return accountProvider.login(credentials)
		.then((responseJson) => {
      console.log(responseJson);
			if(responseJson.isSuccess) {
				this.setState({
					token: responseJson.data,
				  }, function() {
            axios.defaults.headers.common['Authorization'] = this.state.token;
            console.log(this.state.token);
					  Actions.home()
				});
			} else {
				console.error("error");
			}
		})
		.catch((error) => {
		  console.error(error);
		});
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
          <RkButton onPress={() => this.login()} rkType='medium stretch rounded' style={styles.save}>LOGIN</RkButton>
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