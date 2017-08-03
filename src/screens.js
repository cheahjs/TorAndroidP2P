import { Navigation } from 'react-native-navigation';

import MainListScreen from './mainlist';
import TodoListScreen from './todolist'

// register all screens of the app (including internal ones)
export function registerScreens() {
  Navigation.registerComponent('torlist.MainListScreen', () => MainListScreen);
  Navigation.registerComponent('torlist.TodoListScreen', () => TodoListScreen);
}