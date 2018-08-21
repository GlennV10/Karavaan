import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput, Button, ToolbarAndroid, Image, AsyncStorage, TouchableOpacity, Linking} from 'react-native';
import I18n from 'react-native-i18n';

export default class Splashscreen extends React.Component {

    constructor(props) {
        super(props);
    }

    UNSAFE_componentWillMount() {
        console.disableYellowBox = true;
          this.checkSettings();
          this.checkIfLoggedIn();
    }

    checkSettings() {
        try {
            AsyncStorage.getItem('language').then((language) => {
                if(language!= null) {
                    if(language=="English") {
                        I18n.locale = "en";
                    }
                    if(language=="Dutch") {
                        I18n.locale = "nl";
                    }
                }
                else {
                    AsyncStorage.setItem('language', "Dutch").then(console.log("Language 'Dutch' written to memory."));
                    I18n.locale = 'nl';
                }
            });
            AsyncStorage.getItem('currency').then((currency) => {
                if(currency!= null) console.log("Currency " + currency + " in memory.");
                else {AsyncStorage.setItem('currency', "EUR").then(console.log("Currency 'EUR' written to memory."));}
            });
        } catch(error){
            console.log(error);
        }
    }

    /*
    If username is in AsyncStorage => navigate to Dashboard
    If username is not in AsyncStorage => navigate to LoginScreen
    */
    checkIfLoggedIn(){
        try{
            AsyncStorage.getItem('userName').then((username) => {
                if(username != null){
                    console.log("Logged in");
                    setTimeout(() => this.props.navigation.navigate('DashboardTrips'), 1500);
                } else {
                    console.log("Not logged in");
                    setTimeout(() => this.props.navigation.navigate('Login'), 1500);
                }
            })
        } catch(error) {
            console.log(error);
        }
    }

    render() {
        return (
        <View style={styles.container}>
            <TouchableOpacity 
                onPress={() => Linking.openURL('https://www.Karavaan.be')}>
            <Image
                style={{width: 200, height: 133}}
                source={require('../../images/Karavaan_pos.png')}
            />
            </TouchableOpacity>
        </View>
        );
    }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#6FC2B0',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
