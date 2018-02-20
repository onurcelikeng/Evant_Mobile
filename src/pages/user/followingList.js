import React from 'react';
import { ListView, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import _ from 'lodash';
import { RkStyleSheet, RkText, RkTextInput } from 'react-native-ui-kitten';
import {Actions} from 'react-native-router-flux';
import ContentLoader from '../../config/contentLoader'
import Svg,{
  Circle,
  Ellipse,
  G,
  LinearGradient,
  RadialGradient,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
  Symbol,
  Text,
  Use,
  Defs,
  Stop
} from 'react-native-svg';

import * as friendProvider from '../../providers/friendOperations';
import {data} from '../../data';
import {Avatar} from '../../components/avatar';
import {FontAwesome} from '../../assets/icon';

export default class FollowingList extends React.Component {
  constructor(props) {
    super(props);

    this.users = data.getUsers();

    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      isLoading: true
    };

    this.filter = this._filter.bind(this);
    this.setData = this._setData.bind(this);
    this.renderHeader = this._renderHeader.bind(this);
    this.renderRow = this._renderRow.bind(this);
  }

  componentDidMount() {
		this.getFollowings(this.props.id);
	}
	
	getFollowings(id) {
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		return friendProvider.getFollowings(id)
		.then((responseJson) => {
			if(responseJson.isSuccess) {
				this.setState({
					isLoading: false,
          data: ds.cloneWithRows(responseJson.data),
          users: responseJson.data
				  }, function() {
					// do something with new state
				});
			} else {
				console.log(responseJson.message);
			}
		})
		.catch((error) => {
		  console.log(error);
		});
	}  

  _setData(data) {
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.setState({
      data: ds.cloneWithRows(data)
    })
  }

  _renderRow(row) {
    let name = `${row.firstName} ${row.lastName}`;
    return (
      <TouchableOpacity onPress={() => { Actions.push("otherProfile",{id: row.userId}) }}>
        <View style={styles.container}>
        <Image source={{uri: row.photoUrl}} style={styles.circle} />
        <RkText>{name}</RkText>
        </View>
      </TouchableOpacity>
    )
  }

  renderSeparator(sectionID, rowID) {
    return (
      <View style={styles.separator}/>
    )
  }

  _renderHeader() {
    return (
      <View style={styles.searchContainer}>
        <RkTextInput autoCapitalize='none'
                     autoCorrect={false}
                     onChange={(event) => this._filter(event.nativeEvent.text)}
                     label={<RkText rkType='awesome'>{FontAwesome.search}</RkText>}
                     rkType='row'
                     placeholder='Search'/>
      </View>
    )
  }

  _filter(text) {
    let pattern = new RegExp(text, 'i');
    let users = _.filter(this.state.users, (user) => {

      if (user.firstName.search(pattern) != -1
        || user.lastName.search(pattern) != -1)
        return user;
    });

    this.setData(users);
  }

  render() {
    if (this.state.isLoading) {
			var width = require('Dimensions').get('window').width - 50;
      var loaders = [];
      for(let i = 0; i < 10; i++){
        loaders.push(
          <ContentLoader height={70}>
            <Circle cx="30" cy="30" r="30"/>
            <Rect x="80" y="17" rx="4" ry="4" width={width - 80} height="13"/>
          </ContentLoader>
        )
      }
			return (
			  <View style={{flex: 1, paddingTop: 20, backgroundColor: "#ffffff", alignItems: "center"}}>
          {loaders}
			  </View>
			);
		}

    return (
      <ListView
        style={styles.root}
        dataSource={this.state.data}
        renderRow={this.renderRow}
        renderSeparator={this.renderSeparator}
        renderHeader={this.renderHeader}
        enableEmptySections={true}/>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base
  },
  searchContainer: {
    backgroundColor: theme.colors.screen.bold,
    paddingHorizontal: 16,
    paddingVertical: 10,
    height: 60,
    alignItems: 'center'
  },
  container: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center'
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.border.base
  },
  circle: {
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 16
  }
}));