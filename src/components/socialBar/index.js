import React from 'react';
import { View } from 'react-native';
import { RkText, RkButton, RkComponent } from 'react-native-ui-kitten';
import {Actions} from 'react-native-router-flux';

import {FontAwesome} from '../../assets/icon';

export class SocialBar extends RkComponent {
  componentName = 'SocialBar';
  typeMapping = {
    container: {},
    section: {},
    icon: {},
    label: {}
  };

  constructor(props) {
    super(props);

    //this.likes = this.props.likes || 18;
    this.comments = this.props.comments || 62;
    this.shares = this.props.shares || 137;
    this.id = this.props.id || 1;
    this.state = {
      //likes: this.likes,
      comments: this.comments,
      shares: this.shares,
    }
  }

  render() {
    let {container, section, icon, label} = this.defineStyles();

    //let likes = this.state.likes + (this.props.showLabel ? ' Likes' : '');
    let comments = this.state.comments + /*(this.props.showLabel ?*/ ' Comments' /*: '')*/;
    let shares = this.state.shares + /*(this.props.showLabel ?*/ ' Goings' /*: '')*/;

    /*let updateLikes = () => {
      if (this.state.likes === this.likes)
        this.setState({likes: this.state.likes + 1});
      else
        this.setState({likes: this.likes});
    };

    let updateComments = () => {
      if (this.state.comments === this.comments)
        this.setState({comments: this.state.comments + 1});
      else
        this.setState({comments: this.comments});
    };

    let updateShares = () => {
      if (this.state.shares === this.shares)
        this.setState({shares: this.state.shares + 1});
      else
        this.setState({shares: this.shares});
    };*/

    return (
      <View style={container}>
        {/*<View style={section}>
          <RkButton rkType='clear'>
            <RkText rkType='awesome primary' style={icon}>{FontAwesome.heart}</RkText>
            <RkText rkType='primary primary4' style={label}>{likes}</RkText>
          </RkButton>
        </View>*/}
        <View style={section}>
          <RkButton rkType='clear' onPress={() => { Actions.goingList({id: this.id}) }}>
            <RkText rkType='awesome hintColor' style={icon}>{FontAwesome.user}</RkText>
            <RkText rkType='primary4 hintColor' style={label}>{shares}</RkText>
          </RkButton>
        </View>
        <View style={section}>
          <RkButton rkType='clear' onPress={() => { Actions.comments({id: this.id}) }}>
            <RkText rkType='awesome hintColor' style={icon}>{FontAwesome.commentOpen}</RkText>
            <RkText rkType='primary4 hintColor' style={label}>{comments}</RkText>
          </RkButton>
        </View>
      </View>
    )
  }
}