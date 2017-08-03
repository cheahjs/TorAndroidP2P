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
    TouchableHighlight
} from 'react-native'
import Store from './lib/store'
import SortableList from 'react-native-sortable-list';
import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


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
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            order: [],
            loading: true
        };
        Store.clearData();
        Store.setReceiver(this.updateState.bind(this));
        this.updateState();
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
            <SortableList
                data={this.state.data}
                order={this.state.order}
                renderRow={this.renderRow}
                onPressRow={this.onPressRow}
                onActivateRow={this.onActivateRow}
                onChangeOrder={this.onChangeOrder}
                renderFooter={this.renderFooter}
                onReleaseRow={this.onReleaseRow}
                style={styles.list} />
        );
    }

    updateState() {
        tempState = {};
        Store.getLists()
            .then((res) => {
                tempState.data = res ? res : {};
                return Store.getListsOrder();
            })
            .then((res) => {
                tempState.order = res;
                if (res == null || res.count != tempState.data.count) {
                    tempState.order = Object.keys(tempState.data);
                }
                tempState.loading = false;
                this.setState(tempState);
            });
    }

    renderRow = ({ data, active }) => {
        return <Row data={data} active={active} />
    }

    renderFooter = () => {
        return <FooterRow />
    }

    onPressRow = (key) => {
        if (this.state.longPressed) {
            this.deactivateRow();
        } else {
        this.props.navigator.push({
            screen: 'torlist.TodoListScreen', // unique ID registered with Navigation.registerScreen
            title: this.state.data[key].title, // navigation bar title of the pushed screen (optional)
            passProps: { key: key, data: this.state.data[key] }, // Object that will be passed as props to the pushed screen (optional)
            animated: true, // does the push have transition animation or does it happen immediately (optional)
            animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional))
        });
        }
    }

    onActivateRow = (key) => {
        Vibration.vibrate([0, 10]);
        this.activateRow();
    }

    onReleaseRow = (key) => {
    }

    onChangeOrder = (nextOrder) => {
        Store.setListsOrder(nextOrder);
        this.deactivateRow();
    }

    activateRow() {
        // Activated row, set longPressed, change navbar colour and enable menu
        this.setState({ longPressed: true });
        this.props.navigator.showContextualMenu(
            {
                rightButtons: [
                    {
                        title: 'Add',
                        // icon: require('../img/add.png')
                    },
                    {
                        title: 'Delete',
                        // icon: require('../img/delete.png')
                    }
                ],
                onButtonPressed: (index) => console.log(`Button ${index} tapped`)
            }
        );
        // TODO: Menu
    }

    // Called when row has moved (and thus not a target for menu)
    deactivateRow() {
        this.setState({ longPressed: false });
        this.props.navigator.setStyle({
            navBarBackgroundColor: '#f7f7f7'
        });
        this.props.navigator.dismissContextualMenu();
    }
}

class Row extends Component {
    render() {
        const { data, active } = this.props;

        return (
            <Animated.View style={[
                styles.row,
                active ? styles.rowActive : null
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
            <TouchableNativeFeedback onPress={this._onFooterPress}>
                <Animated.View style={[
                    styles.row
                ]}>
                    <Icon name="plus" size={20} color="#64b5f6" />
                    <Text style={styles.footer}>Create list</Text>
                </Animated.View>
            </TouchableNativeFeedback>
        );
    }

    _onFooterPress = () => {
        let current = new Date();
        let data = {};
        data[current.getTime()] = {
            title: current.toTimeString(),
        };
        Store.addListItem(data);
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