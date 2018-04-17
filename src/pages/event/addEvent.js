import React from 'react';
import { ScrollView, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { RkText, RkTextInput, RkAvoidKeyboard, RkTheme, RkStyleSheet, RkButton, RkPicker } from 'react-native-ui-kitten';
import PhotoUpload from 'react-native-photo-upload';
import { Actions } from 'react-native-router-flux';
import { Pages } from 'react-native-pages';

import { RkSwitch } from '../../components/switch';
import DropdownHolder from '../../providers/dropdownHolder';
import * as eventProvider from '../../providers/events'
import {Avatar} from '../../components/avatar';

export default class AddEvent extends React.Component {

    constructor(props) {
        super(props);
        this.data = [
            [{key: 1, value: 'Party'}, {key: 2, value: 'Business'}]
        ]
        this.state = {
            event: {
                categoryId: [{key: 1, value: 'Party'}],
                title: "",
                description: "",
                isPrivate: false,
                startAt: "",
                finishAt: "",
                city: "",
                town: "",
                latitude: "",
                longitude: ""
            },
            photo: "",
            pickerVisible: false,
            date: [],
            selectedYearIndex: 0
        }

        this.hidePicker = this._hidePicker.bind(this);
        this.handlePickedValue = this._handlePickedValue.bind(this);
        this.createDateData = this._createDateData.bind(this);
    }

    componentDidMount() {
        this.createDateData();
    }

    showPicker() {
        this.setState({pickerVisible: true});
    };

    _hidePicker() {
        this.setState({pickerVisible: false});
    }

    _handlePickedValue(data) {
        this.setState({event: {categoryId: data}});
        this.hidePicker();
    };

    render() {
        console.log(this.state.event.isPrivate)
        return(
            <ScrollView style={styles.root}>
                <RkAvoidKeyboard>
                    <View style={styles.section}>
                        <View style={[{flex:1, flexDirection:'row', justifyContent: 'flex-end'}]}>
                            <PhotoUpload onResponse={photo => { console.log(photo); this.setState({photo})}} onCancel={cancel => {this.setState({photo: ""})}}>
                                { this.state.photo == "" ?
                                    <Image style={styles.image} source={require('../../assets/images/tolgshow.jpg')}/>
                                    :
                                    <Image source={{uri: this.state.photo.uri}}/>
                                }     
                            </PhotoUpload>
                        </View>
                        <View style={styles.row}>
                            <RkTextInput 
                                label='Title'
                                value={this.state.event.tittle}
                                rkType='right clear'
                                onChangeText={(title) => this.setState({event: {title}})}/>
                        </View>
                        <View style={styles.row}>
                            <RkTextInput 
                                label='Description'
                                multiline={true}
                                value={this.state.event.description}
                                onChangeText={(description) => this.setState({event: {description}})}
                                rkType='right clear'/>
                        </View>
                        <View style={[styles.row, {marginVertical: 15}]}>
                            <TouchableOpacity onPress={() => this.showPicker()}>
                                <RkText>
                                {this.state.event.categoryId[0].value}
                                </RkText>
                            </TouchableOpacity>
                            <RkPicker
                                title='Choose Category'
                                data={this.data}
                                visible={this.state.pickerVisible}
                                selectedOptions={this.state.event.categoryId}
                                onConfirm={this.handlePickedValue}
                                onCancel={this.hidePicker}/>                        
                        </View>
                        <View style={styles.row}>
                            <RkTextInput 
                                label='City'
                                value={this.state.event.city}
                                onChangeText={(city) => this.setState({event: {city}})}
                                rkType='right clear'/>
                        </View>
                        <View style={styles.row}>
                            <RkTextInput 
                                label='Town'
                                value={this.state.event.town}
                                onChangeText={(town) => this.setState({event: {town}})}
                                rkType='right clear'/>
                        </View>
                        <View style={styles.row}>
                            <RkTextInput 
                                label='Latitude'
                                value={this.state.event.latitude}
                                onChangeText={(latitude) => this.setState({event: {latitude}})}
                                rkType='right clear'/>
                        </View>
                        <View style={styles.row}>
                            <RkTextInput 
                                label='Longitude'
                                value={this.state.event.longitude}
                                onChangeText={(longitude) => this.setState({event: {longitude}})}
                                rkType='right clear'/>
                        </View>
                        <View style={styles.row}>
                            <RkText rkType='header6'>Is Private</RkText>
                            <RkSwitch 
                                    value={this.state.event.isPrivate}
                                    name="Refresh"
                                    onValueChange={(isPrivate) => { this.setState({event: {isPrivate}})}}/>
                        </View>
                    </View>
                    
                    <RkButton rkType='medium stretch rounded' style={styles.button} onPress={() => {
                       
                            DropdownHolder.getDropDown().alertWithType("warn", "", "Please fill out all the spaces.");
                        }}>SAVE</RkButton>
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
        alignItems: 'flex-start',
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
        flex:1,
        paddingHorizontal: 17.5,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: theme.colors.border.base,
    },
    button: {
        marginHorizontal: 25,
        marginBottom: 32,
        backgroundColor: '#FF5E20'
    },
    image: {
        width: 110,
        height: 110,
        marginBottom: 19
    }
}));