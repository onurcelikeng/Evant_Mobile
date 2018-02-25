import React from 'react';
import { View, Image, StatusBar, Platform } from 'react-native';
import { RkText, RkButton, RkTheme, RkStyleSheet } from 'react-native-ui-kitten';

import DropdownHolder from '../../providers/dropdownHolder';
import * as userSettingsProvider from '../../providers/userSettings';
import Options from './options'; 
import { DarkKittenTheme } from '../../config/darkTheme';
import { KittenTheme } from '../../config/theme';
import { scale, scaleModerate, scaleVertical } from '../../utils/scale';

export default class Themes extends React.Component {
  constructor(props) {
    super(props);

    this.userSettings = Options.getSettings();
  }

  updateUserSettings() {
    userSettingsProvider.updateUserSettings(Options.getSettings())
    .then((responseJson) => { 
      if(responseJson.isSuccess) { 
        DropdownHolder.getDropDown().alertWithType("success", "", responseJson.message);
      }
      else {
        DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
      }
    });
  }

  render() {
    return (
      <View style={styles.root}>
        <View style={styles.container}>
          <RkText>Light Theme</RkText>
          <Image style={styles.image} source={require('../../assets/images/lightThemeImage.png')}/>
          <RkButton
            onPress={() => {
              StatusBar.setBarStyle('dark-content', true);
              Platform.OS == 'android' && StatusBar.setBackgroundColor(KittenTheme.colors.screen.base);
              RkTheme.setTheme(KittenTheme);
              Options.getSettings().theme = 'light';
              this.updateUserSettings();
            }}>APPLY</RkButton>
        </View>
        <View style={styles.container}>
          <RkText>Dark Theme</RkText>
          <Image style={styles.image} source={require('../../assets/images/darkThemeImage.png')}/>
          <RkButton
            onPress={() => {
              RkTheme.setTheme(DarkKittenTheme);
              StatusBar.setBarStyle('light-content', true);
              Platform.OS == 'android' && StatusBar.setBackgroundColor(DarkKittenTheme.colors.screen.base);
              Options.getSettings().theme = 'dark';
              this.updateUserSettings();
            }}>APPLY</RkButton>

        </View>
      </View>

    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base,
    flex: 1,
    paddingHorizontal: scale(72),

  },
  image: {
    height: scaleVertical(160)
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scaleVertical(20)
  }
}));