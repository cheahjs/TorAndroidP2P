import { Navigation } from 'react-native-navigation';

import MainListScreen from './screens/mainlist';
import TodoListScreen from './screens/todolist';
import ListModifyScreen, { ListModifyHeader } from './screens/listmodify'

// register all screens of the app (including internal ones)
export function registerScreens() {
  Navigation.registerComponent('torlist.MainListScreen', () => MainListScreen);
  Navigation.registerComponent('torlist.TodoListScreen', () => TodoListScreen);
  Navigation.registerComponent('torlist.ListModifyScreen', () => ListModifyScreen);
  Navigation.registerComponent('torlist.ListModifyHeader', () => ListModifyHeader);
}