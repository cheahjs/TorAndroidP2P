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
    TouchableHighlight, TouchableNativeFeedback, ListView
} from 'react-native';
import { connect } from 'react-redux';
import { iconsMap } from '../lib/icons'
import * as actions from '../actions';
import { uuidv4 } from '../utils';
import FooterRow from '../components/footerRow'
import Row from '../components/row'
import DialogAndroid from 'react-native-dialogs';
import OrbotHelper from '../native/OrbotHelper'

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
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            title: '',
            dataSource: ds.cloneWithRows(this.props.list === undefined ? [] : this.props.list.peers),
            hsHost: ''
        }
        if (this.props.list !== undefined) {
            this.state.title = this.props.list.title;
        }
        this.props.navigator.setButtons({
            rightButtons: [
                {
                    title: 'Done',
                    id: 'done',
                    icon: iconsMap['check']
                },
            ],
        });
        OrbotHelper.getOnionAddress(hsHost => {
            this.setState({ hsHost })
        });
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        this.renderFooter = this.renderFooter.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.onPressFooter = this.onPressFooter.bind(this);
    }

    onNavigatorEvent(event) {
        if (event.type == 'NavBarButtonPress') {
            if (event.id == 'done') {
                if (!this.state.title)
                    return;
                if (this.props.list) {
                    this.props.dispatch(actions.modifyList(this.props.id, this.state.title));
                } else {
                    this.props.dispatch(actions.addList(uuidv4(), this.state.title))
                }
                this.props.navigator.pop({
                    animated: true,
                    animationType: 'slide-horizontal',
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
                        this.props.dispatch(actions.deleteList(this.props.id));
                        this.props.navigator.pop({
                            animated: true,
                            animationType: 'slide-horizontal',
                        });
                    }
                }
            ]);

    }

    componentWillReceiveProps(newProps) {
        if (newProps.list)
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(newProps.list.peers)
            });
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
                    <Text style={{ padding: 0, fontWeight: '400' }}>Sharing with</Text>
                    {this.renderContacts()}
                    {this.renderButton()}
                </ScrollView>
            </View>
        );
    }

    renderContacts() {
        return (
            <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderRow}
                renderFooter={this.renderFooter}
            />
        );
    }

    renderRow = (data, sectionId, rowId, highlightRow) => {
        return (
            <TouchableNativeFeedback>
                <View>
                    <Row
                        data={{ title: `${data.name} (${data.onion})` }}
                        incompleteCount={0}
                        active={false}
                        initial={true} />
                </View>
            </TouchableNativeFeedback>

        );
    }

    renderFooter = () => {
        return (
            <TouchableNativeFeedback
                onPress={this.onPressFooter}>
                <View><FooterRow text={'Add contact'} /></View>
            </TouchableNativeFeedback>
        );
    }

    onPressFooter = () => {
        if (this.props.list === undefined)
            return;
        var dialog = new DialogAndroid();
        dialog.set({
            title: 'Choose a contact',
            items: this.props.contacts
                .filter(x =>
                    this.props.list.peers
                        .find(y => y.onion == x.onion || y.onion == this.state.hsHost) === undefined)
                .map(x => x.name + '\n' + x.onion),
            itemsCallbackSingleChoice: (int, item) => {
                let parts = item.split('\n');
                console.log(int, item, parts);
                if (this.state.hsHost != '') {
                    if (this.props.list.peers.find(x => x.onion == this.state.hsHost) === undefined) {
                        this.props.dispatch(actions.addPeer(this.props.name, this.state.hsHost, this.props.id));
                    }
                }
                this.props.dispatch(actions.addPeer(parts[0], parts[1], this.props.id));
            }
        });
        dialog.show();
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
        textAlign: 'center',
    },
});

const mapStateToProps = (state, ownProps) => {
    return {
        contacts: state.contacts,
        list: state.documents.find(x => x.id == ownProps.id),
        name: state.name
    }
}

export default connect(mapStateToProps)(ListModifyScreen)