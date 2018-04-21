import React, { Component } from 'react';
import { Scene, Router, Actions, Reducer, Overlay, Tabs, Stack } from 'react-native-router-flux';
import { Platform, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { RkText, RkButton, RkStyleSheet, RkTextInput, RkTabView, withRkTheme } from 'react-native-ui-kitten';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';

import Login from './pages/login';
import Signup from './pages/signup';
import { SplashScreen } from './pages/splash';
import Dashboard from './pages/dashboard';
import Events from './pages/event/events';
import CategoryEvents from './pages/event/categoryEvents';
import EventDetail from './pages/event/eventDetail';
import Discover from './pages/event/discover';
import Comments from './pages/event/comments'; 
import AddEvent from './pages/event/addEvent'; 
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

import TabIcon from './components/tabIcon';
import { NavBar } from './components/navBar';
import { FontAwesome } from './assets/icon';

const styles =  RkStyleSheet.create(theme => ({
    container: {
      flex: 1, backgroundColor: 'transparent', justifyContent: 'center',
      alignItems: 'center',
    },
    menu: {
      width: 40
    },
    tabBarStyle: {
        backgroundColor: theme.colors.screen.base
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
let ThemedTabBar = withRkTheme(RkTabView);

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
                            <Scene key="login" component={Login} title="Login" initial/>
                            <Scene key="signup" component={Signup} title="Register"/>
                        </Stack>
                        <Scene 
                            tabs
                            key="tabbar"
                            showLabel={false}
                            lazy
                            hideNavBar
                            headerMode="screen"
                            tabBarStyle={styles.tabBarStyle}
                        >
                            <Stack
                                key="tab1"
                                title="Events"
                                tabBarLabel="Events"
                                icon={TabIcon}
                                onEnter={
                                    console.log("esd")
                                }
                                initial
                            >
                                <Scene
                                    key="events"
                                    component={withRkTheme(Events)}
                                    title="Events"
                                    initial={true}
                                    panHandlers={null}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="eventDetail"
                                    component={withRkTheme(EventDetail)}
                                    title="Event"
                                    hideNavBar={true}
                                    hideTabBar
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="dashboard"
                                    component={withRkTheme(Dashboard)}
                                    title="Dashboard"
                                    hideTabBar="true"
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="goingList"
                                    component={withRkTheme(GoingList)}
                                    title="Goings"
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="otherProfile"
                                    component={withRkTheme(OtherProfile)}
                                    title="Profile"
                                    hideNavBar={true}
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="profile"
                                    component={withRkTheme(Profile)}
                                    title="Profile"
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                    hideNavBar={true}
                                />
                                <Scene
                                    key="followerList"
                                    component={withRkTheme(FollowerList)}
                                    title="Followers"
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="followingList"
                                    component={withRkTheme(FollowingList)}
                                    title="Followings"
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="comments"
                                    title="Comments"
                                    component={withRkTheme(Comments)}
                                    hideTabBar="true"
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                            </Stack>
                            <Stack
                                key="tab2"
                                title="Discover"
                                tabBarLabel="Discover"
                                icon={TabIcon}
                            >
                                <Scene
                                    hideNavBar={true}
                                    key="discover"
                                    component={withRkTheme(Discover)}
                                    title="Discover"
                                    panHandlers={null}
                                    initial={true}
                                />
                                <Scene
                                    key="events"
                                    component={withRkTheme(Events)}
                                    title="Events"
                                    panHandlers={null}
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="categoryEvents"
                                    component={withRkTheme(CategoryEvents)}
                                    title="Category Events"
                                    panHandlers={null}
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    hideNavBar={true}
                                    hideTabBar
                                    key="eventDetail"
                                    component={withRkTheme(EventDetail)}
                                    title="Event"
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="goingList"
                                    component={withRkTheme(GoingList)}
                                    title="Goings"
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="otherProfile"
                                    component={withRkTheme(OtherProfile)}
                                    title="Profile"
                                    hideNavBar={true}
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="profile"
                                    component={withRkTheme(Profile)}
                                    title="Profile"
                                    hideNavBar={true}
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="followerList"
                                    component={withRkTheme(FollowerList)}
                                    title="Followers"
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="followingList"
                                    component={withRkTheme(FollowingList)}
                                    title="Followings"
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="comments"
                                    title="Comments"
                                    component={withRkTheme(Comments)}
                                    hideTabBar="true"
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                            </Stack>
                            <Scene
                                key="addEvent"
                                title="Add Event"
                                component={withRkTheme(AddEvent)}
                                hideTabBar="true"
                                clone
                                direction="vertical"
                                backToInitial
                                icon={TabIcon}
                                navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                            />
                            <Stack
                                key="tab4"
                                title="Notifications"
                                tabBarLabel="Notifications"
                                icon={TabIcon}
                            >
                                <Scene
                                    key="notifications"
                                    component={withRkTheme(Notifications)}
                                    title="Notifications"
                                    initial={true}
                                    panHandlers={null}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="otherProfile"
                                    component={withRkTheme(OtherProfile)}
                                    title="Profile"
                                    hideNavBar={true}
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="followerList"
                                    component={withRkTheme(FollowerList)}
                                    title="Followers"
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="followingList"
                                    component={withRkTheme(FollowingList)}
                                    title="Followings"
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    hideNavBar={true}
                                    hideTabBar
                                    key="eventDetail"
                                    component={withRkTheme(EventDetail)}
                                    title="Event"
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="goingList"
                                    component={withRkTheme(GoingList)}
                                    title="Goings"
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="comments"
                                    title="Comments"
                                    component={withRkTheme(Comments)}
                                    hideTabBar="true"
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                            </Stack>
                            <Stack
                                key="tab5"
                                title="Profile"
                                tabBarLabel="Profile"
                                icon={TabIcon}
                            >
                                <Scene
                                    key="profile"
                                    component={withRkTheme(Profile)}
                                    title="Profile"
                                    initial={true}
                                    hideNavBar={true}
                                    panHandlers={null}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="followerList"
                                    component={withRkTheme(FollowerList)}
                                    title="Followers"
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="followingList"
                                    component={withRkTheme(FollowingList)}
                                    title="Followings"
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="otherProfile"
                                    component={withRkTheme(OtherProfile)}
                                    title="Profile"
                                    hideNavBar={true}
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    hideNavBar={true}
                                    hideTabBar
                                    key="eventDetail"
                                    component={withRkTheme(EventDetail)}
                                    title="Event"
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="options"
                                    component={withRkTheme(Options)}
                                    title="Options"
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="themes"
                                    component={withRkTheme(Themes)}
                                    title="Themes"
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="password"
                                    component={withRkTheme(ChangePassword)}
                                    title="Change Password"
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="editProfile"
                                    component={withRkTheme(EditProfile)}
                                    title="Edit Profile"
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="notificationSettings"
                                    component={withRkTheme(NotificationSettings)}
                                    title="Notification Settings"
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="timelineSettings"
                                    component={withRkTheme(TimelineSettings)}
                                    title="Timeline Settings"
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="goingList"
                                    component={withRkTheme(GoingList)}
                                    title="Goings"
                                    backToInitial={true}
                                    navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                />
                                <Scene
                                    key="comments"
                                    title="Comments"
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