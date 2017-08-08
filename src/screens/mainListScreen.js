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

const window = Dimensions.get('window');

class MainListScreen extends Component {
    static navigatorStyle = {
        contextualMenuStatusBarColor: '#0092d1',
        contextualMenuBackgroundColor: '#00adf5',
        contextualMenuButtonsColor: '#ffffff',
        navBarButtonColor: 'black'
    };

    constructor(props) {
        super(props);
        this._contextualMenu = false;
        const ds = new ListView.DataSource({ rowHasChanged: this.rowHasChanged.bind(this) });
        this.state = {
            dataSource: ds.cloneWithRows(this.props.lists),
            initial: true
        };
        this.renderRow = this.renderRow.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
    }

    rowHasChanged(r1, r2) {
        return true;
        if (r1 !== r2)
            return true;
        if (r1.title !== r2.title)
            return true;
        let r1Todos = this.props.todos.filter(x => x.listId == r1.id);
        let r2Todos = this.props.todos.filter(x => x.listId == r2.id);
        if (r1Todos.length != r2Todos.length)
            return true;
        for (var r1Todo of r1Todos) {
            let r2Find = r2Todos.find(x => x.id == r1Todo.id);
            if (r2Find === undefined)
                return true;
            if (r1Todo !== r2Find)
                return true;
        }
        return false;
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(newProps.lists),
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
        return (
            <TouchableNativeFeedback
                onPress={() => this.onPressRow(data.id)}
                onLongPress={() => this.onLongPress(data.id)}>
                <View>
                    <Row
                        data={data}
                        incompleteCount={this.props.todos.filter(x => x.listId == data.id && !x.completed_at).length}
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
                    <View><InboxRow count={this.props.todos.filter(x => x.listId == "inbox" && !x.completed_at).length} /></View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback
                    onPress={this.onPressStarred}>
                    <View><StarredRow count={this.props.todos.filter(x => x.starred && !x.completed_at).length} /></View>
                </TouchableNativeFeedback>
            </View>
        );
    }

    onPressFooter = () => {
        this.props.navigator.push({
            screen: 'torlist.ListModifyScreen', // unique ID registered with Navigation.registerScreen
            animated: true, // does the push have transition animation or does it happen immediately (optional)
            animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional))
            navigatorButtons: {
                rightButtons: [
                    {
                        title: 'Done', // for a textual button, provide the button title (label)
                        id: 'done', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                        icon: iconsMap['check']
                    },
                ],
            }
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
            title: this.props.lists.find(x => x.id == id).title, // navigation bar title of the pushed screen (optional)
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
            navigatorButtons: {
                rightButtons: [
                    {
                        title: 'Done', // for a textual button, provide the button title (label)
                        id: 'done', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                        icon: iconsMap['check']
                    },
                ],
            },
            passProps: { list: this.props.lists.find(x => x.id == id) }
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
        todos: state.todos
    };
}

export default connect(mapStateToProps)(MainListScreen)