import React from 'react';
import { FlatList, View, Platform, Image, TouchableOpacity, Keyboard, StyleSheet, Dimensions, TouchableHighlight, RefreshControl } from 'react-native';
import {InteractionManager} from 'react-native';
import { RkButton, RkText, RkTextInput, RkAvoidKeyboard, RkStyleSheet, RkTheme } from 'react-native-ui-kitten';
import _ from 'lodash';
import {Actions} from 'react-native-router-flux';
import ContentLoader from '../../config/contentLoader'
import Svg, { Circle, Ellipse, G, LinearGradient, RadialGradient, Line, Path, Polygon, Polyline, Rect, Symbol, Text, Use, Defs, Stop } from 'react-native-svg';
import Swipeable from 'react-native-swipeable';

import DropdownHolder from '../../providers/dropdownHolder';
import Login from '../login';
import * as commentProvider from '../../providers/comments';
import {FontAwesome} from '../../assets/icon';
import {Avatar} from '../../components/avatar';
import {scale} from '../../utils/scale';

let moment = require('moment');

let getUserId = (navigation) => {
  return navigation.state.params ? navigation.state.params.userId : undefined;
};

export default class Comments extends React.Component {

	constructor(props) {
		super(props);
		this.eventId = this.props.id;

		this.renderItem = this._renderItem.bind(this);
		this.onRefresh = this._onRefresh.bind(this);

		this.currentlyOpenSwipeable = null;

		this.state = {
			isLoading: true,
			isSuccess: false,
			isSwiping: false,
			rightActionActivated: false,
			toggle: false,
			isRefreshing: false
		}; 
  	}

	componentDidMount() {
		this.getComments(this.props.id);
	}

  	_onRefresh(){
		this.setState({
			isRefreshing: true
		});
		this.getComments(this.props.id).then(() => {
			this.setState({
				isRefreshing: false
			})
		});
	}

	addComment(credentials) {
		console.log(credentials);
		return commentProvider.addComment(credentials) 
		.then((responseJson) => {
		if(responseJson == null || responseJson == "" || responseJson == undefined) {
			DropdownHolder.getDropDown().alertWithType("error", "", "An error occured, please try again.");
		} else {
			if(responseJson.isSuccess) {
			this.setState({
				isSuccess: true
			})
			this.getComments(this.eventId);
			} else {
			DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
			}
		}
		}).catch((err) => {console.log(err)});
	}

	getComments(id) {
		return commentProvider.getComments(id)
		.then((responseJson) => {
		if(responseJson == null || responseJson == "" || responseJson == undefined) {
			DropdownHolder.getDropDown().alertWithType("error", "", "An error occured, please try again.");
		} else {
			if(responseJson.isSuccess) {
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
			}
		}
		}).catch((err) => {console.log(err)});
	}

	deleteComment(id) {
		return commentProvider.deleteComment(id)
		.then((responseJson) => {
		if(responseJson == null || responseJson == "" || responseJson == undefined) {
			DropdownHolder.getDropDown().alertWithType("error", "", "An error occured, please try again.");
		} else {
			if(responseJson.isSuccess) {
			DropdownHolder.getDropDown().alertWithType("success", "", responseJson.message);
			} else {
			DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
			}
		}
		}).catch((err) => {console.log(err)});
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
		const {rightActionActivated, toggle} = this.state;
		let name = `${info.item.user.firstName} ${info.item.user.lastName}`;

		return (
		<View>
			{
			info.item.user.userId == Login.getCurrentUser().userId ? 
			<Swipeable
				onRef = {ref => this.swipe = ref}
				rightActionActivationDistance={200}
				rightButtons={[
				<TouchableHighlight style={styles.rightSwipeItem} onPress={() => {this.currentlyOpenSwipeable.recenter(); this.deleteComment(info.item.commentId); this.getComments(this.eventId);}}><Image style={{height: 20, width: 20}} source={require('../../assets/icons/delete.png')}/></TouchableHighlight>
				]}
				onRightActionActivate={() => {this.deleteComment(info.item.commentId);this.setState({rightActionActivated: true})}}
				onRightActionDeactivate={(event, gestureState, swipe) => {this.currentlyOpenSwipeable = swipe; this.currentlyOpenSwipeable.recenter();this.currentlyOpenSwipeable = null; this.setState({rightActionActivated: false})}}
				onRightActionComplete={() => {this.currentlyOpenSwipeable = null; this.getComments(this.eventId); this.setState({toggle: !toggle})}}
				onRightButtonsOpenRelease = { (event, gestureState, swipe) => {
				if (this.currentlyOpenSwipeable && this.currentlyOpenSwipeable !== swipe) {
				this.currentlyOpenSwipeable.recenter(); }
				this.currentlyOpenSwipeable = swipe;
				} }
				onRightButtonsCloseRelease = {() => this.currentlyOpenSwipeable = null}>
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
			</Swipeable>
			:
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
			}
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
				refreshControl={<RefreshControl
				refreshing={this.state.isRefreshing}
				onRefresh={this.onRefresh}
				/>}
				renderItem={this.renderItem}
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
				refreshControl={<RefreshControl
				refreshing={this.state.isRefreshing}
				onRefresh={this.onRefresh}
				/>}
				keyExtractor={this._keyExtractor}
				renderItem={this.renderItem}/>
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
		},
		rightSwipeItem: {
			flex: 1,
			justifyContent: 'center',
			paddingLeft: 20,
			backgroundColor: '#FF3B30'
		}
	}));