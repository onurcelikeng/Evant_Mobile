import React from 'react';
import { View, ScrollView, TouchableOpacity, Platform, FlatList, Image, RefreshControl, ImageBackground, Dimensions, StatusBar } from 'react-native';
import { RkText, RkButton, RkStyleSheet, RkCard } from 'react-native-ui-kitten';
import {Actions} from 'react-native-router-flux';
import PhotoUpload from 'react-native-photo-upload';
import * as Animatable from 'react-native-animatable';
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import { Header } from 'react-navigation';
import Timeline from 'react-native-timeline-listview'

import * as eventProvider from '../../providers/events';
import {Avatar} from '../../components/avatar';
import {Gallery} from '../../components/gallery';
import {FontIcons} from '../../assets/icon';
import formatNumber from '../../utils/textUtils';
import {data} from '../../data';
import Login from '../login'

let moment = require('moment');

const MIN_HEIGHT = Header.HEIGHT;
const MAX_HEIGHT = 290;
let {height, width} = Dimensions.get('window');

export default class Profile extends React.Component {

	constructor(props) {
		super(props);
		this.data = data.getUser();
		this.user = Login.getCurrentUser();
		this.state = {
			isLoading: true,
			refreshing: false,
			selected: null
		}
	
		this.renderItem = this._renderItem.bind(this);
		console.log(this.user);

		this.onEventPress = this.onEventPress.bind(this)
    this.renderSelected = this.renderSelected.bind(this)
    this.renderDetail = this.renderDetail.bind(this)

    this.data = [
      {
        time: '09:00', 
        title: 'Archery Training', 
        description: 'The Beginner Archery and Beginner Crossbow course does not require you to bring any equipment, since everything you need will be provided for the course. ',
        lineColor:'#009688', 
        icon: require('../../assets/icons/archery.png'),
        imageUrl: 'https://cloud.githubusercontent.com/assets/21040043/24240340/c0f96b3a-0fe3-11e7-8964-fe66e4d9be7a.jpg'
      },
      {
        time: '10:45', 
        title: 'Play Badminton', 
        description: 'Badminton is a racquet sport played using racquets to hit a shuttlecock across a net.', 
        icon: require('../../assets/icons/badminton.png'),
        imageUrl: 'https://cloud.githubusercontent.com/assets/21040043/24240405/0ba41234-0fe4-11e7-919b-c3f88ced349c.jpg'
      },
      {
        time: '12:00', 
        title: 'Lunch', 
        icon: require('../../assets/icons/lunch.png'),
      },
      {
        time: '14:00', 
        title: 'Watch Soccer', 
        description: 'Team sport played between two teams of eleven players with a spherical ball. ',
        lineColor:'#009688', 
        icon: require('../../assets/icons/soccer.png'),
        imageUrl: 'https://cloud.githubusercontent.com/assets/21040043/24240419/1f553dee-0fe4-11e7-8638-6025682232b1.jpg'
      },
      {
        time: '16:30', 
        title: 'Go to Fitness center', 
        description: 'Look out for the Best Gym & Fitness Centers around me :)', 
        icon: require('../../assets/icons/dumbbell.png'),
        imageUrl: 'https://cloud.githubusercontent.com/assets/21040043/24240422/20d84f6c-0fe4-11e7-8f1d-9dbc594d0cfa.jpg'
			},
			{
        time: '09:00', 
        title: 'Archery Training', 
        description: 'The Beginner Archery and Beginner Crossbow course does not require you to bring any equipment, since everything you need will be provided for the course. ',
        lineColor:'#009688', 
        icon: require('../../assets/icons/archery.png'),
        imageUrl: 'https://cloud.githubusercontent.com/assets/21040043/24240340/c0f96b3a-0fe3-11e7-8964-fe66e4d9be7a.jpg'
      },
      {
        time: '10:45', 
        title: 'Play Badminton', 
        description: 'Badminton is a racquet sport played using racquets to hit a shuttlecock across a net.', 
        icon: require('../../assets/icons/badminton.png'),
        imageUrl: 'https://cloud.githubusercontent.com/assets/21040043/24240405/0ba41234-0fe4-11e7-919b-c3f88ced349c.jpg'
      },
      {
        time: '12:00', 
        title: 'Lunch', 
        icon: require('../../assets/icons/lunch.png'),
      },
      {
        time: '14:00', 
        title: 'Watch Soccer', 
        description: 'Team sport played between two teams of eleven players with a spherical ball. ',
        lineColor:'#009688', 
        icon: require('../../assets/icons/soccer.png'),
        imageUrl: 'https://cloud.githubusercontent.com/assets/21040043/24240419/1f553dee-0fe4-11e7-8638-6025682232b1.jpg'
      },
      {
        time: '16:30', 
        title: 'Go to Fitness center', 
        description: 'Look out for the Best Gym & Fitness Centers around me :)', 
        icon: require('../../assets/icons/dumbbell.png'),
        imageUrl: 'https://cloud.githubusercontent.com/assets/21040043/24240422/20d84f6c-0fe4-11e7-8f1d-9dbc594d0cfa.jpg'
      }
    ]
	}

