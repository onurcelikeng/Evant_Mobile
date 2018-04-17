import React from 'react';
import { FlatList, SectionList, Image, View, TouchableOpacity, TouchableHighlight, ActivityIndicator, ScrollView, StyleSheet, Dimensions, InteractionManager, TouchableWithoutFeedback, ListView } from 'react-native';
import { RkText, RkCard, RkStyleSheet, RkTextInput, RkButton } from 'react-native-ui-kitten';
import {withRkTheme} from 'react-native-ui-kitten'
import {Actions} from 'react-native-router-flux';
import ContentLoader from '../../config/contentLoader'
import Svg, { Circle, Ellipse, G, RadialGradient, Line, Path, Polygon, Polyline, Rect, Symbol, Text, Use, Defs, Stop } from 'react-native-svg';
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';
import LinearGradient from 'react-native-linear-gradient';
import Swipeable from 'react-native-swipeable';

import Login from '../login';
import DropdownHolder from '../../providers/dropdownHolder';
import * as searchHistoryProvider from '../../providers/searchHistories';
import * as categoryProvider from '../../providers/category';
import * as eventProvider from '../../providers/events';
import * as userProvider from '../../providers/users';
import {SocialBar} from '../../components/socialBar';
import {data} from '../../data';
import {Avatar} from '../../components/avatar';
import {FontAwesome} from '../../assets/icon';

let moment = require('moment');

export default class Discover extends React.Component {

	constructor(props) {
		super(props);

		this.setData = this._setData.bind(this);
		this.renderCategoryItem = this._renderCategoryItem.bind(this);		
		this.renderHistoryItem = this._renderHistoryItem.bind(this);		
		this.renderEventItem = this._renderEventItem.bind(this);
		this.renderUserRow = this._renderUserRow.bind(this);
		this.handleChangeTab = this._handleChangeTab.bind(this);

		this.currentlyOpenSwipeable = null;

		this.state = {
			isLoading: true,
			isSearchPressed: false,
			selectedIndex: 0,
			isSwiping: false,
			rightActionActivated: false,
			toggle: false
		}    
	}

	componentDidMount() {
		this.getCategories().then(() => {
			this.getSearchHistories();
		});
	}

	getCategories() {
		return categoryProvider.getCategories()
		.then((responseJson) => {
			if(responseJson.isSuccess) {
				console.log(responseJson.data);
				this.setState({
					data: responseJson.data,
				});
			} else {  
				this.setState({
					data: [],
				});      
				DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
			}
		})
		.catch((error) => {
		  console.log(error);
		});
	}  

	getSearchHistories() {
		return searchHistoryProvider.getSearchHistories()
		.then((responseJson) => {
			if(responseJson.isSuccess) {
				this.setState({
					isLoading: false,
					searchData: responseJson.data.slice(0, 5)
				})
			} else {
				this.setState({
					isLoading: false,
					searchData: []
				})
			}
		})
	}

	deleteSearchHistory(id) {
		return searchHistoryProvider.deleteSearchHistory(id)
		.then((responseJson) => {
			if(responseJson.isSuccess) {
				DropdownHolder.getDropDown().alertWithType("success", "", responseJson.message);
			} else {
				DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
			}
		})
	}

	searchPage() {
		this.setState({
			isSearchPressed: true
		})
	}

	discoverPage() {
		this._searchInput.refs.input.clear(); 
		this._searchInput.refs.input.blur(); 
		this.setState({
			isSearchPressed: false
		})
	}

	handleIndexChange = (index) => {
		this.setState({
		  ...this.state,
		  selectedIndex: index,
		});
	}

	search(text) {
		if(this.state.selectedIndex == 0) {
			if(text.length == 0) {
				this.setData([], 0)
			} else if(text.length >= 2) {
				userProvider.search(text).then((responseJson) => {
					if(responseJson.isSuccess) this.setData(responseJson.data, 0)
				})
			}
		} else if(this.state.selectedIndex == 1) {
			if(text.length == 0) {
				this.setData([], 1)
			} else if(text.length >= 2) {
				eventProvider.search(text).then((responseJson) => {
					if(responseJson.isSuccess) this.setData(responseJson.data, 1)
				})
			}
		}
	}

	_handleChangeTab({i, ref, from, }) {
		this.setState({selectedIndex:i});
		if(this._searchInput.refs.input._lastNativeText !== undefined)
			this.search(this._searchInput.refs.input._lastNativeText);
	}

	_setData(data, type) {
		let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		if(type == 0) {
			this.setState({
				searchUserData: ds.cloneWithRows(data)
			})
		} else if(type == 1) {
			this.setState({
				searchEventData: data
			})
		} else if(type == 2) {
			this.setState({
				searchTagData: ds.cloneWithRows(data)
			})
		}
	}

	_keyExtractor(post, index) {
		return post.categoryId;
	}
	
