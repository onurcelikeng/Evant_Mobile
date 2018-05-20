import React from 'react';
import { ListView, View, Image, TouchableOpacity, TouchableHighlight, RefreshControl, Dimensions, ScrollView } from 'react-native';
import { RkStyleSheet, RkText, RkTheme } from 'react-native-ui-kitten';
import Svg, { Circle, Ellipse, G, LinearGradient, RadialGradient, Line, Path, Polygon, Polyline, Rect, Symbol, Text, Use, Defs, Stop } from 'react-native-svg';
import { Actions } from 'react-native-router-flux';

import DropdownHolder from '../providers/dropdownHolder';
import ContentLoader from '../config/contentLoader'
import {FontAwesome} from '../assets/icon';
import { ProgressChart, DoughnutChart, AreaChart, AreaSmoothedChart } from '../components/charts';
import { CommentStatistics } from '../components/commentStatistics';
import Login from './login';
import { SendNotification } from '../components/sendNotification';
import { UserDistribution } from '../components/userDist';
import { ChatBot } from '../components/chatBot';

let moment = require('moment');

export default class Dashboard extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isSuccess: false,
        }

        this.data = {
            statItems: [
                {
                    name: 'Stars',
                    value: '4,512',
                    icon: 'github',
                    background: RkTheme.current.colors.dashboard.stars
                },
                {
                    name: 'Tweets',
                    value: '2,256',
                    icon: 'twitter',
                    background: RkTheme.current.colors.dashboard.tweets
                },
                {
                    name: 'Likes',
                    value: '1,124',
                    icon: 'facebook',
                    background: RkTheme.current.colors.dashboard.likes
                },
            ]
        };
    }
    
    renderStatItem(item) {
        return (
            <View style={[styles.statItemContainer, {backgroundColor: item.background}]} key={item.name}>
                <View>
                    <RkText rkType='header6' style={styles.statItemValue}>{item.value}</RkText>
                    <RkText rkType='secondary7' style={styles.statItemName}>{item.name}</RkText>
                </View>
                <RkText rkType='awesome hero' style={styles.statItemIcon}>{FontAwesome[item.icon]}</RkText>
            </View>
        )
    }

    render() {
        let chartBlockStyles = [styles.chartBlock, {backgroundColor: RkTheme.current.colors.control.background}];

        return (
            <ScrollView style={styles.screen}>
            {
                Login.getCurrentUser().business.isAgeAnalysis 
                ? 
                <View style={[chartBlockStyles, {marginTop: 15}]}>
                    <DoughnutChart eventId={this.props.eventId}/>
                </View>
                :
                null
            }
            {
                Login.getCurrentUser().business.isSendNotificationUsers 
                ? 
                <View style={chartBlockStyles}>
                    <SendNotification eventId={this.props.eventId}/>
                </View>
                :
                null
            }
            {
                Login.getCurrentUser().business.isCommentAnalysis 
                ? 
                <View style={chartBlockStyles}>
                    <CommentStatistics eventId={this.props.eventId}/>
                </View>
                :
                null
            }
            {
                Login.getCurrentUser().business.isAttendedUserAnalysis 
                ? 
                <View style={chartBlockStyles}>
                    <UserDistribution eventId={this.props.eventId}/>
                </View>
                :
                null
            } 
            {
                Login.getCurrentUser().business.isChatBotSupport 
                ? 
                <View style={chartBlockStyles}>
                    <ChatBot eventId={this.props.eventId}/>
                </View>
                :
                null
            }    
            </ScrollView>
        )
    }
}
    
let styles = RkStyleSheet.create(theme => ({
    screen: {
        backgroundColor: theme.colors.screen.scroll,
        paddingHorizontal: 15,
    },
    statItems: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 15,
    },
    statItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 3,
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    statItemIcon: {
        alignSelf: 'center',
        marginLeft: 10,
        color: 'white',
    },
    statItemValue: {
        color: 'white',
    },
    statItemName: {
        color: 'white',
    },
    chartBlock: {
        padding: 15,
        marginBottom: 15,
        justifyContent: 'center'
    }
}));    