import React from 'react';
import { FlatList, View, Platform, Image, TouchableOpacity, Keyboard, StyleSheet } from 'react-native';
import {InteractionManager} from 'react-native';
import { RkButton, RkText, RkTextInput, RkAvoidKeyboard, RkStyleSheet, RkTheme } from 'react-native-ui-kitten';
import _ from 'lodash';
import {Actions} from 'react-native-router-flux';

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
    let postId = this.props.navigation.params ? this.props.navigation.params.postId : undefined;
    this.chats = data.getComments(postId);
    this.state = {
      data: this.chats
    };
    
    this.renderItem = this._renderItem.bind(this);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.refs.list.scrollToEnd();
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
    let name = `${info.item.user.firstName} ${info.item.user.lastName}`;

    return (
        <View style={styles.item}>
            <TouchableOpacity onPress={() => Actions.otherProfile({id: info.item.user.id})}>
                <Avatar rkType='circle' style={styles.avatar} img={info.item.user.photo}/>
            </TouchableOpacity>
            <View style={styles.content}>
                <View style={styles.contentHeader}>
                    <RkText rkType='header5'>{name}</RkText>
                    <RkText rkType='secondary4 hintColor'>
                    {moment().add(info.item.time, 'seconds').format('LT')}
                    </RkText>
                </View>
                <RkText rkType='primary3 mediumLine'>{info.item.text}</RkText>
            </View>
        </View>
    )
  }

  _scroll() {
    if (Platform.OS === 'ios') {
      this.refs.list.scrollToEnd();
    } else {
      _.delay(() => this.refs.list.scrollToEnd(), 100);
    }
  }

  _pushMessage() {
    /*if (!this.state.message)
      return;

    this.state.data.messages.push({id: this.state.data.messages.length, time: 0, type: 'out', text: this.state.message});*/
    this.setState({message: ''});
    this._scroll(true);
  }

  render() {
    return (
      <RkAvoidKeyboard style={styles.container} onResponderRelease={(event) => { Keyboard.dismiss(); }}>
        <FlatList 
            ref='list'
            data={this.state.data}
            extraData={this.state}
            ItemSeparatorComponent={this._renderSeparator}
            keyExtractor={this._keyExtractor}
            renderItem={this.renderItem}/>
        <View style={styles.footer}>
          <RkTextInput
            onFocus={() => this._scroll(true)}
            onBlur={() => this._scroll(true)}
            onChangeText={(message) => this.setState({message})}
            value={this.state.message}
            rkType='row sticker'
            placeholder="Add a comment..."/>

          <RkButton onPress={() => this._pushMessage()} style={styles.send} rkType='circle highlight'>
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
    avatar: {
        marginRight: 16,
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
        marginVertical: 14,
        flex: 1,
    },
    itemIn: {},
    itemOut: {
        alignSelf: 'flex-end'
    },
    balloon: {
        maxWidth: scale(250),
        paddingHorizontal: 15,
        paddingTop: 10,
        paddingBottom: 15,
        borderRadius: 20,
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