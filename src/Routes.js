import React, { Component } from 'react';
import { Scene, Router, Actions, Reducer, Overlay, Tabs, Stack } from 'react-native-router-flux';
import { Platform, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { RkText, RkButton, RkStyleSheet, RkTextInput, RkTabView, withRkTheme } from 'react-native-ui-kitten';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';

import Login from './pages/login';
import Signup from './pages/signup';
import { SplashScreen } from './pages/splash';
import Dashboard from './pages/dashboard';
import Gameboard from './pages/gameboard';
import Events from './pages/event/events';
import CategoryEvents from './pages/event/categoryEvents';
import EventDetail from './pages/event/eventDetail';
import Discover from './pages/event/discover';
import Comments from './pages/event/comments'; 
import AddEvent from './pages/event/addEvent'; 
import UpdateEvent from './pages/event/updateEvent'; 
import Notifications from './pages/notifications';
import Options from './pages/options/options';
import Themes from './pages/options/themes';
import EditProfile from './pages/options/editProfile';
import ChangePassword from './pages/options/changePassword';
import NotificationSettings from './pages/options/notificationSettings';
import TimelineSettings from './pages/options/timelineSettings';
import Profile from './pages/user/profile';
import FollowerList from './pages/user/followerList';
import FollowingList from './pages/user/followingList';
import GoingList from './pages/user/goingList';
import OtherProfile from './pages/user/otherProfile';
import Business from './pages/business/business';
import AddNewCard from './pages/business/addNewCard';

import TabIcon from './components/tabIcon';
import { NavBar } from './components/navBar';
import { FontAwesome } from './assets/icon';
import {strings} from './locales/i18n'

const styles =  RkStyleSheet.create(theme => ({
    container: {
      flex: 1, backgroundColor: 'transparent', justifyContent: 'center',
      alignItems: 'center',
    },
    menu: {
      width: 40
    },
    tabBarStyle: {
        backgroundColor: theme.colors.screen.base,
    }
}));

const reducerCreate = params => {
    const defaultReducer = new Reducer(params);
    return (state, action) => {
      console.log('ACTION:', action);
      return defaultReducer(state, action);
    };
};
  
const getSceneStyle = () => ({
    backgroundColor: '#F5FCFF',
    shadowOpacity: 1,
    shadowRadius: 3,
});

let ThemedNavigationBar = withRkTheme(NavBar);

export default class Routes extends React.Component {

	render() {
		return(
			<Router
                createReducer={reducerCreate}
                getSceneStyle={getSceneStyle}
                >
                <Overlay key="overlay">
                    <Scene>
                        <Scene key="splashScreen" component={SplashScreen} title="Splash" hideNavBar="true"/>
                        <Stack key="root" hideNavBar>                       
                            <Scene key="login" component={Login} title={strings("routes.login")} initial/>
                            <Scene key="signup" component={Signup} title={strings("routes.register")}/>
                        </Stack>
                        <Scene 
                            tabs
                            key="tabbar"
                            showLabel={false}
                            lazy
                            hideNavBar
                            tabBarStyle={styles.tabBarStyle}
                            headerMode="screen"
                        >
                            <Stack
                                key="tab1"
                                title={strings("routes.events")}
                                tabBarLabel="Events"
                                icon={TabIcon}
                                initial
                            >
                                <Scene
                                hideNavBar
                                    key="events"
                                    component={withRkTheme(Events)}
                                    title={strings("routes.events")}
                                    initial={true}
                                    panHandlers={null}
                                />
                                <Scene
                                    key="eventDetail"
                                    component={withRkTheme(EventDetail)}
                                    title={strings("routes.event")}
                                    hideNavBar={true}
                                    hideTabBar
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="dashboard"
                                    component={withRkTheme(Dashboard)}
                                    title={strings("routes.dashboard")}
                                    hideTabBar="true"
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="goingList"
                                    component={withRkTheme(GoingList)}
                                    title={strings("routes.goings")}
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="otherProfile"
                                    component={withRkTheme(OtherProfile)}
                                    title={strings("routes.profile")}
                                    hideNavBar={true}
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="profile"
                                    component={withRkTheme(Profile)}
                                    title={strings("routes.profile")}
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                    hideNavBar={true}
                                />
                                <Scene
                                    key="followerList"
                                    component={withRkTheme(FollowerList)}
                                    title={strings("routes.followers")}
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="followingList"
                                    component={withRkTheme(FollowingList)}
                                    title={strings("routes.followings")}
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="comments"
                                    title={strings("routes.comments")}
                                    component={withRkTheme(Comments)}
                                    hideTabBar="true"
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                            </Stack>
                            <Stack
                                key="tab2"
                                title={strings("routes.discover")}
                                tabBarLabel="Discover"
                                icon={TabIcon}
                            >
                                <Scene
                                    hideNavBar={true}
                                    key="discover"
                                    component={withRkTheme(Discover)}
                                    title={strings("routes.discover")}
                                    panHandlers={null}
                                    initial={true}
                                />
                                <Scene
                                    key="events"
                                    component={withRkTheme(Events)}
                                    title={strings("routes.events")}
                                    panHandlers={null}
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="categoryEvents"
                                    component={withRkTheme(CategoryEvents)}
                                    title={strings("routes.category_events")}
                                    panHandlers={null}
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    hideNavBar={true}
                                    hideTabBar
                                    key={strings("routes.event_detail")}
                                    component={withRkTheme(EventDetail)}
                                    title="Event"
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="goingList"
                                    component={withRkTheme(GoingList)}
                                    title={strings("routes.goings")}
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="otherProfile"
                                    component={withRkTheme(OtherProfile)}
                                    title={strings("routes.profile")}
                                    hideNavBar={true}
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="profile"
                                    component={withRkTheme(Profile)}
                                    title={strings("routes.profile")}
                                    hideNavBar={true}
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="followerList"
                                    component={withRkTheme(FollowerList)}
                                    title={strings("routes.followers")}
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="followingList"
                                    component={withRkTheme(FollowingList)}
                                    title={strings("routes.followings")}
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="comments"
                                    title={strings("routes.comments")}
                                    component={withRkTheme(Comments)}
                                    hideTabBar="true"
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                            </Stack>
                            <Stack
                                key="tab4"
                                title={strings("routes.notifications")}
                                tabBarLabel="Notifications"
                                icon={TabIcon}
                            >
                                <Scene
                                    key="notifications"
                                    component={withRkTheme(Notifications)}
                                    title={strings("routes.notifications")}
                                    initial={true}
                                    panHandlers={null}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="otherProfile"
                                    component={withRkTheme(OtherProfile)}
                                    title={strings("routes.profile")}
                                    hideNavBar={true}
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="followerList"
                                    component={withRkTheme(FollowerList)}
                                    title={strings("routes.followers")}
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="followingList"
                                    component={withRkTheme(FollowingList)}
                                    title={strings("routes.followings")}
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    hideNavBar={true}
                                    hideTabBar
                                    key="eventDetail"
                                    component={withRkTheme(EventDetail)}
                                    title={strings("routes.event")}
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="goingList"
                                    component={withRkTheme(GoingList)}
                                    title={strings("routes.goings")}
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="comments"
                                    title={strings("routes.comments")}
                                    component={withRkTheme(Comments)}
                                    hideTabBar="true"
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                            </Stack>
                            <Stack
                                key="tab5"
                                title={strings("routes.profile")}
                                tabBarLabel="Profile"
                                icon={TabIcon}
                            >
                                <Scene
                                    key="profile"
                                    component={withRkTheme(Profile)}
                                    title={strings("routes.profile")}
                                    initial={true}
                                    hideNavBar={true}
                                    panHandlers={null}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="followerList"
                                    component={withRkTheme(FollowerList)}
                                    title={strings("routes.followers")}
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="followingList"
                                    component={withRkTheme(FollowingList)}
                                    title={strings("routes.followings")}
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="otherProfile"
                                    component={withRkTheme(OtherProfile)}
                                    title={strings("routes.profile")}
                                    hideNavBar={true}
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="gameboard"
                                    component={withRkTheme(Gameboard)}
                                    title={strings("routes.gameboard")}
                                    hideTabBar="true"
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    hideNavBar={true}
                                    hideTabBar
                                    key="eventDetail"
                                    component={withRkTheme(EventDetail)}
                                    title={strings("routes.event")}
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="options"
                                    component={withRkTheme(Options)}
                                    title={strings("routes.options")}
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="business"
                                    component={withRkTheme(Business)}
                                    title={strings("routes.business")}
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="addCard"
                                    hideTabBar
                                    component={withRkTheme(AddNewCard)}
                                    title={strings("routes.add_card")}
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="password"
                                    component={withRkTheme(ChangePassword)}
                                    title={strings("routes.change")}
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="editProfile"
                                    component={withRkTheme(EditProfile)}
                                    title={strings("routes.edit")}
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="notificationSettings"
                                    component={withRkTheme(NotificationSettings)}
                                    title={strings("routes.notification_settings")}
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="timelineSettings"
                                    component={withRkTheme(TimelineSettings)}
                                    title={strings("routes.timeline_settings")}
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="goingList"
                                    component={withRkTheme(GoingList)}
                                    title={strings("routes.goings")}
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="comments"
                                    title={strings("routes.comments")}
                                    component={withRkTheme(Comments)}
                                    hideTabBar="true"
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                            </Stack>
                        </Scene>
                    </Scene>
                </Overlay>
			</Router>
		)
	}
}