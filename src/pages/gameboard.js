import React from 'react';
import { ListView, View, Image, TouchableOpacity, TouchableHighlight, RefreshControl, Dimensions, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { RkStyleSheet, RkText, RkTextInput } from 'react-native-ui-kitten';
import {Actions} from 'react-native-router-flux';

import {data} from '../data';
import {Avatar} from '../components/avatar';
import {FontAwesome} from '../assets/icon';
import * as gameboardProvider from '../providers/gameboard';
import Login from './login';

export default class Gameboard extends React.Component {
    
    constructor(props) {
        super(props);
    
        this.users = data.getUsers();
    
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
          isLoading: true
        };

        this.index = 0;
    
        this.setData = this._setData.bind(this);
        this.renderRow = this._renderRow.bind(this);
    }

    componentDidMount() {
        this.getGameboard();
    }

    getGameboard() {
        gameboardProvider.getGameboard()
        .then((responseJson) => {
            if(responseJson.isSuccess) {
                this.setData(responseJson.data);
                this.setState({isLoading: false});
                console.log(responseJson.data);
            }
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
        this.index++;
        return (
        <TouchableOpacity onPress={() => {if(row.userId != Login.getCurrentUser().userId) Actions.otherProfile({id: row.userId}); else Actions.profile();}}>
            <View style={styles.container}>
                <RkText style={{marginLeft: 16, marginRight: 16, alignItems: 'center', flexDirection: 'row'}}>{this.index + "."}</RkText>
                <Avatar img={row.photoUrl} rkType='circle'/>
                <RkText style={{marginLeft: 16, alignItems: 'center', flexDirection: 'row'}}>{name}</RkText>
                <View style={{flex: 1}}>
                </View>
                <RkText style={{alignItems: 'flex-end', flexDirection: 'row'}}>{row.score + " puan"}</RkText>
            </View>
        </TouchableOpacity>
        )
    }
    
    renderSeparator(sectionID, rowID) {
        return (
          <View style={styles.separator}/>
        )
    }

    _keyExtractor(post, index) {
		return index;
	}

    render() {
        if(this.state.isLoading) {
            const animating = this.state.isLoading;
			return (
				<View style = {styles.indContainer}>
					<ActivityIndicator
					animating = {animating}
					color = '#bc2b78'
					size = "large"
					style = {styles.activityIndicator}/>
			 	</View>
			);
        }
        else {
            return (
                <ListView
                    style={styles.root}
                    dataSource={this.state.data}
                    keyExtractor={this._keyExtractor}
                    renderRow={this.renderRow}
                    renderSeparator={this.renderSeparator}
                    automaticallyAdjustContentInsets={false}
                    enableEmptySections={true}/>
            )
        }
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
      paddingVertical: 8,
      paddingHorizontal: 16,
      alignItems: 'center'
    },
    avatar: {
      marginRight: 16
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
    },
    activityIndicator: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: 30
    },
    indContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 70
	 },
  }));