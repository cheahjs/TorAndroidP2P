import React, { Component } from 'react';
import {
    StyleSheet, ScrollView, Text, View, Image, TouchableHighlight,
    Dimensions, RefreshControl, LayoutAnimation, Animated
} from 'react-native';
import TodoForm from '../components/todoform';
import TodoItem from '../components/todo';
import Store, { Todo } from '../lib/store';

const { width, height } = Dimensions.get('window');


export default class TodoListScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: Store.getListItem(this.props.keyid),
            showCompleted: false
        };
        console.log(this);
        this.receiver = this.dataListener.bind(this);
        Store.setReceiver(this.receiver);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.keyid != nextProps.keyid) {
            this.setState(nextProps);
        }
    }

    componentWillUpdate() {
        LayoutAnimation.easeInEaseOut();
    }

    componentWillUnmount() {
        Store.removeReceiver(this.receiver);
    }

    dataListener() {
        this.setState({ data: Store.getListItem(this.props.keyid) });
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    {/* Add a todo */}
                    <TodoForm keyid={this.props.keyid} />
                    {/* List */}
                    <View style={{ flexDirection: 'column-reverse' }}>
                        {this.state.data.todos
                            .map(x => Object.assign(new Todo(), x))
                            .filter((todo) => !todo.complete)
                            .sort((a, b) => a.position - b.position)
                            .map((todo) => (
                                <TodoItem key={todo.id} list_key={this.props.keyid} todo_key={todo.id} />
                            ))}
                    </View>
                    {/* Show Completed Button */}
                    {this.renderButton()}
                    {/* Completed list */}
                    {this.renderCompleted()}
                </ScrollView>
            </View>
        );
    }

    renderButton() {
        if (this.state.data.todos
                .map(x => Object.assign(new Todo(), x))
                .filter((todo) => todo.complete) <= 0)
            return;

        return (
            <TouchableHighlight
                activeOpacity={1}
                underlayColor={'rgba(0,0,0,0.4)'}
                style={styles.btn}
                onPress={() => this.setState({ showCompleted: !this.state.showCompleted })}
            >
                <Text style={styles.btnText}>
                    {this.state.showCompleted ? 'HIDE' : 'SHOW'} COMPLETED TO-DOS
                </Text>
            </TouchableHighlight>
        );
    }

    renderCompleted() {
        if (!this.state.showCompleted)
            return;

        return (
        <View style={{ flexDirection: 'column-reverse' }}>
            {this.state.data.todos
                .map(x => Object.assign(new Todo(), x))
                .filter((todo) => todo.complete)
                .sort((a, b) => a.position - b.position)
                .map((todo) => (
                    <TodoItem key={todo.id} list_key={this.props.keyid} todo_key={todo.id} />
                ))}
        </View>);
    }
}

const navbarHeight = 80;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'gray',
        padding: 10
    },
    btn: {
        alignSelf: 'center',
        marginVertical: 20,
        paddingVertical: 6,
        paddingHorizontal: 10,
        backgroundColor: 'rgba(88,141,100,0.8)',
        borderRadius: 2,
    },
    btnText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '600',
    }
});