import React from 'react';
import { View, Image, Dimensions, StyleSheet, FlatList, RefreshControl, TouchableHighlight, TouchableOpacity } from 'react-native';
import { RkComponent, RkText, RkTheme, RkStyleSheet, RkButton, RkTextInput } from 'react-native-ui-kitten';
import Swipeable from 'react-native-swipeable';

import { VictoryPie } from "victory-native";

import { Svg, Text as SvgText } from 'react-native-svg';
import { scale } from '../utils/scale';
import * as dashboardProvider from '../providers/dashboard';
import * as commentProvider from '../providers/comments';
import { FontAwesome } from '../assets/icon';
import DropDownHolder from '../providers/dropdownHolder';

let moment = require('moment');

export class SendNotification extends RkComponent {

    constructor(props) {
        super(props);

        this.state = {
            message: ''
        }
    }

    componentDidMount() {
        
    }

    sendNotification() {
        var credentials = {
            message: this.state.message,
            eventId: this.props.eventId
        }
        dashboardProvider.getAnnouncement(credentials).then((responseJson) => {
            if(responseJson.isSuccess) {
                DropDownHolder.getDropDown().alertWithType("success", "", "Notification sent successfully.");
                this.setState({message: ""})
            } else {
                DropDownHolder.getDropDown().alertWithType("error", "", "An error occured, please try again.");
            }
        })
    }

    render() {
        return (
            <View>
                <RkText rkType='header4'>SEND ANNOUNCEMENT</RkText>
                <View style={{maxHeight: 500, flexDirection: 'row', flex: 1, justifyContent: "space-between"}}>
                    <RkTextInput
                        style={{flex: 1}}
                        autoCapitalize='none'
                        autoCorrect={false}
                        placeholder="Your message"
                        secureTextEntry={this.state.hidden}
                        onChangeText={(message) => {
                            this.setState({message: message})
                        }}
                        value={this.state.message}
                    />
                    <TouchableOpacity style={{width:40, height:40, marginTop:20, marginLeft: 10}} onPress={() => { this.sendNotification() }}>
                        <RkText rkType='awesome hero' style={styles.backButton}>{FontAwesome.chevronRight}</RkText>
                    </TouchableOpacity>
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
    },
    backButton: {
        fontSize: 20
    }
}));