import React, {Component} from 'react';
import {AsyncStorage, StyleSheet, View, Image, Text, TextInput, Button, TouchableOpacity, BackHandler, Picker, Alert, ScrollView} from 'react-native';
import {StackNavigator} from 'react-navigation';
import I18n from 'react-native-i18n';

export default class Settings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            username: "",
            password: "",
            language: "",
            chosenLanguage: "",
            currency: ""
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('userName').then((username) => {
            this.setState({ username });
        });
        AsyncStorage.getItem('language').then((language) => {
            this.setState({ language });
            if(language == "English") this.setState({ chosenLanguage: "English" });
            if(language == "Dutch") this.setState({ chosenLanguage: "Nederlands" });
        });
        AsyncStorage.getItem('currency').then((currency) => {
            this.setState({ currency });
        });
        this.props.navigation.addListener("didFocus", () => BackHandler.addEventListener('hardwareBackPress', this._handleBackButton));
        this.props.navigation.addListener("willBlur", () => BackHandler.removeEventListener('hardwareBackPress', this._handleBackButton))
    }

    _handleBackButton = () => {
        this.props.navigation.navigate('DashboardTrips');
        return true;
    }

    updateLanguage(newLanguage) {
        console.log(newLanguage);
        this.setState({ language: newLanguage });
        AsyncStorage.setItem('language', newLanguage).then(console.log("Language updated to " + newLanguage));
        if (newLanguage == 'English') {
            I18n.locale = 'en';
            this.setState({ chosenLanguage: "English" });
            console.log('en');
        }
        else if (newLanguage == 'Dutch') {
            I18n.locale = 'nl';
            this.setState({ chosenLanguage: "Nederlands" });
            console.log('nl');
        }
        this.props.navigation.setParams({
            title: I18n.t('settings')
        });
    }

    updateCurrency(newCurrency) {
        this.setState({ currency: newCurrency });
        AsyncStorage.setItem('currency', newCurrency).then(console.log("Currency updated to " + newCurrency));
    }

    logout() {
        try {
            Alert.alert(
                I18n.t('logout'),
                I18n.t('logoutmessage'), [{
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                }, {
                    text: 'OK',
                    onPress: () => {
                        AsyncStorage.removeItem("userName").then(console.log("Logged out"));
                        this.props.navigation.navigate('Login');
                    }
                },], {
                    cancelable: false
                }
            )
        } catch (error) {
            console.log(error);
        }
    }

    render(){
        return(
            <ScrollView style={styles.container}>
                <TouchableOpacity style={styles.profileButton}>
                    <Image source={require('../../images/placeholder_user.png')} style={styles.profileImage} />
                </TouchableOpacity>
                <TextInput
                    style={styles.inputField}
                    placeholder="Firstname Name"
                    underlineColorAndroid="#ffd185"
                    placeholderTextColor="#111"
                    returnKeyType="next"
                    onChangeText={(nameText) => this.setState({ name: nameText })}
                    onSubmitEditing={() => this.passwordInput.focus()}></TextInput>
                <TextInput
                    style={styles.inputField}
                    placeholder="Username/Email"
                    underlineColorAndroid="#ffd185"
                    placeholderTextColor="#111"
                    returnKeyType="next"
                    onChangeText={(usernameText) => this.setState({ username: usernameText })}
                    onSubmitEditing={() => this.passwordInput.focus()}></TextInput>
                <TextInput
                    style={styles.inputField}
                    secureTextEntry
                    placeholder="Password"
                    underlineColorAndroid="#ffd185"
                    placeholderTextColor="#111"
                    returnKeyType="done"
                    onChangeText={(passwordText) => this.setState({ password: passwordText })}
                    ref={(input) => this.passwordInput = input}></TextInput>
                <Text>{I18n.t('lang')} {this.state.chosenLanguage} </Text>
                <Picker selectedValue={this.state.language} onValueChange={(itemValue, itemIndex) => this.updateLanguage(itemValue)}>
                    <Picker.Item label="Dutch" value="Dutch" ref={(input) => this.dutchPicker = input}/>
                    <Picker.Item label="English" value="English" ref={(input) => this.englishPicker = input}/>
                </Picker>
                <Text>{I18n.t('currency')} {this.state.currency}</Text>
                <Picker selectedValue={this.state.currency} onValueChange={(itemValue, itemIndex) => this.updateCurrency(itemValue)}>
                    <Picker.Item label="Euro" value="Euro" />
                    <Picker.Item label="American Dollar" value="USD" />
                </Picker>

                <TouchableOpacity style={styles.logoutButton} onPress={() => this.logout()}>
                    <Text style={styles.logoutText}>{I18n.t('logout')}</Text>
                </TouchableOpacity>
            </ScrollView>
        )
    }

}

const styles = StyleSheet.create({
    container: {
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
    inputField: {
        padding: 10
    },
    logoutButton: {
        height: 40,
        alignItems: 'center',
        backgroundColor: '#ffd185',
        borderRadius: 5
    },
    logoutText: {
        fontSize: 15,
        lineHeight: 28,
        color: '#303030',
        textAlign: 'center'
    }
});
