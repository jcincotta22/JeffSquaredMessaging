
import React, { Component } from 'react';
import {
  AppRegistry,
  Navigator,
  StyleSheet,
  AppState,
  Platform
} from 'react-native';
import Login from './components/login';
import OpenChannel from './components/openChannel';
import CreateChannel from './components/createChannel';
import APP_ID from './components/keys';
import SendBird from 'sendbird';

const ROUTES = {
  login: Login,
  openChannel: OpenChannel
};

export default class Main extends Component {

  componentDidMount() {
    sb = new SendBird({appId: APP_ID});

    AppState.addEventListener('change', function(currentAppState){
      if (currentAppState === 'active') {
        console.log('foreground');
        sb.setForegroundState();
      } else if (currentAppState === 'background') {
        console.log('background');
        sb.setBackgroundState();
      }
    });
    // var Notifications = require('react-native-push-notification');
    // Notifications.configure({
    //     onRegister: function(token) {
    //         if (Platform.OS === 'ios') {
    //           sb.registerAPNSPushTokenForCurrentUser(token['token'], function(result, error){
    //             console.log("registerAPNSPushTokenForCurrentUser");
    //             console.log(result);
    //           });
    //         } else {
    //           sb.registerGCMPushTokenForCurrentUser(token['token'], function(result, error){
    //             console.log("registerAPNSPushTokenForCurrentUser");
    //             console.log(result);
    //           });
    //         }
    //     },
    //
    //     onNotification: function(notification) {
    //         console.log( 'NOTIFICATION:', notification );
    //     },
    //
    //     // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
    //     senderID: "984140644677",
    //
    //     // IOS ONLY (optional): default: all - Permissions to register.
    //     permissions: {
    //         alert: true,
    //         badge: true,
    //         sound: true
    //     },
    //
    //     // Should the initial notification be popped automatically
    //     // default: true
    //     popInitialNotification: true,
    //
    //     /**
    //       * (optional) default: true
    //       * - Specified if permissions (ios) and token (android and ios) will requested or not,
    //       * - if not, you must call PushNotificationsHandler.requestPermissions() later
    //       */
    //     requestPermissions: true,
    // });

  }

  render() {
    return (
      <Navigator
        initialRoute={{name: 'login'}}
        renderScene={this._renderScene}
        configureScene={() => {return Navigator.SceneConfigs.FloatFromRight;}}
        style={styles.container}
      />
    )
  }

  _renderScene(route, navigator) {
    var Component = ROUTES[route.name];
    return <Component route={route} navigator={navigator} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
