import React from 'react';
import { FlatList, Image, View, TouchableOpacity, Dimensions, RefreshControl, Modal, Geolocation } from 'react-native';
import { RkText, RkCard, RkStyleSheet, withRkTheme } from 'react-native-ui-kitten';
import {Actions} from 'react-native-router-flux';
import ContentLoader from '../../config/contentLoader'
import { Header } from 'react-navigation';
import Svg, { Circle, Ellipse, G, RadialGradient, Line, Path, Polygon, Polyline, Rect, Symbol, Text, Use, Defs, Stop } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import ActionButton from 'react-native-action-button';
import * as Animatable from 'react-native-animatable';
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import PhotoUpload from 'react-native-photo-upload';

import AddEvent from './addEvent';
import {Avatar} from '../../components/avatar';
import Login from '../login';
import DropdownHolder from '../../providers/dropdownHolder';
import * as eventProvider from '../../providers/events';
import * as weatherProvider from '../../providers/weather';
import {SocialBar} from '../../components/socialBar';
import {data} from '../../data';
import { formatDate } from '../../utils/momentjs';
import {strings} from '../../locales/i18n'

let moment = require('moment');

const MIN_HEIGHT = Header.HEIGHT;
const MAX_HEIGHT = 150;
let {height, width} = Dimensions.get('window');

export default class Events extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			isRefreshing: false,
			modal: false,
			city: 'Buca',
			icon: 'https://developer.accuweather.com/sites/default/files/01-s.png'
		}
		this.onRefresh = this._onRefresh.bind(this);
		this.renderItem = this._renderItem.bind(this);
	}

	componentDidMount() {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				console.log(position)
				this.setState({
				  latitude: position.coords.latitude,
				  longitude: position.coords.longitude,
				  error: null,
				}, () => this.getCity(this.state.latitude, this.state.longitude));
			  },
			  (error) => this.setState({ error: error.message }),
			  { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
		);

		
		if(this.props.id != null) {
			this.getCategoryEvents(this.props.id);
		} else {
			this.getEvents();
		}
	}

	renderModal() {
		return (
				<Modal
					animationType={"slide"}
					transparent={false}
					visible={this.state.modal}
					onRequestClose={() => {}}
				>
					<AddEvent lat={this.state.latitude} long={this.state.longitude} onPress={() => this.setState({modal: false})} />
				</Modal>
		)
	}
	
	getCity(lat, long) {
		/*return weatherProvider.getCity(lat, long)
		.then((res) => {
			this.setState({city: res.LocalizedName}, () => {
				this.getWeather(res.Key);
			});
		})
		.catch((err) => {
			console.log(err);
		})*/
	}

	getWeather(key) {
		return weatherProvider.getWeather(key)
		.then((res) => {
			if(6 < moment(res.DailyForecasts[0].Date).format('LT').replace(":", ".") && moment(res.DailyForecasts[0].Date).format('LT').replace(":", ".") < 18) {
				var icon = res.DailyForecasts[0].Day.Icon;
				if(icon < 10) icon = "0" + icon;
				this.setState({icon: "https://developer.accuweather.com/sites/default/files/" + icon + "-s.png"})
			} else {
				var icon = res.DailyForecasts[0].Night.Icon;
				if(icon < 10) icon = "0" + icon;
				this.setState({icon: "https://developer.accuweather.com/sites/default/files/" + icon + "-s.png"})
			}
		})
		.catch((err) => {
			console.log(err);
		})
	}

	getIcon(icon) {
		return weatherProvider.getIcon(icon)
		.then((res) => {
			this.setState({icon: res})
		})
		.catch((err) => {
			console.log(err);
		})
	}

	getCategoryEvents(id) {
		return eventProvider.getCategoryEvents(id)
		.then((responseJson) => {
			if(responseJson == null || responseJson == "" || responseJson == undefined) {
				DropdownHolder.getDropDown().alertWithType("error", "", strings("common.error_occured"));
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
					DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
				}
			}
		}).catch((err) => {console.log(err)});
	}

	getEvents() {
		return eventProvider.getEvents()
		.then((responseJson) => {
			if(responseJson == null || responseJson == "" || responseJson == undefined) {
				DropdownHolder.getDropDown().alertWithType("error", "", strings("common.error_occured"));
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
					DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
				}
			}
		}).catch((err) => {console.log(err)});
	}

	_keyExtractor(post, index) {
		return post.eventId;
	}
	
	_renderItem(info) {
		return (
			<View style={styles.container}>
			<TouchableOpacity
				delayPressIn={70}
				activeOpacity={1}
				onPress={() => { if(info.item.user.userId == Login.getCurrentUser().userId) Actions.profile(); else Actions.otherProfile({id: info.item.user.userId}) }}>
				<View flexDirection="row" style={{flex:1, marginBottom: 5}}>
					<Avatar img={info.item.user.photoUrl} rkType='small'/>
					<RkText style={{fontSize: 14, alignSelf: 'center', fontWeight: 'bold'}}>{info.item.user.firstName + " " + info.item.user.lastName}</RkText>
				</View>
				</TouchableOpacity>
				<TouchableOpacity
					delayPressIn={70}
					activeOpacity={1}
					onPress={() => { Actions.eventDetail({id: info.item.eventId, obj: info.item}) }}>
					<RkCard rkType='backImg2' style={styles.card}>
						<Image rkCardImg style={{resizeMode:"stretch"}} source={{uri: info.item.photoUrl}}/>
						<View rkCardImgOverlay rkCardContent alignItems="baseline" style={styles.overlay}>
							<LinearGradient colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 1)']} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}/>
							<RkText rkType='header4 inverseColor'>{info.item.title}</RkText>
							<View flexDirection="row">
								<Image style={{height: 16, width: 16, marginRight:5}} alignSelf="center" source={require('../../assets/icons/calendar.png')}/>
								<RkText style={styles.time}  alignSelf="center" rkType='secondary2 inverseColor'>{formatDate(info.item.start)}</RkText>
							</View>
							<View flexDirection="row">
								<Image style={{height: 16, width: 16, marginRight:5}} alignSelf="center" source={require('../../assets/icons/place.png')}/>
								<RkText style={styles.time} alignSelf="center" rkType='secondary2 inverseColor'>{info.item.address.town}</RkText>
								<RkText style={styles.time} alignSelf="center" rkType='secondary2 inverseColor'>, {info.item.address.city}</RkText>
							</View>
						</View>
					</RkCard>
				</TouchableOpacity>
			</View>
		)
	}

	_onRefresh() {
		console.log("refreshing");
		this.setState({isRefreshing: true});
		this.getEvents().then(() => {
			this.setState({isRefreshing: false});
		});
	}
	
	render() {
		const {modal} = this.state;

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
			<View style={styles.containerHeader}>
				<HeaderImageScrollView
					maxHeight={MAX_HEIGHT}
					minHeight={MIN_HEIGHT}
					renderHeader={() => <Image rkCardImg style={styles.image} source={require('../../assets/images/gradientBackground.jpg')}/>}
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
							<RkText style={styles.navTitle}>{strings("events.events_title")}</RkText>
						</Animatable.View>
					)}
          			renderForeground={() => (
				
						<View style={styles.header}>
							<TouchableOpacity style={styles.navButtons} onPress={() => Actions.options()}>
								<Image style={{height: 55, width: 85, marginRight: 20}} source={{uri: this.state.icon}} />
							</TouchableOpacity>
							<TouchableOpacity style={{marginTop: MAX_HEIGHT - 100, position: 'absolute', marginLeft: 20, alignSelf:'flex-start'}} onPress={() => Actions.discover({search: this.state.city})}>
								<RkText rkType='primary3' numberOfLines={1} style={{color: '#ffffff', fontSize: 50}}>{this.state.city}</RkText>
							</TouchableOpacity>
						</View>
					)}
        		>
				<TriggeringView
					onHide={() => this.navTitleView.fadeInUp(200)}
					onDisplay={() => this.navTitleView.fadeOut(100)}
					style={{height: 0}}
				>
				</TriggeringView>
				{this.state.isLoading ?
					<View style={{flex: 1, paddingTop: 20, backgroundColor: "#ffffff", alignItems: "center"}}>
						{loaders}
					</View>
					:
					<View style={styles.timeline}>
						<FlatList
							data={this.state.data}
							renderItem={this.renderItem}
							keyExtractor={this._keyExtractor}
							style={styles.container}
							ListEmptyComponent={<View style={{flex:1, flexDirection: 'row', justifyContent: 'center', alignSelf:'center', alignContent: 'center'}}>
													<Image style={{alignSelf: 'center'}} source={require('../../assets/images/notfound.png')}/>
												</View>}
							refreshControl={
								<RefreshControl
									refreshing={this.state.isRefreshing}
									onRefresh={this.onRefresh}
								/>
							}
						/>
					</View>
				}
          		</HeaderImageScrollView>
				<ActionButton
					offsetY={15}
					offsetX={15}
					buttonColor="rgba(218,105,84,1)"
					onPress={() => { this.setState({modal: true}) }}
				/>
				{this.renderModal()}
      		</View>
		)
	}
}
	