	_renderCategoryItem(info) {
		return (
			<View style={styles.row}>
				<TouchableOpacity 
					style={styles.rowButton}	
					delayPressIn={70}
					activeOpacity={0.8}
					onPress={() => this.props.navigation.navigate('categoryEvents', {id: info.item.categoryId, title: info.item.name})}>
					<View style={styles.categoryNameIcon}>
						<Image rkCardImg style={styles.categoryIcon} source={{uri: info.item.photoUrl}}/>
						<RkText style={styles.categoryName}>{info.item.name}</RkText>
					</View>
					<RkText rkType='awesome' style={{opacity: .70}}>{FontAwesome.chevronRight}</RkText>
				</TouchableOpacity>
			</View>
		)
	}

	_renderHistoryItem(info) {
		const {rightActionActivated, toggle} = this.state;
		return (
			<Swipeable
				onRef = {ref => this.swipe = ref}
				rightActionActivationDistance={200}
				rightButtons={[
					<TouchableHighlight style={styles.rightSwipeItem} onPress={() => {this.currentlyOpenSwipeable.recenter(); this.deleteSearchHistory(info.item.historyId); this.getSearchHistories();}}><Image style={{height: 20, width: 20}} source={require('../../assets/icons/delete.png')}/></TouchableHighlight>
				]}
				onRightActionActivate={() => {this.deleteSearchHistory(info.item.historyId);this.setState({rightActionActivated: true})}}
				onRightActionDeactivate={(event, gestureState, swipe) => {this.currentlyOpenSwipeable = swipe; this.currentlyOpenSwipeable.recenter();this.currentlyOpenSwipeable = null; this.setState({rightActionActivated: false})}}
				onRightActionComplete={() => {this.currentlyOpenSwipeable = null; this.getSearchHistories(); this.setState({toggle: !toggle})}}
				onRightButtonsOpenRelease = { (event, gestureState, swipe) => {
					if (this.currentlyOpenSwipeable && this.currentlyOpenSwipeable !== swipe) {
					this.currentlyOpenSwipeable.recenter(); }
					this.currentlyOpenSwipeable = swipe;
					} }
				onRightButtonsCloseRelease = {() => this.currentlyOpenSwipeable = null}>
				<View style={styles.row}>
					<TouchableOpacity style={styles.rowButton}>
						<RkText style={styles.recentSearch}>{info.item.keyword}</RkText>
					</TouchableOpacity>
				</View>
			</Swipeable>
		)
	}

	_renderEventItem(info) {
		return (
			<View>
			<TouchableOpacity
				delayPressIn={70}
				activeOpacity={1}
				onPress={() => { if(info.item.user.userId == Login.getCurrentUser().userId) Actions.profile(); else Actions.otherProfile({id: info.item.user.userId}) }}>
				<View flexDirection="row" style={{flex:1, marginBottom: 5}}>
					<Image style={{height:30, width: 30, borderRadius: 15, marginLeft: 5, marginRight: 5}} source={{uri: info.item.user.photoUrl}}/>
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
								<RkText style={styles.time} alignSelf="center" rkType='secondary2 inverseColor'>{info.item.address.town}</RkText>
								<RkText style={styles.time} alignSelf="center" rkType='secondary2 inverseColor'>, {info.item.address.city}</RkText>
							</View>
						</View>
					</RkCard>
				</TouchableOpacity>
			</View>
		)
	}

	_renderUserRow(row) {
		let name = `${row.firstName} ${row.lastName}`;
		console.log(row);
		return (
			<TouchableOpacity onPress={() => { if(row.userId == Login.getCurrentUser().userId) {Actions.profile()} else {Actions.push("otherProfile", {id: row.userId}) }}}>
				<View style={styles.containerUser}>
					<Avatar img={row.photoUrl} rkType='circle'/>
					<RkText style={{alignItems: 'center', flexDirection: 'row', marginLeft: 16}}>{name}</RkText>
				</View>
			</TouchableOpacity>
		)
	}

	renderSeparator(sectionID, rowID) {
		return (
		  <View style={styles.separator}/>
		)
	}
	
