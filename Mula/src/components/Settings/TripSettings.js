import React, {Component} from 'react';
import {AsyncStorage, StyleSheet, View, Image, Text, TextInput, Button, TouchableOpacity, BackHandler, Picker, Alert} from 'react-native';
import {StackNavigator} from 'react-navigation';
import I18n from 'react-native-i18n';

export default class Settings extends Component{

    constructor(props) {
        super(props);
        this.state = {
          name: "",
          username: "",
          password: "",
          language: "",
          currency: ""
        }
    }

    componentDidMount() {
        
        AsyncStorage.getItem('currency').then((currency) => {
            this.setState({ currency });
        });
        this.props.navigation.addListener("didFocus", () => BackHandler.addEventListener('hardwareBackPress', this._handleBackButton));
        this.props.navigation.addListener("willBlur", () => BackHandler.removeEventListener('hardwareBackPress', this._handleBackButton))
    }

    _handleBackButton = () => {
        this.props.navigation.navigate('Dashboard');
        return true;
    }

    updateCurrency(newCurrency) {
        this.setState({ currency: newCurrency});
        AsyncStorage.setItem('currency', newCurrency).then(console.log("Currency updated to " + newCurrency));
    }

    render(){
        return(
            <View style={styles.container}>
                <Text>{I18n.t('currency')}</Text>
                <Picker selectedValue={this.state.currency} onValueChange={(itemValue, itemIndex) => this.updateCurrency(itemValue)}>
                    <Picker.Item label="Euro" value="Euro" />
                    <Picker.Item label="American Dollar" value="USD" />
                </Picker>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#FFFFFF',
        alignSelf: 'stretch',
        padding: 20
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40  
    },
    profileButton: {
        alignSelf: 'center'
    },
    logoutButton: {
        height: 40,
        alignItems: 'center',
        backgroundColor: '#ffd185',
        borderRadius: 5
    },
    logoutText: {
        fontSize: 12,
        lineHeight: 28,
        color: '#303030',
        textAlign: 'center'
    }
});