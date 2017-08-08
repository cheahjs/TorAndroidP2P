import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Dimensions,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const window = Dimensions.get('window');

export default class InboxRow extends Component {
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