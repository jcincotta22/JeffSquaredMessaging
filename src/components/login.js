
import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  StyleSheet,
  Platform,
  Keyboard,
  KeyboardAvoidingView
} from 'react-native';
import APP_ID from './keys.js';
import Button from './button'
import SendBird from 'sendbird';

const LoginView = Platform.select({
  ios: () => KeyboardAvoidingView,
  android: () => View,
})();
var sb = null;

export default class Login extends Component {
  constructor(props) {
   super(props);
   this.state = {
     userId: '',
      username: '',
      connectLabel: 'CONNECT',
      buttonDisabled: true,
      errorMessage: ''
   };
   this.onPress = this.onPress.bind(this);
   this._onPressOpenChannel = this._onPressOpenChannel.bind(this);
   this._onPressGroupChannel = this._onPressGroupChannel.bind(this);
 }

 onPress(){
   Keyboard.dismiss();

   if (!this.state.buttonDisabled) {
      this._onPressDisconnect();
      return;
    }

   if (this.state.username.trim().length == 0 || this.state.userId.trim().length == 0) {
      this.setState({
        userId: '',
        username: '',
        errorMessage: 'Must Supply a User ID and Nickname.'
      });
      return;
    }

   sb = SendBird.getInstance();
   var _SELF = this;

   sb.connect(_SELF.state.userId, function(user, error) {
     console.log('successfully connected', sb)
     if (error) {
        _SELF.setState({
          userId: '',
          username: '',
          errorMessage: 'Login Error'
        });
        console.log(error);
        return;
      }
      if (Platform.OS === 'ios') {
       if (sb.getPendingAPNSToken()){
         sb.registerAPNSPushTokenForCurrentUser(sb.getPendingAPNSToken(), function(result, error){
           console.log("APNS TOKEN REGISTER AFTER LOGIN");
           console.log(result);
         });
       }
     } else {
       if (sb.getPendingGCMToken()){
         sb.registerGCMPushTokenForCurrentUser(sb.getPendingGCMToken(), function(result, error){
           console.log("GCM TOKEN REGISTER AFTER LOGIN");
           console.log(result);
         });
       }
     }
   sb.updateCurrentUserInfo(_SELF.state.username, '', function(response, error) {
        _SELF.setState({
          buttonDisabled: false,
          connectLabel: 'DISCONNECT',
          errorMessage: ''
        });
      });
  });
}

  _onPressOpenChannel() {
    this.props.navigator.push({name: 'openChannel'});
  }

  _onPressGroupChannel() {
    this.props.navigator.push({name: 'groupChannel'});
  }

  _onPressDisconnect() {
    sb.disconnect();
    this.setState({
      userId: '',
      username: '',
      errorMessage: '',
      buttonDisabled: true,
      connectLabel: 'CONNECT'
    });
  }

  _buttonStyle() {
  return {
    backgroundColor: '#6E5BAA',
    underlayColor: '#51437f',
    borderColor: '#6E5BAA',
    disabledColor: '#ababab',
    textColor: '#ffffff'
  }
}

  render() {
    return (
      <LoginView behavior='padding' style={styles.container} >
          <View style={styles.loginContainer}>
            <TextInput
              style={styles.input}
              value={this.state.userId}
              onChangeText={(text) => this.setState({userId: text})}
              onSubmitEditing={Keyboard.dismiss}
              placeholder={'Enter User ID'}
              maxLength={12}
              multiline={false}
              />
            <TextInput
              style={[styles.input, {marginTop: 10}]}
              value={this.state.username}
              onChangeText={(text) => this.setState({username: text})}
              onSubmitEditing={Keyboard.dismiss}
              placeholder={'Enter User Nickname'}
              maxLength={12}
              multiline={false}
              />

            <Button
              text={this.state.connectLabel}
              style={this._buttonStyle()}
              onPress={this.onPress}
            />

            <Text style={styles.errorLabel}>{this.state.errorMessage}</Text>

            <Button
              text={'Open Channel'}
              style={this._buttonStyle()}
              disabled={this.state.buttonDisabled}
              onPress={this._onPressOpenChannel}
            />
            <Button
              text={'Group Channel'}
              style={this._buttonStyle()}
              disabled={this.state.buttonDisabled}
              onPress={this._onPressGroupChannel}
            />
          </View>
        </LoginView>
    );
  }

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  input: {
    width: 250,
    color: '#555555',
    padding: 10,
    height: 50,
    borderColor: '#6E5BAA',
    borderWidth: 1,
    borderRadius: 4,
    alignSelf: 'center',
    backgroundColor: '#ffffff'
  },
  errorLabel: {
    color: '#ff0200',
    fontSize: 13,
    marginTop: 10,
    width: 250
  }
});
