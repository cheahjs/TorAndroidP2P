import { Navigation } from 'react-native-navigation';
import { registerScreens } from './src/screens';
import { iconsMap, iconsLoaded } from './src/lib/icons';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import todoApp from './src/reducers';
import { getStoredState, autoRehydrate, createPersistor } from 'redux-persist';
import FilesystemStorage from 'redux-persist-filesystem-storage';


const persistConfig = { storage: FilesystemStorage }

console.log('getting stored state');
getStoredState(persistConfig, (err, restoredState) => {
  console.log('state restored',restoredState);
  const store = createStore(todoApp, restoredState);
  const persistor = createPersistor(store, persistConfig);
  console.log('loading icons');
  iconsLoaded.then(() => {
    console.log('icons loaded, starting app');
    registerScreens(store, Provider);
    startApp();
  });
})

function startApp() {
  Navigation.startSingleScreenApp({
    screen: {
      screen: 'torlist.MainListScreen', 
      title: 'TorTodo',
      navigatorButtons: {
        rightButtons: [
          {
            title: 'Settings',
            id: 'Settings',
            icon: iconsMap['settings'],
            buttonColor: 'black'
          },
        ],
      } // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
    },
    animationType: ' none'
  });
}