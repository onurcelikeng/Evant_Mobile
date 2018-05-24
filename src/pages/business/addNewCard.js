import React from 'react';
import {
  View,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import {
  RkText,
  RkTextInput,
  RkStyleSheet,
  RkAvoidKeyboard,
  RkButton
} from 'react-native-ui-kitten';
import {Actions, ActionConst} from 'react-native-router-flux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {FontAwesome} from '../../assets/icon';
import DropdownHolder from '../../providers/dropdownHolder';
import {PasswordTextInput} from '../../components/passwordTextInput';
import {DatePicker} from '../../components/picker/datePicker';
import {CardInput} from '../../components/cardInput';
import {scale} from '../../utils/scale';
import Login from '../login';
import * as businessProvider from '../../providers/business';
import * as accountProvider from '../../providers/account';
import {strings} from '../../locales/i18n';

export default class AddNewCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        cardNumber: '',
        nameOnCard: '',
        cardCode: '',
        expireYear: 2018,
        expireMonth: 5,
        pickerVisible: false,
        hidden: true,
        };
    }

    componentDidMount() {
        console.log("esd")
        this.setState({product: this.props.product, type: this.props.type});
    }

    handlePickedDate(date) {
        console.log(date);
        this.setState({expireMonth: date.month.key, expireYear: date.year});
        this.hidePicker()
    }

    hidePicker() {
        this.setState({pickerVisible: false});
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

    switchToBusiness() {
        var price = "19";
        if(this.state.type == "Basic") price = "19";
        else if(this.state.type == "Gold") price = "79";
        else if(this.state.type == "Platinum") price = "99";

        var cardNo = this.state.cardNumber;
        var i = 0, strLength = cardNo.length;
        
        for(i; i < strLength; i++) {      
            cardNo = cardNo.replace(" ", "");
        }

        let payment = {
            CardHolderName: this.state.nameOnCard,
            CardNumber: cardNo,
            ExpireMonth: this.state.expireMonth.toString(),
            ExpireYear: this.state.expireYear.toString(),
            Cvc: this.state.cardCode,
            FirstName: Login.getCurrentUser().firstName,
            LastName: Login.getCurrentUser().lastName,
            Email: Login.getCurrentUser().email,
            Phone: "05419999999",
            ProductName: this.state.product,
            Price: price
        }

        return businessProvider.switchToBusiness(this.state.type, payment)
        .then((responseJson) => {
            if(responseJson == null || responseJson == "" || responseJson == undefined) {
                DropdownHolder.getDropDown().alertWithType("error", "", strings("common.error_occured"));
            } else {
                if(responseJson.isSuccess) {
                    this.getMe();
                    Actions.pop();
                }
            }
        }).catch((err) => {console.log(err)});
    }

    formatCreditNumber(cardNumber, hiddenFlag) {
        return hiddenFlag
          ? cardNumber.replace(/\D/g, '')
          : cardNumber.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim();
      }

    render() {
        let button = (
            <RkButton style={styles.button} rkType='clear'
                      onPress={() => {
                        this.setState({hidden: !this.state.hidden});
                        this.setState({cardNumber: this.formatCreditNumber(this.state.cardNumber, !this.state.hidden)})
                      }}>
              <RkText style={styles.icon} rkType='awesome secondaryColor'>{FontAwesome.slashEye}</RkText>
            </RkButton>
          );
      
        return (
            <KeyboardAwareScrollView innerRef={ref => {this.scroll = ref}}
            resetScrollToCoords={{ x: 0, y: 0 }}
            onStartShouldSetResponder={ (e) => true}
            contentContainerStyle={styles.screen}
            onResponderRelease={ (e) => Keyboard.dismiss()}>
            <View style={[styles.formContent]}>
            <View>
                <View>
                <View style={[styles.textRow]}>
                    <RkText rkType='subtitle'>{strings("newCard.card_no")}</RkText>
                </View>
                <RkTextInput
                    autoCapitalize='none'
                    rkType='bordered rounded iconRight'
                    autoCorrect={false}
                    label={button}
                    secureTextEntry={this.state.hidden}
                    onChangeText={(cardNumber) => {
                    this.setState({cardNumber: this.formatCreditNumber(cardNumber, this.state.hidden)})
                    }}
                    value={this.state.cardNumber}
                    keyboardType='numeric'
                    maxLength={19}
                />
                </View>

                <View style={[styles.content]}>
                <View style={[styles.textRow]}>
                    <RkText rkType='subtitle'>{strings("newCard.exp_date")}</RkText>
                </View>
                <View style={[styles.expireDateBlock]}>
                    <DatePicker
                    onConfirm={(date) => this.handlePickedDate(date)}
                    onCancel={() => this.hidePicker()}
                    selectedYear={this.state.expireYear}
                    selectedMonth={this.state.expireMonth}
                    visible={this.state.pickerVisible}
                    customDateParts={[DatePicker.DatePart.YEAR, DatePicker.DatePart.MONTH]}/>
                    <View style={[styles.expireDateInput, styles.balloon]}>
                    <TouchableOpacity onPress={() => this.setState({pickerVisible: true})}>
                        <RkText rkType='medium' style={styles.expireDateInnerInput}>
                        {this.state.expireMonth}
                        </RkText>
                    </TouchableOpacity>
                    </View>
                    <View style={[styles.expireDateDelimiter]}/>
                    <View style={[styles.expireDateInput, styles.balloon]}>
                    <TouchableOpacity onPress={() => this.setState({pickerVisible: true})}>
                        <RkText rkType='medium' style={styles.expireDateInnerInput}>
                        {this.state.expireYear}
                        </RkText>
                    </TouchableOpacity>
                    </View>
                </View>
                </View>

                <View style={[styles.content]}>
                <View style={[styles.textRow]}>
                    <RkText rkType='subtitle'>{strings("newCard.name")}</RkText>
                </View>
                <RkTextInput rkType='rounded'
                            onChangeText={(nameOnCard) => this.setState({nameOnCard})}
                            value={this.state.nameOnCard}/>
                </View>

                <View style={[styles.content]}>
                <View style={[styles.textRow]}>
                    <RkText rkType='subtitle'>{strings("newCard.cvc")}</RkText>
                </View>
                <PasswordTextInput maxLength={3}
                                    keyboardType='numeric'
                                    onChangeText={(cardCode) => this.setState({cardCode})}
                                    value={this.state.cardCode}/>
                </View>
            </View>
            <View>
                <RkButton rkType='medium stretch rounded' style={styles.save} text='ADD TO CARD' onPress={() => {
                    this.switchToBusiness();
                }}>{strings("newCard.buy")}</RkButton>
            </View>
            </View>
            </KeyboardAwareScrollView>
        )
    }
}

let styles = RkStyleSheet.create(theme => ({
  screen: {
    padding: 15,
    flex: 1,
    backgroundColor: theme.colors.screen.base
  },
  content: {
    marginTop: 10
  },
  formContent: {
    justifyContent: 'space-between',
    flexDirection: 'column',
    flex: 1
  },
  textRow: {
    marginLeft: 20
  },
  expireDateBlock: {
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  expireDateInput: {
    flex: 0.48,
    marginVertical: 10,
  },
  expireDateInnerInput: {
    textAlign: 'center'
  },
  expireDateDelimiter: {
    flex: 0.04
  },
  balloon: {
    maxWidth: scale(250),
    padding: 15,
    borderRadius: 100,
    borderWidth: 0.5,
    borderColor: theme.colors.border.solid,
  },
  save: {
    marginVertical: 9,
    backgroundColor: '#FF5E20',
    marginHorizontal: 10
  },
  icon: {
    fontSize: 24
  },
  button: {
    right: 17
  }
}));