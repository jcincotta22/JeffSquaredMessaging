
import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  ListView,
  TouchableHighlight,
  StyleSheet
} from 'react-native';
import APP_ID from './keys.js';
const PULLDOWN_DISTANCE = 40;

import SendBird from 'sendbird';

export default React.createClass({
  getInitialState: function() {
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      channelList: [],
      dataSource: ds.cloneWithRows([]),
      page: 0,
      next: 0,
      channelName: ''
    };
  },
  componentWillMount: function() {
    let username = 'Jeff'
    let sb = new SendBird({
      appId: APP_ID
    });
    sb.connect(username, function(user, error) { console.log('success', sb)});
    sb.OpenChannel.createChannel("Test", "Test", "none", function (channel, error) {
      if (error) {
          console.error(error);
          return;
      }
      console.log("channel:", channel);
    });

    let openChannelListQuery = sb.OpenChannel.createOpenChannelListQuery();
    openChannelListQuery.next(function (response, error) {
      if (error) {
          console.log("Error:", error);
          return;
      }
      console.log(openChannelListQuery);
    });
    // this.getChannelList(1);
  },
  render: function() {
      return (
        <View style={styles.container}>
          <View style={styles.listContainer}>
            <ListView
              dataSource={this.state.dataSource}
              renderRow={(rowData) =>
                <TouchableHighlight onPress={() => this.onChannelPress(rowData.channel_url)}>
                  <View style={styles.listItem}>
                    <View style={styles.listIcon}>
                      <Image style={styles.channelIcon} source={{uri: rowData.cover_img_url}} />
                    </View>
                    <View style={styles.listInfo}>
                      <Text style={styles.titleLabel}># {rowData.name}</Text>
                      <Text style={styles.memberLabel}>{rowData.member_count} members</Text>
                    </View>
                  </View>
                </TouchableHighlight>
              }
              onEndReached={() => this.getChannelList(this.state.next)}
              onEndReachedThreshold={PULLDOWN_DISTANCE}
            />
          </View>
        </View>
      );
    },
    onChannelPress: function(url) {
       console.log(url);
    },
    getChannelList: function(page) {
    if (page == 0) {
      return;
    }
    SendBird.getChannelList({
      page: page,
      limit: 20,
      successFunc : (data) => {
        this.setState({channelList: this.state.channelList.concat(data.channels)}, () => {
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.state.channelList),
            page: data.page,
            next: data.next
          });
        });
      },
      errorFunc: (status, error) => {
        console.log(status, error);
      }
    });
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#6E5BAA'
  }
});
