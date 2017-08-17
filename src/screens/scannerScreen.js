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
    StyleSheet, View, Text
} from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../actions'
import QRCodeScanner from 'react-native-qrcode-scanner';

class ScannerScreen extends Component {
    constructor(props) {
        super(props);
        this.onRead = this.onRead.bind(this);
    }

    render() {
        return (
            <View style={styles.container}>
                <QRCodeScanner
                    onRead={this.onRead}
                    topContent={(
                        <Text style={styles.centerText}>Scan your contact's QR code.</Text>
                    )}
                    bottomViewStyle={styles.zeroContainer}
                    showMarker={true}
                    reactivate={true}
                    reactivateTimeout={3000}
                />
            </View>
        );
    }

    onRead(e) {
        if (e.type != "QR_CODE") {
            return alertError();
        }
        let jsonData = null;
        try {
            jsonData = JSON.parse(e.data);
        } catch (error) {
            return this.alertError();
        }
        if ("hsHost" in jsonData && "name" in jsonData) {
            if (this.props.contacts.find(x => x.onion == jsonData.hsHost) !== undefined) {
                return this.alertDuplicate();
            }
            this.props.dispatch(actions.addContact(jsonData.name, jsonData.hsHost));
        } else {
            return this.alertError();
        }
        this.props.navigator.pop({
            animated: true,
            animationType: 'slide-horizontal',
        });
    }

    alertError() {
        this.props.navigator.showSnackbar({
            text: 'Invalid QR code'
        });
    }

    alertDuplicate() {
        this.props.navigator.showSnackbar({
            text: 'Contact already added'
        });
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: 'white',
    },
    zeroContainer: {
        height: 0,
        flex: 0,
    },
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777',
    },
});

const mapStateToProps = (state) => {
    return {
        contacts: state.contacts || []
    }
}

export default connect(mapStateToProps)(ScannerScreen)