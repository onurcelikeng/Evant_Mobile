import React from 'react';
import { View, Image, StatusBar, Platform, Keyboard } from 'react-native';
import { RkText, RkButton, RkTheme, RkStyleSheet, RkAvoidKeyboard, RkTextInput } from 'react-native-ui-kitten';

import * as accountProvider from '../../providers/account';
import Options from './options'; 
import { scale, scaleModerate, scaleVertical } from '../../utils/scale';

export default class Themes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        oldPassword: '',
        newPassword: '',
        newPasswordRepeat: ''
    };
  }

  changePassword() {
    accountProvider.changePassword(this.state)
    .then((responseJson) => { 
      if(responseJson.isSuccess) { 
        console.log(responseJson.data);
      }
      else {
        console.log(responseJson.data)
      }
    });
  }

  render() {
    return (
        <RkAvoidKeyboard
            onStartShouldSetResponder={ (e) => true}
            onResponderRelease={ (e) => Keyboard.dismiss()}
            style={styles.screen}>
        <View style={styles.container}>
          <RkTextInput autoCapitalize='none' value={this.state.oldPassword} onChangeText={(text) => this.setState({ oldPassword: text })} autoCorrect={false} style={{marginHorizontal: 10, marginBottom: -3}} rkType='rounded' placeholder='Old Password' secureTextEntry={true}/>
          <RkTextInput autoCapitalize='none' value={this.state.newPassword} onChangeText={(text) => this.setState({ newPassword: text })} autoCorrect={false} style={{marginHorizontal: 10, marginBottom: -3}} rkType='rounded' placeholder='New Password' secureTextEntry={true}/>
          <RkTextInput autoCapitalize='none' value={this.state.newPasswordRepeat} onChangeText={(text) => this.setState({ newPasswordRepeat: text })} autoCorrect={false} style={{marginHorizontal: 10}} rkType='rounded' placeholder='New Password (Again)' secureTextEntry={true}/>
          <RkButton onPress={() => { 
              if(this.state.oldPassword != '' && this.state.newPassword != '' && this.state.newPasswordRepeat != '') {
                this.changePassword()
              }
            }} rkType='medium stretch rounded' style={styles.save}>LOGIN</RkButton>
        </View>
      </RkAvoidKeyboard>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
    screen: {
        paddingVertical: 25,
        flex: 1,
        alignItems: 'center',
        backgroundColor: theme.colors.screen.base
    },
    container: {
        paddingHorizontal: 17,
        paddingBottom: scaleVertical(22),
        alignItems: 'center',
        flex: -1
    },
    save: {
        marginVertical: 9,
        backgroundColor: '#FF5E20',
        marginHorizontal: 10
    }
}));