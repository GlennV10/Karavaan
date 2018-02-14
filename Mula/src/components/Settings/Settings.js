import React, {Component} from 'react';
import {AsyncStorage, StyleSheet, View, Image, Text, TextInput, Button, TouchableOpacity, BackHandler, Picker} from 'react-native';
import {StackNavigator} from 'react-navigation';
import I18n from 'react-native-i18n';

export default class Settings extends Component{

    componentDidMount() {
        this.props.navigation.addListener("didFocus", () => BackHandler.addEventListener('hardwareBackPress', this._handleBackButton));
        this.props.navigation.addListener("willBlur", () => BackHandler.removeEventListener('hardwareBackPress', this._handleBackButton))
    }

    _handleBackButton = () => {
        this.props.navigation.navigate('Dashboard');
    }

    logout() {
        
    }

    render(){
        return(
            <View style={styles.container}>
                <Text>Taal</Text>
                <Picker selectedValue={this.state.language} onValueChange={(itemValue, itemIndex) => this.setState({language: itemValue})}>
                    <Picker.Item label="Nederlands" value="Nederlands" />
                    <Picker.Item label="English" value="English" />
                </Picker>
                <TouchableOpacity style={styles.registerButton} onPress={() => this.props.navigation.navigate('Login')}>
                    <Text style={styles.buttonText}>Afmelden</Text>
                </TouchableOpacity>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#6fc2b0',
        alignSelf: 'stretch'
    },
});