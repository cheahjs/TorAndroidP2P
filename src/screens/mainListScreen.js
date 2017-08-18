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
    Animated,
    StyleSheet,
    Text,
    Image,
    View,
    Dimensions,
    Vibration,
    TouchableNativeFeedback,
    TouchableHighlight,
    ListView
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { iconsMap } from '../lib/icons'
import Row from '../components/row'
import FooterRow from '../components/footerRow'
import InboxRow from '../components/inboxRow'
import StarredRow from '../components/starredRow'
import OrbotHelper from '../native/OrbotHelper'

const window = Dimensions.get('window');

class MainListScreen extends Component {
    static navigatorStyle = {
        contextualMenuStatusBarColor: '#0092d1',
        contextualMenuBackgroundColor: '#00adf5',
        contextualMenuButtonsColor: '#ffffff',
        navBarButtonColor: 'black'
    }

    constructor(props) {
        super(props);
        this._contextualMenu = false;
        const ds = new ListView.DataSource({ rowHasChanged: this.rowHasChanged.bind(this) });
        this.state = {
            dataSource: ds.cloneWithRows(this.props.lists.filter(x => x != 'inbox')),
            initial: true
        };
        this.renderRow = this.renderRow.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.props.navigator.setButtons({
            rightButtons: [
                {
                    title: 'Settings',
                    id: 'Settings',
                    icon: iconsMap['settings'],
                    buttonColor: 'black'
                },
                {
                    title: 'Contacts',
                    id: 'Contacts',
                    icon: iconsMap['account-multiple'],
                    buttonColor: 'black'
                },
            ],
        });
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) { 
        if (event.type == 'NavBarButtonPress') {
            switch (event.id) {
                case 'Contacts': {
                    this.props.navigator.push({
                        screen: 'torlist.ContactsScreen',
                        title: 'Contacts',
                        animated: true, 
                        animationType: 'slide-horizontal',
                    });
                    break;
                }
                case 'Settings': {
                    this.props.navigator.push({
                        screen: 'torlist.SettingsScreen',
                        title: 'Settings',
                        animated: true,
                        animationType: 'slide-horizontal',
                    });
                    break;
                }
            }
        }
    }

    rowHasChanged(r1, r2) {
        return true;
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(newProps.lists.filter(x => x != 'inbox')),
            initial: false
        });
    }

    render() {
        return (
            <ListView
                initialListSize={this.props.lists.length}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow}
                renderFooter={this.renderFooter}
                renderHeader={this.renderHeader}
                style={styles.list} />
        )
    }

    renderRow = (data, sectionId, rowId, highlightRow) => {
        let listId = data;
        let document = this.props.documents.find(x => x.id == listId);
        return (
            <TouchableNativeFeedback
                onPress={() => this.onPressRow(listId)}
                onLongPress={() => this.onLongPress(listId)}>
                <View>
                    <Row
                        data={document}
                        incompleteCount={document.todos.filter(x => !x.completed_at).length}
                        active={false}
                        initial={this.state.initial} />
                </View>
            </TouchableNativeFeedback>

        );
    }

    renderFooter = () => {
        return (
            <TouchableNativeFeedback
                onPress={this.onPressFooter}>
                <View><FooterRow text={'Create list'}/></View>
            </TouchableNativeFeedback>
        );
    }

    renderHeader = () => {
        return (
            <View>
                <TouchableNativeFeedback
                    onPress={this.onPressInbox}>
                    <View>
                        <InboxRow count={this.props.documents
                            .find(x => x.id == "inbox").todos
                            .filter(x => !x.completed_at).length} />
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback
                    onPress={this.onPressStarred}>
                    <View>
                        <StarredRow
                            count={this.props.documents
                                .reduce((val, document) => {
                                    return document.todos
                                        .filter(todo => todo.starred && !todo.completed_at).length
                                        + val;
                                }, 0)} />
                    </View>
                </TouchableNativeFeedback>
            </View>
        );
    }

    onPressFooter = () => {
        this.props.navigator.push({
            screen: 'torlist.ListModifyScreen', 
            animated: true,
            animationType: 'slide-horizontal', 
        });
    }

    onPressInbox = () => {
        this.props.navigator.push({
            screen: 'torlist.TodoListScreen', 
            title: "Inbox",
            passProps: { id: 'inbox' },
            animated: true,
            animationType: 'slide-horizontal', 
        });
    }

    onPressStarred = () => {
        this.props.navigator.push({
            screen: 'torlist.TodoListScreen', 
            title: "Starred",
            passProps: { id: 'starred' },
            animated: true,
            animationType: 'slide-horizontal', 
        });
    }

    onPressRow = (id) => {
        this.props.navigator.push({
            screen: 'torlist.TodoListScreen', 
            title: this.props.documents.find(x => x.id == id).title,
            passProps: { id },
            animated: true,
            animationType: 'slide-horizontal', 
        });
    }

    onLongPress = (id) => {
        Vibration.vibrate([0, 10]);
        this.props.navigator.push({
            screen: 'torlist.ListModifyScreen', 
            animated: true,
            animationType: 'slide-horizontal', 
            passProps: { id }
        });
    }
}

const styles = StyleSheet.create({
    list: {
        flex: 1
    },
});

const mapStateToProps = state => {
    return {
        lists: state.lists,
        documents: state.documents
    };
}

export default connect(mapStateToProps)(MainListScreen)