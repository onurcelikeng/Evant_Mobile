import React from 'react';
import { ListView, View, Image, TouchableOpacity, TouchableHighlight, RefreshControl, Dimensions, ScrollView, Modal, Alert } from 'react-native';
import { PricingCard, Button } from 'react-native-elements';
import { RkButton, RkTextInput, RkText, RkStyleSheet } from 'react-native-ui-kitten';
import {Actions} from 'react-native-router-flux';

import DropdownHolder from '../../providers/dropdownHolder';
import Login from '../login';
import * as businessProvider from '../../providers/business';
import * as accountProvider from '../../providers/account';

let moment = require('moment');

export default class Business extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            modalSwitchVisible: false,
            modalCancelVisible: false
        }
    }

    componentDidMount() {
        businessProvider.getBusiness().then((responseJson) => {
            if(responseJson.isSuccess) {
                this.setState({business: {type: responseJson.data.businessType, expire: responseJson.data.expireAt}})

            console.log(this.state.business.expire);
            console.log(moment().format());
            console.log(this.state.business.expire > moment().format());
            }
        })
    }

    switchToBusiness(type, payment) {
        return businessProvider.switchToBusiness(type, payment)
        .then((responseJson) => {
            if(responseJson == null || responseJson == "" || responseJson == undefined) {
                DropdownHolder.getDropDown().alertWithType("error", "", "An error occured, please try again.");
            } else {
                if(responseJson.isSuccess) {
                    this.getMe();
                    this._setModalVisible(false, 1);
                    Actions.pop();
                }
            }
        }).catch((err) => {console.log(err)});
    }

    getMe() {
        accountProvider.getMe()
        .then((responseJson) => {
            if(responseJson == null || responseJson == "" || responseJson == undefined) {
                DropdownHolder.getDropDown().alertWithType("error", "", "An error occured, please try again.");
            } else {
                if(responseJson.isSuccess) {
                    console.log(responseJson);
                    Login.setCurrentUser(responseJson.data);
                    console.log(Login.getCurrentUser());
                }
            }
        }).catch((err) => {console.log(err)});
    }

    cancelBusiness() {
        return businessProvider.cancelBusiness()
        .then((responseJson) => {
            if(responseJson == null || responseJson == "" || responseJson == undefined) {
                DropdownHolder.getDropDown().alertWithType("error", "", "An error occured, please try again.");
            } else {
                if(responseJson.isSuccess) {
                    this.getMe();
                    this._setModalVisible(false, 1);
                    Actions.pop();
                }
            }
        }).catch((err) => {console.log(err)});
    }

    _setModalVisible(visible, type) {
        if(type == 1)
        this.setState({modalSwitchVisible: visible});
        else if(type == 2)
        this.setState({modalCancelVisible: visible});
    }

    openAlert(title, message, type, businessType) {
        var payment = null;
        Alert.alert(
            title,
            message,
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'OK', onPress: () => {
                if(type == 'business') {
                    var product = businessType + " Business Üyelik";
                    if(businessType == "Free")
                        this.switchToBusiness(businessType, null);
                    else if(!Login.getCurrentUser().isBusiness && this.state.business.type == businessType && this.state.business.expire > moment().format())
                        this.switchToBusiness(businessType, null);
                    else if(Login.getCurrentUser().isBusiness && this.state.business.type != businessType)
                        Actions.push("addCard", {product: product, type: businessType});
                    else if(!Login.getCurrentUser().isBusiness && this.state.business.type == businessType && this.state.business.expire < moment().format())
                    Actions.push("addCard", {product: product, type: businessType});
                    else if(!Login.getCurrentUser().isBusiness && this.state.business.type != businessType)
                    Actions.push("addCard", {product: product, type: businessType});
                } else if(type == 'cancel') {
                    this.cancelBusiness();
                }
                }},
            ],
            { cancelable: false }
        )
    }

    render() {
        return(
            <ScrollView style={styles.root}>
                <PricingCard
                color='#4f9deb'
                title='Free'
                price='₺0'
                info={['Unlimited', 'For Everyone', 'User Age Analysis of Events']}
                button={{ title: 'GET STARTED', icon: 'flight-takeoff', buttonStyle: {borderRadius: 22} }}
                onButtonPress={() => {  if(!Login.getCurrentUser().isBusiness || this.state.business.type != "Free") 
                                            this.openAlert('SWITCH', 'Do you want to switch to Free Business account?', 'business', 'Free') 
                                    }}/>
                <PricingCard
                color='#a72ce9'
                title='Basic'
                price='₺19'
                info={['Per Year', 'For Small Businesses', 'User Age Analysis of Events', 'Notifications to Different Age Groups']}
                button={{ title: 'BUY NOW', icon: 'shopping-cart', buttonStyle: {borderRadius: 22} }}
                onButtonPress={() => { if(!Login.getCurrentUser().isBusiness || this.state.business.type != "Basic") 
                                            this.openAlert('SWITCH', 'Do you want to switch to Basic Business account?', 'business', 'Basic')
                                    }}/>
                <PricingCard
                color='#f9b632'
                title='Gold'
                price='₺79'
                info={['Per Year', 'For Larger Businesses', 'All Core Features', 'Comment Analysis of Events', 'Daily Attendees of Events']}
                button={{ title: 'BUY NOW', icon: 'shopping-cart', buttonStyle: {borderRadius: 22} }}
                onButtonPress={() => { if(!Login.getCurrentUser().isBusiness || this.state.business.type != "Gold") 
                                            this.openAlert('SWITCH', 'Do you want to switch to Gold Business account?', 'business', 'Gold')
                                        }}/>
                <PricingCard
                color='#cdcbc7'
                title='Platinum'
                price='₺99'
                info={['Per Year', 'For Larger Businesses', 'All Features', 'Chat Bot Support for FAQ']}
                button={{ title: 'BUY NOW', icon: 'shopping-cart', buttonStyle: {borderRadius: 22} }}
                onButtonPress={() => { if(!Login.getCurrentUser().isBusiness || this.state.business.type != "Platinum") 
                                            this.openAlert('SWITCH', 'Do you want to switch to Platinum Business account?', 'business', 'Platinum')
                                        }}/>
                {
                    Login.getCurrentUser().isBusiness ?
                    <View style={{flex: 1, justifyContent:"center", alignContent: "center"}}>
                        <TouchableOpacity onPress={() => this.openAlert('CANCEL', 'Do you want to cancel your' + " " + Login.getCurrentUser().business.type + " " + 'business account?', 'cancel', null)} style={styles.button}>
                            <RkText rkType='primary3' style={{textAlign: "center"}}>Switch to </RkText>
                            <RkText rkType='header6' style={{textAlign: "center"}}>Normal Account</RkText>
                        </TouchableOpacity>
                    </View>
                    :
                    null
                }
            </ScrollView>
        );
    }
} 

let styles = RkStyleSheet.create(theme => ({
    root: {
        backgroundColor: theme.colors.screen.base,
    },
    button: {
        alignContent: "center",
        justifyContent: 'center',
        flexDirection: 'row',
        margin: 5
    }
}));