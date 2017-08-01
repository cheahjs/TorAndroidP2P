import React, { Component } from 'react';
import {
    AppRegistry, FlatList, StyleSheet, Text, View, ListItem
} from 'react-native';
import NavBar, { NavButton, NavButtonText, NavTitle, NavGroup } from 'react-native-nav'
import MainList from './mainlist'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


export default class TodoApp extends Component {
    render() {
        return (
            <View>
                {/* Nav */}
                <NavBar>
                    <NavTitle>
                        {"TorTodo"}
                    </NavTitle>
                    <NavGroup>
                        <NavButton onPress={() => alert('Not Implemented Yet')}>
                            <Icon name="magnify" size={28}/>
                        </NavButton>
                        <NavButton onPress={() => alert('Not Implemented Yet')}>
                            <Icon name="settings" size={28}/>
                        </NavButton>
                    </NavGroup>
                </NavBar>
                {/* List of Todo lists */}
                <MainList/>
            </View>
        );
    }
}