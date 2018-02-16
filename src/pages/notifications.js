import React from 'react';
import { ListView, View, Image, TouchableOpacity, TouchableHighlight } from 'react-native';
import { RkStyleSheet, RkText } from 'react-native-ui-kitten';
import { Actions } from 'react-native-router-flux';

import { Avatar } from '../components/avatar';
import { data } from '../data';

let moment = require('moment');

export default class Notifications extends React.Component {

	constructor(props) {
		super(props);
	
		let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		this.data = ds.cloneWithRows(data.getNotifications());
	}

	renderRow(row) {
		let username = `${row.user.firstName} ${row.user.lastName}`;
		let hasAttachment = row.attach !== undefined;
		let attachment = <View/>;
	
		let mainContentStyle;
		if (hasAttachment) {
			mainContentStyle = styles.mainContent;
			attachment = <Image style={styles.attachment} source={row.attach}/>
		}
	
		return (
			<TouchableOpacity activeOpacity={1} onPress={() => {
				if(row.type == "comment") {
					Actions.comments()
				}
				else if(row.type == "like") {
					Actions.eventDetail({id: row.user.id})
				}
				else if(row.type == "follow") {
					Actions.otherProfile({id: row.user.id})
				}
			}}>
				<View style={styles.container}>
					<TouchableHighlight style={{borderRadius: 20}} activeOpacity={0.6} onPress={() => { Actions.otherProfile({id: row.user.id}) }}>
						<Avatar img={row.user.photo}
							rkType='circle'
							badge={row.type}/>
					</TouchableHighlight>
					<View style={styles.content}>
						<View style={mainContentStyle}>
							<View style={styles.text}>
								<RkText>
									<RkText rkType='header6'>{username}</RkText>
									<RkText rkType='primary2'> {row.description}</RkText>
								</RkText>
							</View>
							<RkText rkType='secondary5 hintColor'>{moment().add(row.time, 'seconds').fromNow()}</RkText>
						</View>
						
							
						
						{(row.type == "comment" || row.type == "like") ? <TouchableHighlight activeOpacity={0.6} style={styles.attachment} onPress={() => {
							if(row.type == "comment") {
								Actions.comments()
							}
							else if(row.type == "like") {
								Actions.eventDetail({id: row.user.id})
							}
						} }>{attachment}</TouchableHighlight> : null }
					</View>
				</View>
		  	</TouchableOpacity>
		)
	}
	
	render() {
		return (
			<ListView
				style={styles.root}
				dataSource={this.data}
				renderRow={this.renderRow}/>
		)
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