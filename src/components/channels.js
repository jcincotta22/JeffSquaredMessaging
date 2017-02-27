
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
let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
console.log("datasource:", ds)

class Channels extends Component {
  constructor(props) {
   super(props);
   this.state = {
     channelList: [],
     dataSource: ds.cloneWithRows([]),
     page: 0,
     next: 0,
     channelName: ''
   };
   this.onChannelPress = this.onChannelPress.bind(this);
   this.getChannelList = this.getChannelList.bind(this);
 }

 onChannelPress(url) {
    console.log(url);
 }

 getChannelList(page) {
   if (page == 0) {
     return;
   }
   SendBird.getChannelList({
     page: page,
     limit: 20,
     successFunc: (data) => {
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


  componentWillMount() {
    console.log('mounted')
    let sb = new SendBird({
      appId: APP_ID,
    });

    sb.connect("Jeff", function(user, error) {

      console.log('success', sb)
      sb.OpenChannel.createChannel("Test2", "Test2", "none", function (channel, error) {
        if (error) {
            console.error(error);
            return;
        }
        console.log("Test channel:", channel);
      });


    });
  }

    // let openChannelListQuery = sb.OpenChannel.createOpenChannelListQuery();
    // openChannelListQuery.next(function (response, error) {
    //   if (error) {
    //       console.log("Error:", error);
    //       return;
    //   }
    //   console.log(openChannelListQuery);
    // });
    // let openChannelListQuery = this.OpenChannel.createOpenChannelListQuery();

  render() {
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
    }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#ffffff'
  },
  listContainer: {
    flex: 11,
    justifyContent: 'center',
    alignItems: 'stretch',
    marginTop: 10
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f8fc',
    borderBottomWidth: 0.5,
    borderColor: '#D0DBE4',
    padding: 5
  },
  listIcon: {
    justifyContent: 'flex-start',
    paddingLeft: 10,
    paddingRight: 15
  },
  channelIcon: {
    width: 30,
    height: 30
  },
  listInfo: {
    flex: 1,
    justifyContent: 'flex-start'
  },
  titleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#60768b',
  },
  memberLabel: {
    fontSize: 13,
    fontWeight: '400',
    color: '#abb8c4',
  }
});

export default Channels;
