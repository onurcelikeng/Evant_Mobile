import React from 'react';
import { FlatList, View, Platform, Image, TouchableOpacity, Keyboard, StyleSheet, Dimensions } from 'react-native';
import {InteractionManager} from 'react-native';
import { RkButton, RkText, RkTextInput, RkAvoidKeyboard, RkStyleSheet, RkTheme } from 'react-native-ui-kitten';
import _ from 'lodash';
import {Actions} from 'react-native-router-flux';
import ContentLoader from '../../config/contentLoader'
import Svg, { Circle, Ellipse, G, LinearGradient, RadialGradient, Line, Path, Polygon, Polyline, Rect, Symbol, Text, Use, Defs, Stop } from 'react-native-svg';

import DropdownHolder from '../../providers/dropdownHolder';
import Login from '../login';
import * as commentProvider from '../../providers/comments';
import {FontAwesome} from '../../assets/icon';
import {data} from '../../data';
import {Avatar} from '../../components/avatar';
import {scale} from '../../utils/scale';

let moment = require('moment');

let getUserId = (navigation) => {
  return navigation.state.params ? navigation.state.params.userId : undefined;
};

export default class Chat extends React.Component {

  constructor(props) {
    super(props);
    this.eventId = this.props.id;

    this.chats = data.getComments(1);
    this.state = {
      isLoading: true,
      isSuccess: false
    };
    
    this.renderItem = this._renderItem.bind(this);
  }

  componentDidMount() {
    this.getComments(this.props.id);
  }

  addComment(credentials) {
    console.log(credentials);
    return commentProvider.addComment(credentials) 
    .then((responseJson) => {
      console.log(responseJson);
      if(responseJson.isSuccess) {
        this.setState({
          isSuccess: true
        })
        this.getComments(this.eventId);
      } else {
        DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
      }
    })
  }

  getComments(id) {
    return commentProvider.getComments(id)
    .then((responseJson) => {
      if(responseJson.isSuccess) {
        console.log(responseJson);
        this.setState({
					isLoading: false,
          data: responseJson.data,
          isSuccess:true
				});
        InteractionManager.runAfterInteractions(() => {
          this.refs.list.scrollToEnd();
        });
      } else {
        this.setState({
					isLoading: false,
          isSuccess: false,
          data: []
				  });
        DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
      }
    });
  }

  _keyExtractor(post, index) {
    return post.id;
  }

  _renderSeparator() {
    return (
      <View style={styles.separator}/>
    )
  }

  _renderItem(info) {
    console.log(info);
    let name = `${info.item.user.firstName} ${info.item.user.lastName}`;

    return (
      <View style={styles.item}>
          <TouchableOpacity style={{alignItems: 'center', flexDirection: 'row'}} onPress={() => {if(info.item.user.userId == Login.getCurrentUser().userId) {Actions.profile()} else {Actions.otherProfile({id: info.item.user.userId })} }}>
              <Avatar img={info.item.user.photoUrl} rkType='circle'/>
          </TouchableOpacity>
          <View style={styles.content}>
              <View style={styles.contentHeader}>
                  <RkText rkType='header5'>{name}</RkText>
                  <RkText rkType='secondary4 hintColor'>
                  {moment(info.item.createdAt).fromNow()}
                  </RkText>
              </View>
              <RkText rkType='primary3 mediumLine'>{info.item.content}</RkText>
          </View>
      </View>
    )
  }

  _scroll() {
    if(this.state.isSuccess) {
      if (Platform.OS === 'ios') {
        this.refs.list.scrollToEnd();
      } else {
        _.delay(() => this.refs.list.scrollToEnd(), 100);
      }
    }  
  }

  _pushMessage() {
    if (!this.state.message)
      return;

    let credentials = {
      content: this.state.message,
      eventId: this.eventId
    }

    this.addComment(credentials);
    
    //this.state.data.push({id: this.state.data.length, time: 0, type: 'out', text: this.state.message});
    this.setState({message: ''});
    this._scroll(true);
  }

