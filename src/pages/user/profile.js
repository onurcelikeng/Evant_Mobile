import React from 'react';
import { View, ScrollView, TouchableOpacity, Platform, FlatList } from 'react-native';
import { RkText, RkButton, RkStyleSheet } from 'react-native-ui-kitten';
import {Actions} from 'react-native-router-flux';

import {Avatar} from '../../components/avatar';
import {Gallery} from '../../components/gallery';
import {FontIcons} from '../../assets/icon';
import formatNumber from '../../utils/textUtils';
import {data} from '../../data';

export default class Profile extends React.Component {

	constructor(props) {
		super(props);
		this.user = data.getUser();
	}

	render() {
		let name = `${this.user.firstName} ${this.user.lastName}`;
		let images = this.user.images;

		return (
			<ScrollView style={styles.root}>
				<View style={[styles.header, styles.bordered]}>
					<Avatar img={this.user.photo} rkType='big'/>
					<RkText rkType='header2'>{name}</RkText>
				</View>

				<View style={styles.userInfo}>
					<View style={styles.section}>
						<RkText rkType='header3' style={styles.space}>{this.user.postCount}</RkText>
						<RkText rkType='secondary1 hintColor'>Events</RkText>
					</View>
					<TouchableOpacity onPress={() => {Actions.followerList()}} style={styles.section}>
						<View style={styles.section}>
							<RkText rkType='header3' style={styles.space}>{formatNumber(this.user.followersCount)}</RkText>
							<RkText rkType='secondary1 hintColor'>Followers</RkText>
						</View>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => {Actions.followingList()}}  style={styles.section}>
						<View style={styles.section}>
							<RkText rkType='header3' style={styles.space}>{this.user.followingCount}</RkText>
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
	}  
}));