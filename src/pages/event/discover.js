import React from 'react';
import { FlatList, Image, View, TouchableOpacity, TouchableHighlight, ActivityIndicator, Dimensions } from 'react-native';
import { RkText, RkCard, RkStyleSheet, RkTextInput } from 'react-native-ui-kitten';
import {withRkTheme} from 'react-native-ui-kitten'
import {Actions} from 'react-native-router-flux';
import ContentLoader from '../../config/contentLoader'
import Svg, { Circle, Ellipse, G, LinearGradient, RadialGradient, Line, Path, Polygon, Polyline, Rect, Symbol, Text, Use, Defs, Stop } from 'react-native-svg';

import DropdownHolder from '../../providers/dropdownHolder';
import * as categoryProvider from '../../providers/category';
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
						labelStyle={{fontSize: 18}}
						inputStyle={{fontSize: 16}}
						autoCapitalize='none'
						autoCorrect={false}
						label={<RkText rkType='awesome'>{FontAwesome.search}</RkText>}
						rkType='row'
						placeholder='Search'/>
			</View> }
	};

	constructor(props) {
		super(props);
		this.state = {
			isLoading: true
		}
		this.renderItem = this._renderItem.bind(this);
	}

	componentDidMount() {
		this.getCategories();
	}
	
	getCategories() {
		return categoryProvider.getCategories()
		.then((responseJson) => {
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
		})
		.catch((error) => {
		  console.log(error);
		});
	}  

	_keyExtractor(post, index) {
		return post.id;
	}
	
	_renderItem(info) {
		return (
			<TouchableHighlight
				delayPressIn={70}
				activeOpacity={0.8}
				onPress={() => this.props.navigation.navigate('events', {id: info.item.categoryId})}>
				<RkCard rkType='backImg'>
					<Image rkCardImg style={{resizeMode:"stretch"}} source={{uri: info.item.photoUrl}}/>
					<View rkCardImgOverlay rkCardContent style={styles.overlay}>
						<RkText rkType='header2 inverseColor' style={{fontSize: 20}}>{info.item.name}</RkText>
					</View>
				</RkCard>
			</TouchableHighlight>
		)
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
			<FlatList numColumns={2} data={this.state.data}
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
		justifyContent: 'flex-end',
		backgroundColor: 'rgba(0, 0, 0, 0.3)'
	},
	footer: {
		width: 240
	},
    searchContainer: {
		backgroundColor: theme.colors.screen.base,
		paddingHorizontal: 16,
		paddingTop: 26,
		paddingBottom: 8,
		height: 64,
		alignItems: 'center',
		borderBottomWidth: 0.3,
		borderBottomColor: theme.colors.border.base
	},
	search: {
		backgroundColor: theme.colors.screen.bold
	},
}));