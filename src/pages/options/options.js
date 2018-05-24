import React from 'react';
import { ScrollView, View, TouchableOpacity, StyleSheet, AsyncStorage, Modal, Alert } from 'react-native';
import { RkText, RkStyleSheet, RkTheme, RkButton } from 'react-native-ui-kitten';
import {Actions, ActionConst} from 'react-native-router-flux';
import I18n from 'react-native-i18n';

import DropdownHolder from '../../providers/dropdownHolder';
import * as accountProvider from '../../providers/account';
import * as deviceProvider from '../../providers/userDevices';
import * as userSettingsProvider from '../../providers/userSettings';
import * as searchHistoriesProvider from '../../providers/searchHistories';
import Login from '../login';
import { RkSwitch } from '../../components/switch';
import { FindFriends } from '../../components/findFriends';
import { FontAwesome } from '../../assets/icon';
import {scale, scaleModerate, scaleVertical} from '../../utils/scale';
import {UIConstants} from '../../config/appConstants';
import {strings} from '../../locales/i18n'

export default class Options extends React.Component {

  static userSettings = {
    isCommentNotif: true,
    isEventNewComerNotif: true,
    isEventUpdateNotif: true,
    isFriendshipNotif: true,
    isCommentVisibleTimeline: true,
    isFollowerVisibleTimeline: true,
    isFollowingVisibleTimeline: true,
    isJoinEventVisibleTimeline: true,
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
      modalLogoutVisible: false,
      modalDeactivateVisible: false,
      modalSwitchVisible: false,
    }
  }

  logout() {
    AsyncStorage.removeItem("token");
    AsyncStorage.removeItem("deviceId");
    Login.currentUser = {};
    this._setModalVisible(false, 1);
    Actions.reset("root");
  }

  componentDidMount() {
		this.getUserSettings();
  }

  deactivateAccount() {
    return accountProvider.deactivateAccount()
    .then((responseJson) => {
      if(responseJson == null || responseJson == "" || responseJson == undefined) {
        DropdownHolder.getDropDown().alertWithType("error", "", strings("common.error_occured"));
      } else {
        if(responseJson.isSuccess) {
          this.logout();
        } else {
          DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
        }
      }
    }).catch((err) => {console.log(err)});
  }
  
  getUserSettings() {
		return userSettingsProvider.getUserSettings()
		.then((responseJson) => {
      if(responseJson == null || responseJson == "" || responseJson == undefined) {
        DropdownHolder.getDropDown().alertWithType("error", "", strings("common.error_occured"));
      } else {
        if(responseJson.isSuccess) {
          Options.userSettings = responseJson.data;
        } else {
          console.log(responseJson.message);
        }
      }
		})
		.catch((error) => {
		  console.log(error);
		});
  }

  clearSearchHistories() {
    return searchHistoriesProvider.deleteAllSearchHistories()
    .then((responseJson) => {
      if(responseJson == null || responseJson == "" || responseJson == undefined) {
        DropdownHolder.getDropDown().alertWithType("error", "", strings("common.error_occured"));
      } else {
        if(responseJson.isSuccess) {
          DropdownHolder.getDropDown().alertWithType("success", "", responseJson.message);
        } else {
          DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
        }
      }
    }).catch((err) => {console.log(err)});
  }

  switchToBusiness() {
    return accountProvider.switchToBusiness()
    .then((responseJson) => {
      if(responseJson == null || responseJson == "" || responseJson == undefined) {
        DropdownHolder.getDropDown().alertWithType("error", "", strings("common.error_occured"));
      } else {
        if(responseJson.isSuccess) {
          Login.getCurrentUser().isBusiness = !Login.getCurrentUser().isBusiness;
          this._setModalVisible(false, 1);
        }
      }
    }).catch((err) => {console.log(err)});
  }
  
  static getSettings() {
    return Options.userSettings;
  }

  _setModalVisible(visible, type) {
    if(type == 1)
    this.setState({modalLogoutVisible: visible});
    else if(type == 2)
    this.setState({modalDeactivateVisible: visible});
    else if(type == 3)
    this.setState({modalSwitchVisible: visible});
  }

  openAlert(title, message, type) {
    Alert.alert(
      title,
      message,
      [
        {text: strings("options.cancel"), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: strings("options.ok"), onPress: () => {
          if(type == 'logout') {
            this.logout();
          } else if(type == 'deactivate') {
            this.deactivateAccount();
          } else if(type == 'business') {
            this.switchToBusiness();
          } else if(type == 'clear') {
            this.clearSearchHistories();
          }
        }},
      ],
      { cancelable: false }
    )
  }

  changeLanguage(language) {
    Options.getSettings().language = language;

    userSettingsProvider.updateUserSettings(Options.getSettings())
    .then((responseJson) => { 
      if(responseJson == null || responseJson == "" || responseJson == undefined) {
        DropdownHolder.getDropDown().alertWithType("error", "", strings("common.error_occured"));
      } else {
        if(responseJson.isSuccess) { 
          I18n.locale = language;
          Actions.reset("splashScreen");
        }
        else {
          DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
        }
      }
    }).catch((err) => {console.log(err)});
  }

  openLanguageAlert(title, message) {
    Alert.alert(
      title,
      message,
      [
        {text: strings("options.cancel"), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: strings("options.english"), onPress: () => {
          this.changeLanguage('en');
        }},
        {text: strings("options.turkish"), onPress: () => {
          this.changeLanguage('tr');
        }},
      ],
      { cancelable: false }
    )
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <View style={[styles.row, styles.heading]}>
            <RkText rkType='primary header6'>{strings("options.account")}</RkText>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.rowButton} onPress={() => {Actions.editProfile()} }>
              <RkText rkType='header6'>{strings("options.edit_profile")}</RkText>
              <RkText rkType='awesome' style={{opacity: .70}}>{FontAwesome.chevronRight}</RkText>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.rowButton} onPress={() => {Actions.password()} }>
              <RkText rkType='header6'>{strings("options.change_password")}</RkText>
              <RkText rkType='awesome' style={{opacity: .70}}>{FontAwesome.chevronRight}</RkText>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.rowButton} onPress={() => {Actions.business()}}>
              <RkText rkType='header6'>{strings("options.switch_to_business")}</RkText>
              <RkText rkType='awesome' style={{opacity: .70}}>{FontAwesome.chevronRight}</RkText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={[styles.row, styles.heading]}>
            <RkText rkType='primary header6'>{strings("options.settings")}</RkText>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.rowButton} onPress={() => {Actions.timelineSettings()} }>
              <RkText rkType='header6'>{strings("options.timeline")}</RkText>
              <RkText rkType='awesome' style={{opacity: .70}}>{FontAwesome.chevronRight}</RkText>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.rowButton} onPress={() => {this.openLanguageAlert(strings("options.title_language"), strings("options.language_message"))}}>
              <RkText rkType='header6'>{strings("options.language")}</RkText>
              <RkText rkType='awesome' style={{opacity: .70}}>{FontAwesome.chevronRight}</RkText>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.rowButton} onPress={() => {Actions.notificationSettings()} }>
              <RkText rkType='header6'>{strings("options.push_notification")}</RkText>
              <RkText rkType='awesome' style={{opacity: .70}}>{FontAwesome.chevronRight}</RkText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={[styles.row, styles.heading]}>
            <RkText rkType='primary header6'>{strings("options.support")}</RkText>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.rowButton}>
              <RkText rkType='header6'>{strings("options.help")}</RkText>
              <RkText rkType='awesome' style={{opacity: .70}}>{FontAwesome.chevronRight}</RkText>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.rowButton}>
              <RkText rkType='header6'>{strings("options.report")}</RkText>
              <RkText rkType='awesome' style={{opacity: .70}}>{FontAwesome.chevronRight}</RkText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={[styles.row, styles.heading]}>
            <RkText rkType='primary header6'>{strings("options.about")}</RkText>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.rowButton}>
              <RkText rkType='header6'>{strings("options.privacy")}</RkText>
              <RkText rkType='awesome' style={{opacity: .70}}>{FontAwesome.chevronRight}</RkText>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.rowButton}>
              <RkText rkType='header6'>{strings("options.terms")}</RkText>
              <RkText rkType='awesome' style={{opacity: .70}}>{FontAwesome.chevronRight}</RkText>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.rowButton}>
              <RkText rkType='header6'>{strings("options.open_source")}</RkText>
              <RkText rkType='awesome' style={{opacity: .70}}>{FontAwesome.chevronRight}</RkText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <TouchableOpacity style={styles.rowButton} onPress={() => this.openAlert(strings("options.title_clear"), strings("options.clear_message"), 'clear')}>
              <RkText rkType='header6'>{strings("options.clear")}</RkText>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.rowButton} onPress={() => this.openAlert(strings("options.title_deactivate"), strings("options.deactivate_message"), 'deactivate')}>
              <RkText rkType='header6'>{strings("options.deactivate")}</RkText>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity onPress={() => this.openAlert(strings("options.title_logout"), strings("options.logout_message"), 'logout')} style={styles.rowButton}>
              <RkText rkType='header6'>{strings("options.logout")}</RkText>
            </TouchableOpacity>
          </View>
        </View>
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
    paddingVertical: 18,
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