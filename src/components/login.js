
import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  StyleSheet
} from 'react-native';
import APP_ID from './keys.js';
import SendBird from 'sendbird';


export default React.createClass({
  getInitialState: function() {
    return {
      username: ''
    };
  },
  render: function() {
    return (
      <View style={styles.container}>
        <View style={styles.loginContainer}>
          <TextInput
            style={styles.input}
            value={this.state.username}
            onChangeText={(text) => this.setState({username: text})}
            placeholder={'Enter User Nickname'}
            maxLength={12}
            multiline={false}
            />

          <TouchableHighlight
            style={styles.button}
            underlayColor={'#328FE6'}
            onPress={this.onPress}
            >
            <Text style={styles.label}>LOGIN</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  },
  onPress: function() {
      let sb = new SendBird({
        appId: APP_ID,
      });
    sb.connect(this.state.username, function(user, error) {
      console.log('successfully connected', sb)
      sb.OpenChannel.createChannel("New Channel", "New Channel.com", "Data", function (channel, error) {
        if (error) {
          console.error(error);
          return;
        }
        console.log("Channel", channel);
      });


      sb.updateCurrentUserInfo("Test Nickname", "Test.com", function(response, error) {
        console.log("update:", sb.currentUser.nickname, sb);
      });
      var openChannelListQuery = sb.OpenChannel.createOpenChannelListQuery();

      openChannelListQuery.next(function (response, error) {
        if (error) {
          console.log(error);
          return;
        }

        console.log("Open channel:", response);
      });
    });
    // sb.updateCurrentUserInfo(this.state.username, function(response, error) {
    this.props.navigator.push({ name: 'channels' });
    //     console.log("user name:", this.state.username);
    // });

  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#6E5BAA'
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: 250,
    color: '#555555',
    padding: 10,
    height: 50,
    borderColor: '#32C5E6',
    borderWidth: 1,
    borderRadius: 4,
    alignSelf: 'center',
    backgroundColor: '#ffffff'
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    height: 50,
    borderColor: '#328FE6',
    padding: 10,
    marginTop: 10,
    backgroundColor: '#32c5e6'
  },
  label: {
    width: 230,
    flex: 1,
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff'
  }
});
