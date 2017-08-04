import React, { Component } from 'react';
import {
    View, StyleSheet, Dimensions, TextInput, ScrollView, Text
} from 'react-native';
import Store from '../lib/store'

const { height, width } = Dimensions.get('window');

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
            this.state.title = Store.getListItem(this.props.keyid);
        }
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
        if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
            if (event.id == 'edit') { // this is the same id field from the static navigatorButtons definition
                AlertIOS.alert('NavBar', 'Edit button pressed');
            }
            if (event.id == 'add') {
                AlertIOS.alert('NavBar', 'Add button pressed');
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