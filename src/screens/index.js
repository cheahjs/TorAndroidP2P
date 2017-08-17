/*
 * Copyright 2017 Jun Siang Cheah
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

import { Navigation } from 'react-native-navigation';

import MainListScreen from './mainListScreen';
import TodoListScreen from './todoListScreen';
import ListModifyScreen from './listModifyScreen';
import ContactsScreen from './contactsScreen';
import SettingsScreen from './settingsScreen';
import ScannerScreen from './scannerScreen';

// register all screens of the app (including internal ones)
export function registerScreens(store, Provider) {
  console.log('registering screens', store, Provider);
  Navigation.registerComponent('torlist.MainListScreen', () => MainListScreen, store, Provider);
  Navigation.registerComponent('torlist.TodoListScreen', () => TodoListScreen, store, Provider);
  Navigation.registerComponent('torlist.ListModifyScreen', () => ListModifyScreen, store, Provider);
  Navigation.registerComponent('torlist.ContactsScreen', () => ContactsScreen, store, Provider);
  Navigation.registerComponent('torlist.SettingsScreen', () => SettingsScreen, store, Provider);
  Navigation.registerComponent('torlist.ScannerScreen', () => ScannerScreen, store, Provider);
}