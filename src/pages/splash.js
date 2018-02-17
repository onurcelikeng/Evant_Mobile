import React from 'react';
import { StyleSheet, Image, View, Dimensions, StatusBar, AsyncStorage } from 'react-native';
import { RkText, RkTheme } from 'react-native-ui-kitten'
import { NavigationActions } from 'react-navigation';
import {Actions} from 'react-native-router-flux';
import axios from 'axios';

import {ProgressBar} from '../components/progressBar';
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
      progress: 0
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
          route = 'home'
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
          if(route == 'home') {
            accountProvider.getMe().then((responseJson) => {
              if(responseJson.isSuccess) {
                Login.currentUser.name = responseJson.data.firstName + ' ' + responseJson.data.lastName;
                Login.currentUser.photo = responseJson.data.photoUrl;
                Actions.home();
              }
              else {
                let toHome = NavigationActions.reset({
                  index: 0,
                  actions: [NavigationActions.navigate({routeName: 'login'})]
                });
                this.props.navigation.dispatch(toHome)
              }
            })
          }
          else if(route == 'login') {
            
            let toHome = NavigationActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({routeName: 'login'})]
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