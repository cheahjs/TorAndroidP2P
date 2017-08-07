import { Navigation } from 'react-native-navigation';

import MainListScreen from './screens/mainlist';
import TodoListScreen from './screens/todolist';
import ListModifyScreen from './screens/listmodify'

// register all screens of the app (including internal ones)
export function registerScreens(store, Provider) {
  Navigation.registerComponent('torlist.MainListScreen', () => MainListScreen, store, Provider);
  Navigation.registerComponent('torlist.TodoListScreen', () => TodoListScreen, store, Provider);
  Navigation.registerComponent('torlist.ListModifyScreen', () => ListModifyScreen, store, Provider);
}