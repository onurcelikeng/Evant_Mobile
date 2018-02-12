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
    return <Image style={{tintColor: props.focused ? 'red' : 'black', height: 23, width: 23}} source={require('../assets/icons/home.png')}/>
  else if(props.title == "Discover")
    return <Image style={{tintColor: props.focused ? 'red' : 'black', height: 23, width: 23}} source={require('../assets/icons/search.png')}/>
  else if(props.title == "Notifications")
    return <Image style={{tintColor: props.focused ? 'red' : 'black', height: 23, width: 23}} source={require('../assets/icons/notification.png')}/>
  else if(props.title == "Profile")
    return <Image style={{tintColor: props.focused ? 'red' : 'black', height: 23, width: 23}} source={require('../assets/icons/profile.png')}/>
};

TabIcon.propTypes = propTypes;

export default TabIcon;