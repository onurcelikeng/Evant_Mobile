import React from 'react';
import { ScrollView, Image, View, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { RkCard, RkText, RkStyleSheet } from 'react-native-ui-kitten';
import {Actions} from 'react-native-router-flux';
import * as Animatable from 'react-native-animatable';
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import { Header } from 'react-navigation';

import {data} from '../../data';
import {Avatar} from '../../components/avatar';
import {SocialBar} from '../../components/socialBar';

let moment = require('moment');

const MIN_HEIGHT = Header.HEIGHT;
const MAX_HEIGHT = 250;


export default class EventDetail extends React.Component {
  constructor(props) {
    super(props);
    let {params} = this.props.navigation.state;
    let id = params ? params.id : 1;
    this.data = data.getArticle(id);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <HeaderImageScrollView
          maxHeight={MAX_HEIGHT}
          minHeight={MIN_HEIGHT}
          maxOverlayOpacity={0.6}
          minOverlayOpacity={0.3}
          fadeOutForeground
          renderHeader={() => <Image rkCardImg style={styles.image} source={this.data.photo}/>}
          renderFixedForeground={() => (
            <Animatable.View
              style={styles.navTitleView}
              ref={navTitleView => {
                this.navTitleView = navTitleView;
              }}
            >
              <RkText style={styles.navTitle}>
                {this.data.header}
              </RkText>
            </Animatable.View>
          )}
          renderForeground={() => (
            <View style={styles.titleContainer}>
              <RkText style={styles.imageTitle}>{this.data.header}</RkText>
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
                <RkText style={styles.title} rkType='header4'>{this.data.header}</RkText>
                <RkText rkType='secondary2 hintColor'>{moment().add(this.data.time, 'seconds').fromNow()}</RkText>
              </View>
              <TouchableOpacity onPress={() => { Actions.otherProfile({id: this.data.user.id}) }}>
                <Avatar rkType='circle' img={this.data.user.photo}/>
              </TouchableOpacity>
            </View>
            </RkCard>
          </TriggeringView>
          <RkCard rkType='article'>
            <View rkCardContent>
              <SocialBar/>
            </View>
            <View rkCardContent>
              <View>
                <RkText rkType='primary3 bigLine'>{this.data.text}</RkText>
              </View>
            </View>
          </RkCard>
        </HeaderImageScrollView>
      </View>
    )
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
  }
}));


{/*<ScrollView style={styles.root}>
<RkCard rkType='article'>
  <Image rkCardImg source={this.data.photo}/>
  <View rkCardHeader>
    <View>
      <RkText style={styles.title} rkType='header4'>{this.data.header}</RkText>
      <RkText rkType='secondary2 hintColor'>{moment().add(this.data.time, 'seconds').fromNow()}</RkText>
    </View>
    <TouchableOpacity onPress={() => { Actions.otherProfile({id: this.data.user.id}) }}>
      <Avatar rkType='circle' img={this.data.user.photo}/>
    </TouchableOpacity>
  </View>
  <View rkCardContent>
    <SocialBar/>
  </View>
  <View rkCardContent>
    <View>
      <RkText rkType='primary3 bigLine'>{this.data.text}</RkText>
    </View>
  </View>
</RkCard>
</ScrollView>*/}