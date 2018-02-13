import React from 'react';
import { FlatList, Image, View, TouchableOpacity, TouchableHighlight } from 'react-native';
import { RkText, RkCard, RkStyleSheet, RkTextInput } from 'react-native-ui-kitten';
import {withRkTheme} from 'react-native-ui-kitten'
import {Actions} from 'react-native-router-flux';

import {SocialBar} from '../../components/socialBar';
import {data} from '../../data';
import {FontAwesome} from '../../assets/icon';

let moment = require('moment');

export default class Events extends React.Component {
	
	static navigationOptions = {
		header: (headerProps) => { 
			return <View style={styles.searchContainer}>
					<RkTextInput
								style={styles.search} 
								autoCapitalize='none'
								autoCorrect={false}
								label={<RkText rkType='awesome'>{FontAwesome.search}</RkText>}
								rkType='row'
								placeholder='Search'/>
			</View> }
	};

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
			<TouchableHighlight
				delayPressIn={70}
				activeOpacity={0.8}
				onPress={() => this.props.navigation.navigate('eventDetail', {id: info.item.id})}>
				<RkCard rkType='backImg'>
					<Image rkCardImg style={{resizeMode:"stretch"}} source={info.item.photo}/>
					<View rkCardImgOverlay rkCardContent style={styles.overlay}>
						<RkText rkType='header2 inverseColor'>{info.item.header}</RkText>
						<RkText rkType='secondary2 inverseColor'>{moment().add(info.item.time, 'seconds').fromNow()}</RkText>
					</View>
				</RkCard>
			</TouchableHighlight>
		)
	}
	
	render() {
		let info = {};
		info.item = this.data[0];
		return (
			<FlatList numColumns={2} data={this.data}
				renderItem={this.renderItem}
				keyExtractor={this._keyExtractor}
				style={styles.root}/>
		
		)
	}
}
	
let styles = RkStyleSheet.create(theme => ({
	root: {
		backgroundColor: theme.colors.screen.base
	},
	overlay: {
		justifyContent: 'flex-end'
	},
	footer: {
		width: 240
	},
    searchContainer: {
		backgroundColor: theme.colors.screen.base,
		paddingHorizontal: 16,
		paddingTop: 25,
		paddingBottom: 7,
		height: 64,
		alignItems: 'center',
		borderBottomWidth: 0.3,
		borderBottomColor: theme.colors.border.base
	},
	search: {
		backgroundColor: theme.colors.screen.bold
	},
}));