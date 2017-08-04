import React, { Component } from 'react';
import { 
    StyleSheet, TextInput, View, TouchableOpacity 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Store from '../lib/store'

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
    Store.addListTodo(this.props.keyid, this.state.todo, this.state.starred);
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
            placeholder={'Add a to-do...'}
            placeholderTextColor={'white'}
            value={todo}
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