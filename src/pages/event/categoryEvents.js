import React from 'react';
import { FlatList, Image, View, TouchableOpacity, Dimensions, RefreshControl, TouchableHighlight } from 'react-native';
import { RkText, RkCard, RkStyleSheet, withRkTheme, RkImage, RkTabView, Tab, RkTheme } from 'react-native-ui-kitten';
import {Actions} from 'react-native-router-flux';
import ContentLoader from '../../config/contentLoader'
import Svg, { Circle, Ellipse, G, RadialGradient, Line, Path, Polygon, Polyline, Rect, Symbol, Text, Use, Defs, Stop } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';

import {Avatar} from '../../components/avatar';
import Login from '../login';
import DropdownHolder from '../../providers/dropdownHolder';
import * as eventProvider from '../../providers/events';
import * as eventOperationProvider from '../../providers/eventOperations';
import {SocialBar} from '../../components/socialBar';
import {data} from '../../data';
import { NavBar } from '../../components/navBar';
import {FontAwesome} from '../../assets/icon';

let moment = require('moment');

export default class CategoryEvents extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
            isRefreshing: false,
            selectedIndex: 0
		}
               
        this.renderItem = this._renderItem.bind(this);
        this.handleChangeTab = this._handleChangeTab.bind(this);
	}

	componentDidMount() {
        this.title = this.props.title;
		if(this.props.id != null) {
			this.getCategoryEvents(this.props.id);
        }
	}

	getCategoryEvents(id) {
		return eventProvider.getCategoryEvents(id)
		.then((responseJson) => {
            if(responseJson == null || responseJson == "" || responseJson == undefined) {
                DropdownHolder.getDropDown().alertWithType("error", "", "An error occured, please try again.");
            } else {
                if(responseJson.isSuccess) {
                    this.setState({
                        isLoading: false,
                        data: responseJson.data,
                    });
                } else {
                    this.setState({
                        isLoading: false,
                        data: [],
                    });
                }
            }
		}).catch((err) => {console.log(err)});
    }
    
    joinEvent() {
        console.log(this.state.data);
        return eventOperationProvider.joinEvent(this.state.data.eventId)
        .then((responseJson) => {
            if(responseJson == null || responseJson == "" || responseJson == undefined) {
                DropdownHolder.getDropDown().alertWithType("error", "", "An error occured, please try again.");
            } else {
                if(responseJson.isSuccess) {
                    this.setState({join: true});
                    DropdownHolder.getDropDown().alertWithType("success", "", responseJson.message);
                } else {
                    DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
                }
            }
        }).catch((err) => {console.log(err)});
    }

    leaveEvent() {
        return eventOperationProvider.leaveEvent(this.state.data.eventId)
        .then((responseJson) => {
            if(responseJson == null || responseJson == "" || responseJson == undefined) {
                DropdownHolder.getDropDown().alertWithType("error", "", "An error occured, please try again.");
            } else {
                if(responseJson.isSuccess) {
                this.setState({join: false});
                DropdownHolder.getDropDown().alertWithType("success", "", responseJson.message);
                } else {
                DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
                }
            }
        }).catch((err) => {console.log(err)});
    }

    joinStatus() {
        return eventOperationProvider.joinStatus(this.state.data.eventId)
        .then((responseJson) => {
            if(responseJson == null || responseJson == "" || responseJson == undefined) {
                DropdownHolder.getDropDown().alertWithType("error", "", "An error occured, please try again.");
            } else {
                this.setState({join: responseJson.isSuccess})
            }
        }).catch((err) => {console.log(err)});
    }

    filterData(index) {
        if(index == 0) {
			
		} else if(index == 1) {
            var array = []
			this.state.data.forEach(element => {
                if(moment(element.start).calendar().toLocaleLowerCase().indexOf("Today") !=-1 || moment(element.start).calendar().toLocaleLowerCase().indexOf("bugün") !=-1){
                    array.push(element);
                }
            });

            this.setState({today: array});
		} else if(index == 2) {
            var array = []
			this.state.data.forEach(element => {
                console.log(moment(element.start));
                if(moment(element.start).calendar().toLocaleLowerCase().indexOf("Tomorrow") !=-1 || moment(element.start).calendar().toLocaleLowerCase().indexOf("yarın") !=-1){
                    array.push(element);
                }
            });

            this.setState({tomorrow: array});
		} else if(index == 3) {
            var array = []
			this.state.data.forEach(element => {
                if(moment(element.start) >= moment().startOf('week').subtract(1, 'days') && moment(element.start) <= moment().startOf('week').add(4, 'days')){
                    array.push(element);
                }
            });

            this.setState({week: array});
        } else if(index == 4) {
            var array = []
			this.state.data.forEach(element => {
                if(moment(element.start).format() >= moment().endOf('week').subtract(2, 'days').format() && moment(element.start).format() <= moment().endOf('week').format()){
                    array.push(element);
                }
            });

            this.setState({weekend: array});
        }
    }

    _handleChangeTab(index) {
        this.setState({selectedIndex:index});
        this.filterData(index);
	}

	_keyExtractor(post, index) {
		return post.eventId;
	}
	
	_renderItem(info) {
        let button = null;
        if(this.state.join){
            button = <TouchableOpacity onPress={() => { this.leaveEvent()}} activeOpacity={0.6} style={{justifyContent: 'space-between', alignSelf: "flex-end", flexDirection: "row"}}>
                        <Image style={{height: 20, width: 20}} source={require("../../assets/icons/heart.png")}/>
                    </TouchableOpacity>;
        } else if(!this.state.join) {
            button = <TouchableOpacity onPress={() => { this.joinEvent()}} activeOpacity={0.6} style={{justifyContent: 'space-between', alignSelf: "flex-end", flexDirection: "row"}}>
                        <Image style={{height: 20, width: 20}} source={require("../../assets/icons/heart_outline.png")}/>
                    </TouchableOpacity>;
        }
        let username = `${info.item.user.firstName} ${info.item.user.lastName}`;
		return (
            <TouchableOpacity activeOpacity={1} onPress={() => { Actions.eventDetail({id: info.item.eventId}) }}>
                <View style={styles.rowContainer}>
                    <TouchableHighlight style={{borderRadius: 20}} activeOpacity={0.6}>
                        <Image style={{height:70, width: 70, marginRight: 15, borderRadius: 5}} source={{uri: info.item.photoUrl}}/>
                    </TouchableHighlight>
                    <View style={styles.content}>
                        <View>
                            <View style={styles.text}>
                                <RkText>
                                    <RkText rkType='header6'>{info.item.title}</RkText>
                                    <RkText rkType='primary2'> {info.item.content}</RkText>
                                </RkText>
                            </View>
                            <RkText rkType='secondary5 hintColor'>{moment(info.item.start).format('lll')}</RkText>
                            <RkText rkType='secondary5 hintColor'>{username}</RkText>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
		)
	}

	_onRefresh() {
		console.log("refreshing");
        this.setState({isRefreshing: true});
        this.getCategoryEvents(this.props.id).then(() => {
        this.setState({isRefreshing: false});
        });
    }
	
	render() {
		if (this.state.isLoading) {
			var width = require('Dimensions').get('window').width - 50;
			var loaders = [];
			for(let i = 0; i < 10; i++){
			  loaders.push(
				<ContentLoader key={i} height={150}>
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

		return (
            <View style={styles.root}>
                <RkTabView rkType='rounded' maxVisibleTabs={3} onTabChanged={(index) => this.handleChangeTab(index)} style={{borderColor: "#ffffff", backgroundColor: '#da6954'}}>
                    <RkTabView.Tab title={'All'} style={{backgroundColor: '#da6954'}}>
                        <FlatList
                            data={this.state.data}
                            renderItem={this.renderItem}
                            keyExtractor={this._keyExtractor}
                            style={styles.root}
                            enableEmptySections={true}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isRefreshing}
                                    onRefresh={this._onRefresh.bind(this)}
                                />
                            }
                        />
                    </RkTabView.Tab>
                    <RkTabView.Tab title={'Today'} style={{backgroundColor: '#da6954'}}>
                        <FlatList
                            data={this.state.today}
                            renderItem={this.renderItem}
                            keyExtractor={this._keyExtractor}
                            style={styles.root}
                            enableEmptySections={true}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isRefreshing}
                                    onRefresh={this._onRefresh.bind(this)}
                                />
                            }
                        />
                    </RkTabView.Tab>
                    <RkTabView.Tab title={'Tomorrow'} style={{backgroundColor: '#da6954', borderWidth: 0}}>
                        <FlatList
                            data={this.state.tomorrow}
                            renderItem={this.renderItem}
                            keyExtractor={this._keyExtractor}
                            style={styles.root}
                            enableEmptySections={true}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isRefreshing}
                                    onRefresh={this._onRefresh.bind(this)}
                                />
                            }
                        />
                    </RkTabView.Tab>
                    <RkTabView.Tab title={'This Week'} style={{backgroundColor: '#da6954', borderWidth: 0}}>
                        <FlatList
                            data={this.state.week}
                            renderItem={this.renderItem}
                            keyExtractor={this._keyExtractor}
                            style={styles.root}
                            enableEmptySections={true}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isRefreshing}
                                    onRefresh={this._onRefresh.bind(this)}
                                />
                            }
                        />
                    </RkTabView.Tab>
                    <RkTabView.Tab title={'This Weekend'} style={{backgroundColor: '#da6954', borderWidth: 0}}>
                        <FlatList
                            data={this.state.weekend}
                            renderItem={this.renderItem}
                            keyExtractor={this._keyExtractor}
                            style={styles.root}
                            enableEmptySections={true}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isRefreshing}
                                    onRefresh={this._onRefresh.bind(this)}
                                />
                            }
                        />
                    </RkTabView.Tab>
                </RkTabView>
            </View>
		)
	}
}
	
