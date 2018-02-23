import React, { Component } from 'react';
import { Scene, Router, Actions, Reducer, Overlay, Tabs, Stack } from 'react-native-router-flux';
import { Platform, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { RkText, RkButton, RkStyleSheet, RkTextInput } from 'react-native-ui-kitten';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import { withRkTheme } from 'react-native-ui-kitten'

import Login from './pages/login';
import Signup from './pages/signup';
import { SplashScreen } from './pages/splash';
import Events from './pages/event/events';
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
                        <Stack key="root" hideNavBar={true}>                       
                            <Scene key="login" component={Login} title="Login" initial={true}/>
                            <Scene key="signup" component={Signup} title="Register"/>
                        </Stack>
                        <Stack key="home" hideNavBar={true} headerMode="screen">
                            <Tabs 
                                key="tabbar"
                                showLabel={false}
                                backToInitial={true}
                                lazy
                            >
                                <Stack
                                    key="tab1"
                                    title="Events"
                                    tabBarLabel="Events"
                                    icon={TabIcon}
                                    initial={true}
                                >
                                    <Scene
                                        key="events"
                                        component={withRkTheme(Events)}
                                        title="Events"
                                        panHandlers={null}
                                        initial={true}
                                        navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                    />
                                    <Scene
                                        hideNavBar={true}
                                        key="eventDetail"
                                        component={withRkTheme(EventDetail)}
                                        title="Event"
                                        navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                    />
                                    <Scene
                                        key="goingList"
                                        component={withRkTheme(GoingList)}
                                        title="Goings"
                                        navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                    />
                                    <Scene
                                        key="otherProfile"
                                        component={withRkTheme(OtherProfile)}
                                        title="Profile"
                                        navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                    />
                                    <Scene
                                        key="profile"
                                        component={withRkTheme(Profile)}
                                        title="Profile"
                                        onRight={() => Actions.options()}
                                        rightTitle={() => <RkText style={{fontSize: 25}} rkType='awesome'>{ FontAwesome.setting }</RkText> }
                                        navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                    />
                                    <Scene
                                        key="followerList"
                                        component={withRkTheme(FollowerList)}
                                        title="Followers"
                                        navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                    />
                                    <Scene
                                        key="followingList"
                                        component={withRkTheme(FollowingList)}
                                        title="Followings"
                                        navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                    />
                                    <Scene
                                        key="comments"
                                        title="Comments"
                                        component={withRkTheme(Comments)}
                                        hideTabBar="true"
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
                                        initial={true}
                                        panHandlers={null}
                                    />
                                    <Scene
                                        hideNavBar={true}
                                        key="eventDetail"
                                        component={withRkTheme(EventDetail)}
                                        title="Event"
                                        navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                    />
                                    <Scene
                                        key="goingList"
                                        component={withRkTheme(GoingList)}
                                        title="Goings"
                                        navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                    />
                                    <Scene
                                        key="otherProfile"
                                        component={withRkTheme(OtherProfile)}
                                        title="Profile"
                                        navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                    />
                                    <Scene
                                        key="followerList"
                                        component={withRkTheme(FollowerList)}
                                        title="Followers"
                                        navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                    />
                                    <Scene
                                        key="followingList"
                                        component={withRkTheme(FollowingList)}
                                        title="Followings"
                                        navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                    />
                                    <Scene
                                        key="comments"
                                        title="Comments"
                                        component={withRkTheme(Comments)}
                                        hideTabBar="true"
                                        navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                    />
                                </Stack>
                                <Scene
                                    key="addEvent"
                                    title="Add Event"
                                    component={withRkTheme(AddEvent)}
                                    hideTabBar="true"
                                    clone
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
                                        navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                    />
                                    <Scene
                                        key="followerList"
                                        component={withRkTheme(FollowerList)}
                                        title="Followers"
                                        navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                    />
                                    <Scene
                                        key="followingList"
                                        component={withRkTheme(FollowingList)}
                                        title="Followings"
                                        navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                    />
                                    <Scene
                                        hideNavBar={true}
                                        key="eventDetail"
                                        component={withRkTheme(EventDetail)}
                                        title="Event"
                                        navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                    />
                                    <Scene
                                        key="goingList"
                                        component={withRkTheme(GoingList)}
                                        title="Goings"
                                        navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                    />
                                    <Scene
                                        key="comments"
                                        title="Comments"
                                        component={withRkTheme(Comments)}
                                        hideTabBar="true"
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
                                        onRight={() => Actions.options()}
                                        rightTitle={() => <RkText style={{fontSize: 25}} rkType='awesome'>{ FontAwesome.setting }</RkText> }
                                        panHandlers={null}
                                        initial={true}
                                        navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                    />
                                    <Scene
                                        key="followerList"
                                        component={withRkTheme(FollowerList)}
                                        title="Followers"
                                        navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                    />
                                    <Scene
                                        key="followingList"
                                        component={withRkTheme(FollowingList)}
                                        title="Followings"
                                        navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                    />
                                    <Scene
                                        key="otherProfile"
                                        component={withRkTheme(OtherProfile)}
                                        title="Profile"
                                        navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                    />
                                    <Scene
                                        key="options"
                                        component={withRkTheme(Options)}
                                        title="Options"
                                        navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                    />
                                    <Scene
                                        key="themes"
                                        component={withRkTheme(Themes)}
                                        title="Themes"
                                        navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                    />
                                    <Scene
                                        key="password"
                                        component={withRkTheme(ChangePassword)}
                                        title="Change Password"
                                        navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                    />
                                    <Scene
                                        key="editProfile"
                                        component={withRkTheme(EditProfile)}
                                        title="Edit Profile"
                                        navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                    />
                                    <Scene
                                        key="notificationSettings"
                                        component={withRkTheme(NotificationSettings)}
                                        title="Notification Settings"
                                        navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                    />
                                    <Scene
                                        key="goingList"
                                        component={withRkTheme(GoingList)}
                                        title="Goings"
                                        navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                    />
                                    <Scene
                                        key="comments"
                                        title="Comments"
                                        component={withRkTheme(Comments)}
                                        hideTabBar="true"
                                        navBar={(headerProps) => { return <ThemedNavigationBar headerProps={headerProps}/> }}
                                    />
                                </Stack>
                            </Tabs>
                        </Stack>
                    </Scene>
                </Overlay>
			</Router>
		)
	}
}