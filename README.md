# TorList
To-do list application heavily inspired by Wunderlist that uses Tor hidden services to sync lists between devices to avoid depending on , using [Automerge](https://github.com/automerge/automerge) to provide automatic merging of changes.

<!--- TODO: Add images --->

## Installing

### Pre-requisites

* [React Native](https://facebook.github.io/react-native/docs/getting-started.html)
* Orbot (for sharing)

### Installing

1. `git clone https://github.com/Deathmax/TorAndroidP2P.git`
2. Run `react-native run-android` to build and install the application.

### Usage

#### Without sharing

No additional setup required, you can create new lists, create new to-dos, mark to-dos complete and star to-dos.

#### With sharing

1. Install Orbot
2. Open TorList -> Settings and tap on Onion Address. This should open Orbot and prompt you to create a hidden service.
3. Set your name in Settings.
4. Share your details by sharing your QR code, or add others by scanning their QR code.
5. Long press a list and add the contact to the share list.
6. Pull down on the to-do list to sync.