  render() {
    if (this.state.isLoading) {
			var width = require('Dimensions').get('window').width - 50;
			var loaders = [];
			for(let i = 0; i < 10; i++){
			  loaders.push(
				<ContentLoader height={150}>
					<Circle cx="30" cy="30" r="30"/>
					<Rect x="80" y="17" rx="4" ry="4" width={width - 80} height="13"/>
					<Rect x="80" y="40" rx="3" ry="3" width={width - 80} height="10"/>
					<Rect x="0" y="80" rx="3" ry="3" width={width} height="10"/>
					<Rect x="0" y="100" rx="3" ry="3" width={width} height="10"/>
					<Rect x="0" y="120" rx="3" ry="3" width={width} height="10"/>
				</ContentLoader>
			  )
			}
			return (
			  <View style={{flex: 1, paddingTop: 20, backgroundColor: "#ffffff", alignItems: "center"}}>
				{loaders}
			  </View>
			);
    }
    
    if(this.state.isSuccess == false) {
      const data = []

      renderFooter = () => {
        return (
          <View>
            <Text>No messages found.</Text>
          </View>
        );
      };
      return(
        <RkAvoidKeyboard style={styles.container} onResponderRelease={(event) => { Keyboard.dismiss(); }}>
          <FlatList 
            ref="list"
            data={this.state.data}
            extraData={this.state}
            ItemSeparatorComponent={this._renderSeparator}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            ListEmptyComponent={this.showEmptyListView}/>
          <View style={styles.footer}>
            <RkTextInput
              onFocus={() => this._scroll(true)}
              onBlur={() => this._scroll(true)}
              onChangeText={(message) => this.setState({message})}
              value={this.state.message}
              autoCorrect={false}
              rkType='row sticker'
              placeholder="Add a comment..."/>

            <RkButton onPress={() => {this._pushMessage(); Keyboard.dismiss();}} style={styles.send} rkType='circle highlight'>
              <Image source={require('../../assets/icons/sendIcon.png')}/>
            </RkButton>
          </View>
        </RkAvoidKeyboard>
      )
    }

    return (
      <RkAvoidKeyboard style={styles.container} onResponderRelease={(event) => { Keyboard.dismiss(); }}>
        <FlatList 
            ref="list"
            data={this.state.data}
            extraData={this.state}
            ItemSeparatorComponent={this._renderSeparator}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}/>
        <View style={styles.footer}>
          <RkTextInput
            onFocus={() => this._scroll(true)}
            onBlur={() => this._scroll(true)}
            onChangeText={(message) => this.setState({message})}
            value={this.state.message}
            autoCorrect={false}
            rkType='row sticker'
            placeholder="Add a comment..."/>

          <RkButton onPress={() => {this._pushMessage(); Keyboard.dismiss();}} style={styles.send} rkType='circle highlight'>
            <Image source={require('../../assets/icons/sendIcon.png')}/>
          </RkButton>
        </View>
      </RkAvoidKeyboard>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
    root: {
        backgroundColor: theme.colors.screen.base
    },
    header: {
        alignItems: 'center'
    },
    container: {
        flex: 1,
        backgroundColor: theme.colors.screen.base
    },
    list: {
        paddingHorizontal: 17
    },
    footer: {
        flexDirection: 'row',
        minHeight: 60,
        padding: 10,
        backgroundColor: theme.colors.screen.alter
    },
    item: {
        paddingLeft: 19,
        paddingRight: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
        flex: 1,
    },
    itemIn: {},
    itemOut: {
        alignSelf: 'flex-end'
    },
    time: {
        alignSelf: 'flex-end',
        margin: 15
    },
    plus: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginRight: 7
    },
    send: {
        width: 40,
        height: 40,
        marginLeft: 10,
    },
    content: {
      marginLeft: 16,
      flex: 1,
    },
    contentHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 6
    },
    separator: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.colors.border.base
    }
}));