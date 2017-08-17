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
    StyleSheet, View, Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../actions'
import SettingsList from 'react-native-settings-list';
import OrbotHelper from '../native/OrbotHelper'
import prompt from 'react-native-prompt-android';

const { width, height } = Dimensions.get('window');


class SettingsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hsHost: ''
        };
        OrbotHelper.getOnionAddress(hsHost => {
            if (hsHost == '') {
                hsHost = "No Hidden Service, click to setup";
            }
            this.setState({hsHost})
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <SettingsList
                    borderColor='#d6d5d9'>
                    <SettingsList.Header
                        headerText={"PROFILE"}
                    />
                    <SettingsList.Item
                        title="Name"
                        hasNavArrow={false}
                        titleStyle={{color:'black', fontSize: 16}}
                        titleInfo={this.props.name}
                        onPress={this.onPressName.bind(this)}
                    />
                    <SettingsList.Header
                        headerText={"TOR"}
                    />
                    <SettingsList.Item
                        title="Onion Address"
                        hasNavArrow={false}
                        titleStyle={{color:'black', fontSize: 16}}
                        titleInfo={this.state.hsHost}
                        onPress={() => OrbotHelper.requestHiddenServicePort()}
                    />
                </SettingsList>
            </View>
        );
    }

    onPressName() {
        prompt(
            'Enter name',
            '',
            [
                {text: 'Cancel', style: 'cancel'},
                {text: 'OK', onPress: name => this.props.dispatch(actions.setName(name))}
            ],
            {
                defaultValue: !this.props.name ? '' : this.props.name
            }
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        // padding: 10
        paddingLeft: 16
    }
});

const mapStateToProps = (state, ownProps) => {
    return {
        name: state.name
    };
}

export default connect(mapStateToProps)(SettingsScreen)