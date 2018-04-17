import React from 'react';
import { ScrollView, View, StyleSheet, Image } from 'react-native';
import { RkText, RkTextInput, RkAvoidKeyboard, RkTheme, RkStyleSheet, RkButton } from 'react-native-ui-kitten';
import PhotoUpload from 'react-native-photo-upload';

import DropdownHolder from '../../providers/dropdownHolder';
import * as accountProvider from '../../providers/account'
import Login from '../login';
import {data} from '../../data';
import {Avatar} from '../../components/avatar';
import {SocialSetting} from '../../components/socialSetting';
import { FontAwesome } from '../../assets/icon';

export default class EditProfile extends React.Component {

    constructor(props) {
        super(props);
        this.data = data.getUser();
        this.user = Login.getCurrentUser();
        console.log(this.user);
        this.state = {
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            email: this.user.email,
            country: this.data.country,
            phone: this.data.phone,
            twitter: true,
            google: false,
            facebook: false,
            photo: this.user.photo,
            isPhotoChanged: false
        }
    }

    profileEdit() {
        console.log("esd");
        credentials = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email
        }

        accountProvider.profileEdit(credentials)
        .then((responseJson) => {
            if(responseJson.isSuccess) { 
                Login.getCurrentUser().firstName = this.state.firstName;
                Login.getCurrentUser().lastName = this.state.lastName;
                Login.getCurrentUser().email = this.state.email;
                if(this.state.isPhotoChanged) {
                    accountProvider.photo(this.state.photo)
                    .then((res) => {
                        console.log(res);
                        if(res.isSuccess) {
                            this.user.photo = this.state.photo;
                            DropdownHolder.getDropDown().alertWithType("success", "", responseJson.message);
                        } else {
                            DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                } else {
                    DropdownHolder.getDropDown().alertWithType("success", "", responseJson.message);
                }
            }
            else {
                DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
            }
        })
    }

    render() {
        return (
            <ScrollView style={styles.root} key={this.state}>
                <RkAvoidKeyboard>
                    <View style={styles.header}>
                        <PhotoUpload 
                            width={300}
                            height={300}
                            quality={50}
                            onResizedImageUri={(res) => {console.log(res); this.setState({photo: res, isPhotoChanged: true})}}
                        >
                        { 
                            this.state.isPhotoChanged ?
                            <Avatar img={this.state.photo.uri} rkType='bigEdit'/>
                            :
                            <Avatar img={this.state.photo} rkType='bigEdit'/>
                        }
                        </PhotoUpload>
                    </View>
                    <View style={styles.section}>
                        <View style={[styles.row, styles.heading]}>
                            <RkText rkType='header6 primary'>INFO</RkText>
                        </View>
                        <View style={styles.row}>
                            <RkTextInput label='First Name'
                                value={this.state.firstName}
                                rkType='right clear'
                                onChangeText={(text) => this.setState({firstName: text})}/>
                        </View>
                        <View style={styles.row}>
                            <RkTextInput label='Last Name'
                                value={this.state.lastName}
                                onChangeText={(text) => this.setState({lastName: text})}
                                rkType='right clear'/>
                        </View>
                        <View style={styles.row}>
                            <RkTextInput label='Email'
                                value={this.state.email}
                                onChangeText={(text) => this.setState({email: text})}
                                rkType='right clear'/>
                        </View>
                        <View style={styles.row}>
                            <RkTextInput label='Country'
                                value={this.state.country}
                                onChangeText={(text) => this.setState({country: text})}
                                rkType='right clear'/>
                        </View>
                        <View style={styles.row}>
                            <RkTextInput label='Phone'
                                value={this.state.phone}
                                onChangeText={(text) => this.setState({phone: text})}
                                rkType='right clear'/>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <View style={[styles.row, styles.heading]}>
                            <RkText rkType='primary header6'>CONNECT YOUR ACCOUNT</RkText>
                        </View>
                        <View style={styles.row}>
                            <SocialSetting name='Twitter' icon={FontAwesome.twitter} tintColor={RkTheme.current.colors.twitter}/>
                        </View>
                        <View style={styles.row}>
                            <SocialSetting name='Google' icon={FontAwesome.google} tintColor={RkTheme.current.colors.google}/>
                        </View>
                        <View style={styles.row}>
                            <SocialSetting name='Facebook' icon={FontAwesome.facebook} tintColor={RkTheme.current.colors.facebook}/>
                        </View>
                    </View>
                    
                    <RkButton rkType='medium stretch rounded' style={styles.button} onPress={() => {
                        if(this.state.firstName != '' && this.state.lastName != '' && this.state.email != '' 
                        && this.state.country != '' && this.state.phone != '') {
                            this.profileEdit();
                        } else {
                            DropdownHolder.getDropDown().alertWithType("warn", "", "Please fill out all the spaces.");
                        }}}>SAVE</RkButton>
                </RkAvoidKeyboard>
            </ScrollView>
        )
    }
}

let styles = RkStyleSheet.create(theme => ({
    root: {
        backgroundColor: theme.colors.screen.base
    },
    header: {
        alignItems: 'center',
        backgroundColor: theme.colors.screen.neutral,
        paddingVertical: 25
    },
    section: {
        marginVertical: 25
    },
    heading: {
        paddingBottom: 12.5
    },
    row: {
        flexDirection: 'row',
        paddingHorizontal: 17.5,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: theme.colors.border.base,
        alignItems: 'center'
    },
    button: {
        marginHorizontal: 25,
        marginBottom: 32,
        backgroundColor: '#FF5E20'
    }
}));