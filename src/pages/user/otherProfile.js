import React from 'react';
import { View, ScrollView, TouchableOpacity, Platform, FlatList, RefreshControl, Image, Dimensions } from 'react-native';
import { RkText, RkButton, RkStyleSheet } from 'react-native-ui-kitten';
import {Actions} from 'react-native-router-flux';
import Svg, { Circle, Ellipse, G, LinearGradient, RadialGradient, Line, Path, Polygon, Polyline, Rect, Symbol, Text, Use, Defs, Stop } from 'react-native-svg';
import * as Animatable from 'react-native-animatable';
import HeaderImageScrollView, { TriggeringView } from 'image-header-scroll';
import { Header } from 'react-navigation';
import Timeline from 'react-native-timeline-listview';

import DropdownHolder from '../../providers/dropdownHolder';
import ContentLoader from '../../config/contentLoader'
import * as friendProvider from '../../providers/friendOperations';
import * as userProvider from '../../providers/users';
import {Avatar} from '../../components/avatar';
import {Gallery} from '../../components/gallery';
import {FontIcons} from '../../assets/icon';
import formatNumber from '../../utils/textUtils';
import {data} from '../../data';
import Login from '../login'

let moment = require('moment');

const MIN_HEIGHT = Header.HEIGHT;
const MAX_HEIGHT = 280;
let {height, width} = Dimensions.get('window');

export default class OtherProfile extends React.Component {

	goSettings() {
		Actions.settings()
	}

	constructor(props) {
		super(props);

		this.state = {
			isFollowing: '',
			isRefreshing: false,      
			waiting: false,
			isLoading: true,
			data: []
		}

		this.onRefresh = this.onRefresh.bind(this)
		this.onEventPress = this.onEventPress.bind(this)
    this.renderSelected = this.renderSelected.bind(this)
    this.renderDetail = this.renderDetail.bind(this)
	}

	componentWillMount() {
		friendProvider.isFollowing(this.props.id).then((responseJson) => {
			this.setState({
				isFollowing: responseJson.isSuccess
			})
		});

		userProvider.getUserInfo(this.props.id).then((responseJson) => {
			if(responseJson.isSuccess) {
				this.setState({
					user: responseJson.data
				}, function() {
					this.getTimeline(this.state.user.userId);
				})
			} else {
				console.log(responseJson.message);
			}
		});
	}

	getUserInfo() {
		userProvider.getUserInfo(this.props.id).then((responseJson) => {
			if(responseJson.isSuccess) {
				this.setState({
					user: responseJson.data
				})
			} else {
				console.log(responseJson.message);
			}
		});
	}

	follow() {
		friendProvider.follow(this.props.id).then((responseJson) => {
			if(responseJson.isSuccess) {
				this.setState({
					isFollowing: true
				});
				DropdownHolder.getDropDown().alertWithType("success", "", responseJson.message);
				this.getUserInfo();
			} else {
				DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
			}
		})
	}

	unfollow() {
		friendProvider.unfollow(this.props.id).then((responseJson) => {
			if(responseJson.isSuccess) {
				this.setState({
					isFollowing: false
				});
				DropdownHolder.getDropDown().alertWithType("success", "", responseJson.message);
				this.getUserInfo();
			} else {
				DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
			}
		})
	}

	onEventPress(data){
    this.setState({selected: data});
		
		console.log(data);
		if(data.type == "following") {
			Actions.otherProfile({id: data.customId});
		} else if(data.type == "follower") {
			if(Login.getCurrentUser().userId == data.customId) Actions.profile();
			else Actions.otherProfile({id: data.customId});
		} else if(data.type == "comment-event") {
			Actions.comments({id: data.customId});
		} else if(data.type == "create-event") {
			Actions.eventDetail({id: data.customId});
		} else if(data.type == "join-event") {
			Actions.eventDetail({id: data.customId});
		}
  }

  renderSelected(){
		if(this.state.selected)
			return <RkText style={{marginTop:10}}>Selected event: {this.state.selected.title} at {this.state.selected.time}</RkText>
	}
	
	renderDetail(rowData, sectionID, rowID) {
    let title = <RkText style={[styles.titleTimeline]}>{rowData.header}</RkText>
    var desc = null
    if(rowData.body && rowData.image)
      desc = ( 
				<View style={styles.descriptionContainer}>
					<View style={{flex:1}}>  
						{title}
						<RkText style={[styles.textDescription]}>{rowData.body}</RkText>
					</View>
          <Image source={{uri: rowData.image}} style={styles.image}/>
				</View>
			)
		else if(rowData.body)
			desc = (
        <View style={{flex:1}}>  
					{title}
					<RkText style={[styles.textDescription]}>{rowData.body}</RkText>
        </View>
			)

    return (
			<View> 
        {desc}
			</View>
    )
	}
	
