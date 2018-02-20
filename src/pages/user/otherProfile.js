import React from 'react';
import { View, ScrollView, TouchableOpacity, Platform, FlatList, Image } from 'react-native';
import { RkText, RkButton, RkStyleSheet } from 'react-native-ui-kitten';
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
import * as userProvider from '../../providers/users';
import {Avatar} from '../../components/avatar';
import {Gallery} from '../../components/gallery';
import {FontIcons} from '../../assets/icon';
import formatNumber from '../../utils/textUtils';
import {data} from '../../data';

export default class OtherProfile extends React.Component {

	goSettings() {
		Actions.settings()
	}

	state = {
		isFollowing: '',
		isLoading: true,
		isReload: false
	}

	constructor(props) {
		super(props);
		let {params} = this.props.navigation.state;
    let id = params ? params.id : 1;
		this.user = data.getUser(1);
	}

	componentWillMount() {
		friendProvider.isFollowing(this.props.id).then(following => {
			this.setState({
				isFollowing: following.isSuccess
			})
		});

		userProvider.getUserInfo(this.props.id).then(user => {
			this.setState({
				isLoading: false,
				user: user.data
			})
		})
	}

	follow() {
		console.log(this.props.id)
		friendProvider.follow(this.props.id).then(follow => {
			console.log(follow);
			this.setState({
				isFollowing: true
			})
		})
	}

	unfollow() {
		friendProvider.unfollow(this.props.id).then(unfollow => {
			console.log(unfollow);
			this.setState({
				isFollowing: false
			})
		})
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
		}

		console.log(this.state.user.photoUrl);
		let name = `${this.state.user.firstName} ${this.state.user.lastName}`;
		let images = this.user.images;

		return (
			<ScrollView style={styles.root} key={this.state.isFollowing}>
				<View style={[styles.header, styles.bordered]}>
					<Image source={{uri: this.state.user.photoUrl}} style={styles.big} />
					<RkText rkType='header2'>{name}</RkText>          
					{this.state.isFollowing === false ? <RkButton onPress={() => {this.follow()}} style={styles.button} rkType='small stretch rounded'>FOLLOW</RkButton>: <RkButton onPress={() => {this.unfollow()}} style={styles.button} rkType='small stretch rounded'>UNFOLLOW</RkButton>}
				</View>

				<View style={styles.userInfo}>
					<View style={styles.section}>
						<RkText rkType='header3' style={styles.space}>{this.user.postCount}</RkText>
						<RkText rkType='secondary1 hintColor'>Events</RkText>
					</View>
					<TouchableOpacity onPress={() => {if(this.state.user.followersCount != 0) { Actions.followerList({id: this.state.user.userId})}}}  style={styles.section}>
						<View style={styles.section}>
							<RkText rkType='header3' style={styles.space}>{formatNumber(this.state.user.followersCount)}</RkText>
							<RkText rkType='secondary1 hintColor'>Followers</RkText>
						</View>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => {if(this.state.user.followingsCount != 0) { Actions.followingList({id: this.state.user.userId})}}}  style={styles.section}>
						<View style={styles.section}>
							<RkText rkType='header3' style={styles.space}>{this.state.user.followingsCount}</RkText>
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