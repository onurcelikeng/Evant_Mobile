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
            [{key: 1, value: 'Jun'}, {key: 2, value: 'Feb'}]
        ]
        this.state = {
            event: {
                categoryId: [{key: 1, value: 'Jun'}],
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

    _createDateData() {
        let date = [];
        for(let i=2018;i<2045;i++){
            let month = [];
            for(let j = 1;j<13;j++){
                let day = [];
                if(j === 2){
                    for(let k=1;k<29;k++){
                        day.push(k+'日');
                    }
                    //Leap day for years that are divisible by 4, such as 2000, 2004
                    if(i%4 === 0){
                        day.push(29+'日');
                    }
                }
                else if(j in {1:1, 3:1, 5:1, 7:1, 8:1, 10:1, 12:1}){
                    for(let k=1;k<32;k++){
                        day.push(k+'日');
                    }
                }
                else{
                    for(let k=1;k<31;k++){
                        day.push(k+'日');
                    }
                }
                let _month = {};
                _month[j+'月'] = day;
                month.push(_month);
            }
            let _date = {};
            _date[i+'年'] = month;
            date.push(_date);
        }
        console.log(date[0].item);
        this.setState({date: date});
    }

    showPicker() {
        this.setState({pickerVisible: true})
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
                        <View style={styles.row}>
                            <PhotoUpload onResponse={photo => { console.log(photo); this.setState({photo})}}>
                                { this.state.photo == "" ?
                                    <Avatar img={this.state.photo} rkType='bigEdit'/>
                                    :
                                    <Avatar img={this.state.photo.uri} rkType='bigEdit'/>
                                }     
                            </PhotoUpload>
                        </View>
                        <View style={styles.row}>
                            <RkTextInput label='Title'
                                value={this.state.event.tittle}
                                rkType='right clear'
                                onChangeText={(title) => this.setState({event: {title}})}/>
                        </View>
                        <View style={styles.row}>
                            <RkTextInput label='Description'
                                value={this.state.event.description}
                                onChangeText={(description) => this.setState({event: {description}})}
                                rkType='right clear'/>
                        </View>
                        <View style={styles.row}>
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
                            <RkTextInput label='City'
                                value={this.state.event.city}
                                onChangeText={(city) => this.setState({event: {city}})}
                                rkType='right clear'/>
                        </View>
                        <View style={styles.row}>
                            <RkTextInput label='Town'
                                value={this.state.event.town}
                                onChangeText={(town) => this.setState({event: {town}})}
                                rkType='right clear'/>
                        </View>
                        <View style={styles.row}>
                            <RkTextInput label='Latitude'
                                value={this.state.event.latitude}
                                onChangeText={(latitude) => this.setState({event: {latitude}})}
                                rkType='right clear'/>
                        </View>
                        <View style={styles.row}>
                            <RkTextInput label='Longitude'
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
        alignItems: 'center'
    },
    button: {
        marginHorizontal: 25,
        marginBottom: 32,
        backgroundColor: '#FF5E20'
    }
}));