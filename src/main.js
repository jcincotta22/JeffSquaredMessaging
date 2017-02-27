
import React, { Component } from 'react';
import {
  Navigator,
  StyleSheet
} from 'react-native';
import Main from './main';
import Login from './components/login';

var ROUTES = {
  login: Login
};

export default React.createClass({
  renderScene: function(route, navigator) {
    var Component = ROUTES[route.name];
    return <Component route={route} navigator={navigator} />;
  },
  render: function() {
    return (
      <Navigator
        style={ styles.container }
        initialRoute={ {name: 'login'} }
        renderScene={this.renderScene}
        configureScene={ () => { return Navigator.SceneConfigs.FloatFromRight; } }
      />
    );
  }
});


const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
