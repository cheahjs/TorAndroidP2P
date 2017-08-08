import React, { Component } from 'react';
import {
    StyleSheet, TextInput, View, TouchableOpacity, Text, TouchableNativeFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Store from '../lib/store'

export default class Todo extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { id, title, starred, completed_at } = this.props.todo;

        return (
            <TouchableNativeFeedback>
                <View style={[styles.container, { opacity: !!completed_at ? 0.75 : 1 }]}>
                    <TouchableNativeFeedback onPress={this.props.toggleCompleteTodo}>
                        <View style={[styles.placeholder, { paddingTop: 2 }]}>
                            <Icon name={"checkbox-" + (!!completed_at ? "marked-outline" : "blank-outline")} size={24} color="gray" />
                        </View>
                    </TouchableNativeFeedback>

                    <View style={styles.wrap}>
                        <Text numberOfLines={1} style={[styles.title, !!completed_at && styles.checked]}>
                            {title}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.btn}
                        activeOpacity={1}
                        onPress={this.props.toggleStarredTodo}
                    >
                        {/* {starred && <View style={styles.starBg}>
                            <View style={styles.bottomTriangle} />
                        </View>} */}
                        <Icon
                            name={'star' + (starred ? '' : '-outline')}
                            size={24}
                            color={starred ? '#d74e48' : 'gray'}
                        />
                    </TouchableOpacity>
                </View>
            </TouchableNativeFeedback>
        );
    }
}

const size = 50;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 2,
        marginBottom: 1,
        height: size,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    placeholder: {
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: 'black',
        fontSize: 16,
        backgroundColor: 'transparent'
    },
    checked: {
        textDecorationLine: 'line-through',
        color: '#555'
    },
    wrap: {
        flex: 1,
        justifyContent: 'center',
    },
    btn: {
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    starBg: {
        position: 'absolute',
        top: 0,
        left: 13,
        width: 25,
        height: 44,
        backgroundColor: '#d74e48'
    }
});