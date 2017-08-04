import React, { Component } from 'react';
import {
    View, StyleSheet, Dimensions, TextInput, ScrollView, Text, Alert
} from 'react-native';
import Store from '../lib/store'
// var uuid = require('react-native-uuid');

const { height, width } = Dimensions.get('window');

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export default class ListModifyScreen extends Component {
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
        this.state = {
            title: ''
        }
        if (this.props.keyid !== undefined) {
            this.state.title = Store.getListItem(this.props.keyid).title;
        }
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
        if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
            if (event.id == 'done') { // this is the same id field from the static navigatorButtons definition
                if (!this.state.title)
                    return;
                let listkey = this.props.keyid ? this.props.keyid : uuidv4();
                Store.addListItem(listkey, this.state.title);
                this.props.navigator.pop({
                    animated: true, // does the pop have transition animation or does it happen immediately (optional)
                    animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the pop have different transition animation (optional)
                });
            }
        }
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
                        onChangeText={title => this.setState({ title })}
                        selectionColor={'#80d6ff'}
                        autoFocus={true}
                    />
                </View>
                <ScrollView style={styles.container}>
                    <Text>TODO: Sharing, deletion, modification</Text>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
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
    }
});