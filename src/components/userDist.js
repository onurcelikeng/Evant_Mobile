import React from 'react';
import { View, Image, Dimensions, StyleSheet, FlatList, RefreshControl, TouchableHighlight } from 'react-native';
import { RkComponent, RkText, RkTheme, RkStyleSheet } from 'react-native-ui-kitten';
import Swipeable from 'react-native-swipeable';
import PureChart from 'react-native-pure-chart';

import { scale } from '../utils/scale';
import DropdownHolder from '../providers/dropdownHolder';
import * as dashboardProvider from '../providers/dashboard';
import {strings} from '../locales/i18n';

let moment = require('moment');

export class UserDistribution extends RkComponent {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true
        }
    }

    componentDidMount() {
        this.getDate();
    }

    getDate() {
        dashboardProvider.getDate(this.props.eventId).then((responseJson) => {
            if(responseJson.isSuccess) {
                var array = []
                responseJson.data.forEach(element => {
                    array.push({x: element.date, y: element.userCount})
                });

                this.setState({
                    data: array.reverse(),
                    isLoading: false
                })
            } else {
                this.setState({
                    data: [],
                    isLoading: false
                })
            }
            console.log(responseJson);
        })
    }

    render() {
        if(this.state.isLoading) {
            return (
                <View>
                    <RkText rkType='header4'>{strings("userDist.attendee_distribution")}</RkText>
                </View>
            )
        } else if(this.state.data.length == 0){
            console.log(this.state.data)
            return (
                <View>
                    <RkText rkType='header4'>{strings("userDist.attendee_distribution")}</RkText>
                    <View style={{maxHeight: 50}}>
                        <RkText rkType='primary3 mediumLine'>{strings("userDist.footer")}</RkText>
                    </View>
                </View>   
            )
        }
        return (
            <View>
                <RkText rkType='header4'>{strings("userDist.attendee_distribution")}</RkText>
                <View style={{marginVertical: 20}}>
                    <PureChart data={this.state.data} type='line' />
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