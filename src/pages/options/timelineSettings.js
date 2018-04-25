import React from 'react';
import { ScrollView, View, TouchableOpacity, StyleSheet } from 'react-native';
import { RkText, RkStyleSheet, RkTheme } from 'react-native-ui-kitten';

import DropdownHolder from '../../providers/dropdownHolder';
import * as userSettingsProvider from '../../providers/userSettings';
import Options from './options'; 
import { RkSwitch } from '../../components/switch';
import { FindFriends } from '../../components/findFriends';
import { FontAwesome } from '../../assets/icon';

export default class TimelineSettings extends React.Component {

  constructor(props) {
    super(props);

    this.settings = Options.getSettings();

    this.state = {
      comment: this.settings.isCommentVisibleTimeline,
      follower: this.settings.isFollowerVisibleTimeline,
      following: this.settings.isFollowingVisibleTimeline,
      event: this.settings.isJoinEventVisibleTimeline
    }
  }

  updateUserSettings() {
    userSettingsProvider.updateUserSettings(Options.getSettings())
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

  render() {
    return (
      <ScrollView style={styles.container}>
          <View style={styles.row}>
            <RkText rkType='header6'>Comments Visible in Timeline?</RkText>
            <RkSwitch style={styles.switch}
                      value={this.state.comment}
                      name="Push"
                      onValueChange={(comment) => {
                        console.log(comment)
                        this.setState({comment});
                        Options.getSettings().isCommentVisibleTimeline = comment;
                        this.updateUserSettings();
                      }}/>
            {/* <RkText rkType='secondary5 hintColor'>seray</RkText> */}
          </View>
          <View style={styles.row}>
            <RkText rkType='header6'>New Followers Visible in Timeline?</RkText>
            <RkSwitch style={styles.switch}
                      value={this.state.follower}
                      name="Refresh"
                      onValueChange={(follower) => {
                        console.log(follower)
                        this.setState({follower});
                        Options.getSettings().isFollowerVisibleTimeline = follower;
                        this.updateUserSettings();
                      }}/>
          </View>
          <View style={styles.row}>
            <RkText rkType='header6'>New Followings Visible in Timeline?</RkText>
                <RkSwitch style={styles.switch}
                      value={this.state.following}
                      name="Push"
                      onValueChange={(following) => {
                        console.log(following)
                        this.setState({following});
                        Options.getSettings().isFollowingVisibleTimeline = following;
                        this.updateUserSettings();
                      }}/>
          </View>
          <View style={styles.row}>
            <RkText rkType='header6'>Joined Events Visible in Timeline?</RkText>
                <RkSwitch style={styles.switch}
                      value={this.state.event}
                      name="Push"
                      onValueChange={(event) => {
                        console.log(event)
                        this.setState({event});
                        Options.getSettings().isJoinEventVisibleTimeline = event;
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