let styles = RkStyleSheet.create(theme => ({
	root: {
        backgroundColor: theme.colors.screen.base,
        flex:1
    },
    container: {
		padding: 16,
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderColor: theme.colors.border.base,
		alignItems: 'flex-start'
    },
    tabbarInactive: {
        backgroundColor: "#da6954",
        color: "#ffffff",
        borderWidth: 0
    },
    tabbarActive: {
        backgroundColor: "#da6954",
        color: "#ffffff"
    },
	card: {
		marginBottom: 15,
	},
	time: {
		marginTop: 5
	},
	overlay: {
		justifyContent: 'flex-end'
	},
	linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'Gill Sans',
        textAlign: 'center',
        margin: 10,
        color: '#ffffff',
        backgroundColor: 'transparent',
    },
    rowContainer: {
        padding: 16,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: theme.colors.border.base,
        alignItems: 'flex-start'
    },
    text: {
        marginBottom: 5,
    },
    content: {
        flex: 1,
        marginRight: 0
    },
}));

RkTheme.setType('RkTabView', 'rounded', {
    backgroundColor: 'transparent',
    color: 'white',
    borderWidth: 0,
    tabContainer: {
      overflow: 'hidden',
      borderWidth: 0,
      borderLeftWidth: 0,
      borderRightWidth: 0,
    },
    content: {
      padding: 7
    }
});

RkTheme.setType('RkTabView', 'roundedSelected', {
    tabContainer: {
        overflow: 'hidden',
        borderWidth: 0,
        borderBottomColor: 'black',
        borderBottomWidth: 1
      }
});