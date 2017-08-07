// import React, { Component } from 'react';
// import { AppRegistry, StyleSheet, Text, View } from 'react-native';
// import TodoApp from './src/app';

// AppRegistry.registerComponent('TorAndroidP2P', () => TodoApp);

import { Navigation } from 'react-native-navigation';
import { registerScreens } from './src/screens';
import { iconsMap, iconsLoaded } from './src/lib/icons';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import todoApp from './src/reducers';

const store = createStore(todoApp);

iconsLoaded.then(() => {
  startApp();
});

function startApp() {
  registerScreens(store, Provider); // this is where you register all of your app's screens

  Navigation.startSingleScreenApp({
    screen: {
      screen: 'torlist.MainListScreen', // unique ID registered with Navigation.registerScreen
      title: 'TorTodo', // title of the screen as appears in the nav bar (optional)
      navigatorButtons: {
        rightButtons: [
          {
            title: 'Settings', // for a textual button, provide the button title (label)
            id: 'Settings', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
            icon: iconsMap['settings'],
            buttonColor: 'black'
          },
        ],
      } // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
    },
    animationType: ' none'
  });
}