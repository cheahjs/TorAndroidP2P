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
    TouchableHighlight
} from 'react-native'
import Store from './lib/store'
import SortableList from 'react-native-sortable-list';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const window = Dimensions.get('window');

export default class MainList extends Component {
    render() {
        return (
            <View style={styles.container}>
                <SortableList
                    data={Store.getLists()}
                    renderRow={this._renderRow}
                    onPressRow={this._onPressRow} />
            </View>
        );
    }

    _renderRow = ({ data, active }) => {
        return <Row data={data} active={active} />
    }

    _onPressRow = (key) => {
        //TODO: open list related to key
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
                <Text style={styles.text}>{data.key}</Text>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    row: {
        width: window.width,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
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
});