	render() {
		if (this.state.isLoading) {
			var width = require('Dimensions').get('window').width - 50;
			var loaders = [];
			for(let i = 0; i < 10; i++){
				loaders.push(
					<ContentLoader key={i} height={150} marginLeft={5}>
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
			  <View style={styles.root}>
				<View style={styles.searchContainer}>
					<RkTextInput
						ref={c => this._searchInput = c}
						style={[styles.search, {marginRight: 5}]} 
						labelStyle={{fontSize: 18}}
						inputStyle={{fontSize: 16}}
						autoCapitalize='none'
						autoCorrect={false}
						onChange={(event) => {this.search(event.nativeEvent.text)}}
						onFocus={() => {this.searchPage()}}
						label={<RkText rkType='awesome'>{FontAwesome.search}</RkText>}
						rkType='row'
						placeholder='Search'/>
					<TouchableWithoutFeedback onPress={() => {this.discoverPage()}}><RkText style={styles.cancelButton}>Cancel</RkText></TouchableWithoutFeedback>
				</View> 
				<View style={{flex: 1, paddingTop: 20, backgroundColor: "#ffffff", alignItems: "center"}}>
					{loaders}
				</View>
			  </View>
			);
		}

		else if(this.state.isSearchPressed) {
			return (
				<View style={styles.root}>
					<View style={styles.searchContainer}>
						<RkTextInput
							ref={c => this._searchInput = c}
							style={[styles.search, {marginRight: 5}]} 
							labelStyle={{fontSize: 18}}
							inputStyle={{fontSize: 16}}
							autoCapitalize='none'
							autoCorrect={false}
							onChange={(event) => {this.search(event.nativeEvent.text)}}
							onFocus={() => {this.searchPage()}}
							label={<RkText rkType='awesome'>{FontAwesome.search}</RkText>}
							rkType='row'
							placeholder='Search'/>
						<TouchableWithoutFeedback onPress={() => {this.discoverPage()}}><RkText style={styles.cancelButton}>Cancel</RkText></TouchableWithoutFeedback>
					</View> 
					
					<ScrollableTabView
						style={{height: 5, }}
						initialPage={0}
						tabStyle={{height: 4}}
						tabBarStyle={{height: 5}}
						tabBarUnderlineStyle={{height: 1}}
						onChangeTab={this.handleChangeTab}
						renderTabBar={() => <DefaultTabBar />}
					>
						<View tabLabel='Users'>
						{
							this.state.searchUserData != null ?
							<ListView
								dataSource={this.state.searchUserData}
								renderRow={this.renderUserRow}
								renderSeparator={this.renderSeparator}
								enableEmptySections={true}/>
							:
							<View></View>
							}
						</View>
						<View tabLabel='Events'>
						{
							this.state.searchEventData != null ?
							<FlatList
								data={this.state.searchEventData}
								renderItem={this.renderEventItem}
								keyExtractor={this._keyExtractor}
								style={styles.containerEvent}
								enableEmptySections={true}
							/>
							:
							<View></View>
							}
						</View>
						<View tabLabel='Tags'>
						{
							this.state.searchData != null ?
							<View></View>
							:
							<View></View>
							}
						</View>
					</ScrollableTabView>
				</View>
			)
		}

		return (
			<View style={styles.root}>
				<View style={styles.searchContainer}>
					<RkTextInput
						style={styles.search} 
						labelStyle={{fontSize: 18}}
						inputStyle={{fontSize: 16}}
						autoCapitalize='none'
						autoCorrect={false}
						onFocus={() => {this.searchPage()}}
						label={<RkText rkType='awesome'>{FontAwesome.search}</RkText>}
						rkType='row'
						placeholder='Search'/>
				</View> 

				<ScrollView style={styles.scroll}>
					<SectionList
						renderSectionHeader = {({section}) => {
							return <View style={styles.section}>
										<View style={[styles.row, styles.heading]}>
											<RkText rkType='primary header6'>{section.title}</RkText>
										</View>
									</View>
						}}
						sections={[
							{data: this.state.searchData, key: "0", renderItem: this.renderHistoryItem, title: "RECENT SEARCHES"},
							{data: this.state.data, key: "1", renderItem: this.renderCategoryItem, title: "CATEGORIES"}
						]}
					/>
				</ScrollView>
			</View>
		)
	}
}
	
let styles = RkStyleSheet.create(theme => ({
	root: {
		flex: 1,
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
		flexDirection: 'row',
		backgroundColor: theme.colors.screen.nav,
		paddingHorizontal: 16,
		paddingTop: 26,
		paddingBottom: 8,
		height: 64,
		alignItems: 'center',
		borderBottomWidth: 0.3,
		borderBottomColor: theme.colors.border.base
	},
	search: {
		backgroundColor: theme.colors.screen.bold,
		height: 30
	},
	cancelButton: {
		color: theme.colors.text.nav,
		fontSize: 15
	},
	separator: {
	  flex: 1,
	  height: 1,
	  backgroundColor: theme.colors.border.base
	},
	containerUser: {
		flexDirection: 'row',
		paddingVertical: 8,
		paddingHorizontal: 16,
		alignItems: 'center'
	},
	tabView: {
		flex: 1,
		padding: 10,
		backgroundColor: 'rgba(0,0,0,0.01)',
	},
	containerEvent: {
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
	scroll: {
		backgroundColor: theme.colors.screen.base
	},
	section: {
		marginTop: 25
	},
	heading: {
		paddingBottom: 12.5
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 17.5,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderColor: theme.colors.border.base,
		alignItems: 'center'
	},
	rowButton: {
		flex: 1,
		paddingVertical: 18,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	categoryIcon: {
		width: 20, 
		height: 20, 
		marginRight: 8,
		alignItems: "center"
	},
	categoryName: {
		fontSize: 15, 
		fontWeight:"normal", 
		alignSelf:"center"
	},
	categoryNameIcon: {
		flexDirection: 'row'
	},
	recentSearch: {
		fontSize: 15, 
		fontWeight:"normal"
	},
	rightSwipeItem: {
		flex: 1,
		justifyContent: 'center',
		paddingLeft: 20,
		backgroundColor: '#FF3B30'
	}
}));