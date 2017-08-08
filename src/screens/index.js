import { Navigation } from 'react-native-navigation';

import MainListScreen from './mainListScreen';
import TodoListScreen from './todoListScreen';
import ListModifyScreen from './listModifyScreen';

// register all screens of the app (including internal ones)
export function registerScreens(store, Provider) {
  console.log('registering screens', store, Provider);
  Navigation.registerComponent('torlist.MainListScreen', () => MainListScreen, store, Provider);
  Navigation.registerComponent('torlist.TodoListScreen', () => TodoListScreen, store, Provider);
  Navigation.registerComponent('torlist.ListModifyScreen', () => ListModifyScreen, store, Provider);
}