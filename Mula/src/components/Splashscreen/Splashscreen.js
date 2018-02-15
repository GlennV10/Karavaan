import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput, Button, ToolbarAndroid, Image, AsyncStorage} from 'react-native';
import {StackNavigator} from 'react-navigation';
import { NavigationActions } from 'react-navigation';
import I18n from 'react-native-i18n';

export default class Splashscreen extends React.Component {

    componentWillMount() {
       /*const resetAction = NavigationActions.reset({
            index: 0,
            actions: [

              NavigationActions.navigate({ routeName: 'Login'}),
            ]
          })
          this.props.navigation.dispatch(resetAction)*/

        //setTimeout(() => this.props.navigation.navigate('Login'), 3000);
          this.checkSettings();
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
                if(currency!= null) AsyncStorage.setItem('currency', currency).then(console.log("Currency" + currency + " written to memory."));
                else {AsyncStorage.setItem('currency', "Euro").then(console.log("Currency 'Euro' written to memory."));}
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
                console.log(username);
                if(username != null){
                    setTimeout(() => this.props.navigation.navigate('Dashboard'), 2000);
                } else {
                    setTimeout(() => this.props.navigation.navigate('Login'), 2000);
                }
            })
        } catch(error) {
            console.log(error);
        }
    }

    render() {
        this.checkIfLoggedIn();

        return (
        <View style={styles.container}>
            <Image
                style={{width: 200, height: 133}}
                source={require('../../images/Karavaan_pos.png')}
            />
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
