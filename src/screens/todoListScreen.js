/*
 * Copyright 2017 Jun Siang Cheah
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

import React, { Component } from 'react';
import {
    StyleSheet, ScrollView, Text, View, Image, TouchableHighlight,
    Dimensions, RefreshControl, LayoutAnimation, Animated
} from 'react-native';
import TodoForm from '../components/todoForm';
import TodoItem from '../components/todo';
import { connect } from 'react-redux';
import * as actions from '../actions'

const { width, height } = Dimensions.get('window');


class TodoListScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showCompleted: false
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    {/* Add a todo */}
                    <TodoForm id={this.props.id} addTodo={this.props.addTodo} />
                    {/* List */}
                    <View style={{ flexDirection: 'column-reverse' }}>
                        {this.props.todos
                            .filter((todo) => !todo.completed_at)
                            .sort((a, b) => a.starred == b.starred ? 0 : (a.starred ? 1 : -1))
                            .map((todo) => (
                                <TodoItem
                                    key={todo.id}
                                    todo={todo}
                                    listId={this.props.listId}
                                    toggleCompleteTodo={() => this.props.toggleCompleteTodo(todo.id, todo.listId)}
                                    toggleStarredTodo={() => this.props.toggleStarredTodo(todo.id, todo.listId)} />
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
        if (this.props.todos
            .filter((todo) => !!todo.completed_at) == 0)
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
                {this.props.todos
                    .filter((todo) => !!todo.completed_at)
                    .sort((a, b) => a.starred == b.starred ? 0 : (a.starred ? 1 : 0))
                    .map((todo) => (
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            listId={this.props.listId}
                            toggleCompleteTodo={() => this.props.toggleCompleteTodo(todo.id, todo.listId)}
                            toggleStarredTodo={() => this.props.toggleStarredTodo(todo.id, todo.listId)} />
                    ))}
            </View>);
    }
}
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

function getTodos(listId, documents) {
    if (listId == 'starred') {
        return documents.reduce((a, ele) => {
            return a.concat(ele.todos.filter(x => x.starred));
        }, []);
    } else {
        return documents.find(x => x.id == listId).todos;
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        todos: getTodos(ownProps.id, state.documents)
    };
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        addTodo: (id, listId, title, starred) => dispatch(actions.addTodo(id, listId, title, starred)),
        toggleCompleteTodo: (id, listId) => dispatch(actions.toggleCompleteTodo(id, listId)),
        toggleStarredTodo: (id, listId) => dispatch(actions.toggleStarredTodo(id, listId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoListScreen)