import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const window = Dimensions.get('window');

export default class FooterRow extends Component {
    render() {
        return (
            <View style={[
                styles.footerRow
            ]}>
                <Icon name="plus" size={20} color="#64b5f6" />
                <Text style={styles.footer}>Create list</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    footerRow: {
        width: window.width,
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 16,
    },

    footer: {
        fontSize: 20,
        paddingLeft: 16,
        color: '#64b5f6'
    },
});