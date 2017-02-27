
// var React = require('react-native');
// var {
//   AppRegistry
// } = React;
//
// var Main = require('./src/main')
import Main from './src/main';

//
import React, { Component } from 'react';
import {
  AppRegistry
} from 'react-native';

AppRegistry.registerComponent('JeffSquaredMessaging', () => Main);
