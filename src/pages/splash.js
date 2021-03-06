import React from 'react';
import { StyleSheet, Image, View, Dimensions, StatusBar, AsyncStorage, Platform, Text, TouchableHighlight  } from 'react-native';
import { RkText, RkTheme } from 'react-native-ui-kitten'
import { NavigationActions } from 'react-navigation';
import {Actions} from 'react-native-router-flux';
import axios from 'axios';
import I18n from 'react-native-i18n';

import {ProgressBar} from '../components/progressBar';
import { DarkKittenTheme } from '../config/darkTheme';
import { KittenTheme } from '../config/theme';
import {scale, scaleModerate, scaleVertical} from '../utils/scale';
import {data} from '../data'
import * as accountProvider from '../providers/account';
import Login from './login'

let timeFrame = 250;

export class SplashScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
    }
  }

  componentDidMount() {
    StatusBar.setHidden(true, 'none');
    RkTheme.setTheme(KittenTheme);
    let route = ''
    try {
      AsyncStorage.getItem('token').then((token) => {
        if (token !== null){
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          route = 'tabbar'
        }
        else {
          route = 'login'
        }
      }); 
    } catch (error) {
      console.log(error);
    }

    this.timer = setInterval(() => {
      if (this.state.progress == 1) {
        clearInterval(this.timer);
        setTimeout(() => {
          StatusBar.setHidden(false, 'slide');
          if(route == 'tabbar') {
            accountProvider.getMe().then((responseJson) => {
              console.log(responseJson);
              if(responseJson == null || responseJson == "" || responseJson == undefined) {
                DropdownHolder.getDropDown().alertWithType("error", "", "An error occured, please try again.");
              } else {
                if(responseJson.isSuccess) {
                  Login.setCurrentUser(responseJson.data);
                  if(responseJson.data.settings.language != "")
                    I18n.locale = responseJson.data.settings.language;
                  if(Login.getCurrentUser().settings.theme == "dark") {
                    RkTheme.setTheme(DarkKittenTheme);
                    StatusBar.setBarStyle('light-content', true);
                    Platform.OS == 'android' && StatusBar.setBackgroundColor(DarkKittenTheme.colors.screen.base);
                  } else {
                    StatusBar.setBarStyle('dark-content', true);
                    Platform.OS == 'android' && StatusBar.setBackgroundColor(KittenTheme.colors.screen.base);
                    RkTheme.setTheme(KittenTheme);
                  }
                  Actions.tabbar();
                }
                else {
                  let toHome = NavigationActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({routeName: 'root'})]
                  });
                  this.props.navigation.dispatch(toHome)
                }
              }
            }).catch((err) => {
              console.log(err)
            });
          }
          else if(route == 'login') {
            
            let toHome = NavigationActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({routeName: 'root'})]
            });
            this.props.navigation.dispatch(toHome)
          }
        }, timeFrame);
      } else {
        let random = Math.random() * 0.5;
        let progress = this.state.progress + random;
        if (progress > 1) {
          progress = 1;
        }
        this.setState({progress});
      }
    }, timeFrame)

  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Image style={[styles.image]} source={require('../assets/images/evant_logo.png')}/>
        </View>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    backgroundColor: KittenTheme.colors.screen.base,
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },
  image: {
    height: scale(200),
    width: scale(200)
  }
});