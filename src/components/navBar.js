import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions
} from 'react-native';
import _ from 'lodash';
import {RkText, RkButton, RkStyleSheet} from 'react-native-ui-kitten';
import {FontAwesome} from '../assets/icon';
import {UIConstants} from '../config/appConstants';
import {scale, scaleModerate, scaleVertical} from '../utils/scale';
import {Actions} from 'react-native-router-flux';

export class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {width: undefined};

  }

  _renderRight(headerRight) {
    let windowWidth = Dimensions.get('window').width;
    const width = this.state.width
      ? (windowWidth - this.state.width) / 2
      : undefined;

    return headerRight && (
        <View style={[{width}, styles.right]}>{headerRight}</View>
      );
  }

  _renderLeft(headerLeft) {
    if (headerLeft) {
      return (
        <View style={styles.left}>{headerLeft}</View>
      )
    }

    let windowWidth = Dimensions.get('window').width;
    const width = this.state.width
      ? (windowWidth - this.state.width) / 2
      : undefined;

    let renderLeftContent = () => {
      let index = _.findIndex(this.props.headerProps.scenes, {isActive: true});
      if (index > 0) {
        return <RkButton
          rkType='clear'
          style={styles.menu}
          onPress={() => {
            Actions.pop()
          }}>
          <RkText rkType='awesome hero' style={styles.backButton}>{FontAwesome.chevronLeft}</RkText>
        </RkButton>
      }
    };

    return (
      <View style={[{width}, styles.left]}>
        {renderLeftContent()}
      </View>
    )
  }

  _renderTitle(title, headerTitle) {
    if (headerTitle) {
      return (
        <View style={styles.title} onLayout={onLayout}>{headerTitle}</View>);
    }

    const onLayout = (e) => {
      this.setState({
        width: e.nativeEvent.layout.width,
      });
    };

    return (
      <View style={styles.title} onLayout={onLayout}>
        <RkText style={styles.titleText}>{title}</RkText>
      </View>
    )
  }

  render() {
    let options = this.props.headerProps.getScreenDetails(this.props.headerProps.scene).options;
    return (
      <View style={styles.layout}>
        <View style={styles.container}>
          {this._renderTitle(options.title, options.headerTitle)}
          {this._renderLeft(options.headerLeft)}
          {this._renderRight(options.headerRight)}
        </View>
      </View>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  layout: {
    backgroundColor: theme.colors.screen.nav,
    paddingTop: UIConstants.StatusbarHeight,
    borderBottomColor: theme.colors.border.base
  },
  container: {
    flexDirection: 'row',
    height: UIConstants.AppbarHeight,

  },
  left: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center'
  },
  right: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center'
  },
  title: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleText: {
    fontSize:20,
    color: theme.colors.text.nav
  },
  menu: {
    width: 40
  },
  backButton: {
    color: theme.colors.text.nav
  }
}));