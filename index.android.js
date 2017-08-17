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
import { registerScreens } from './src/screens';
import { iconsMap, iconsLoaded } from './src/lib/icons';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import todoApp from './src/reducers';
import { 
  getStoredState, autoRehydrate, createPersistor, purgeStoredState,
  createTransform
} from 'redux-persist';
import FilesystemStorage from 'redux-persist-filesystem-storage';
import * as actions from './src/actions';
import Automerge from 'automerge'


let automergeTransform = createTransform(
    (inState, key) => {
      if (key == 'documents') {
        return inState.map(x => Automerge.save(x));
      }
      return inState;
    },
    (outState, key) => {
      if (key == 'documents') {
        return outState.map(x => Automerge.load(x));
      }
      return outState;
    }
);

let persistConfig = { storage: FilesystemStorage, transforms: [automergeTransform] }

console.log('getting stored state');
getStoredState(persistConfig, (err, restoredState) => {
  console.log('state restored', restoredState);
  const store = createStore(todoApp, restoredState);
  oldState = restoredState;
  store.subscribe(stateChangeListener(store));
  const persistor = createPersistor(store, persistConfig);
  // persistor.purge();
  let initialState = store.getState();
  // Create initial inbox list
  if ("documents" in initialState) {
    if (initialState.documents.find(x => x.id == 'inbox') === undefined) {
      store.dispatch(actions.addList('inbox', 'Inbox'));
    }
  } else {
    store.dispatch(actions.addList('inbox', 'Inbox'));
  }
  console.log('loading icons');
  iconsLoaded.then(() => {
    console.log('icons loaded, starting app');
    registerScreens(store, Provider);
    startApp();
  });
})

let oldState;
const stateChangeListener = (store) => () => {
  let newState = store.getState();
  //TODO: Fire off events here.
  oldState = newState;
}

function startApp() {
  Navigation.startSingleScreenApp({
    screen: {
      screen: 'torlist.MainListScreen',
      title: 'TorTodo',
    },
    animationType: 'fade'
  });
}