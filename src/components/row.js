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
    Animated, StyleSheet, Text, View, Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const window = Dimensions.get('window');

export default class Row extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opacity: this.props.initial ? 1 : new Animated.Value(0)
        };
    }

    componentDidMount() {
        if (!this.props.initial) {
            Animated.timing(this.state.opacity, {
                toValue: 1,
                duration: 250,
            }).start();
        }
    }

    render() {
        const { data, active } = this.props;
        console.log(this.props);

        return (
            <Animated.View style={[
                styles.rowContainer,
                { opacity: this.state.opacity }
            ]}>
                <View style={[
                    styles.row,
                    active ? styles.rowActive : null,
                ]}>
                    <Icon name="format-list-bulleted" size={20} />
                    <Text style={styles.text} numberOfLines={1}>{data.title}</Text>
                </View>
                {this.renderBadge()}
            </Animated.View>
        );
    }

    renderBadge() {
        if (this.props.incompleteCount == 0) {
            return;
        }

        return (<Text style={styles.countBadge}>{this.props.incompleteCount}</Text>);
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

    rowActive: {
        backgroundColor: '#9be7ff',
        opacity: 0.5
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