	onEventPress(data){
    this.setState({selected: data})
  }

  renderSelected(){
      if(this.state.selected)
        return <RkText style={{marginTop:10}}>Selected event: {this.state.selected.title} at {this.state.selected.time}</RkText>
  }

  renderDetail(rowData, sectionID, rowID) {
    let title = <RkText style={[styles.titleTimeline]}>{rowData.title}</RkText>
    var desc = null
    if(rowData.description && rowData.imageUrl)
      desc = (
        <View style={styles.descriptionContainer}>   
          <Image source={{uri: rowData.imageUrl}} style={styles.image}/>
          <RkText style={[styles.textDescription]}>{rowData.description}</RkText>
        </View>
      )
    
    return (
      <View style={{flex:1}}>
        {title}
        {desc}
      </View>
    )
  }

	componentDidMount() {
		this.getEvents(this.user.userId);
	}
	
	getEvents(id) {
		return eventProvider.getUserEvents(id)
		.then((responseJson) => {
			if(responseJson.isSuccess) {
				console.log(responseJson.data)
				this.setState({
					isLoading: false,
					data: responseJson.data,
					eventCount: responseJson.data.length
				  }, function() {
					// do something with new state
				});
			} else {
				this.setState({
					isLoading: false,
					data: [],
				  }, function() {
					// do something with new state
				});
				DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
			}
		});
	}

	_onRefresh() {
		console.log("refreshing");
    this.setState({refreshing: true});
    this.getUserEvents(this.user.userId).then(() => {
      this.setState({refreshing: false});
    });
  }

	_keyExtractor(post, index) {
		return post.id;
	}
	
	_renderItem(info) {
		console.log(info)
		return (
		  <TouchableOpacity
				delayPressIn={70}
				activeOpacity={1}
				onPress={() => { Actions.eventDetail({id: info.item.eventId, obj: info.item}) }}>
				<RkCard rkType='imgBlock' style={styles.card}>
					<Image rkCardImg source={{uri: info.item.photoUrl}}/>
					<View rkCardImgOverlay rkCardContent style={styles.overlay}>
						<RkText rkType='header4 inverseColor'>{info.item.title}</RkText>
						<RkText style={styles.time}
							rkType='secondary2 inverseColor'>{moment(info.item.start).fromNow()}</RkText>
					</View>
				</RkCard>
		  </TouchableOpacity>
		)
	}