	getTimeline(id) {
		userProvider.getTimeline(id).then((responseJson) => {
			let icon = require("../../assets/icons/comment.png");
			if(responseJson.isSuccess) {
				this.setState({data: []});
				responseJson.data.forEach(element => {
					if(element.type == "comment-event") {
						icon = require("../../assets/icons/comment.png");
					} else if(element.type == "create-event") {
						icon = require("../../assets/icons/create_event.png");
					} else if(element.type == "follower") {
						icon = require("../../assets/icons/new_follower.png");
					} else if(element.type == "following") {
						icon = require("../../assets/icons/new_following.png");
					} else if(element.type == "join-event") {
						icon = require("../../assets/icons/join_event.png");
					}
					var model = {
						body: element.body,
						customId: element.customId,
						header: element.header,
						image: element.image,
						icon: icon,
						lineColor: element.lineColor,
						type: element.type,
						createAt: element.createAt
					};
					
					this.state.data.push(model);
					this.setState(
						this.state
					)
				});
				
				this.setState({
					isLoading: false,
					isRefreshing: false
				})
			} else {
				DropdownHolder.getDropDown().alertWithType("alert", "", responseJson.message);
			}
		})
	}

	onRefresh(){
    this.setState({
			isRefreshing: true});
		this.getTimeline(this.props.id);
	}

