import React from 'react';
import { Image, View } from 'react-native';
import { RkComponent, RkText, RkTheme } from 'react-native-ui-kitten';

import {FontAwesome} from '../../assets/icon';

export class Avatar extends RkComponent {
  componentName = 'Avatar';
  typeMapping = {
    container: {},
    image: {},
    badge: {},
    badgeText: {}
  };

  constructor(props) {
    super(props);
  }

  renderImg(styles) {
    let {image, badge, badgeText} = styles;
    return (
      <View>
        {
          this.props.uri != "" ?
          <Image style={image} source={{uri: this.props.img}}/>
          :
          <Image style={image} source={require("../../assets/images/evant_logo.png")}/>
        }
        
        { this.props.badge && this.renderBadge(badge, badgeText)}
      </View>
    )
  }

  renderBadge(style, textStyle) {
    let symbol;
    let backgroundColor;
    let color;

    switch (this.props.badge) {
      case 2:
        symbol = FontAwesome.heart;
        backgroundColor = RkTheme.current.colors.badge.likeBackground;
        color = RkTheme.current.colors.badge.likeForeground;
        break;
      case 3:
        symbol = FontAwesome.plus;
        backgroundColor = RkTheme.current.colors.badge.plusBackground;
        color = RkTheme.current.colors.badge.plusForeground;
        break;
      case 1:
        symbol = FontAwesome.comment;
        backgroundColor = RkTheme.current.colors.badge.commentBackground;
        color = RkTheme.current.colors.badge.commentForeground;
        break;
      case 'photo':
        symbol = FontAwesome.plus;
        backgroundColor = RkTheme.current.colors.badge.commentBackground;
        color = RkTheme.current.colors.badge.commentForeground;
        break;
    }

    return (
      <View style={[style, {backgroundColor}]}>
        <RkText rkType='awesome' style={[textStyle, {color}]}>
          {symbol}
        </RkText>
      </View>
    )
  };

  render() {
    let {container, ...other} = this.defineStyles();
    return (
      <View style={[container]}>
        {this.renderImg(other)}
      </View>
    )
  }
}
