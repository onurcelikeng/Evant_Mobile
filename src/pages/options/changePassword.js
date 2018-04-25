import React from 'react';
import { View, Image, StatusBar, Platform, Keyboard, ScrollView, StyleSheet } from 'react-native';
import { RkText, RkButton, RkTheme, RkStyleSheet, RkAvoidKeyboard, RkTextInput } from 'react-native-ui-kitten';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import DropdownHolder from '../../providers/dropdownHolder';
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
      if(responseJson == null || responseJson == "" || responseJson == undefined) {
        DropdownHolder.getDropDown().alertWithType("error", "", "An error occured, please try again.");
      } else {
        if(responseJson.isSuccess) { 
          DropdownHolder.getDropDown().alertWithType("success", "", responseJson.message);
        }
        else {
          DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
        }
      }
    }).catch((err) => {console.log(err)});
  }

  _scrollToInput (reactNode) {
    // Add a 'scroll' ref to your ScrollView
    this.scroll.props.scrollToFocusedInput(reactNode)
  } 

  render() {
    return (
        <KeyboardAwareScrollView innerRef={ref => {this.scroll = ref}}
          resetScrollToCoords={{ x: 0, y: 0 }}
          onStartShouldSetResponder={ (e) => true}
          contentContainerStyle={[styles.root, {alignItems:"stretch"}]}
          onResponderRelease={ (e) => Keyboard.dismiss()}>            
              <View style={styles.section}>
                <View style={styles.row}>
                    <RkTextInput 
                      onFocus={(event) => {
                        this._scrollToInput(ReactNative.findNodeHandle(event.target))
                      }} 
                      label='Old Password'
                      value={this.state.oldPassword}
                      rkType='right clear'
                      autoCapitalize='none'
                      secureTextEntry={true}
                      autoCorrect={false}
                      onChangeText={(text) => this.setState({oldPassword: text})}/>
                </View>
                <View style={styles.row}>
                    <RkTextInput 
                      onFocus={(event) => {
                        this._scrollToInput(ReactNative.findNodeHandle(event.target))
                      }} 
                      label='New Password'
                      value={this.state.newPassword}
                      autoCapitalize='none'
                      secureTextEntry={true}
                      autoCorrect={false}
                      onChangeText={(text) => this.setState({newPassword: text})}
                      rkType='right clear'/>
                </View>
                <View style={styles.row}>
                    <RkTextInput 
                      onFocus={(event) => {
                        this._scrollToInput(ReactNative.findNodeHandle(event.target))
                      }}  
                      label='New Password (Again)'
                      value={this.state.newPasswordRepeat}
                      autoCapitalize='none'
                      secureTextEntry={true}
                      autoCorrect={false}
                      onChangeText={(text) => this.setState({newPasswordRepeat: text})}
                      rkType='right clear'/>
                </View>
            </View>

            <RkButton rkType='medium stretch rounded' style={styles.button} onPress={() => {
                if(this.state.oldPassword != '' && this.state.newPassword != '' && this.state.newPasswordRepeat != '') {
                    this.changePassword()
                } else {
                    DropdownHolder.getDropDown().alertWithType("warn", "", "Please fill out all the spaces.");
                }}}>SAVE</RkButton>
        </KeyboardAwareScrollView>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base
  },
  header: {
      alignItems: 'center',
      backgroundColor: theme.colors.screen.neutral,
      paddingVertical: 25
  },
  section: {
      marginVertical: 25
  },
  heading: {
      paddingBottom: 12.5
  },
  row: {
      flexDirection: 'row',
      paddingHorizontal: 17.5,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border.base,
      alignItems: 'center'
  },
  button: {
      marginHorizontal: 25,
      marginBottom: 32,
      backgroundColor: '#FF5E20'
  },
  big: {
    width: 110,
    height: 110,
    borderRadius: 55,
          marginBottom: 19,      
          paddingVertical: 25,
          flexDirection: 'column'
  }
}));