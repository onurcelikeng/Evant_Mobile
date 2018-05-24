import React from 'react';
import { ScrollView, View, StyleSheet, Image } from 'react-native';
import { RkText, RkTextInput, RkTheme, RkStyleSheet, RkButton } from 'react-native-ui-kitten';
import PhotoUpload from 'react-native-photo-upload';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import DropdownHolder from '../../providers/dropdownHolder';
import * as accountProvider from '../../providers/account'
import Login from '../login';
import {data} from '../../data';
import {Avatar} from '../../components/avatar';
import {SocialSetting} from '../../components/socialSetting';
import { FontAwesome } from '../../assets/icon';
import {strings} from '../../locales/i18n'

export default class EditProfile extends React.Component {

    constructor(props) {
        super(props);
        this.data = data.getUser();
        this.user = Login.getCurrentUser();

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
        credentials = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email
        }

        accountProvider.profileEdit(credentials)
        .then((responseJson) => {
            if(responseJson == null || responseJson == "" || responseJson == undefined) {
                DropdownHolder.getDropDown().alertWithType("error", "", strings("common.error_occured"));
            } else {
                if(responseJson.isSuccess) { 
                    Login.getCurrentUser().firstName = this.state.firstName;
                    Login.getCurrentUser().lastName = this.state.lastName;
                    Login.getCurrentUser().email = this.state.email;
                    if(this.state.isPhotoChanged) {
                        accountProvider.photo(this.state.photo)
                        .then((res) => {
                            if(responseJson == null || responseJson == "" || responseJson == undefined) {
                                DropdownHolder.getDropDown().alertWithType("error", "", strings("common.error_occured"));
                            } else {
                                if(res.isSuccess) {
                                    this.user.photo = this.state.photo;
                                    DropdownHolder.getDropDown().alertWithType("success", "", responseJson.message);
                                } else {
                                    DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
                                }
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
            }
        }).catch((err) => {console.log(err)});
    }

    _scrollToInput (reactNode) {
        // Add a 'scroll' ref to your ScrollView
        this.scroll.props.scrollToFocusedInput(reactNode)
    }

    render() {
        return (
            <ScrollView style={styles.root} key={this.state}>
                <KeyboardAwareScrollView innerRef={ref => {this.scroll = ref}}
                    resetScrollToCoords={{ x: 0, y: 0 }}
                    onStartShouldSetResponder={ (e) => true}
                    contentContainerStyle={[{alignItems:"stretch"}]}
                    onResponderRelease={ (e) => Keyboard.dismiss()}>
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
                            <RkText rkType='header6 primary'>{strings("editProfile.info")}</RkText>
                        </View>
                        <View style={styles.row}>
                            <RkTextInput 
                                onFocus={(event) => {
                                    this._scrollToInput(ReactNative.findNodeHandle(event.target))
                                }} 
                                autoCapitalize='none' 
                                autoCorrect={false} 
                                label={strings("editProfile.first_name")}
                                value={this.state.firstName}
                                rkType='right clear'
                                onChangeText={(text) => this.setState({firstName: text})}/>
                        </View>
                        <View style={styles.row}>
                            <RkTextInput 
                                onFocus={(event) => {
                                    this._scrollToInput(ReactNative.findNodeHandle(event.target))
                                }} 
                                autoCapitalize='none' 
                                autoCorrect={false} 
                                label={strings("editProfile.last_name")}
                                value={this.state.lastName}
                                onChangeText={(text) => this.setState({lastName: text})}
                                rkType='right clear'/>
                        </View>
                        <View style={styles.row}>
                            <RkTextInput 
                                onFocus={(event) => {
                                    this._scrollToInput(ReactNative.findNodeHandle(event.target))
                                }} 
                                autoCapitalize='none' 
                                autoCorrect={false} 
                                label={strings("editProfile.email")}
                                value={this.state.email}
                                onChangeText={(text) => this.setState({email: text})}
                                rkType='right clear'/>
                        </View>
                        <View style={styles.row}>
                            <RkTextInput 
                                onFocus={(event) => {
                                    this._scrollToInput(ReactNative.findNodeHandle(event.target))
                                }} 
                                autoCapitalize='none' 
                                autoCorrect={false} 
                                label={strings("editProfile.country")}
                                value={this.state.country}
                                onChangeText={(text) => this.setState({country: text})}
                                rkType='right clear'/>
                        </View>
                        <View style={styles.row}>
                            <RkTextInput 
                                onFocus={(event) => {
                                    this._scrollToInput(ReactNative.findNodeHandle(event.target))
                                }} 
                                autoCapitalize='none' 
                                autoCorrect={false} 
                                label={strings("editProfile.phone")}
                                value={this.state.phone}
                                onChangeText={(text) => this.setState({phone: text})}
                                rkType='right clear'/>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <View style={[styles.row, styles.heading]}>
                            <RkText rkType='primary header6'>{strings("editProfile.connect")}</RkText>
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
                            DropdownHolder.getDropDown().alertWithType("warn", "", strings("common.fill_error"));
                        }}}>{strings("editProfile.save_button")}</RkButton>
                </KeyboardAwareScrollView>
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