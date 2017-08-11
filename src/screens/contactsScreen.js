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
import { connect } from 'react-redux';
import * as actions from '../actions'

const { width, height } = Dimensions.get('window');


class ContactsScreen extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
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

function getTodos(listId, todos) {
    return todos.filter(x => x.listId == listId
        || (listId == 'starred' && x.starred));
}

const mapStateToProps = (state, ownProps) => {
    return {
        todos: getTodos(ownProps.id, state.todos)
    };
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        addTodo: (id, listId, title, starred) => dispatch(actions.addTodo(id, listId, title, starred)),
        toggleCompleteTodo: (id) => dispatch(actions.toggleCompleteTodo(id)),
        toggleStarredTodo: (id) => dispatch(actions.toggleStarredTodo(id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactsScreen)