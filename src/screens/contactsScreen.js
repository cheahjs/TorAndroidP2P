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

import React, { Component } from 'react';
import {
    StyleSheet, Text, View, Dimensions, Modal, ListView,
    TouchableNativeFeedback, Vibration, Alert
} from 'react-native';
import { connect } from 'react-redux';
import { iconsMap } from '../lib/icons'
import * as actions from '../actions'
import OrbotHelper from '../native/OrbotHelper'
import QRCode from 'react-native-qrcode-svg';
import Permissions from 'react-native-permissions'

const { width, height } = Dimensions.get('window');


class ContactsScreen extends Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataSource: ds.cloneWithRows(this.props.contacts),
            qrCodeVisible: false,
            hsHost: '',
            qrData: ''
        };
        OrbotHelper.getOnionAddress(hsHost => {
            let qrData = JSON.stringify({
                hsHost,
                name: this.props.name
            })
            this.setState({ qrData, hsHost })
        });
        this.renderRow = this.renderRow.bind(this);
        this.props.navigator.setButtons({
            rightButtons: [
                {
                    title: 'Add',
                    id: 'add',
                    icon: iconsMap['plus'],
                    buttonColor: 'black'
                },
                {
                    title: 'Share',
                    id: 'share',
                    icon: iconsMap['share-variant'],
                    buttonColor: 'black'
                },
            ],
        });
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(newProps.contacts),
        });
    }

    onNavigatorEvent(event) {
        if (event.type == 'NavBarButtonPress') {
            switch (event.id) {
                case 'share':
                    this.setState({ qrCodeVisible: true });
                    break;
                case 'add':
                    Permissions.request('camera')
                        .then(response => {
                            if (response == 'authorized') {
                                this.props.navigator.push({
                                    screen: 'torlist.ScannerScreen',
                                    title: 'QR Code Scanner',
                                    animated: true,
                                    animationType: 'slide-horizontal',
                                });
                            } else {
                                this.props.navigator.showSnackbar({
                                    text: 'No permission to use camera'
                                });
                            }
                        });

                    break;
            }
        }
    }

    render() {
        let qrCode = null;
        if (this.state.qrData && this.state.hsHost != '') {
            qrCode = <QRCode
                value={this.state.qrData}
                size={Math.min(width, height) * 0.8}
            />;
        } else {
            qrCode = <Text>Hidden services not set up yet, please go to Settings</Text>
        }
        return (
            <View style={styles.container}>
                <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.qrCodeVisible}
                    onRequestClose={() => { this.setState({ qrCodeVisible: false }); }}
                >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000080' }}>
                        {qrCode}
                    </View>
                </Modal>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                />
            </View>
        );
    }

    renderRow(data) {
        return (
            <TouchableNativeFeedback onLongPress={() => {
                Vibration.vibrate([0, 10]);
                Alert.alert("Delete Contact", `"${data.name}" (${data.onion}) will be deleted forever.`,
                    [
                        { text: "NO" },
                        {
                            text: "DELETE", onPress: () => {
                                this.props.dispatch(actions.deleteContact(data.onion))
                            }
                        }
                    ]);
            }}>
                <View style={styles.row}>
                    <Text style={{ fontWeight: 'bold' }}>{data.name}</Text>
                    <Text>{data.onion}</Text>
                </View>
            </TouchableNativeFeedback>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    list: {
        padding: 10
    },
    row: {
        padding: 10
    }
});

const mapStateToProps = (state) => {
    return {
        contacts: state.contacts || [],
        name: state.name || ''
    };
}

export default connect(mapStateToProps)(ContactsScreen)