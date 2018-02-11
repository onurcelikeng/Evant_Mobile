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
    return <RkText style={{color: props.focused ? 'red' : 'black', fontSize: 25}} rkType='awesome'>{ FontAwesome.home }</RkText> 
  else if(props.title == "Discover")
    return <RkText style={{color: props.focused ? 'red' : 'black', fontSize: 25}} rkType='awesome'>{ FontAwesome.discover }</RkText> 
  else if(props.title == "Notifications")
    return <RkText style={{color: props.focused ? 'red' : 'black', fontSize: 25}} rkType='awesome'>{ FontAwesome.notification }</RkText> 
  else if(props.title == "Profile")
    return <RkText style={{color: props.focused ? 'red' : 'black', fontSize: 25}} rkType='awesome'>{ FontAwesome.profile }</RkText> 
};

TabIcon.propTypes = propTypes;

export default TabIcon;