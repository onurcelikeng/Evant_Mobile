import React from 'react';
import { FlatList, Image, View, TouchableOpacity, Dimensions, RefreshControl } from 'react-native';
import { RkText, RkCard, RkStyleSheet, withRkTheme } from 'react-native-ui-kitten';
import {Actions} from 'react-native-router-flux';
import ContentLoader from '../../config/contentLoader'
import Svg, { Circle, Ellipse, G, LinearGradient, RadialGradient, Line, Path, Polygon, Polyline, Rect, Symbol, Text, Use, Defs, Stop } from 'react-native-svg';

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
      refreshing: false
		}
	
		this.renderItem = this._renderItem.bind(this);
	}

	componentDidMount() {
		if(this.props.id != null) {
			console.log("esd");
			this.getCategoryEvents(this.props.id);
		} else {
			this.getEvents();
		}
	}

	getCategoryEvents(id) {
		return eventProvider.getCategoryEvents(id)
		.then((responseJson) => {
			console.log(responseJson);
			if(responseJson.isSuccess) {
				this.setState({
					isLoading: false,
					data: responseJson.data,
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

	getEvents() {
		return eventProvider.getEvents()
		.then((responseJson) => {
			if(responseJson.isSuccess) {
				console.log(responseJson.data)
				this.setState({
					isLoading: false,
					data: responseJson.data,
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

	_keyExtractor(post, index) {
		return post.id;
	}
	
	_renderItem(info) {
		console.log(info)
		return (
			<View >
				<View flexDirection="row" style={{flex:1, marginBottom: 5}}>
					<Image style={{height:30, width: 30, borderRadius: 15, marginLeft: 5, marginRight: 5}} source={{uri: info.item.user.photoUrl}}/>
					<RkText style={{fontSize: 14, alignSelf: 'center', fontWeight: 'bold'}}>{info.item.user.firstName + " " + info.item.user.lastName}</RkText>
				</View>
				<TouchableOpacity
					delayPressIn={70}
					activeOpacity={1}
					onPress={() => { Actions.eventDetail({id: info.item.eventId, obj: info.item}) }}>
					<RkCard rkType='backImg2' style={styles.card}>
						<Image rkCardImg style={{resizeMode:"stretch"}} source={{uri: info.item.photoUrl}}/>
						<View rkCardImgOverlay rkCardContent alignItems="baseline" style={styles.overlay}>
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
    this.setState({refreshing: true});
    this.getEvents().then(() => {
      this.setState({refreshing: false});
    });
  }
	
	render() {
		if (this.state.isLoading) {
			var width = require('Dimensions').get('window').width - 50;
			var loaders = [];
			for(let i = 0; i < 10; i++){
			  loaders.push(
				<ContentLoader height={150}>
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
            refreshing={this.state.refreshing}
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
		marginBottom: 40,
	},
	time: {
		marginTop: 5
	},
	overlay: {
		justifyContent: 'flex-end',
		backgroundColor: 'rgba(0, 0, 0, 0.3)'
	},
}));