	_keyExtractor(post, index) {
		return post.id;
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

		let name = `${this.state.user.firstName} ${this.state.user.lastName}`;

		return (
			<View style={styles.container}>
        <HeaderImageScrollView
          maxHeight={MAX_HEIGHT}
          minHeight={MIN_HEIGHT}
					renderHeader={() => <View style={styles.headerBackground} />}
					refreshControl={<RefreshControl
						refreshing={this.state.isRefreshing}
						onRefresh={this.onRefresh}
					/>}
					renderFixedForeground={() => (
            <Animatable.View
              style={styles.navTitleView}
              ref={navTitleView => {
                this.navTitleView = navTitleView;
              }}
            >
							<RkText style={styles.navTitle}>{name}</RkText>
            </Animatable.View>
          )}
          renderForeground={() => (
						<View>
						<View style={styles.header}>
							<View style={styles.row}>
								<View style={styles.buttons}>
								</View>
								<Avatar img={this.state.user.photoUrl} rkType='big'/>
								<View style={styles.buttons}>
								{this.state.isFollowing === false ? 
									<TouchableOpacity style={[styles.navButtons, {alignSelf: "flex-end"}]} onPress={() => {this.follow()}}>
										<Image style={{height: 25, width: 25}} source={require('../../assets/icons/follow.png')} />
									</TouchableOpacity>
									: 
									<TouchableOpacity style={[styles.navButtons, {alignSelf: "flex-end"}]} onPress={() => {this.unfollow()}}>
										<Image style={{height: 25, width: 25}} source={require('../../assets/icons/unfollow.png')} />
									</TouchableOpacity>
								}
								</View>
							</View>
							<RkText rkType='header3' style={{color: '#ffffff', marginBottom: 5}}>{name}</RkText>
							<View style={{flexDirection:"row", justifyContent: 'center', alignItems: 'center'}}>
								<Image style={{height:20, width:20}} source={require('../../assets/icons/location.png')}></Image>
								<RkText style={{color: '#ffffff',  fontSize: 14, textAlign:"center", marginLeft:2}} rkType='secondary1 hintColor'>İzmir, Türkiye</RkText>
							</View>
						</View>

						<View style={styles.userInfo}>
							{this.state.user.followersCount != 0 ?
							<TouchableOpacity onPress={() => {Actions.followerList({id: this.state.user.userId})}} style={styles.section}>
									<View style={styles.section}>
											<RkText rkType='header3' style={styles.space}>{formatNumber(this.state.user.followersCount)} <RkText style={styles.title} rkType='secondary1 hintColor'>Followers</RkText></RkText>
									</View>
							</TouchableOpacity>
							:
							<TouchableOpacity activeOpacity={1} style={styles.section}>
									<View style={styles.section}>
											<RkText rkType='header3' style={styles.space}>{formatNumber(this.state.user.followersCount)} <RkText style={styles.title} rkType='secondary1 hintColor'>Followers</RkText></RkText>
									</View>
							</TouchableOpacity>
							}
							<View style={styles.separator}/>
							{this.state.user.followingsCount != 0 ?
							<TouchableOpacity onPress={() => {Actions.followingList({id: this.state.user.userId})}} style={styles.section}>
									<View style={styles.section}>
											<RkText rkType='header3' style={styles.space}>{formatNumber(this.state.user.followingsCount)} <RkText style={styles.title} rkType='secondary1 hintColor'>Followings</RkText></RkText>
									</View>
							</TouchableOpacity>
							:
							<TouchableOpacity activeOpacity={1} style={styles.section}>
									<View style={styles.section}>
											<RkText rkType='header3' style={styles.space}>{formatNumber(this.state.user.followingsCount)} <RkText style={styles.title} rkType='secondary1 hintColor'>Followings</RkText></RkText>
									</View>
							</TouchableOpacity>
							}
							</View>
						</View>
					)}
        >
				<TriggeringView
            onHide={() => this.navTitleView.fadeInUp(200)}
						onDisplay={() => this.navTitleView.fadeOut(100)}
						style={{height: 0}}
          >
            <RkText style={{color: '#ffffff'}}>{name}</RkText>
          </TriggeringView>
					{this.state.isLoading ?
						<View style={{flex: 1, paddingTop: 20, backgroundColor: "#ffffff", alignItems: "center"}}>
							<ContentLoader height={70}>
								<Circle cx="30" cy="30" r="30"/>
								<Rect x="80" y="17" rx="4" ry="4" width={width - 80} height="13"/>
							</ContentLoader>
						</View>
						:
						<View style={styles.timeline}>
							<Timeline 
								style={styles.list}
								data={this.state.data}
								circleSize={20}
								circleColor='rgba(0,0,0,0)'
								lineColor='rgb(45,156,219)'
								timeContainerStyle={{minWidth:70, marginTop: -5}}
								timeStyle={{textAlign: 'center', backgroundColor:'#ff9797', color:'white', padding:5, borderRadius:13}}
								descriptionStyle={{color:'gray'}}
								options={{
									style:{paddingTop:5},
									removeClippedSubviews: false,
									refreshControl: (
										<RefreshControl
											refreshing={this.state.isRefreshing}
											onRefresh={this.onRefresh}
										/>
									)
								}}
								innerCircle={'icon'}
								onEventPress={this.onEventPress}
								renderDetail={this.renderDetail}
							/>
						</View>
					} 
        </HeaderImageScrollView>
      </View>
		)
	}
}
	
	
let styles = RkStyleSheet.create(theme => ({
	root: {
	},
	header: {
		marginTop: 10,
	  paddingTop: 25,
		paddingBottom: 17,
		alignItems: "center"
	},
	title: {
		color: '#ffffff',
		fontSize: 16,
		marginBottom: 5
	},
	userInfo: {
	  flexDirection: 'row',
	  paddingBottom: 4
	},
	section: {
	  flex: 1,
	  alignItems: 'center'
	},
	row: {
		flexDirection: 'row'
  },
	space: {
		color: '#ffffff',
		fontSize: 16
	},
	separator: {
	  backgroundColor: theme.colors.border.base,
	  alignSelf: 'center',
	  flexDirection: 'row',
	  flex: 0,
	  width: 1,
	  height: 20
	},
	buttons: {
		flex: 1,
		paddingLeft: 30
	},
	button: {
	  marginTop: 10,
	  alignSelf: 'center',
	  width: 140,
	  backgroundColor: '#FF5E20',
	},
  navButtons: {
		marginRight: 10
	},
	big: {
		width: 100,
		height: 100,
		borderRadius: 50,
		marginBottom: 19,
		flexDirection: 'column',
		borderColor:"#ffffff", 
		borderWidth:1.5,
		marginTop:30
	},  
	backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
	},
	background: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#da6954'
  },
  navTitleView: {
    height: MIN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
		paddingTop: 16,
		opacity: 0
  },
  navTitle: {
    color: 'white',
    fontSize: 21,
    backgroundColor: 'transparent',
	},
	container: {
		flex: 1
	},
	timeline: {
    flex: 1,
		paddingBottom: 20,
		paddingLeft: 20,
		paddingRight: 20,
    backgroundColor: theme.colors.screen.base
  },
  list: {
    flex: 1,
    marginTop:20,
  },
  titleTimeline:{
    fontSize:16,
		fontWeight: 'bold',
		marginBottom: 5
  },
  descriptionContainer:{
    flexDirection: 'row'
  },
  image:{
    width: 50,
    height: 50,
		borderRadius: 25,
		marginLeft: 3
  },
  textDescription: {
    color: 'gray'
	},
	headerBackground: {
		backgroundColor: theme.colors.screen.nav, height: MAX_HEIGHT, width: Dimensions.get('window').width
	}
}));