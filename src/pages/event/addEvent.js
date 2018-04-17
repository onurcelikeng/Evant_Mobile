import React from 'react';
import { ScrollView, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { RkText, RkTextInput, RkAvoidKeyboard, RkTheme, RkStyleSheet, RkButton, RkPicker } from 'react-native-ui-kitten';
import PhotoUpload from 'react-native-photo-upload';
import { Actions } from 'react-native-router-flux';
import { Pages } from 'react-native-pages';
import DatePicker from 'react-native-datepicker';

import { RkSwitch } from '../../components/switch';
import DropdownHolder from '../../providers/dropdownHolder';
import * as eventProvider from '../../providers/events';
import * as categoryProvider from '../../providers/category';
import {Avatar} from '../../components/avatar';

export default class AddEvent extends React.Component {

    constructor(props) {
        super(props);
        this.data = [
            []
        ]

        this.state = {
            categoryId: [{key:1, value:'Music'}],
            title: '',
            description: '',
            isPrivate: false,
            startAt: '2016-05-05 20:00',
            finishAt: '2016-05-05 20:00',
            city: '',
            town: '',
            latitude: '',
            longitude: '',
            photo: '',
            pickerVisible: false,
            categories: []
        }

        this.hidePicker = this._hidePicker.bind(this);
        this.handlePickedValue = this._handlePickedValue.bind(this);
    }

    componentDidMount() {
        this.getCategories();
    }

    getCategories() {
		return categoryProvider.getCategories()
		.then((responseJson) => {
			if(responseJson.isSuccess) {
				console.log(responseJson.data);
				this.setState({
					categories: responseJson.data,
                });
                var i = 0;
                responseJson.data.forEach(element => {
                    this.data[0].push({
                        key: ++i,
                        value: element.name
                    })
                });
                this.categories = responseJson.data;
                
                console.log(this.data[0][4 - 1]);
			} else {  
				this.setState({
					categories: [],
				});      
				DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
			}
		})
		.catch((error) => {
		  console.log(error);
		});
	}  

    addEvent() {
        console.log(this.data[0][this.state.categoryId[0].key - 1])
        credentials = {
            categoryId: this.categories[this.state.categoryId[0].key - 1].categoryId,
            title: this.state.title,
            description: this.state.description,
            isPrivate: this.state.isPrivate,
            startAt: this.state.startAt,
            finishAt: this.state.finishAt,
            city: this.state.city,
            town: this.state.town,
            latitude: this.state.latitude,
            longitude: this.state.longitude
        }
        console.log(credentials);
        if(this.state.title != '' && this.state.description != '' && this.state.startAt != '' && this.state.finishAt != ''
        && this.state.city != '' && this.state.town != '' && this.state.latitude != '' && this.state.longitude != '' && this.state.photo != '') {
            credentials = {
                categoryId: this.state.categoryId[0].key,
                title: this.state.title,
                description: this.state.description,
                isPrivate: this.state.isPrivate,
                startAt: this.state.startAt,
                finishAt: this.state.finishAt,
                city: this.state.city,
                town: this.state.town,
                latitude: parseInt(this.state.latitude, 10),
                longitude: parseInt(this.state.longitude, 10)
            }

            eventProvider.addEvent(credentials)
            .then((responseJson) => {
                if(responseJson.isSuccess) { 
                    eventProvider.addPhoto(this.state.photo)
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
                }
                else {
                    DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
                }
            });
        } else {
            DropdownHolder.getDropDown().alertWithType("error", "", "Please fill up all the spaces.");
        }   
    }

    showPicker() {
        this.setState({pickerVisible: true});
    };

    _hidePicker() {
        this.setState({pickerVisible: false});
    }

    _handlePickedValue(data) {
        this.setState({categoryId: data});
        this.hidePicker();
    };

    render() {
        return(
            <ScrollView style={styles.root}>
                <RkAvoidKeyboard>
                    <View style={styles.section}>
                        <View style={[{flex:1, flexDirection:'row', justifyContent: 'flex-end'}]}>
                            <PhotoUpload 
                                width={300}
                                height={300}
                                quality={50}
                                onResizedImageUri={photo => {console.log(photo); this.setState({photo})}} onCancel={cancel => {this.setState({photo: ""})}}>
                                { this.state.photo == "" ?
                                    <Image style={styles.image} source={require('../../assets/images/tolgshow.jpg')}/>
                                    :
                                    <Image style={styles.image} source={{uri: this.state.photo.uri}}/>
                                }     
                            </PhotoUpload>
                        </View>
                        <View style={styles.row}>
                            <RkTextInput 
                                label='Title'
                                value={this.state.tittle}
                                rkType='right clear'
                                onChangeText={(title) => this.setState({title})}/>
                        </View>
                        <View style={styles.row}>
                            <RkTextInput 
                                label='Description'
                                multiline={true}
                                numberOfLines={3}
                                value={this.state.description}
                                onChangeText={(description) => this.setState({description})}
                                rkType='right clear'/>
                        </View>
                        <View style={[styles.row]}>
                            <RkText rkType='secondary2 hintColor' style={styles.label}>Start Date</RkText>
                            <DatePicker
                                style={styles.date}
                                date={this.state.startAt}
                                mode="datetime"
                                placeholder="select date"
                                format="YYYY-MM-DD HH:mm"
                                minDate="2016-05-01"
                                maxDate="2016-06-01"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                showIcon={false}
                                customStyles={{
                                    dateInput: {
                                        marginLeft: 36
                                    }
                                }}
                                onDateChange={(date) => {this.setState({startAt: date})}}
                            />               
                        </View>
                        <View style={[styles.row]}>
                            <RkText rkType='secondary2 hintColor' style={styles.label}>Finish Date</RkText>
                            <DatePicker
                                style={styles.date}
                                date={this.state.finishAt}
                                mode="datetime"
                                placeholder="select date"
                                format="YYYY-MM-DD HH:mm"
                                minDate="2016-05-01"
                                maxDate="2016-06-01"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                showIcon={false}
                                customStyles={{
                                    dateInput: {
                                        marginLeft: 36
                                    }
                                }}
                                onDateChange={(date) => {this.setState({finishAt: date})}}
                            />               
                        </View>
                        <View style={[styles.row]}>
                            <RkText rkType='secondary2 hintColor' style={[styles.category, styles.label]}>Category</RkText>
                            {
                                this.data[0].length > 0 ?
                                <RkPicker
                                title='Choose Category'
                                data={this.data}
                                visible={this.state.pickerVisible}
                                selectedOptions={this.state.categoryId}
                                onConfirm={this.handlePickedValue}
                                onCancel={this.hidePicker}/>      
                                :
                                <View></View>
                            }
                            <TouchableOpacity onPress={() => this.showPicker()} style={styles.categoryView}>
                                <RkText style={styles.input}>{this.state.categoryId[0].value}</RkText>
                                <Image style={{width: 15, height: 15, marginLeft: 10}} source={require('../../assets/icons/arrow.png')}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.row}>
                            <RkTextInput 
                                label='City'
                                value={this.state.city}
                                onChangeText={(city) => this.setState({city})}
                                rkType='right clear'/>
                        </View>
                        <View style={styles.row}>
                            <RkTextInput 
                                label='Town'
                                value={this.state.town}
                                onChangeText={(town) => this.setState({town})}
                                rkType='right clear'/>
                        </View>
                        <View style={styles.row}>
                            <RkTextInput 
                                label='Latitude'
                                value={this.state.latitude}
                                onChangeText={(latitude) => this.setState({latitude})}
                                rkType='right clear'/>
                        </View>
                        <View style={styles.row}>
                            <RkTextInput 
                                label='Longitude'
                                value={this.state.longitude}
                                onChangeText={(longitude) => this.setState({longitude})}
                                rkType='right clear'/>
                        </View>
                        <View style={styles.row}>
                            <RkText rkType='secondary2 hintColor' style={styles.label}>Is Private</RkText>
                            <RkSwitch
                            style={styles.switch}
                                value={this.state.isPrivate}
                                name="Push"
                                onValueChange={(isPrivate) => {
                                    this.setState({isPrivate});
                                }}/>
                        </View>
                    </View>
                    
                    <RkButton rkType='medium stretch rounded' style={styles.button} onPress={() => {
                            this.addEvent();
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
        justifyContent: 'space-between',
        paddingHorizontal: 17.5,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: theme.colors.border.base,
        alignItems: 'center',
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
    },
    switch: {
        marginVertical: 14
    },
    date: {
        width: 200,
        height: theme.fonts.sizes.base * 1.42,
        marginVertical: 18
    },
    category: {
        flex:1,
        flexDirection: 'row',
        fontSize: theme.fonts.sizes.base,
        height: theme.fonts.sizes.base * 1.42,
        marginVertical: 18
    },
    categoryView: {
        flex:1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: theme.fonts.sizes.base * 1.42,
        marginVertical: 18
    },
    label: {
        color: theme.colors.input.label,
        fontSize: theme.fonts.sizes.small
    },
    input: {
        fontSize: theme.fonts.sizes.base,
        color: theme.colors.input.text
    }
}));