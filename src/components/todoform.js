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
    StyleSheet, TextInput, View, TouchableOpacity 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { uuidv4 } from '../utils';

export default class TodoForm extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      todo: '',
      starred: false,
    };
  }

  onSubmit() {
    if (!this.state.todo) return;
    this.props.addTodo(uuidv4(), this.props.id, this.state.todo, this.state.starred);
    this.setState({ todo: '', starred: false });
  }

  onStarred() {
    this.setState({ starred: !this.state.starred });
  }

  render() {
    const { todo, starred } = this.state;

    return (
      <View style={styles.container}>
        <View style={[styles.placeholder, { paddingTop: 2 }]}>
           <Icon name="plus" size={24} color="white" /> 
        </View>

        <View style={styles.wrap}>
          <TextInput
            style={styles.title}
            placeholder={this.props.id == 'starred' ? 'Add a to-do to "Inbox"' : 'Add a to-do...'}
            placeholderTextColor={'white'}
            value={todo}
            autoCapitalize={'words'}
            onChangeText={todo => this.setState({ todo })}
            returnKeyType={'done'}
            onSubmitEditing={this.onSubmit.bind(this)}
          />
        </View>

        <TouchableOpacity
          style={styles.placeholder}
          activeOpacity={1}
          onPress={this.onStarred.bind(this)}
        >
           <Icon
            name={'star' + (starred ? '' : '-outline')}
            size={24}
            color={'white'}
          /> 
        </TouchableOpacity>
      </View>
    );
  }
}

const size = 50;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(88,141,100,0.8)',
    borderRadius: 2,
    marginBottom: 5,
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
    color: '#fff',
    height: size,
    lineHeight: size,
    fontSize: 16,
    backgroundColor: 'transparent'
  },
  wrap: {
    flex: 1,
    justifyContent: 'center',
  }
});