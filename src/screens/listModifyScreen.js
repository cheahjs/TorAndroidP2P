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
    View, StyleSheet, Dimensions, TextInput, ScrollView, Text, Alert,
    TouchableHighlight
} from 'react-native';
import { connect } from 'react-redux';
import { iconsMap } from '../lib/icons'
import * as actions from '../actions';
import { uuidv4 } from '../utils';

const { height, width } = Dimensions.get('window');

class ListModifyScreen extends Component {
    static navigatorStyle = {
        drawUnderTabBar: true,
        navBarButtonColor: 'white',
        navBarTextColor: '#ffffff',
        navBarBackgroundColor: '#42a5f5',
        topBarElevationShadowEnabled: false,
        screenBackgroundColor: 'white',
    };

    constructor(props) {
        super(props);
        this.state = {
            title: ''
        }
        if (this.props.list !== undefined) {
            this.state.title = this.props.list.title;
        }
        this.props.navigator.setButtons({
            rightButtons: [
                {
                    title: 'Done', // for a textual button, provide the button title (label)
                    id: 'done', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                    icon: iconsMap['check']
                },
            ],
        });
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
        if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
            if (event.id == 'done') { // this is the same id field from the static navigatorButtons definition
                if (!this.state.title)
                    return;
                if (this.props.list) {
                    this.props.dispatch(actions.modifyList(this.props.list.id, this.state.title));
                } else {
                    this.props.dispatch(actions.addList(uuidv4(), this.state.title))
                }
                this.props.navigator.pop({
                    animated: true, // does the pop have transition animation or does it happen immediately (optional)
                    animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the pop have different transition animation (optional)
                });
            }
        }
    }

    onDelete() {
        Alert.alert("Delete List", `"${this.props.list.title}" will be deleted forever.`,
            [
                { text: "NO" },
                {
                    text: "DELETE", onPress: () => {
                        this.props.dispatch(actions.deleteList(this.props.list.id));
                        this.props.navigator.pop({
                            animated: true, // does the pop have transition animation or does it happen immediately (optional)
                            animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the pop have different transition animation (optional)
                        });
                    }
                }
            ]);

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerLabel}>List Name</Text>
                    <TextInput
                        returnKeyType={'done'}
                        numberOfLines={1}
                        underlineColorAndroid={'transparent'}
                        style={styles.headerInput}
                        value={this.state.title}
                        autoCapitalize={'words'}
                        onChangeText={title => this.setState({ title })}
                        selectionColor={'#80d6ff'}
                    />
                </View>
                <ScrollView style={styles.bodyContainer}>
                    <Text style={{padding: 0, fontWeight: '400'}}>List Members</Text>
                    {this.renderContacts()}
                    {this.renderButton()}
                </ScrollView>
            </View>
        );
    }

    renderContacts() {
        return;
    }

    renderButton() {
        if (this.props.list === undefined)
            return;

        return (
            <TouchableHighlight
                activeOpacity={1}
                underlayColor={'rgba(0,0,0,0.4)'}
                style={styles.btn}
                onPress={() => this.onDelete()}
            >
                <Text style={styles.btnText}>
                    Delete List
                </Text>
            </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    bodyContainer: {
        flex: 1,
        padding: 24
    },
    header: {
        backgroundColor: '#42a5f5',
        width: width,
        height: 150,
        paddingLeft: 48,
        paddingRight: 48,
        paddingTop: 32
    },
    headerLabel: {
        color: '#eee'
    },
    headerInput: {
        color: 'white',
        fontSize: 32
    },
    btn: {
        alignSelf: 'center',
        marginVertical: 20,
        paddingVertical: 6,
        paddingHorizontal: 10,
        width: width - 20,
        backgroundColor: 'red',
        borderRadius: 2,
    },
    btnText: {
        color: 'white',
        fontSize: 20,
        // fontWeight: '600',
        textAlign: 'center',
    },
});

const mapStateToProps = (state) => {
    return {
        contacts: state.contacts
    }
}

export default connect(mapStateToProps)(ListModifyScreen)