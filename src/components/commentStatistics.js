import React from 'react';
import { View, Image, Dimensions, StyleSheet, FlatList, RefreshControl, TouchableHighlight } from 'react-native';
import { RkComponent, RkText, RkTheme, RkStyleSheet } from 'react-native-ui-kitten';
import Swipeable from 'react-native-swipeable';

import { VictoryPie } from "victory-native";

import { Svg, Text as SvgText } from 'react-native-svg';
import { scale } from '../utils/scale';
import DropdownHolder from '../providers/dropdownHolder';
import * as dashboardProvider from '../providers/dashboard';
import {strings} from '../locales/i18n';

let moment = require('moment');

export class CommentStatistics extends RkComponent {

    constructor(props) {
        super(props);
        this.renderItem = this._renderItem.bind(this);
		this.onRefresh = this._onRefresh.bind(this);
        this.renderGridItem = this._renderGridItem.bind(this);
        this.renderFooter = this._renderFooter.bind(this);

		this.currentlyOpenSwipeable = null;
        this.size = 300;
        this.fontSize = 40;
        this.state = {
            isLoading: true,
            isSuccess: false,
            isSwiping: false,
            rightActionActivated: false,
            toggle: false,
            isRefreshing: false
        }
    }

    componentDidMount() {
        this.getComments();
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

    getComments() {
        dashboardProvider.getCommentStatistics(this.props.eventId).then((responseJson) => {
            if(responseJson.isSuccess) {
                this.setState({comments: responseJson.data, isLoading: false});
            }
            console.log(this.state.comments);
        })
    }

    deleteComment(id) {
        return commentProvider.deleteComment(id)
        .then((responseJson) => {
            if(responseJson == null || responseJson == "" || responseJson == undefined) {
            DropdownHolder.getDropDown().alertWithType("error", "", strings("common.error_occured"));
            } else {
            if(responseJson.isSuccess) {
                DropdownHolder.getDropDown().alertWithType("success", "", responseJson.message);
            } else {
                DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
            }
            }
        }).catch((err) => {console.log(err)});
    }

    _renderSeparator() {
		return (
		<View style={styles.separator}/>
		)
    }
    
    _renderGridItem(info) {
        return (
            <View style={{backgroundColor: "#b8b8b8", borderRadius: 50, padding: 5, margin: 3}}>
                <RkText style={{color: "#ffffff", fontSize: 12}}>{info.item}</RkText>
            </View>
        )
    }

    _renderFooter() {
        console.log(this.state.comments)
        if(this.state.comments.length == 0) {
            return (
                <View style={{maxHeight: 50}}>
                    <RkText rkType='primary3 mediumLine'>{strings("commentStatistics.footer")}</RkText>
                </View>
            )
        }

        return null;
    }

    _renderItem(info) {
        const {rightActionActivated, toggle} = this.state;
        var color = 'grey';
        
        if((info.item.sentiment * 100).toFixed(2) >= 75) {
            color = 'green';
        } else if((info.item.sentiment * 100).toFixed(2) >= 50) {
            color = "#d7d700";
        } else if((info.item.sentiment * 100).toFixed(2) >= 25) {
            color = "orange";
        } else {
            color = "red";
        }
        console.log(info)
        return (
            <Swipeable
                onRef = {ref => this.swipe = ref}
                rightActionActivationDistance={200}
                rightButtons={[
                    <TouchableHighlight style={styles.rightSwipeItem} 
                                        onPress={() => { 
                                            this.currentlyOpenSwipeable.recenter(); 
                                            this.deleteComment(info.item.commentId); 
                                            this.getComments(this.eventId);}}>
                                            <Image style={{height: 20, width: 20}} source={require('../assets/icons/delete.png')}/>
                                        </TouchableHighlight>
                ]}
                onRightActionActivate={() => {this.deleteComment(info.item.commentId);this.setState({rightActionActivated: true})}}
                onRightActionDeactivate={(event, gestureState, swipe) => {
                                            this.currentlyOpenSwipeable = swipe; 
                                            this.currentlyOpenSwipeable.recenter();
                                            this.currentlyOpenSwipeable = null; 
                                            this.setState({rightActionActivated: false})
                                        }}
                onRightActionComplete={() => {this.currentlyOpenSwipeable = null; this.getComments(this.eventId); this.setState({toggle: !toggle})}}
                onRightButtonsOpenRelease = { (event, gestureState, swipe) => {
                    if (this.currentlyOpenSwipeable && this.currentlyOpenSwipeable !== swipe) {
                    this.currentlyOpenSwipeable.recenter(); }
                    this.currentlyOpenSwipeable = swipe;
                    } }
                onRightButtonsCloseRelease = {() => this.currentlyOpenSwipeable = null}>
                <View style={styles.item}>
                    <View style={{backgroundColor: color, width: 2, height: 30, flexDirection: 'column'}}></View>
                    <View style={styles.content}>
                        <View style={styles.contentHeader}>
                            <RkText rkType='secondary4 hintColor'>
                            {moment(info.item.createdAt).format('lll')}
                            </RkText>
                        </View>
                        <RkText rkType='primary3 mediumLine'>{info.item.content}</RkText>
                        <RkText rkType='secondary4 mediumLine'>{strings("commentStatistics.language")} {info.item.language}</RkText>
                        <View style={{flexDirection: 'row'}}>
                            <RkText rkType='secondary4 mediumLine'>{strings("commentStatistics.score")}</RkText>
                            <RkText style={{color: color}} rkType='secondary4 mediumLine'>{(info.item.sentiment * 100).toFixed(2)}/100</RkText>
                        </View>
                        
                        <View>
                            <FlatList 
                            ref="list"
                            data={info.item.keyPhrases}
                            numColumns={3}
                            renderItem={this.renderGridItem}/>
                        </View>
                    </View>
                </View>
            </Swipeable>
        )
    }

    render() {
        if(this.state.isLoading) {
            return (
                <View>
                    <RkText rkType='header4'>{strings("commentStatistics.comment_overview")}</RkText>
                </View>
            )
        }
        return (
            <View>
                <RkText rkType='header4'>{strings("commentStatistics.comment_overview")}</RkText>
                <View style={{maxHeight: 300}}>
                    <FlatList 
                        ref="list"
                        data={this.state.comments}
                        extraData={this.state}
                        ItemSeparatorComponent={this._renderSeparator}
                        ListFooterComponent={this.renderFooter}
                        refreshControl={<RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this.onRefresh}
                        />}
                        renderItem={this.renderItem}/>
                </View>
            </View>
        )
    }
}

let styles = RkStyleSheet.create(theme => ({
    item: {
        paddingLeft: 19,
        paddingRight: 16,
        paddingVertical: 12,
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
    }
}));