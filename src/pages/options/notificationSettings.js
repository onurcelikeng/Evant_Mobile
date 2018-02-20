import React from 'react';
import { ScrollView, View, TouchableOpacity, StyleSheet } from 'react-native';
import { RkText, RkStyleSheet, RkTheme } from 'react-native-ui-kitten';

import * as userSettingsProvider from '../../providers/userSettings';
import Options from './options'; 
import { RkSwitch } from '../../components/switch';
import { FindFriends } from '../../components/findFriends';
import { FontAwesome } from '../../assets/icon';

export default class NotificationSettings extends React.Component {

  constructor(props) {
    super(props);

    this.settings = Options.getSettings();

    this.state = {
      comment: this.settings.isCommentNotif,
      follow: this.settings.isFriendshipNotif,
      attend: this.settings.isEventNewComerNotif,
      update: this.settings.isEventUpdateNotif
    }
  }

  updateUserSettings() {
    userSettingsProvider.updateUserSettings(Options.getSettings())
    .then((responseJson) => { 
      if(responseJson.isSuccess) { 
        console.log(responseJson.message);
      }
      else {
        console.log(responseJson.message)
      }
    });
  }

  render() {
    return (
      <ScrollView style={styles.container}>
          <View style={styles.row}>
            <RkText rkType='header6'>Comment Notifications</RkText>
            <RkSwitch style={styles.switch}
                      value={this.state.comment}
                      name="Push"
                      onValueChange={(comment) => {
                        this.setState({comment});
                        Options.getSettings().isCommentNotif = comment;
                        this.updateUserSettings();
                      }}/>
            {/* <RkText rkType='secondary5 hintColor'>seray</RkText> */}
          </View>
          <View style={styles.row}>
            <RkText rkType='header6'>Follow Notifications</RkText>
            <RkSwitch style={styles.switch}
                      value={this.state.follow}
                      name="Refresh"
                      onValueChange={(follow) => {
                        this.setState({follow});
                        Options.getSettings().isFriendshipNotif = follow;
                        this.updateUserSettings();
                      }}/>
          </View>
          <View style={styles.row}>
            <RkText rkType='header6'>Attend Notifications</RkText>
                <RkSwitch style={styles.switch}
                      value={this.state.attend}
                      name="Push"
                      onValueChange={(attend) => {
                        this.setState({attend});
                        Options.getSettings().isEventNewComerNotif = attend;
                        this.updateUserSettings();
                      }}/>
          </View>
          <View style={styles.row}>
            <RkText rkType='header6'>Event Update Notifications</RkText>
                <RkSwitch style={styles.switch}
                      value={this.state.update}
                      name="Push"
                      onValueChange={(update) => {
                        this.setState({update});
                        Options.getSettings().isEventUpdateNotif = update;
                        this.updateUserSettings();
                      }}/>
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
    paddingVertical: 24
  },
  switch: {
    marginVertical: 14
  },
}));