	render() {
		let name = this.user.name;
		
		return (
			<View style={styles.container}>
        <HeaderImageScrollView
          maxHeight={MAX_HEIGHT}
          minHeight={MIN_HEIGHT}
					renderHeader={() => <View style={{backgroundColor: '#da6954', height: MAX_HEIGHT, width: Dimensions.get('window').width}} />}
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
								<PhotoUpload onResponse={res => console.log(res)}>
									<Image source={{uri: this.user.photo}} style={styles.big} />
								</PhotoUpload>
								<View style={styles.buttons}>
									<TouchableOpacity style={[styles.navButtons, {alignSelf: "flex-end"}]} onPress={() => Actions.options()}>
										<Image style={{height: 21, width: 21, tintColor: "#ffffff"}} source={require('../../assets/icons/settings.png')} />
									</TouchableOpacity>
								</View>
							</View>

							<RkText rkType='header4' style={{color: '#ffffff', marginBottom: 5}}>{name}</RkText>
							<RkText style={{color: '#ffffff',  fontSize: 14}} rkType='secondary1 hintColor'>İzmir, Türkiye</RkText>
						</View>

						<View style={styles.userInfo}>
							<View style={styles.section}>
									<RkText rkType='header3' style={styles.space}>{this.state.eventCount}</RkText>
									<RkText style={styles.title} rkType='secondary1 hintColor'>Events</RkText>
							</View>
							<View style={styles.separator}/>
							{this.user.followersCount != 0 ?
							<TouchableOpacity onPress={() => {Actions.followerList({id: this.user.userId})}} style={styles.section}>
									<View style={styles.section}>
											<RkText rkType='header3' style={styles.space}>{formatNumber(this.user.followersCount)}</RkText>
											<RkText style={styles.title} rkType='secondary1 hintColor'>Followers</RkText>
									</View>
							</TouchableOpacity>
							:
							<TouchableOpacity activeOpacity={1} style={styles.section}>
									<View style={styles.section}>
											<RkText rkType='header3' style={styles.space}>{formatNumber(this.user.followersCount)}</RkText>
											<RkText style={styles.title} rkType='secondary1 hintColor'>Followers</RkText>
									</View>
							</TouchableOpacity>
							}
							<View style={styles.separator}/>
							{this.user.followingsCount != 0 ?
							<TouchableOpacity onPress={() => {Actions.followingList({id: this.user.userId})}} style={styles.section}>
									<View style={styles.section}>
											<RkText rkType='header3' style={styles.space}>{formatNumber(this.user.followingsCount)}</RkText>
											<RkText style={styles.title} rkType='secondary1 hintColor'>Followings</RkText>
									</View>
							</TouchableOpacity>
							:
							<TouchableOpacity activeOpacity={1} style={styles.section}>
									<View style={styles.section}>
											<RkText rkType='header3' style={styles.space}>{formatNumber(this.user.followingsCount)}</RkText>
											<RkText style={styles.title} rkType='secondary1 hintColor'>Followings</RkText>
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
            <RkText>{name}</RkText>
          </TriggeringView>
          <View style={styles.timeline}>
						<Timeline 
							style={styles.list}
							data={this.data}
							circleSize={20}
							circleColor='rgba(0,0,0,0)'
							lineColor='rgb(45,156,219)'
							timeContainerStyle={{minWidth:52, marginTop: -5}}
							timeStyle={{textAlign: 'center', backgroundColor:'#ff9797', color:'white', padding:5, borderRadius:13}}
							descriptionStyle={{color:'gray'}}
							options={{
								style:{paddingTop:5}
							}}
							innerCircle={'icon'}
							onEventPress={this.onEventPress}
							renderDetail={this.renderDetail}
						/>
					</View>
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
		fontSize: 12,
		marginBottom: 5
	},
	userInfo: {
	  flexDirection: 'row',
	  paddingVertical: 4
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
		width: 50,
		height: 50,
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
    padding: 20,
    backgroundColor:'white'
  },
  list: {
    flex: 1,
    marginTop:20,
  },
  titleTimeline:{
    fontSize:16,
    fontWeight: 'bold'
  },
  descriptionContainer:{
    flexDirection: 'row',
    paddingRight: 50
  },
  image:{
    width: 50,
    height: 50,
    borderRadius: 25
  },
  textDescription: {
    marginLeft: 10,
    color: 'gray'
  }
}));