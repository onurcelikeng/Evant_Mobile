import React from 'react';
import { ListView, View, Image, TouchableOpacity, TouchableHighlight, RefreshControl, Dimensions, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { RkStyleSheet, RkText, RkTextInput, RkTabView } from 'react-native-ui-kitten';
import {Actions} from 'react-native-router-flux';

import {data} from '../data';
import {Avatar} from '../components/avatar';
import {FontAwesome} from '../assets/icon';
import * as gameboardProvider from '../providers/gameboard';
import Login from './login';
import {strings} from '../locales/i18n'

const {width} = Dimensions.get('window');

export default class Gameboard extends React.Component {

    constructor(props) {
        super(props);
    
        this.users = data.getUsers();
    
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
          isLoading: true,
          isRefreshing: false,
          selectedIndex: 1
        };

        this.index = 0;
    
        this.setData = this._setData.bind(this);
        this.renderRow = this._renderRow.bind(this);
        this.handleChangeTab = this._handleChangeTab.bind(this);
    }

    componentDidMount() {
        this.getGameboard(this.state.selectedIndex).then(() => {
            this.setState({isLoading: false});
        });
    }

    getGameboard(type) {
        return gameboardProvider.getGameboard(type)
        .then((responseJson) => {
            if(responseJson.isSuccess) {
                console.log(responseJson);
                this.index = 0;
                this.setData(responseJson.data, type);
            }
        }).catch((err) => {console.log(err)});
    }

    _handleChangeTab(current) {
        this.index = 0;
        this.getGameboard(current).then(() => this.setState({selectedIndex:current}));
    }
    
    _setData(data, type) {
        this.index = 0;
		let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		if(type == 0) {
			this.setState({
				dailyData: ds.cloneWithRows(data)
			})
		} else if(type == 1) {
			this.setState({
				weeklyData: ds.cloneWithRows(data)
			})
		} else if(type == 2) {
			this.setState({
				monthlyData: ds.cloneWithRows(data)
			})
		}
	}

    _onRefresh() {
        this.index = 0;
		this.setState({isRefreshing: true});
		this.getGameboard(this.state.selectedIndex).then(() => {
			this.setState({isRefreshing: false});
		});
	}

    _renderRow(row) {
        let name = `${row.firstName} ${row.lastName}`;
        if(!this.state.isRefreshing) this.index += 1;
        return (
        <TouchableOpacity onPress={() => {if(row.userId != Login.getCurrentUser().userId) Actions.otherProfile({id: row.userId}); else Actions.profile();}}>
            {
                row.userId == Login.getCurrentUser().userId 
                ?
                <View style={[styles.container, {backgroundColor: "#f5ea92"}]}>
                    <RkText style={{marginLeft: 16, marginRight: 16, alignItems: 'center', flexDirection: 'row'}}>{this.index + "."}</RkText>
                    <Avatar img={row.photoUrl} rkType='circle'/>
                    <RkText style={{marginLeft: 16, alignItems: 'center', flexDirection: 'row'}}>{name}</RkText>
                    <View style={{flex: 1}}>
                    </View>
                    <RkText style={{alignItems: 'flex-end', flexDirection: 'row'}}>{row.score + " puan"}</RkText>
                </View>
                :
                <View style={styles.container}>
                    <RkText style={{marginLeft: 16, marginRight: 16, alignItems: 'center', flexDirection: 'row'}}>{this.index + "."}</RkText>
                    <Avatar img={row.photoUrl} rkType='circle'/>
                    <RkText style={{marginLeft: 16, alignItems: 'center', flexDirection: 'row'}}>{name}</RkText>
                    <View style={{flex: 1}}>
                    </View>
                    <RkText style={{alignItems: 'flex-end', flexDirection: 'row'}}>{row.score + " puan"}</RkText>
                </View>
            }
            
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
            this.index = 0;
            return (
                <RkTabView index={this.state.selectedIndex} rkType='rounded' maxVisibleTabs={3} onTabChanged={(index) => this.handleChangeTab(index)}  style={{borderColor: "#ffffff", backgroundColor: '#da6954'}}>
                    <RkTabView.Tab title={strings("gameboard.daily")} style={{backgroundColor: '#da6954'}}>
                        {
							this.state.dailyData != null ?
                            <ListView
                                style={styles.root}
                                dataSource={this.state.dailyData}
                                keyExtractor={this._keyExtractor}
                                renderRow={this.renderRow}
                                renderSeparator={this.renderSeparator}
                                automaticallyAdjustContentInsets={false}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.isRefreshing}
                                        onRefresh={this._onRefresh.bind(this)}
                                    />
                                }
                                enableEmptySections={true}/>
                            :
                            <View style={[styles.root, {flex:1}]}></View>
                        }
                    </RkTabView.Tab>
                    <RkTabView.Tab title={strings("gameboard.weekly")} style={{backgroundColor: '#da6954'}}>
                        {
                            this.state.weeklyData != null ?
                            <ListView
                                style={styles.root}
                                dataSource={this.state.weeklyData}
                                keyExtractor={this._keyExtractor}
                                renderRow={this.renderRow}
                                renderSeparator={this.renderSeparator}
                                automaticallyAdjustContentInsets={false}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.isRefreshing}
                                        onRefresh={this._onRefresh.bind(this)}
                                    />
                                }
                                enableEmptySections={true}/>
                            :
                            <View style={[styles.root, {flex:1}]}></View>
                        }
                    </RkTabView.Tab>
                    <RkTabView.Tab title={strings("gameboard.monthly")} style={{backgroundColor: '#da6954'}}>
                        {
                            this.state.monthlyData != null ?
                            <ListView
                                style={styles.root}
                                dataSource={this.state.monthlyData}
                                keyExtractor={this._keyExtractor}
                                renderRow={this.renderRow}
                                renderSeparator={this.renderSeparator}
                                automaticallyAdjustContentInsets={false}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.isRefreshing}
                                        onRefresh={this._onRefresh.bind(this)}
                                    />
                                }
                                enableEmptySections={true}/>
                            :
                            <View style={[styles.root, {flex:1}]}></View>
                        }
                    </RkTabView.Tab>
                </RkTabView>
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
    navbar: {
        width: width,
        backgroundColor: theme.colors.screen.nav,
        padding: 10, 
        flexDirection: 'row', 
        alignItems: 'center',
        borderBottomColor: 'grey', 
        borderBottomWidth: 0.7
    },
    backButton: {
        color: theme.colors.text.nav,
        fontSize: 20
    }
  }));