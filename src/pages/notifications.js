import React from 'react';
import { ListView, View, Image, TouchableOpacity, TouchableHighlight, RefreshControl } from 'react-native';
import { RkStyleSheet, RkText } from 'react-native-ui-kitten';
import Svg, { Circle, Ellipse, G, LinearGradient, RadialGradient, Line, Path, Polygon, Polyline, Rect, Symbol, Text, Use, Defs, Stop } from 'react-native-svg';
import { Actions } from 'react-native-router-flux';

import DropdownHolder from '../providers/dropdownHolder';
import ContentLoader from '../config/contentLoader'
import * as notificationProvider from '../providers/notifications';
import { Avatar } from '../components/avatar';
import { data } from '../data';

let moment = require('moment');

export default class Notifications extends React.Component {

	constructor(props) {
		super(props);
	
		this.state = {
			isLoading: true,
			isRefreshing: false
		};
	}

	componentWillMount() {
		this.getNotifications();
	}

	getNotifications() {				
		let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		return notificationProvider.getNotifications()
		.then((responseJson) => {
			console.log(responseJson)
			if(responseJson.isSuccess) {
				this.setState({
					data: ds.cloneWithRows(responseJson.data),
					isLoading: false
				});
				notificationProvider.readNotifications()
				.then((responseJson) => {
					console.log(responseJson)
					if(responseJson.isSuccess) {
						console.log(responseJson.message)
					} else {
						DropdownHolder.getDropDown().alertWithType("error", "", responseJson.data);
					}
				})
			} else {
				DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
			}
		})
	}

	_onRefresh() {
		console.log("refreshing");
		this.setState({isRefreshing: true});
		this.getNotifications().then(() => {
			this.setState({isRefreshing: false});
		});
	}

	renderRow(row) {
	
		let username = `${row.user.firstName} ${row.user.lastName}`;
		let hasAttachment = row.event !== null;
		console.log(hasAttachment)
		let attachment = <View/>;
	
		let mainContentStyle;
		if (hasAttachment) {
			mainContentStyle = styles.mainContent;
			attachment = <Image style={styles.attachment} source={{uri: row.event.photoUrl}}/>
		}
	
		return (
			<TouchableOpacity activeOpacity={1} onPress={() => {
				if(row.notificationType == 1) {
					Actions.comments()
				}
				else if(row.notificationType == 2) {
					Actions.eventDetail({id: row.user.id})
				}
				else if(row.notificationType == 3) {
					Actions.otherProfile({id: row.user.id})
				}
			}}>
				<View style={styles.container}>
					<TouchableHighlight style={{borderRadius: 20}} activeOpacity={0.6} onPress={() => { Actions.otherProfile({id: row.user.userId}) }}>
						<Avatar img={row.user.photoUrl} rkType='circle' badge={row.notificationType}/>
					</TouchableHighlight>
					<View style={styles.content}>
						<View style={mainContentStyle}>
							<View style={styles.text}>
								<RkText>
									<RkText rkType='header6'>{username}</RkText>
									<RkText rkType='primary2'> {row.content}</RkText>
								</RkText>
							</View>
							<RkText rkType='secondary5 hintColor'>{moment().add(row.createdAt, 'seconds').fromNow()}</RkText>
						</View>		
						
						{(row.notificationType == 1 || row.notificationType == 2) ? <TouchableHighlight activeOpacity={0.6} style={styles.attachment} onPress={() => {
							if(row.notificationType == 1) {
								Actions.comments()
							}
							else if(row.notificationType == 2) {
								Actions.eventDetail({id: row.event.eventId})
							}
						} }>{attachment}</TouchableHighlight> : null }
					</View>
				</View>
			</TouchableOpacity>
		)
	}
	
	render() {
		if (this.state.isLoading) {
			var width = require('Dimensions').get('window').width - 50;

			return (
			  <View style={{flex: 1, paddingTop: 20, backgroundColor: "#ffffff", alignItems: "center"}}>
				<ContentLoader height={70}>
					<Circle cx="30" cy="30" r="30"/>
					<Rect x="80" y="17" rx="4" ry="4" width={width - 80} height="13"/>
				</ContentLoader>
				<ContentLoader height={70}>
					<Circle cx="30" cy="30" r="30"/>
					<Rect x="80" y="17" rx="4" ry="4" width={width - 80} height="13"/>
				</ContentLoader>
				<ContentLoader height={70}>
					<Circle cx="30" cy="30" r="30"/>
					<Rect x="80" y="17" rx="4" ry="4" width={width - 80} height="13"/>
				</ContentLoader>
				<ContentLoader height={70}>
					<Circle cx="30" cy="30" r="30"/>
					<Rect x="80" y="17" rx="4" ry="4" width={width - 80} height="13"/>
				</ContentLoader>
			  </View>
			);
		} else {
			return (
				<ListView
					style={styles.root}
					dataSource={this.state.data}
					renderRow={this.renderRow}
					refreshControl={
						<RefreshControl
						  refreshing={this.state.isRefreshing}
						  onRefresh={this._onRefresh.bind(this)}
						/>
					}
				/>
			)
		}
	}
}
	
let styles = RkStyleSheet.create(theme => ({
	root: {
		backgroundColor: theme.colors.screen.base
	},
	container: {
		padding: 16,
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderColor: theme.colors.border.base,
		alignItems: 'flex-start'
	},
	avatar: {},
	text: {
		marginBottom: 5,
	},
	content: {
		flex: 1,
		marginLeft: 16,
		marginRight: 0
	},
	mainContent: {
		marginRight: 60
	},
	img: {
		height: 50,
		width: 50,
		margin: 0
	},
	attachment: {
		position: 'absolute',
		right: 0,
		height: 50,
		width: 50
	}
}));