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
    StyleSheet, Text, Dimensions, View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const window = Dimensions.get('window');

export default class InboxRow extends Component {
    render() {
        return (
            <View style={styles.rowContainer}>
                <View style={styles.row}>
                    <Icon name="inbox" size={20} color="#64b5f6" />
                    <Text style={styles.text}>Inbox</Text>
                </View>
                {this.renderBadge()}
            </View>
        );
    }

    renderBadge() {
        if (this.props.count == 0)
            return;

        return (<Text style={styles.countBadge}>{this.props.count}</Text>);
    }
}

const styles = StyleSheet.create({
    row: {
        width: window.width,
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        paddingRight: 16
    },

    rowContainer: {
        width: window.width,
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 16,
    },

    text: {
        fontSize: 20,
        paddingLeft: 16,
        color: 'black',
    },

    countBadge: {
        alignSelf: 'center',
        paddingLeft: 16,
    }
});