let styles = RkStyleSheet.create(theme => ({
	container: {
		paddingVertical: 8,
		backgroundColor: theme.colors.screen.base,
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
	navbar: {
		backgroundColor: theme.colors.screen.nav,
		paddingHorizontal: 16,
		paddingTop: 26,
		paddingBottom: 8,
		height: 64,
		flexDirection: 'column',
		alignContent: 'center',
		alignItems: 'center',
		borderBottomWidth: 0.3,
		borderBottomColor: theme.colors.border.base
	},
	navTitle: {
		color: 'white',
		fontSize: 21,
		backgroundColor: 'transparent',
	},
	containerHeader: {
		flex: 1,
		backgroundColor: theme.colors.screen.base
	},
	buttons: {
		flex: 1,
		paddingLeft: 30
	},
	button: {
		marginTop: 10,
		alignSelf: 'center',
		width: 140,
		backgroundColor: '#FF5E20'
	},
  	navButtons: {
		marginRight: 20,
		alignSelf: "flex-end",
		marginTop: MAX_HEIGHT - 100, 
		position: 'absolute'
	}, 
	gameButton: {
		alignSelf: "flex-start"
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
	  	flexDirection: 'row',
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
		textAlign: 'center', 
		alignSelf: 'center'
	},
	headerBackground: {
		backgroundColor: theme.colors.screen.nav, height: MAX_HEIGHT, width: Dimensions.get('window').width
	},
	header: {
		marginTop: 10,
	  	paddingTop: 25,
		paddingBottom: 17,
		alignItems: "center",
		flexDirection: 'column'
	},
	row: {
		flexDirection: 'row'
	},
	image: {
		height: MAX_HEIGHT,
		width: Dimensions.get('window').width,
		alignSelf: 'stretch',
		resizeMode: 'cover',
	},
}));