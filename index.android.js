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
import Automerge from 'automerge';
import OrbotHelper from './src/native/OrbotHelper';
import ToastAndroid from 'ToastAndroid'


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
let store = null;

// OrbotHelper.startService().then(() => {
OrbotHelper.bindService().then(() => {
  console.log('getting stored state');
  getStoredState(persistConfig, (err, restoredState) => {
    console.log('state restored', restoredState);
    store = createStore(todoApp, restoredState);
    // oldState = restoredState;
    // store.subscribe(stateChangeListener(store));
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
    OrbotHelper.setResponseListener(responseListener);
  })
});
// });

const responseListener = (addr, response, conditionId) => {
  OrbotHelper.setResponseListener(responseListener);
  let data = JSON.parse(response);
  ToastAndroid.show('Received document from ' + data.name, ToastAndroid.SHORT);
  let returnResponse = '{}';
  switch (data.type) {
    case "FULL_DOCUMENT":
      let merged = mergeDocuments(store, data.data);
      returnResponse = JSON.stringify({
        type: merged == null ? 'NEW' : 'FULL_DOCUMENT_RETURN',
        data: merged == null ? null : Automerge.save(merged)
      });
      break;
    case "FULL_DOCUMENT_RETURN":
      mergeDocuments(store, data.data);
      break;
    case 'NEW':
      break;
    case "FAILED":
    case "NO_LISTENER":
    default:
      console.log('something went wrong', addr, response, conditionId);
      break;
  }
  if (conditionId != null) {
    OrbotHelper.setResponse(conditionId, returnResponse);
  }
};

const mergeDocuments = (store, doc) => {
  let state = store.getState();
  doc = Automerge.load(doc);
  let localDoc = state.documents.find(x => x.id == doc.id);
  if (localDoc === undefined) {
    store.dispatch(actions.addExistingList(doc));
    return null;
  } else {
    let newDoc = Automerge.merge(localDoc, doc);
    store.dispatch(actions.replaceList(newDoc.id, newDoc));
    return newDoc;
  }
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