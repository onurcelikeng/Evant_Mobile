import React from 'react';
import { FlatList, Image, View, TouchableOpacity } from 'react-native';
import { RkText, RkCard, RkStyleSheet, withRkTheme } from 'react-native-ui-kitten';
import {Actions} from 'react-native-router-flux';

import {SocialBar} from '../../components/socialBar';
import {data} from '../../data';

let moment = require('moment');

export default class Events extends React.Component {

	constructor(props) {
		super(props);
	
		this.data = data.getArticles();
		this.renderItem = this._renderItem.bind(this);
	}

	_keyExtractor(post, index) {
		return post.id;
	  }
	
	  _renderItem(info) {
		return (
		  <TouchableOpacity
			delayPressIn={70}
			activeOpacity={1}
			onPress={() => { Actions.notifications() }}>
			<RkCard rkType='imgBlock' style={styles.card}>
			  <Image rkCardImg source={info.item.photo}/>
	
			  <View rkCardImgOverlay rkCardContent style={styles.overlay}>
				<RkText rkType='header4 inverseColor'>{info.item.header}</RkText>
				<RkText style={styles.time}
						rkType='secondary2 inverseColor'>{moment().add(info.item.time, 'seconds').fromNow()}</RkText>
			  </View>
			  <View rkCardFooter>
				<SocialBar rkType='space' showLabel={true}/>
			  </View >
			</RkCard>
		  </TouchableOpacity>
		)
	  }
	
	  render() {
		return (
		  <FlatList
			data={this.data}
			renderItem={this.renderItem}
			keyExtractor={this._keyExtractor}
			style={styles.container}/>
	
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
	  }
	}));