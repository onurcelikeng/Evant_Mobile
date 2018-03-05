import React from 'react';
import { ScrollView, Image, View, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { RkCard, RkText, RkStyleSheet, RkButton, RkModalImg } from 'react-native-ui-kitten';
import {Actions} from 'react-native-router-flux';
import Svg, { Circle, Ellipse, G, LinearGradient, RadialGradient, Line, Path, Polygon, Polyline, Rect, Symbol, Text, Use, Defs, Stop } from 'react-native-svg';
import * as Animatable from 'react-native-animatable';
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import { Header } from 'react-navigation';

import DropdownHolder from '../../providers/dropdownHolder';
import ContentLoader from '../../config/contentLoader'
import {scale, scaleModerate, scaleVertical} from '../../utils/scale';
import * as eventOperationProvider from '../../providers/eventOperations';
import * as eventProvider from '../../providers/events';
import Login from '../login';
import {data} from '../../data';
import {Avatar} from '../../components/avatar';
import {SocialBar} from '../../components/socialBar';

let moment = require('moment');

const MIN_HEIGHT = Header.HEIGHT;
const MAX_HEIGHT = 250;
let {height, width} = Dimensions.get('window');

export default class EventDetail extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      join: false,
      isLoading: true
    }

    let {params} = this.props.navigation.state;
    this.id = params ? params.id : 1;
    console.log(this.id);
    if(this.id == 1) this.setState({data: this.props.obj});
    else this.getEvent(this.id);

    this.user = data.getUser();
  }

  componentDidMount() {
    if(this.id == 1)
      this.joinStatus();
  }

  getEvent(id) {
    console.log(id);
    return eventProvider.getEvent(id)
    .then((responseJson) => {
      console.log(responseJson);
      if(responseJson.isSuccess) {
        this.setState({data: responseJson.data})
        this.joinStatus().then(() =>
          this.setState({isLoading: false})
        );    
      } else {
        DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
      }
    });
  }

  deleteEvent() {
    return eventProvider.deleteEvent(this.state.data.eventId)
    .then((responseJson) => {
      console.log(responseJson);
      if(responseJson.isSuccess) {
        DropdownHolder.getDropDown().alertWithType("success", "", responseJson.message);
      } else {
        DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
      }
    });
  }

  joinEvent() {
    console.log(this.state.data);
    return eventOperationProvider.joinEvent(this.state.data.eventId)
    .then((responseJson) => {
      console.log(responseJson);
      if(responseJson.isSuccess) {
        this.setState({join: true});
        DropdownHolder.getDropDown().alertWithType("success", "", responseJson.message);
      } else {
        DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
      }
    });
  }

  leaveEvent() {
    return eventOperationProvider.leaveEvent(this.state.data.eventId)
    .then((responseJson) => {
      console.log(responseJson);
      if(responseJson.isSuccess) {
        this.setState({join: false});
        DropdownHolder.getDropDown().alertWithType("success", "", responseJson.message);
      } else {
        DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
      }
    });
  }

  joinStatus() {
    console.log(this.state.data)
    return eventOperationProvider.joinStatus(this.state.data.eventId)
    .then((responseJson) => {
      this.setState({join: responseJson.isSuccess})
    })
  }

  followers() {
    return eventOperationProvider.followers(this.state.data.eventId)
    .then((responseJson) => {
      console.log(responseJson);
      this.setState({status: responseJson.data});
    });
  }

  _renderFooter(options) {
    return (
      <View style={styles.footer}>
        <RkButton rkType='clear contrast' onPress={options.closeImage}>Close</RkButton>
        <RkText rkType='header4'>{`${options.pageNumber}/${options.totalPages}`}</RkText>
      </View>
    );
  }

  render() {
    if (this.state.isLoading) {
			var width = require('Dimensions').get('window').width - 50;

			return (
			  <View style={{flex: 1, paddingTop: 20, backgroundColor: "#ffffff", alignItems: "center"}}>
          <ContentLoader height={70}>
            <Circle cx="30" cy="30" r="30"/>
            <Rect x="80" y="17" rx="4" ry="4" width={width - 80} height="13"/>
          </ContentLoader>
          <ContentLoader height={70}>
            <Circle cx="30" cy="30" r="30"/>
            <Rect x="80" y="17" rx="4" ry="4" width={width - 80} height="13"/>
          </ContentLoader>
          <ContentLoader height={70}>
            <Circle cx="30" cy="30" r="30"/>
            <Rect x="80" y="17" rx="4" ry="4" width={width - 80} height="13"/>
          </ContentLoader>
          <ContentLoader height={70}>
            <Circle cx="30" cy="30" r="30"/>
            <Rect x="80" y="17" rx="4" ry="4" width={width - 80} height="13"/>
          </ContentLoader>
			  </View>
			);
		} else {
      console.log(this.state.data)
      let button = null;
      if (this.state.data.user.userId == Login.getCurrentUser().userId) {
        button = <RkButton rkType='medium stretch rounded' style={styles.save} onPress={() => this.deleteEvent()}>DELETE</RkButton>;
      } else if(this.state.join == true){
        button = <RkButton rkType='medium stretch rounded' style={styles.save} onPress={() => this.leaveEvent()}>LEAVE</RkButton>;
      } else {
        button = <RkButton rkType='medium stretch rounded' style={styles.save} onPress={() => this.joinEvent()}>JOIN</RkButton>;
      }

      return (
        <View style={{ flex: 1 }}>
          <HeaderImageScrollView
            maxHeight={MAX_HEIGHT}
            minHeight={MIN_HEIGHT}
            maxOverlayOpacity={0.6}
            minOverlayOpacity={0.3}
            fadeOutForeground
            renderHeader={() => <Image rkCardImg style={styles.image} source={{uri: this.state.data.photoUrl}}/>}
            renderFixedForeground={() => (
              <Animatable.View
                style={styles.navTitleView}
                ref={navTitleView => {
                  this.navTitleView = navTitleView;
                }}
              >
                <RkText style={styles.navTitle}>
                  {this.state.data.title}
                </RkText>
              </Animatable.View>
            )}
            renderTouchableFixedForeground={() => (
              <RkModalImg
                  style={{width: width, height: MAX_HEIGHT}}
                  renderFooter={this._renderFooter}
                  source={this.user.images}/>
            )}
            renderForeground={() => (
              <View style={styles.titleContainer}>
                <RkText style={styles.imageTitle}>{this.state.data.title}</RkText>
              </View>
            )}
          >
            <TriggeringView
              onHide={() => this.navTitleView.fadeInUp(200)}
              onDisplay={() => this.navTitleView.fadeOut(100)}
            >
              <RkCard rkType='article'>
                <View rkCardHeader>
                  <View>
                    <RkText style={styles.title} rkType='header4'>{this.state.data.title}</RkText>
                    <RkText rkType='secondary2 hintColor'>{moment(this.state.data.start).fromNow()}</RkText>
                  </View>
                  <TouchableOpacity style={{alignItems: 'center', flexDirection: 'row', marginRight: 16}} onPress={() => { if(this.state.data.user.userId == Login.getCurrentUser().userId) Actions.profile(); else Actions.otherProfile({id: this.state.data.user.userId}) }}>
                    <Avatar img={this.state.data.user.photoUrl} rkType='circle'/>
                  </TouchableOpacity>
                </View>
              </RkCard>
            </TriggeringView>
            <RkCard rkType='article'>
              <View rkCardContent>
                <SocialBar id={this.state.data.eventId} comments={this.state.data.totalComments} goings={this.state.data.totalGoings}/>
              </View>
              <View rkCardContent>
                <View>
                  <RkText rkType='primary3 bigLine'>{this.state.data.description}</RkText>
                </View>
              </View>
              <View style={styles.buttons}>
                {button} 
              </View>
            </RkCard>
          </HeaderImageScrollView>
        </View>
      )
    }  
  }
}

let styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base
  },
  image: {
    height: MAX_HEIGHT,
    width: Dimensions.get('window').width,
    alignSelf: 'stretch',
    resizeMode: 'cover',
  },
  title: {
    fontSize: 20,
  },
  name: {
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    backgroundColor: 'white',
  },
  imageStyle: {
    width: null,
  height: null,
  resizeMode: 'cover',
  flex: 1
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionContent: {
    fontSize: 16,
    textAlign: 'justify',
  },
  keywords: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  keywordContainer: {
    backgroundColor: '#999999',
    borderRadius: 10,
    margin: 10,
    padding: 10,
  },
  keyword: {
    fontSize: 16,
    color: 'white',
  },
  titleContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageTitle: {
    color: 'white',
    backgroundColor: 'transparent',
    fontSize: 24,
  },
  navTitleView: {
    height: MIN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
    opacity: 0,
  },
  navTitle: {
    color: 'white',
    fontSize: 21,
    backgroundColor: 'transparent',
  },
  sectionLarge: {
    height: 600,
  },
  save: {
    marginVertical: 9,
    backgroundColor: '#FF5E20',
    marginHorizontal: 10,
    flex: -1
  },
  buttons: {
    paddingHorizontal: 17,
    paddingBottom: scaleVertical(22),
    flex: 1,
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex:1,
    marginHorizontal: 10
  }
}));