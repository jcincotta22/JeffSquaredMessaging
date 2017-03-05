import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  ListView,
  StyleSheet
} from 'react-native'

import APP_ID from './keys';
import TopBar from './topBar';
import SendBird from 'sendbird';
const PULLDOWN_DISTANCE = 40;
var sb = null;

export default class Participants extends Component {
  constructor(props) {
    super(props);
    sb = SendBird.getInstance();
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      channel: props.route.channel,
      list: [],
      dataSource: ds.cloneWithRows([]),
      listQuery: props.route.channel.createParticipantListQuery()
    };
    this._getParticipantList = this._getParticipantList.bind(this);
    this._onBackPress = this._onBackPress.bind(this);
  }

  componentWillMount() {
    this._getParticipantList();
  }

  _getParticipantList() {
    var _SELF = this;
    this.state.listQuery.next(function(response, error) {
      if (error) {
        if (response.length == 0) {
          return;
        }
        console.log('Get Participant List Fail.', error);
        return;
      }

      _SELF.setState({list: _SELF.state.list.concat(response)}, () => {
        _SELF.setState({dataSource: _SELF.state.dataSource.cloneWithRows(_SELF.state.list)});
      });
    });
  }

  _onBackPress() {
    this.props.navigator.pop();
  }

  render() {
    return (
      <View style={styles.container}>
        <TopBar
          onBackPress={this._onBackPress}
          title='Participants'
           />

        <View style={styles.listContainer}>
          <ListView
            enableEmptySections={true}
            onEndReached={() => this._getParticipantList()}
            onEndReachedThreshold={PULLDOWN_DISTANCE}
            dataSource={this.state.dataSource}
            renderRow={(rowData) =>
              <View style={styles.listItem}>
                <View style={styles.listIcon}>
                  <Image style={styles.profileIcon} source={{uri: rowData.profileUrl.replace('http://', 'https://')}} />
                </View>
                <View style={styles.listInfo}>
                  <Text style={styles.memberLabel}>{rowData.nickname}</Text>
                </View>
              </View>
            }
          />
        </View>
      </View>
    )
  }
}

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
    alignItems: 'stretch'
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
  profileIcon: {
    width: 30,
    height: 30
  },
  listInfo: {
    flex: 1,
    justifyContent: 'flex-start'
  },
  memberLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#60768b',
  }
});
