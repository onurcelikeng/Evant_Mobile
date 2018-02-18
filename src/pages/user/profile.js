import React from 'react';
import { View, ScrollView, TouchableOpacity, Platform, FlatList, Image } from 'react-native';
import { RkText, RkButton, RkStyleSheet } from 'react-native-ui-kitten';
import {Actions} from 'react-native-router-flux';

import {Avatar} from '../../components/avatar';
import {Gallery} from '../../components/gallery';
import {FontIcons} from '../../assets/icon';
import formatNumber from '../../utils/textUtils';
import {data} from '../../data';
import Login from '../login'

export default class Profile extends React.Component {

	constructor(props) {
		super(props);
		this.data = data.getUser();
		this.user = Login.getCurrentUser();
		console.log(this.user);
	}

	render() {
		let name = this.user.name;
		let images = this.data.images;

		return (
			<ScrollView style={styles.root}>
				<View style={[styles.header, styles.bordered]}>
				<Image source={{uri: this.user.photo}} style={styles.big} />
					<RkText rkType='header2'>{name}</RkText>
				</View>

				<View style={styles.userInfo}>
					<View style={styles.section}>
						<RkText rkType='header3' style={styles.space}>{this.data.postCount}</RkText>
						<RkText rkType='secondary1 hintColor'>Events</RkText>
					</View>
					<TouchableOpacity onPress={() => {Actions.followerList()}} style={styles.section}>
						<View style={styles.section}>
							<RkText rkType='header3' style={styles.space}>{formatNumber(this.data.followersCount)}</RkText>
							<RkText rkType='secondary1 hintColor'>Followers</RkText>
						</View>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => {Actions.followingList()}}  style={styles.section}>
						<View style={styles.section}>
							<RkText rkType='header3' style={styles.space}>{this.data.followingCount}</RkText>
							<RkText rkType='secondary1 hintColor'>Following</RkText>
						</View>
					</TouchableOpacity>
				</View>
				<Gallery items={images}/>
			</ScrollView>
		)
	}
}
	
let styles = RkStyleSheet.create(theme => ({
	root: {
	  backgroundColor: theme.colors.screen.base
	},
	header: {
	  alignItems: 'center',
	  paddingTop: 25,
	  paddingBottom: 17
	},
	userInfo: {
	  flexDirection: 'row',
	  paddingVertical: 18,
	},
	bordered: {
	  borderBottomWidth: 1,
	  borderColor: theme.colors.border.base
	},
	section: {
	  flex: 1,
	  alignItems: 'center'
	},
	space: {
	  marginBottom: 3
	},
	separator: {
	  backgroundColor: theme.colors.border.base,
	  alignSelf: 'center',
	  flexDirection: 'row',
	  flex: 0,
	  width: 1,
	  height: 42
	},
	buttons: {
	  flexDirection: 'row',
	  paddingVertical: 8,
	},
	button: {
	  marginTop: 10,
	  alignSelf: 'center',
	  width: 140,
	  backgroundColor: '#FF5E20',
	},
	big: {
			width: 110,
			height: 110,
			borderRadius: 55,
			marginBottom: 19,
			flexDirection: 'column'
	},  
}));