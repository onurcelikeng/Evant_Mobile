import React from 'react';
import { ScrollView, View, StyleSheet, Image, TouchableOpacity, Dimensions, Keyboard } from 'react-native';
import { RkText, RkTextInput, RkAvoidKeyboard, RkTheme, RkStyleSheet, RkButton, RkPicker } from 'react-native-ui-kitten';
import PhotoUpload from 'react-native-photo-upload';
import { Actions } from 'react-native-router-flux';
import { Pages } from 'react-native-pages';
import DatePicker from 'react-native-datepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {FontAwesome} from '../../assets/icon';
import { RkSwitch } from '../../components/switch';
import DropdownHolder from '../../providers/dropdownHolder';
import * as eventProvider from '../../providers/events';
import * as categoryProvider from '../../providers/category';
import {Avatar} from '../../components/avatar';
import {scale, scaleVertical} from '../../utils/scale';
import Events from './events';

let moment = require('moment');

const {width} = Dimensions.get('window');

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
            startAt: '2018-05-25 11:00',
            finishAt: '2018-05-25 11:00',
            city: '',
            town: '',
            latitude: this.props.lat,
            longitude: this.props.long,
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
            if(responseJson == null || responseJson == "" || responseJson == undefined) {
                DropdownHolder.getDropDown().alertWithType("error", "", "An error occured, please try again.");
            } else {
                if(responseJson.isSuccess) {
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
            }
		})
		.catch((error) => {
		  console.log(error);
		});
	}  

    addEvent() {
        if(this.state.title != '' && this.state.description != '' && this.state.startAt != '' && this.state.finishAt != ''
        && this.state.city != '' && this.state.town != '' && this.state.latitude != '' && this.state.longitude != '' && this.state.photo != '') {
            
            eventProvider.addPhoto(this.state.photo)
            .then((res) => {
                if(res.isSuccess) {
                    credentials = {
                        eventId: res.message,
                        categoryId: this.categories[this.state.categoryId[0].key - 1].categoryId,
                        title: this.state.title,
                        description: this.state.description,
                        isPrivate: this.state.isPrivate,
                        startAt: moment(this.state.startAt).format(),
                        finishAt: moment(this.state.finishAt).format(),
                        city: this.state.city,
                        town: this.state.town,
                        latitude: this.props.lat,
                        longitude: this.props.long
                    }

                    eventProvider.addEvent(credentials)
                    .then((responseJson) => {
                        if(responseJson == null || responseJson == "" || responseJson == undefined) {
                            DropdownHolder.getDropDown().alertWithType("error", "", "An error occured, please try again.");
                        } else {
                            if(responseJson.isSuccess) { 
                                this.props.onPress();
                            }
                            else {
                                DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
                            }
                        }
                    }).catch((err) => {console.log(err)});
                } else {
                    DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
                }
            })
            .catch((err) => {
                console.log(err);
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
            <View style={{flex: 1, paddingTop: 20}}>
                <View style={styles.navbar}>
                    <TouchableOpacity onPress={this.props.onPress}>
                        <RkText rkType='awesome hero' style={styles.backButton}>{FontAwesome.chevronLeft}</RkText>
                    </TouchableOpacity>
                    <RkText style={{alignSelf: "center", textAlign: "center", flex:1, flexDirection:'row'}}>Add Event</RkText>
                </View>
                <KeyboardAwareScrollView innerRef={ref => {this.scroll = ref}}
                    resetScrollToCoords={{ x: 0, y: 0 }}
                    onStartShouldSetResponder={ (e) => true}
                    contentContainerStyle={styles.screen}
                    onResponderRelease={ (e) => Keyboard.dismiss()}>
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
                            <View>
                                <View style={[styles.textRow]}>
                                    <RkText rkType='subtitle'>Title</RkText>
                                </View>
                                <RkTextInput 
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    value={this.state.title}
                                    rkType='bordered rounded iconRight'
                                    onChangeText={(title) => this.setState({title})}/>
                            </View>
                            <View>
                                <View style={[styles.textRow]}>
                                    <RkText rkType='subtitle'>Description</RkText>
                                </View>
                                <RkTextInput 
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    multiline={true}
                                    numberOfLines={3}
                                    value={this.state.description}
                                    onChangeText={(description) => this.setState({description})}
                                    rkType='bordered rounded iconRight'/>
                            </View>
                            <View>
                                <View style={[styles.textRow]}>
                                    <RkText rkType='subtitle'>Category</RkText>
                                </View>                                
                                {
                                    this.data[0].length > 0 ?
                                    <RkPicker
                                    rkType='bordered rounded iconRight'
                                    title='Choose Category'
                                    data={this.data}
                                    visible={this.state.pickerVisible}
                                    selectedOptions={this.state.categoryId}
                                    onConfirm={this.handlePickedValue}
                                    onCancel={this.hidePicker}/>      
                                    :
                                    <View></View>
                                }
                                <TouchableOpacity onPress={() => this.showPicker()}>
                                    <View style={[styles.balloon,styles.categoryView]}>
                                        <RkText style={styles.input}>{this.state.categoryId[0].value}</RkText>
                                        <Image style={{width: 15, height: 15, marginLeft: 10}} source={require('../../assets/icons/arrow.png')}/>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <View style={[styles.textRow]}>
                                    <RkText rkType='subtitle'>City</RkText>
                                </View>
                                <RkTextInput 
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    value={this.state.city}
                                    onChangeText={(city) => this.setState({city})}
                                    rkType='bordered rounded iconRight'/>
                            </View>
                            <View>
                                <View style={[styles.textRow]}>
                                    <RkText rkType='subtitle'>Town</RkText>
                                </View>
                                <RkTextInput 
                                    autoCapitalize='none'
									autoCorrect={false}
                                    value={this.state.town}
                                    onChangeText={(town) => this.setState({town})}
                                    rkType='bordered rounded iconRight'/>
                            </View>

                            <View>
                                <View style={[styles.textRow]}>
                                    <RkText rkType='subtitle'>Start Date</RkText>
                                </View>
                                <DatePicker
                                    style={styles.date}
                                    date={this.state.startAt}
                                    mode="datetime"
                                    placeholder="select date"
                                    format="YYYY-MM-DD HH:mm"
                                    minDate="2018-05-25"
                                    maxDate="2019-05-25"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    showIcon={false}
                                    customStyles={{
                                        dateInput: {
                                            borderWidth: 0
                                        },
                                        dateTouchBody: styles.balloon,
                                        datePickerCon: {
                                            borderWidth: 0
                                        }
                                    }}
                                    onDateChange={(date) => {this.setState({startAt: date})}}
                                />               
                            </View>
                            <View>
                                <View style={[styles.textRow]}>
                                    <RkText rkType='subtitle'>Finish Date</RkText>
                                </View>
                                <DatePicker
                                    style={styles.date}
                                    date={this.state.finishAt}
                                    mode="datetime"
                                    placeholder="select date"
                                    format="YYYY-MM-DD HH:mm"
                                    minDate="2018-05-01"
                                    maxDate="2019-06-01"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    showIcon={false}
                                    customStyles={{
                                        dateInput: {
                                            borderWidth: 0
                                        },
                                        dateTouchBody: styles.balloon,
                                        datePickerCon: {
                                            borderWidth: 0
                                        }
                                    }}
                                    onDateChange={(date) => {this.setState({finishAt: date})}}
                                />               
                            </View>

                            <View style={styles.row}>
                                <RkText rkType='subtitle' >Is Private</RkText>
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
                </KeyboardAwareScrollView>
            </View>
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
        margin: 10
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
        marginVertical: 18
    },
    label: {
        color: theme.colors.input.label,
        fontSize: theme.fonts.sizes.small
    },
    input: {
        fontSize: theme.fonts.sizes.base,
        color: theme.colors.input.text
    },
    navbar: {
        width: width,
        backgroundColor: "#ffffff",
        padding: 10, 
        flexDirection: 'row', 
        alignItems: 'center',
        borderBottomColor: 'grey', 
        borderBottomWidth: 0.7
    },
    textRow: {
        marginLeft: 20
    },
    balloon: {
        borderRadius: 100,
        borderWidth: 1,
        borderColor: theme.colors.border.solid,
        width: width - 20,
        padding: 15
      },
}));