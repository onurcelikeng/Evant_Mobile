import React from 'react';
import { View, Image, Keyboard } from 'react-native';
import { RkButton, RkText, RkTextInput, RkStyleSheet, RkTheme, RkAvoidKeyboard } from 'react-native-ui-kitten';
import {Actions} from 'react-native-router-flux';

import {scale, scaleModerate, scaleVertical} from '../utils/scale';

export default class Signup extends React.Component {

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
            <RkTextInput autoCorrect={false} style={{marginHorizontal: 10, marginBottom: -3}} rkType='rounded' placeholder='Name'/>
            <RkTextInput autoCorrect={false} style={{marginHorizontal: 10, marginBottom: -3}} rkType='rounded' placeholder='Surname'/>
            <RkTextInput autoCorrect={false} style={{marginHorizontal: 10, marginBottom: -3}} rkType='rounded' placeholder='Email'/>
            <RkTextInput autoCorrect={false} style={{marginHorizontal: 10, marginBottom: -3}} rkType='rounded' placeholder='Password' secureTextEntry={true}/>
            <RkTextInput autoCorrect={false} style={{marginHorizontal: 10}} rkType='rounded' placeholder='Confirm Password' secureTextEntry={true}/>
            <RkButton onPress={ () => Actions.home() } rkType='medium stretch rounded' style={styles.save}>SIGN UP</RkButton>
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