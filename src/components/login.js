
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';


export default React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <Text style={{color: 'white'}}>SendBird JavaScript SDK!!!</Text>
      </View>
    );
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
