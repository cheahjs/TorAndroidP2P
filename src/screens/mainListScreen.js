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

    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
        if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
            switch (event.id) {
                case 'Contacts': {  // this is the same id field from the static navigatorButtons definition
                    this.props.navigator.push({
                        screen: 'torlist.ContactsScreen', // unique ID registered with Navigation.registerScreen
                        title: 'Contacts',
                        animated: true, // does the push have transition animation or does it happen immediately (optional)
                        animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional))
                    });
                    break;
                }
                case 'Settings': {
                    this.props.navigator.push({
                        screen: 'torlist.SettingsScreen', // unique ID registered with Navigation.registerScreen
                        title: 'Settings',
                        animated: true, // does the push have transition animation or does it happen immediately (optional)
                        animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional))
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
                <View><FooterRow /></View>
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
            screen: 'torlist.ListModifyScreen', // unique ID registered with Navigation.registerScreen
            animated: true, // does the push have transition animation or does it happen immediately (optional)
            animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional))
        });
    }

    onPressInbox = () => {
        this.props.navigator.push({
            screen: 'torlist.TodoListScreen', // unique ID registered with Navigation.registerScreen
            title: "Inbox", // navigation bar title of the pushed screen (optional)
            passProps: { id: 'inbox' }, // Object that will be passed as props to the pushed screen (optional)
            animated: true, // does the push have transition animation or does it happen immediately (optional)
            animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional))
        });
    }

    onPressStarred = () => {
        this.props.navigator.push({
            screen: 'torlist.TodoListScreen', // unique ID registered with Navigation.registerScreen
            title: "Starred", // navigation bar title of the pushed screen (optional)
            passProps: { id: 'starred' }, // Object that will be passed as props to the pushed screen (optional)
            animated: true, // does the push have transition animation or does it happen immediately (optional)
            animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional))
        });
    }

    onPressRow = (id) => {
        this.props.navigator.push({
            screen: 'torlist.TodoListScreen', // unique ID registered with Navigation.registerScreen
            title: this.props.documents.find(x => x.id == id).title, // navigation bar title of the pushed screen (optional)
            passProps: { id }, // Object that will be passed as props to the pushed screen (optional)
            animated: true, // does the push have transition animation or does it happen immediately (optional)
            animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional))
        });
    }

    onLongPress = (id) => {
        Vibration.vibrate([0, 10]);
        this.props.navigator.push({
            screen: 'torlist.ListModifyScreen', // unique ID registered with Navigation.registerScreen
            animated: true, // does the push have transition animation or does it happen immediately (optional)
            animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional))
            passProps: { list: this.props.documents.find(x => x.id == id) }
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