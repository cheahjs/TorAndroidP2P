import React, { Component } from 'react';
import {
    StyleSheet, ScrollView, Text, View, Image, TouchableHighlight,
    Dimensions, RefreshControl, LayoutAnimation, Animated
} from 'react-native';

const { width, height } = Dimensions.get('window');


export default class TodoListScreen extends Component {
    constructor(props) {
        super(props);
        this.state = this.props;
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.key != nextProps.key) {
            this.setState(nextProps);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Animated.View>
                    <ScrollView>
                        {/* Add a todo */}
                        {/* Starred list */}
                        {/* Completed */}
                        {/* Completed list */}
                    </ScrollView>
                </Animated.View>
            </View>
        );
    }
}

const navbarHeight = 80;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    }
});