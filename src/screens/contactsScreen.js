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
    StyleSheet, ScrollView, Text, View, Image, TouchableHighlight,
    Dimensions, RefreshControl, LayoutAnimation, Animated, ListView
} from 'react-native';
import { connect } from 'react-redux';
import { iconsMap } from '../lib/icons'
import * as actions from '../actions'

const { width, height } = Dimensions.get('window');


class ContactsScreen extends Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataSource: ds.cloneWithRows(this.props.contacts)
        };
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
                    icon: iconsMap['account-multiple'],
                    buttonColor: 'black'
                },
            ],
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                />
            </View>
        );
    }

    renderRow(data) {
        return (
            <View>
                <Text>{data.name}</Text>
                <Text>{data.onion}</Text>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10
    }
});

const mapStateToProps = (state) => {
    return {
        contacts: state.contacts
    };
}

export default connect(mapStateToProps)(ContactsScreen)