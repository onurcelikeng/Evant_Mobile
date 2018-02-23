import React from 'react';
import { FlatList, Image, View, TouchableOpacity, Dimensions, RefreshControl } from 'react-native';
import { RkText, RkCard, RkStyleSheet, withRkTheme } from 'react-native-ui-kitten';
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
		this.getEvents();
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
			}
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
					<View rkCardFooter>
					<SocialBar rkType='space' showLabel={true} comments={info.item.totalComments} goings={info.item.totalGoings} id={info.item.eventId}/>
					</View >
				</RkCard>
		  </TouchableOpacity>
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
		paddingHorizontal: 14,
		backgroundColor: theme.colors.screen.scroll,
	},
	card: {
		marginVertical: 8,
	},
	time: {
		marginTop: 5
	},
	overlay: {
		justifyContent: 'flex-end'
	},
}));