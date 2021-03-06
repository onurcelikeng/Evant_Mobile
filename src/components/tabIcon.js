import React from 'react';
import PropTypes from 'prop-types';
import {
  Text, Image
} from 'react-native';
import {
  RkText,
  RkTheme
} from 'react-native-ui-kitten';
import {FontAwesome, FontIcons} from '../assets/icon';

const propTypes = {
  selected: PropTypes.bool,
  title: PropTypes.string,
};

const TabIcon = (props) => {
  if(props.title == "Events")
    return <Image style={{tintColor: props.focused ? 'red' : 'black', height: 21, width: 21}} source={require('../assets/icons/home.png')}/>
  else if(props.title == "Discover")
    return <Image style={{tintColor: props.focused ? 'red' : 'black', height: 21, width: 21}} source={require('../assets/icons/search.png')}/>
  else if(props.title == "Notifications")
    return <Image style={{tintColor: props.focused ? 'red' : 'black', height: 21, width: 21}} source={require('../assets/icons/notification.png')}/>
  else if(props.title == "Profile")
    return <Image style={{tintColor: props.focused ? 'red' : 'black', height: 21, width: 21}} source={require('../assets/icons/profile.png')}/>
  else if(props.title == "Add Event")
    return <Image style={{tintColor: props.focused ? 'red' : 'black', height: 24, width: 24}} source={require('../assets/icons/add.png')}/>
};

TabIcon.propTypes = propTypes;

export default TabIcon;