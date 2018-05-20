import React from 'react';
import { View, Image, Dimensions, StyleSheet, FlatList, RefreshControl, TouchableHighlight, Modal, TouchableOpacity } from 'react-native';
import { RkComponent, RkText, RkTheme, RkStyleSheet, RkButton, RkTextInput } from 'react-native-ui-kitten';
import Swipeable from 'react-native-swipeable';
import PureChart from 'react-native-pure-chart';

import { scale, scaleVertical } from '../utils/scale';
import DropdownHolder from '../providers/dropdownHolder';
import * as faqProvider from '../providers/faq';
import { FontAwesome } from '../assets/icon';

let moment = require('moment');
let {height, width} = Dimensions.get('window');

export class ChatBot extends RkComponent {

    constructor(props) {
        super(props);

		this.renderItem = this._renderItem.bind(this);
		this.onRefresh = this._onRefresh.bind(this);
		this.renderFooter = this._renderFooter.bind(this);
		
        this.state = {
			isLoading: true,
			modalVisible: false,
			isSuccess: false,
            isSwiping: false,
            rightActionActivated: false,
            toggle: false,
            isRefreshing: false
        }
    }

    componentDidMount() {
        this.getFAQ();
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    getFAQ() {
        faqProvider.getFAQ(this.props.eventId).then((responseJson) => {
			console.log(responseJson);
			if(responseJson == null || responseJson == "" || responseJson == undefined) {
				DropdownHolder.getDropDown().alertWithType("error", "", "An error occured, please try again.");
			} else {
				if(responseJson.isSuccess) {
					this.setState({faqs: responseJson.data, isLoading: false})
				} 
			}
        })
    }

    addFAQ() {
        var body = {
            eventId: this.props.eventId,
            question: this.state.question,
            answer: this.state.answer
        }

        faqProvider.addFAQ(body).then((responseJson) => {
			if(responseJson == null || responseJson == "" || responseJson == undefined) {
				DropdownHolder.getDropDown().alertWithType("error", "", "An error occured, please try again.");
			} else {
				if(responseJson.isSuccess) {
					this.setModalVisible(!this.state.modalVisible)
					DropdownHolder.getDropDown().alertWithType("success", "", "The FAQ is successfully added.");
					this.getFAQ(this.props.eventId);
				} else {
					DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
				}
			}
        })
    }

    deleteFAQ(id) {
        faqProvider.deleteFAQ(id).then((responseJson) => {
            if(responseJson == null || responseJson == "" || responseJson == undefined) {
				DropdownHolder.getDropDown().alertWithType("error", "", "An error occured, please try again.");
			} else {
				if(responseJson.isSuccess) {
					DropdownHolder.getDropDown().alertWithType("success", "", "The FAQ is successfully added.");
					this.getFAQ(this.props.eventId);
				} else {
					DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
				}
			}
        })
	}

	_onRefresh(){
		this.setState({
			isRefreshing: true
		});
		this.getComments(this.props.id).then(() => {
			this.setState({
				isRefreshing: false
			})
		});
	}
	
	_renderSeparator() {
		return (
		<View style={styles.separator}/>
		)
    }

    _renderFooter() {
        if(this.state.faqs.length == 0) {
            return (
                <View style={{maxHeight: 50}}>
                    <RkText rkType='primary3 mediumLine'>No FAQ</RkText>
                </View>
            )
        }

        return null;
	}
	
	_renderItem(info) {
		const {rightActionActivated, toggle} = this.state;

		return(<Swipeable
			onRef = {ref => this.swipe = ref}
			rightActionActivationDistance={200}
			rightButtons={[
				<TouchableHighlight style={styles.rightSwipeItem} onPress={() => {this.currentlyOpenSwipeable.recenter(); this.deleteFAQ(info.item.faqId); this.getFAQ(this.props.eventId);}}><Image style={{height: 20, width: 20}} source={require('../assets/icons/delete.png')}/></TouchableHighlight>
			]}
			onRightActionActivate={() => {this.deleteFAQ(info.item.faqId);this.setState({rightActionActivated: true})}}
			onRightActionDeactivate={(event, gestureState, swipe) => {this.currentlyOpenSwipeable = swipe; this.currentlyOpenSwipeable.recenter();this.currentlyOpenSwipeable = null; this.setState({rightActionActivated: false})}}
			onRightActionComplete={() => {this.currentlyOpenSwipeable = null; this.getFAQ(this.props.eventId); this.setState({toggle: !toggle})}}
			onRightButtonsOpenRelease = { (event, gestureState, swipe) => {
				if (this.currentlyOpenSwipeable && this.currentlyOpenSwipeable !== swipe) {
					this.currentlyOpenSwipeable.recenter(); }
					this.currentlyOpenSwipeable = swipe;
			} }
			onRightButtonsCloseRelease = {() => this.currentlyOpenSwipeable = null}>
			<View style={styles.item}>
				<View style={styles.content}>
					<RkText rkType='secondary4 mediumLine'>Q: {info.item.question}</RkText>
					<RkText rkType='secondary4 mediumLine'>A: {info.item.answer}</RkText>
				</View>
			</View>
		</Swipeable>)
	}

    render() {
        if(this.state.isLoading) {
            return (
                <View>
                    <Modal
						animationType="slide"
						visible={this.state.modalVisible}
						onRequestClose={() => {
							alert('Modal has been closed.');
						}}>
						<View style={{marginTop: 22}}>
							<View style={styles.navbar}>
								<TouchableOpacity onPress={() => {this.setModalVisible(!this.state.modalVisible)}}>
									<RkText rkType='awesome hero' style={styles.backButton}>{FontAwesome.chevronLeft}</RkText>
								</TouchableOpacity>
								<RkText style={{alignSelf: "center", textAlign: "center", flex:1, flexDirection:'row'}}>Add FAQ</RkText>
							</View>
							<View style={{marginHorizontal: 15}}>
								<View>
									<RkTextInput 
										autoCapitalize='none'
										autoCorrect={false}
										placeholder='Question' 
										value={this.state.question}
										rkType='rounded'
										onChangeText={(question) => this.setState({question})}/>
								</View>
								<View>
									<RkTextInput 
										autoCapitalize='none'
										autoCorrect={false}
										placeholder='Answer' 
										value={this.state.answer}
										rkType='rounded'
										onChangeText={(answer) => this.setState({answer})}/>
								</View>
							</View>
							<View>
								<RkButton  rkType='medium stretch rounded' style={styles.save} onPress={() => this.addFAQ()}>Save</RkButton>
							</View>
						</View>
					</Modal>
					<View style={{flex:1, flexDirection: "row", justifyContent:"space-between"}}>
						<RkText rkType='header4'>CHAT BOT</RkText>
						<View style={{}}>
							<RkButton rkType="roundedIcon" style={{backgroundColor: "#ff0000"}} onPress={() => this.setModalVisible(!this.state.modalVisible)}>+</RkButton>
						</View>
					</View>
                </View>
            )
        }
        return (
            <View>
                <Modal
					animationType="slide"
					visible={this.state.modalVisible}
					onRequestClose={() => {
						alert('Modal has been closed.');
					}}>
					<View style={{marginTop: 22}}>
						<View style={styles.navbar}>
							<TouchableOpacity onPress={() => {this.setModalVisible(!this.state.modalVisible)}}>
								<RkText rkType='awesome hero' style={styles.backButton}>{FontAwesome.chevronLeft}</RkText>
							</TouchableOpacity>
							<RkText style={{alignSelf: "center", textAlign: "center", flex:1, flexDirection:'row'}}>Add FAQ</RkText>
						</View>
						<View style={{marginHorizontal: 15}}>
							<View>
								<RkTextInput 
									autoCapitalize='none'
									autoCorrect={false}
									placeholder='Question' 
									value={this.state.question}
									rkType='rounded'
									onChangeText={(question) => this.setState({question})}/>
							</View>
							<View>
								<RkTextInput 
									autoCapitalize='none'
									autoCorrect={false}
									placeholder='Answer' 
									value={this.state.answer}
									rkType='rounded'
									onChangeText={(answer) => this.setState({answer})}/>
							</View>
						</View>
						<View>
							<RkButton  rkType='medium stretch rounded' style={styles.save} onPress={() => this.addFAQ()}>Save</RkButton>
						</View>
					</View>
				</Modal>
				<View>
                	<View style={{flex:1, flexDirection: "row", justifyContent:"space-between"}}>
						<RkText rkType='header4'>CHAT BOT</RkText>
						<View style={{}}>
							<RkButton rkType="roundedIcon" style={{backgroundColor: "#ff0000"}} onPress={() => this.setModalVisible(!this.state.modalVisible)}>+</RkButton>
						</View>
					</View>
					<View style={{maxHeight: 300}}>
					<FlatList 
						ref="list"
						data={this.state.faqs}
						ItemSeparatorComponent={this._renderSeparator}
						ListFooterComponent={this.renderFooter}
						refreshControl={<RefreshControl
							refreshing={this.state.isRefreshing}
							onRefresh={this.onRefresh}
						/>}
						renderItem={this.renderItem}/>
						</View>
				</View>
            </View>
        )
    }
}

RkTheme.setType('RkButton', 'roundedIcon', {
	fontSize: 15,
	width: 34,
	height: 34,
	borderRadius: 17,
	hitSlop: {top: 5, left: 5, bottom: 5, right: 5}
  });

let styles = RkStyleSheet.create(theme => ({
    item: {
		paddingLeft: 19,
		paddingVertical: 12,
        paddingRight: 16,
        flexDirection: 'row',
        alignItems: 'flex-start',
        flex: 1,
    },
    separator: {
		height: StyleSheet.hairlineWidth,
		backgroundColor: theme.colors.border.base
    },
    rightSwipeItem: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 20,
        backgroundColor: '#FF3B30'
    },
    content: {
        marginLeft: 16,
        flex: 1,
    },
    contentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6
	},
	save: {
		marginVertical: 9,
		backgroundColor: '#FF5E20',
		marginHorizontal: 10
	},
	container: {
		paddingHorizontal: 17,
		paddingBottom: scaleVertical(22),
		alignItems: 'center',
		flex: -1
	},
	navbar: {
        width: width,
        backgroundColor: "#ffffff",
        padding: 10, 
        flexDirection: 'row', 
        alignItems: 'center',
        borderBottomColor: 'grey', 
        borderBottomWidth: 0.7
    },
}));