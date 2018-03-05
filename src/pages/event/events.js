import React from 'react';
import { FlatList, Image, View, TouchableOpacity, Dimensions, RefreshControl } from 'react-native';
import { RkText, RkCard, RkStyleSheet, withRkTheme } from 'react-native-ui-kitten';
import {Actions} from 'react-native-router-flux';
import ContentLoader from '../../config/contentLoader'
import Svg, { Circle, Ellipse, G, RadialGradient, Line, Path, Polygon, Polyline, Rect, Symbol, Text, Use, Defs, Stop } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';

import {Avatar} from '../../components/avatar';
import Login from '../login';
import DropdownHolder from '../../providers/dropdownHolder';
import * as eventProvider from '../../providers/events';
import {SocialBar} from '../../components/socialBar';
import {data} from '../../data';

let moment = require('moment');

export default class Events extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
      isRefreshing: false
		}
	
		this.renderItem = this._renderItem.bind(this);
	}

	componentDidMount() {
		if(this.props.id != null) {
			this.getCategoryEvents(this.props.id);
		} else {
			this.getEvents();
		}
	}

	getCategoryEvents(id) {
		return eventProvider.getCategoryEvents(id)
		.then((responseJson) => {
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
		});
	}

	getEvents() {
		return eventProvider.getEvents()
		.then((responseJson) => {
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
		});
	}

	_keyExtractor(post, index) {
		return post.eventId;
	}
	
	_renderItem(info) {
		return (
			<View>
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
								<RkText style={styles.time}  alignSelf="center" rkType='secondary2 inverseColor'>{moment(info.item.start).format('lll')}</RkText>
							</View>
							<View flexDirection="row">
								<Image style={{height: 16, width: 16, marginRight:5}} alignSelf="center" source={require('../../assets/icons/place.png')}/>
								<RkText style={styles.time}  alignSelf="center" rkType='secondary2 inverseColor'>Buca, İzmir</RkText>
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
		if (this.state.isLoading) {
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
			  <View style={{flex: 1, paddingTop: 20, backgroundColor: "#ffffff", alignItems: "center"}}>
				{loaders}
			  </View>
			);
		}

		return (
			<FlatList
				data={this.state.data}
				renderItem={this.renderItem}
				keyExtractor={this._keyExtractor}
				style={styles.container}
				enableEmptySections={true}
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
}));