import React from 'react';
import { ScrollView, Image, View, TouchableOpacity, Dimensions, RefreshControl, StatusBar, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { RkCard, RkText, RkStyleSheet, RkButton, RkModalImg } from 'react-native-ui-kitten';
import {Actions} from 'react-native-router-flux';
import Svg, { Circle, Ellipse, G, LinearGradient, RadialGradient, Line, Path, Polygon, Polyline, Rect, Symbol, Text, Use, Defs, Stop } from 'react-native-svg';
import * as Animatable from 'react-native-animatable';
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import { Header } from 'react-navigation';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import UpdateEvent from './updateEvent';
import {FontAwesome} from '../../assets/icon';
import style, { colors } from '../../components/slider/index.style';
import { sliderWidth, itemWidth } from '../../components/slider/sliderEntry.style';
import SliderEntry from '../../components/slider/sliderEntry';
import DropdownHolder from '../../providers/dropdownHolder';
import ContentLoader from '../../config/contentLoader'
import {scale, scaleModerate, scaleVertical} from '../../utils/scale';
import * as eventOperationProvider from '../../providers/eventOperations';
import * as eventProvider from '../../providers/events';
import Login from '../login';
import {data} from '../../data';
import {Avatar} from '../../components/avatar';
import {SocialBar} from '../../components/socialBar';
import { formatDate } from '../../utils/momentjs';
import {strings} from '../../locales/i18n'

let moment = require('moment');

const MIN_HEIGHT = Header.HEIGHT;
const MAX_HEIGHT = 250;
let {height, width} = Dimensions.get('window');

export default class EventDetail extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      join: false,
      isRefreshing: false,
      isLoading: true,
      slider1ActiveSlide: 0,
      modal: false,
    }

    this.onRefresh = this._onRefresh.bind(this);
    let {params} = this.props.navigation.state;
    this.id = params ? params.id : 1;
    if(this.id == 1) this.setState({data: this.props.obj});
    else this.getEvent(this.id);

    this.user = data.getUser();
  }

  componentDidMount() {
    if(this.id == 1)
      this.joinStatus();
  }

  renderModal() {
		return (
				<Modal
					animationType={"slide"}
					transparent={false}
					visible={this.state.modal}
					onRequestClose={() => {}}
				>
					<UpdateEvent data={this.state.data} onPress={() => this.setState({modal: false})} />
				</Modal>
		)
	}

  getSimilarEvents() {
		return eventProvider.getSimilarEvents(this.state.data.eventId)
		.then((responseJson) => {
      if(responseJson == null || responseJson == "" || responseJson == undefined) {
        DropdownHolder.getDropDown().alertWithType("error", "", strings("common.error_occured"));
      } else {
        console.log(responseJson);
        if(responseJson.isSuccess) {
          this.setState({
            isLoading: false,
            entries: responseJson.data,
          });
        } else {
          this.setState({
            isLoading: false,
            entries: [],
            });
        }
      }
		}).catch((err) => { this.setState({
      isLoading: false,
      entries: [],
      }); 
      console.log(err)});
	}

  getEvent(id) {
    return eventProvider.getEvent(id)
    .then((responseJson) => {
      if(responseJson == null || responseJson == "" || responseJson == undefined) {
        DropdownHolder.getDropDown().alertWithType("error", "", strings("common.error_occured"));
      } else {
        if(responseJson.isSuccess) {
          console.log(responseJson.data);
          this.setState({data: responseJson.data})
          this.joinStatus().then(() => {
            this.getSimilarEvents();
          })   
        } else {
          DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
        }
      }
    }).catch((err) => {console.log(err)});
  }

  deleteEvent() {
    return eventProvider.deleteEvent(this.state.data.eventId)
    .then((responseJson) => {
      if(responseJson == null || responseJson == "" || responseJson == undefined) {
        DropdownHolder.getDropDown().alertWithType("error", "", strings("common.error_occured"));
      } else {
        if(responseJson.isSuccess) {
          DropdownHolder.getDropDown().alertWithType("success", "", responseJson.message);
        } else {
          DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
        }
      }
    }).catch((err) => {console.log(err)});
  }

  joinEvent() {
    return eventOperationProvider.joinEvent(this.state.data.eventId)
    .then((responseJson) => {
      if(responseJson == null || responseJson == "" || responseJson == undefined) {
        DropdownHolder.getDropDown().alertWithType("error", "", strings("common.error_occured"));
      } else {
        if(responseJson.isSuccess) {
          this.setState({join: true});
          DropdownHolder.getDropDown().alertWithType("success", "", responseJson.message);
        } else {
          DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
        }
      }
    }).catch((err) => {console.log(err)});
  }

  leaveEvent() {
    return eventOperationProvider.leaveEvent(this.state.data.eventId)
    .then((responseJson) => {
      if(responseJson == null || responseJson == "" || responseJson == undefined) {
        DropdownHolder.getDropDown().alertWithType("error", "", strings("common.error_occured"));
      } else {
        if(responseJson.isSuccess) {
          this.setState({join: false});
          DropdownHolder.getDropDown().alertWithType("success", "", responseJson.message);
        } else {
          DropdownHolder.getDropDown().alertWithType("error", "", responseJson.message);
        }
      }
    }).catch((err) => {console.log(err)});
  }

  joinStatus() {
    return eventOperationProvider.joinStatus(this.state.data.eventId)
    .then((responseJson) => {
      if(responseJson == null || responseJson == "" || responseJson == undefined) {
        DropdownHolder.getDropDown().alertWithType("error", "", strings("common.error_occured"));
      } else {
        this.setState({join: responseJson.isSuccess})
      }
    }).catch((err) => {console.log(err)});
  }

  followers() {
    return eventOperationProvider.followers(this.state.data.eventId)
    .then((responseJson) => {
      if(responseJson == null || responseJson == "" || responseJson == undefined) {
        DropdownHolder.getDropDown().alertWithType("error", "", strings("common.error_occured"));
      } else {
        this.setState({status: responseJson.data});
      }
    }).catch((err) => {console.log(err)});
  }

  _onRefresh(){
    this.setState({
			isRefreshing: true});
		this.getEvent(this.state.data.eventId).then(() => {
      this.setState({
        isRefreshing: false
      });
    });
	}

  _renderFooter(options) {
    return (
      <View style={styles.footer}>
        <RkButton rkType='clear contrast' onPress={options.closeImage}>{strings("detail.close")}</RkButton>
        <RkText rkType='header4'>{`${options.pageNumber}/${options.totalPages}`}</RkText>
      </View>
    );
  }

  _renderItem ({item, index}) {
    return <SliderEntry data={item} even={(index + 1) % 2 === 0} />;
}

  render() {
    const {modal} = this.state;
    const animating = this.state.isLoading;

    if (this.state.isLoading) {
			var width = require('Dimensions').get('window').width - 50;

			return (
			  <View style = {styles.indContainer}>
            <ActivityIndicator
            animating = {animating}
            color = '#bc2b78'
            size = "large"
            style = {styles.activityIndicator}/>
          </View>
			);
		} else if(this.state.data.length != 0) {
      let button = null;

      if (this.state.data.user.userId == Login.getCurrentUser().userId) {
        button = <TouchableOpacity onPress={() => { this.deleteEvent()}} activeOpacity={0.6}>
                  <Image style={{height: 25, width: 25, tintColor: "#707070", marginLeft: 15}} source={require("../../assets/icons/delete_outline.png")}/>
                </TouchableOpacity>;
      } else if(moment(this.state.data.finish).fromNow().toString().indexOf("ago") == -1) {
        if(this.state.join == true){
          button = <TouchableOpacity onPress={() => { this.leaveEvent()}} activeOpacity={0.6}>
                    <Image style={{height: 25, width: 25, marginLeft: 15}} source={require("../../assets/icons/heart.png")}/>
                  </TouchableOpacity>;
        } else {
          button = <TouchableOpacity onPress={() => { this.joinEvent()}} activeOpacity={0.6}>
                    <Image style={{height: 25, width: 25, marginLeft: 15}} source={require("../../assets/icons/heart_outline.png")}/>
                  </TouchableOpacity>;
        }
      } 

      return (
        <View style={{ flex: 1 }}>
          <HeaderImageScrollView
            maxHeight={MAX_HEIGHT}
            minHeight={MIN_HEIGHT}
            maxOverlayOpacity={0.6}
            minOverlayOpacity={0.3}
            fadeOutForeground
            refreshControl={<RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this.onRefresh}
            />}
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
              <View>
                <TouchableOpacity style={{width:40, height:40, marginTop:20, marginLeft: 10}} onPress={() => { Actions.pop(); }}>
                  <RkText rkType='awesome hero' style={styles.backButton}>{FontAwesome.chevronLeft}</RkText>
                </TouchableOpacity>
              </View>
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
                    <RkText rkType='secondary2 hintColor'>{"by " + this.state.data.user.firstName + " " + this.state.data.user.lastName}</RkText>
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
                <View style={{flex:1, flexDirection: "row", marginBottom: 10}}>
                  <Image style={{height: 20, width: 20, marginRight: 10, alignSelf: 'center'}} source={require("../../assets/icons/calendar.png")}/>
                  <View>
                    <View style={{flex:1, flexDirection: "row"}}>
                      <RkText rkType='secondary2 hintColor'>{moment(this.state.data.start).format('ll')}</RkText>
                      <RkText rkType='secondary2 hintColor'> - {moment(this.state.data.finish).format('ll')}</RkText>
                    </View>
                    <View style={{flex:1, flexDirection: "row"}}>
                      <RkText rkType='secondary2 hintColor'>{moment(this.state.data.start).format('LT')}</RkText>
                      <RkText rkType='secondary2 hintColor'> - {moment(this.state.data.finish).format('LT')}</RkText>
                    </View>
                  </View>
                </View>
                <View style={{flex:1, flexDirection: "row", marginBottom: 10}}>
                  <Image style={{height: 20, width: 20, marginRight: 10, alignSelf: 'center'}} source={require("../../assets/icons/place.png")}/>
                  <View style={{flex:1, flexDirection: "row", alignSelf: 'center', alignContent: 'center'}}>
                    <RkText rkType='secondary2 hintColor'>{this.state.data.address.town}, </RkText>
                    <RkText rkType='secondary2 hintColor'>{this.state.data.address.city}</RkText>
                  </View>
                </View>
                <View style={{flex:1, flexDirection: "row"}}>
                  <Image style={{height: 20, width: 20, marginRight: 10, alignSelf: 'center'}} source={{uri: this.state.data.category.iconUrl}}/>
                  <View style={{flex:1, flexDirection: "row", alignSelf: 'center', alignContent: 'center'}}>
                    <RkText rkType='secondary2 hintColor'>{this.state.data.category.name}</RkText>
                  </View>
                </View>
              </View>
              <View style={{paddingHorizontal: 10, paddingVertical: 5}}>
                <RkText rkType='secondary2 bigLine'>{this.state.data.description}</RkText>
              </View>
            </RkCard>
            <RkCard style={{backgroundColor: 'rgba(0, 0, 0, 0.05)'}}>
              <Carousel
                ref={c => this._slider1Ref = c}
                data={this.state.entries}
                renderItem={this._renderItem}
                sliderWidth={sliderWidth}
                itemWidth={itemWidth}
                inactiveSlideScale={0.94}
                inactiveSlideOpacity={0.7}
                containerCustomStyle={styles.slider}
                contentContainerCustomStyle={styles.sliderContentContainer}
                loop={true}
                loopClonesPerSide={2}
                onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
                activeAnimationType={'spring'}
                activeAnimationOptions={{
                    friction: 4,
                    tension: 40
                }}
              />
              <Pagination
                dotsLength={this.state.entries.length}
                activeDotIndex={this.state.slider1ActiveSlide}
                containerStyle={style.paginationContainer}
                dotColor={'rgba(255, 255, 255, 0.92)'}
                dotStyle={styles.paginationDot}
                inactiveDotColor="#000"
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
                carouselRef={this._slider1Ref}
                tappableDots={!!this._slider1Ref}
              />
            </RkCard>
          </HeaderImageScrollView>

          <View style={{backgroundColor: "#ffffff", height: 45, borderTopWidth: 1, borderTopColor: "#f2f2f2"}}>
            <View style={styles.buttons}>
              {
                this.state.data.user.userId == Login.getCurrentUser().userId && moment(this.state.data.finish).fromNow().toString().indexOf("ago") == -1 ?
                  <TouchableOpacity activeOpacity={0.6} onPress={() => { this.setState({modal: true}) }}>
                    <Image style={{height: 28, width: 28, marginLeft: 15}} source={require("../../assets/icons/edit.png")}/>
                  </TouchableOpacity>
                :
                <View></View>
              }
              {
                this.state.data.user.userId == Login.getCurrentUser().userId && Login.getCurrentUser().isBusiness ?
                  <TouchableOpacity activeOpacity={0.6} onPress={() => {Actions.dashboard({eventId: this.state.data.eventId})}}>
                    <Image style={{height: 28, width: 28, marginLeft: 15}} source={require("../../assets/icons/dashboard.png")}/>
                  </TouchableOpacity>
                :
                <View></View>
              }
              <TouchableOpacity activeOpacity={0.6}>
                <Image style={{height: 28, width: 28, marginLeft: 15}} source={require("../../assets/icons/share.png")}/>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.6} onPress={() => {Actions.comments({id: this.state.data.eventId})}}>
                <Image style={{height: 25, width: 25, marginLeft: 15}} source={require("../../assets/icons/comments.png")}/>
              </TouchableOpacity>
              {button} 
            </View>
          </View>
          {this.renderModal()}
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
    marginBottom: 3
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
  indContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
    marginTop: 70,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
	 },
	 activityIndicator: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: 30
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
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex:1,
    marginHorizontal: 10
  },
  backButton: {
    color: theme.colors.text.nav
  }
}));