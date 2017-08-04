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
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
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
                style={styles.list} />
        )
    }

    updateState(initial = false) {
        this.data = Store.getLists();
        let newData = Object.keys(this.data).map(x => this.data[x]);
        if (initial) {
            this.state.dataSource = this.state.dataSource.cloneWithRows(newData);
            this.state.initial = true;
        } else {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(newData),
                initial: false
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
                styles.row,
                active ? styles.rowActive : null,
                { opacity: this.state.opacity }
            ]}>
                <Icon name="format-list-bulleted" size={20} />
                <Text style={styles.text}>{data.title}</Text>
            </Animated.View>
        );
    }
}

class FooterRow extends Component {
    render() {
        return (
            <Animated.View style={[
                styles.row
            ]}>
                <Icon name="plus" size={20} color="#64b5f6" />
                <Text style={styles.footer}>Create list</Text>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    list: {
        flex: 1
    },

    row: {
        width: window.width,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 16,
        flex: 1
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
    }
});