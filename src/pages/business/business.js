import React from 'react';
import { ListView, View, Image, TouchableOpacity, TouchableHighlight, RefreshControl, Dimensions, ScrollView, Modal, Alert } from 'react-native';
import { PricingCard, Button } from 'react-native-elements';
import { RkButton, RkTextInput, RkText, RkStyleSheet } from 'react-native-ui-kitten';
import {Actions} from 'react-native-router-flux';

import DropdownHolder from '../../providers/dropdownHolder';
import Login from '../login';
import * as businessProvider from '../../providers/business';
import * as accountProvider from '../../providers/account';
import {strings} from '../../locales/i18n';

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
                DropdownHolder.getDropDown().alertWithType("error", "", strings("common.error_occured"));
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
                DropdownHolder.getDropDown().alertWithType("error", "", strings("common.error_occured"));
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
                DropdownHolder.getDropDown().alertWithType("error", "", strings("common.error_occured"));
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
                {text: strings("business.cancel"), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: strings("business.ok"), onPress: () => {
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
                title={strings("business.title_free")}
                price='₺0'
                info={[strings("business.unlimited"), strings("business.everyone"), strings("business.age")]}
                button={{ title: strings("business.start"), icon: 'flight-takeoff', buttonStyle: {borderRadius: 22} }}
                onButtonPress={() => {  if(!Login.getCurrentUser().isBusiness || this.state.business.type != "Free") 
                                            this.openAlert(strings("business.switch"), strings("business.free"), 'business', 'Free') 
                                    }}/>
                <PricingCard
                color='#a72ce9'
                title={strings("business.title_basic")}
                price='₺19'
                info={[strings("business.per_year"), strings("business.small"), strings("business.age"), strings("business.notifications")]}
                button={{ title: strings("business.buy"), icon: 'shopping-cart', buttonStyle: {borderRadius: 22} }}
                onButtonPress={() => { if(!Login.getCurrentUser().isBusiness || this.state.business.type != "Basic") 
                                            this.openAlert(strings("business.switch"), strings("business.basic"), 'business', 'Basic')
                                    }}/>
                <PricingCard
                color='#f9b632'
                title='Gold'
                price='₺79'
                info={[strings("business.per_year"), strings("business.large"), strings("business.core"), strings("business.comment"), strings("business.daily")]}
                button={{ title: strings("business.buy"), icon: 'shopping-cart', buttonStyle: {borderRadius: 22} }}
                onButtonPress={() => { if(!Login.getCurrentUser().isBusiness || this.state.business.type != "Gold") 
                                            this.openAlert(strings("business.switch"), strings("business.gold"), 'business', 'Gold')
                                        }}/>
                <PricingCard
                color='#cdcbc7'
                title='Platinum'
                price='₺99'
                info={[strings("business.per_year"), strings("business.large"), strings("business.all"), strings("business.chatbot")]}
                button={{ title: strings("business.buy"), icon: 'shopping-cart', buttonStyle: {borderRadius: 22} }}
                onButtonPress={() => { if(!Login.getCurrentUser().isBusiness || this.state.business.type != "Platinum") 
                                            this.openAlert(strings("business.switch"), strings("business.platinum"), 'business', 'Platinum')
                                        }}/>
                {
                    Login.getCurrentUser().isBusiness ?
                    <View style={{flex: 1, justifyContent:"center", alignContent: "center"}}>
                        <TouchableOpacity onPress={() => this.openAlert(strings("business.cancel"), strings("business.cancel_question") + " " + Login.getCurrentUser().business.type + " " + strings("business.business_account"), 'cancel', null)} style={styles.button}>
                            <RkText rkType='primary3' style={{textAlign: "center"}}>{strings("business.switch_to")}</RkText>
                            <RkText rkType='header6' style={{textAlign: "center"}}>{strings("business.normal_account")}</RkText>
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