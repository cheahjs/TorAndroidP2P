import React, { Component } from 'react';
import {
    Animated,
    Easing,
    AppRegistry,
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
import Store from '../lib/store';
import SortableList from 'react-native-sortable-list';
import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { iconsMap } from '../lib/icons'

const window = Dimensions.get('window');

const testdata = {
    0: {
        title: 'Inbox 0'
    },
    1: {
        title: 'Inbox 1'
    },
    2: {
        title: 'Inbox 2'
    },
    3: {
        title: 'Inbox 3'
    },
    4: {
        title: 'Inbox 4'
    },
    5: {
        title: 'Inbox 5'
    },
    6: {
        title: 'Inbox 6'
    },
    7: {
        title: 'Inbox 7'
    },
    8: {
        title: 'Inbox 8'
    },
    9: {
        title: 'Inbox 9'
    },
    10: {
        title: 'Inbox 10'
    },
    11: {
        title: 'Inbox 11'
    },
}

let testorder = Object.keys(testdata);


export default class MainListScreen extends Component {
    static navigatorStyle = {
        contextualMenuStatusBarColor: '#0092d1',
        contextualMenuBackgroundColor: '#00adf5',
        contextualMenuButtonsColor: '#ffffff',
        navBarButtonColor: 'black'
    };

    constructor(props) {
        super(props);
        this._contextualMenu = false;
        const ds = new ListView.DataSource({ rowHasChanged: Store.hasListChanged });
        this.state = {
            dataSource: ds.cloneWithRows([]),
            data: {},
            loading: false,
            active_key: null
        };
        // Store.clearData();
        this.receiver = this.updateState.bind(this);
        Store.setReceiver(this.receiver);
        this.updateState(true);
    }

    componentWillUnmount() {
        Store.removeReceiver(this.receiver);
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.list}>
                    <Spinner visible={this.state.loading}
                        color='black' size='large'
                        overlayColor='rgba(0, 0, 0, 0)' />
                </View>
            );
        }
        return (
            <ListView
                initialListSize={Object.keys(this.data).length}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
                renderFooter={this.renderFooter.bind(this)}
                renderHeader={this.renderHeader.bind(this)}
                style={styles.list} />
        )
    }

    updateState(initial = false) {
        this.data = Store.getLists();
        let newData = Object.keys(this.data).map(x => this.data[x]);
        if (initial) {
            this.state.dataSource = this.state.dataSource.cloneWithRows(newData);
            this.state.initial = true;
            this.state.data = newData;
        } else {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(newData),
                initial: false,
                data: newData,
            });
        }
    }

    renderRow = (data, sectionId, rowId, highlightRow) => {
        return (
            <TouchableNativeFeedback
                onPress={() => this.onPressRow(data.key)}
                onLongPress={() => this.onLongPress(data.key)}>
                <View><Row data={data} active={false} initial={this.state.initial} /></View>
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
                    onPress={this.onPressFooter}>
                    <View><InboxRow count={this.state.data.filter(x => !x.completed_at).length} /></View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback
                    onPress={this.onPressFooter}>
                    <View><StarredRow count={this.state.data.filter(x => x.starred)} /></View>
                </TouchableNativeFeedback>
            </View>
        );
    }

    onPressFooter = () => {
        // let current = new Date();
        // Store.addListItem(current.getTime(), current.toTimeString());
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

    onPressRow = (key) => {
        this.props.navigator.push({
            screen: 'torlist.TodoListScreen', // unique ID registered with Navigation.registerScreen
            title: this.data[key].title, // navigation bar title of the pushed screen (optional)
            passProps: { keyid: key }, // Object that will be passed as props to the pushed screen (optional)
            animated: true, // does the push have transition animation or does it happen immediately (optional)
            animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional))
        });
    }

    onLongPress = (key) => {
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
            passProps: { keyid: key }
        });
    }
}

class Row extends Component {
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
        if (this.props.data.todos.length == 0) {
            return;
        }

        return (<Text style={styles.countBadge}>{this.props.data.incompleteLength}</Text>);
    }
}

class FooterRow extends Component {
    render() {
        return (
            <Animated.View style={[
                styles.footerRow
            ]}>
                <Icon name="plus" size={20} color="#64b5f6" />
                <Text style={styles.footer}>Create list</Text>
            </Animated.View>
        );
    }
}

class InboxRow extends Component {
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

class StarredRow extends Component {
    render() {
        return (
            <View style={styles.rowContainer}>
                <View style={styles.row}>
                    <Icon name="star-outline" size={20} color="#d74e48" />
                    <Text style={styles.text}>Starred</Text>
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
    list: {
        flex: 1
    },

    footerRow: {
        width: window.width,
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 16,
    },

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

    footer: {
        fontSize: 20,
        paddingLeft: 16,
        color: '#64b5f6'
    },

    countBadge: {
        alignSelf: 'center',
        // padding: 8
        paddingLeft: 16,
    }
});