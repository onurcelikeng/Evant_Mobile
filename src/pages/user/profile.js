import React from 'react';
import { View, ScrollView, TouchableOpacity, Platform, FlatList, Image, RefreshControl, ImageBackground, Dimensions, StatusBar, ActivityIndicator } from 'react-native';
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
const MAX_HEIGHT = 280;
let {height, width} = Dimensions.get('window');

export default class Profile extends React.Component {

	constructor(props) {
		super(props);
		this.data = data.getUser();
		this.user = Login.getCurrentUser();
		this.state = {
      isRefreshing: false,      
      waiting: false,
      data: this.data
    }
	
		this.renderItem = this._renderItem.bind(this);
		console.log(this.user);
    this.onRefresh = this.onRefresh.bind(this)

		this.onEventPress = this.onEventPress.bind(this)
    this.renderSelected = this.renderSelected.bind(this)
    this.renderDetail = this.renderDetail.bind(this)

    this.data = [
      {
        time: '30/08/17', 
        title: 'TolgShow', 
        description: 'Yeni yorum bıraktın: Çok güzel bir etkinlik. Ailemle birlikte orada olacağız.',
        icon: require('../../assets/icons/comment.png')
      },
      {
        time: '27/08/17', 
        title: 'Gaming İzmir', 
        description: 'İzmirde yeni bir etkinlik oluşturdun.', 
        icon: require('../../assets/icons/create_event.png'),
        imageUrl: require('../../data/img/event1.jpg')
      },
      {
        time: '14/08/17', 
        title: 'Zorlu Jaz Festivali', 
        description: '2 gün süren bir etkinlik oluşturdun.', 
        icon: require('../../assets/icons/create_event.png'),
        imageUrl: require('../../data/img/event4.jpg')
      },
      {
        time: '20/07/17', 
        title: 'Martin Kohlstedt', 
        description: 'Eğlence kategorisinde bir etkinlik oluşturdun.',
        lineColor:'#009688',
        icon: require('../../assets/icons/create_event.png'),
        imageUrl: require('../../data/img/event2.jpg')
      },
      {
        time: '15/06/17', 
        title: 'Onur Çelik', 
        description: 'Bugün yine popülersin, yeni bir takipçi kazandın!', 
        icon: require('../../assets/icons/new_follower.png')
			},
			{
        time: '10/06/17', 
        title: 'Beyaz Show', 
        description: 'Yeni yorum bıraktın: DEU CENG olarak biz de orada olacağız.',
        lineColor:'#009688', 
        icon: require('../../assets/icons/comment.png')
      },
      {
        time: '30/05/17', 
        title: 'Ulaş Birant', 
        description: 'Çevren genişlemeye başladı bile, yeni birini takip ettin.', 
        icon: require('../../assets/icons/new_following.png')
      },
      {
        time: '23/05/17', 
        title: 'Ai Weiwei Porselene Dair', 
        description: '1 gün 36 dakika sürecek bir etkinliğe katıldın.',
        lineColor:'#009688',
        icon: require('../../assets/icons/join_event.png'),
        imageUrl: require('../../data/img/event3.jpg')
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
          <Image source={rowData.imageUrl} style={styles.image}/>
          <RkText style={[styles.textDescription]}>{rowData.description}</RkText>
        </View>
			)
		else if(rowData.description)
			desc = (
				<View style={styles.descriptionContainer}>   
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

	onRefresh(){
		console.log("esd");
    this.setState({isRefreshing: true});
    setTimeout(() => {
      this.setState({
        data: this.data,
        isRefreshing: false
      });
    }, 2000);
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
								<PhotoUpload onResponse={res => console.log(res)}>
									<Image source={{uri: this.user.photo}} style={styles.big} />
								</PhotoUpload>
								<View style={styles.buttons}>
									<TouchableOpacity style={[styles.navButtons, {alignSelf: "flex-end"}]} onPress={() => Actions.options()}>
										<Image style={{height: 21, width: 21, tintColor: "#ffffff"}} source={require('../../assets/icons/settings.png')} />
									</TouchableOpacity>
								</View>
							</View>
							<RkText rkType='header3' style={{color: '#ffffff', marginBottom: 5}}>{name}</RkText>
							<View style={{flexDirection:"row", justifyContent: 'center', alignItems: 'center'}}>
								<Image style={{height:20, width:20}} source={require('../../assets/icons/location.png')}></Image>
								<RkText style={{color: '#ffffff',  fontSize: 14, textAlign:"center", marginLeft:2}} rkType='secondary1 hintColor'>İzmir, Türkiye</RkText>
							</View>
						</View>

						<View style={styles.userInfo}>
							{this.user.followersCount != 0 ?
							<TouchableOpacity onPress={() => {Actions.followerList({id: this.user.userId})}} style={styles.section}>
									<View style={styles.section}>
											<RkText rkType='header3' style={styles.space}>{formatNumber(this.user.followersCount)} <RkText style={styles.title} rkType='secondary1 hintColor'>Followers</RkText></RkText>
									</View>
							</TouchableOpacity>
							:
							<TouchableOpacity activeOpacity={1} style={styles.section}>
									<View style={styles.section}>
											<RkText rkType='header3' style={styles.space}>{formatNumber(this.user.followersCount)} <RkText style={styles.title} rkType='secondary1 hintColor'>Followers</RkText></RkText>
									</View>
							</TouchableOpacity>
							}
							<View style={styles.separator}/>
							{this.user.followingsCount != 0 ?
							<TouchableOpacity onPress={() => {Actions.followingList({id: this.user.userId})}} style={styles.section}>
									<View style={styles.section}>
											<RkText rkType='header3' style={styles.space}>{formatNumber(this.user.followingsCount)} <RkText style={styles.title} rkType='secondary1 hintColor'>Followings</RkText></RkText>
									</View>
							</TouchableOpacity>
							:
							<TouchableOpacity activeOpacity={1} style={styles.section}>
									<View style={styles.section}>
											<RkText rkType='header3' style={styles.space}>{formatNumber(this.user.followingsCount)} <RkText style={styles.title} rkType='secondary1 hintColor'>Followings</RkText></RkText>
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
								style:{paddingTop:5},
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
		fontSize: 14,
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