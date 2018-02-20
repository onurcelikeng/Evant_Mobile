import React from 'react';
import { ScrollView, View, TouchableOpacity, StyleSheet, AsyncStorage, Modal } from 'react-native';
import { RkText, RkStyleSheet, RkTheme, RkButton } from 'react-native-ui-kitten';
import {Actions, ActionConst} from 'react-native-router-flux';

import * as deviceProvider from '../../providers/devices';
import * as userSettingsProvider from '../../providers/userSettings';
import { RkSwitch } from '../../components/switch';
import { FindFriends } from '../../components/findFriends';
import { FontAwesome } from '../../assets/icon';
import {scale, scaleModerate, scaleVertical} from '../../utils/scale';
import {UIConstants} from '../../config/appConstants';

export default class Options extends React.Component {

  static userSettings = {
    isCommentNotif: true,
    isEventNewComerNotif: true,
    isEventUpdateNotif: true,
    isFriendshipNotif: true,
    language: '',
    theme: '',
    userSettingId: ''
  };

  constructor(props) {
    super(props);

    this.state = {
      sendPush: true,
      shouldRefresh: false,
      twitterEnabled: true,
      googleEnabled: false,
      facebookEnabled: true,
      modalVisible: false
    }
  }

  logout() {
    AsyncStorage.getItem("deviceId").then(id => {
      deviceProvider.logout(id)
      .then((responseJson) => {
        if(responseJson.isSuccess) {
          AsyncStorage.removeItem("token");
          AsyncStorage.removeItem("deviceId");
          this._setModalVisible(false);
          Actions.reset("root");
        }
      });
      
      AsyncStorage.removeItem("token");
      this._setModalVisible(false);
      Actions.reset("root");
    });
  }

  componentDidMount() {
		this.getUserSettings();
  }
  
  getUserSettings() {
		return userSettingsProvider.getUserSettings()
		.then((responseJson) => {
			if(responseJson.isSuccess) {
        Options.userSettings = responseJson.data;
			} else {
				console.log(responseJson.message);
			}
		})
		.catch((error) => {
		  console.log(error);
		});
  }
  
  static getSettings() {
    return Options.userSettings;
  }

  _setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <View style={[styles.row, styles.heading]}>
            <RkText rkType='primary header6'>Account</RkText>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.rowButton} onPress={() => {Actions.editProfile()} }>
              <RkText rkType='header6'>Edit Profile</RkText>
              <RkText rkType='awesome' style={{opacity: .70}}>{FontAwesome.chevronRight}</RkText>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.rowButton} onPress={() => {Actions.password()} }>
              <RkText rkType='header6'>Change Password</RkText>
              <RkText rkType='awesome' style={{opacity: .70}}>{FontAwesome.chevronRight}</RkText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={[styles.row, styles.heading]}>
            <RkText rkType='primary header6'>Settings</RkText>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.rowButton} onPress={() => {Actions.themes()} }>
              <RkText rkType='header6'>Theme</RkText>
              <RkText rkType='awesome' style={{opacity: .70}}>{FontAwesome.chevronRight}</RkText>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.rowButton}>
              <RkText rkType='header6'>Language</RkText>
              <RkText rkType='awesome' style={{opacity: .70}}>{FontAwesome.chevronRight}</RkText>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.rowButton} onPress={() => {Actions.notificationSettings()} }>
              <RkText rkType='header6'>Push Notification Settings</RkText>
              <RkText rkType='awesome' style={{opacity: .70}}>{FontAwesome.chevronRight}</RkText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={[styles.row, styles.heading]}>
            <RkText rkType='primary header6'>Support</RkText>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.rowButton}>
              <RkText rkType='header6'>Help Center</RkText>
              <RkText rkType='awesome' style={{opacity: .70}}>{FontAwesome.chevronRight}</RkText>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.rowButton}>
              <RkText rkType='header6'>Report a Problem</RkText>
              <RkText rkType='awesome' style={{opacity: .70}}>{FontAwesome.chevronRight}</RkText>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.rowButton}>
              <RkText rkType='header6'>Privacy Policy</RkText>
              <RkText rkType='awesome' style={{opacity: .70}}>{FontAwesome.chevronRight}</RkText>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.rowButton}>
              <RkText rkType='header6'>Terms & Conditions</RkText>
              <RkText rkType='awesome' style={{opacity: .70}}>{FontAwesome.chevronRight}</RkText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <TouchableOpacity style={styles.rowButton}>
              <RkText rkType='header6'>Clear Search History</RkText>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity onPress={() => this._setModalVisible(true)} style={styles.rowButton}>
              <RkText rkType='header6'>Log Out</RkText>
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          animationType={'fade'}
          transparent={true}
          onRequestClose={() => this._setModalVisible(false)}
          visible={this.state.modalVisible}>
          <View style={styles.popupOverlay}>
            <View style={styles.popup}>
              <View style={styles.popupContent}>
                <RkText style={styles.popupHeader} rkType='header4'>LOGOUT</RkText>
                <RkText>Are you sure you want to log out? You won't be able to get any notification.</RkText>
              </View>
              <View style={styles.popupButtons}>
                <RkButton onPress={() => this._setModalVisible(false)}
                          style={styles.popupButton}
                          rkType='clear'>
                  <RkText rkType='light'>CANCEL</RkText>
                </RkButton>
                <View style={styles.separator}/>
                <RkButton onPress={() => this.logout()}
                          style={styles.popupButton}
                          rkType='clear'>
                  <RkText>OK</RkText>
                </RkButton>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  container: {
    backgroundColor: theme.colors.screen.base,
  },
  header: {
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
    justifyContent: 'space-between',
    paddingHorizontal: 17.5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border.base,
    alignItems: 'center'
  },
  rowButton: {
    flex: 1,
    paddingVertical: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  switch: {
    marginVertical: 14
  },
  popup: {
    backgroundColor: theme.colors.screen.base,
    marginTop: scaleVertical(70),
    marginHorizontal: 37,
    borderRadius: 7
  },
  popupOverlay: {
    backgroundColor: theme.colors.screen.overlay,
    flex: 1,
    marginTop: UIConstants.HeaderHeight
  },
  popupContent: {
    alignItems: 'center',
    margin: 16
  },
  popupHeader: {
    marginBottom: scaleVertical(45)
  },
  popupButtons: {
    marginTop: 15,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: theme.colors.border.base
  },
  popupButton: {
    flex: 1,
    marginVertical: 16
  }
}));