import React, {Component} from 'react';
import {AsyncStorage, StyleSheet, View, Image, Text, TextInput, Button, TouchableOpacity, BackHandler, Alert} from 'react-native';
import {StackNavigator} from 'react-navigation';
import I18n from 'react-native-i18n';

import sha1 from 'sha1';

export default class Login extends Component{

    state = {
        fetchedChallenge: false,
        autheticated: false,
        password: "",
        username: "" ,
        alreadyLoggedIn: false,
        checkLogin: true,
        loadConnection: true
    }

    componentWillMount() {
        this.checkSettings();
    }

    componentDidMount() {
        this.props.navigation.addListener("didFocus", () => BackHandler.addEventListener('hardwareBackPress', this._handleBackButton));
        this.props.navigation.addListener("willBlur", () => BackHandler.removeEventListener('hardwareBackPress', this._handleBackButton));
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

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this._handleBackButton);
    }

    _handleBackButton = () => {
       Alert.alert(
            'Exit App',
            'Exiting the application?', [{
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
            }, {
                text: 'OK',
                onPress: () => BackHandler.exitApp()
            }, ], {
                cancelable: false
            }
        )

         return true;
    }

    getChallenge(usernameField){
        console.log(usernameField + "USERNAME GETCHALLENGE")
        return fetch('http://193.191.177.169:8080/mula/Controller?action=login',{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: usernameField
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log("RESPONSE: "+ responseJson.challenge);
            if(responseJson.challenge != null){
                this.sendLoginRequest(responseJson.challenge);
            }

        }).catch((error)=> console.log("ERROR: " + error));
    }

    sendLoginRequest(salt){
        var hashedPwd = sha1(sha1(this.state.password)+salt);
        return fetch('http://193.191.177.169:8080/mula/Controller?action=login',{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.username,
                psw: hashedPwd
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log("IS LOGIN SUCCESS: "+responseJson.login_succes);
            this.setState({autheticated: responseJson.login_succes});
            console.log(this.state.autheticated);
            if(responseJson.login_succes === "true"){
                console.log('test');
                this.moveOn();
            }
        }).catch((error)=> console.log("ERROR: " + error));
    }

    moveOn(){
	    this.registerToDevice();
        if(this.state.autheticated){
            console.log('test2');
            this.props.navigation.navigate('DashboardTrips');
        }
    }

   registerToDevice(){
       try{
            AsyncStorage.setItem('userName', this.state.username).then(console.log("Username written to memory."));
       }catch(error){
           console.log(error);
       }
   }

    checkIfLoggedIn(){
        try{
            AsyncStorage.getItem('userName').then((username)=>{
                if(username != null){
                    this.setState({alreadyLoggedIn: true, checkLogin: false});
                    if(this.state.alreadyLoggedIn){
                        this.props.navigation.navigate('Dashboard');
                    }
                }else{
                    console.log('Username not yet in memory.');
                    this.setState({alreadyLoggedIn: false, checkLogin: false});
                }
            })
            //========================================================================
            //                      CLEAR USERNAME/LOGIN
            //========================================================================
            //AsyncStorage.clear().then(()=>console.log("cleared"));
            //========================================================================

        }catch(error){
            console.log(error);
        }
    }

    connectionMode(){
        try{
            //========================================================================
            //                      SET INTERNET CONNECTION
            //========================================================================
            // AsyncStorage.setItem("connection", JSON.stringify(true)).then(console.log("Connection type set to true"));
            AsyncStorage.setItem('connectionStatus', "online").then(()=> this.setState({loadConnection: false}));
            //AsyncStorage.setItem('connectionStatus', "offline").then(()=> this.setState({loadConnection: false}));
            //========================================================================
        }catch(error){
            console.log(error);
        }
        // try{
        //     AsyncStorage.getItem('connection').then((status)=> this.setState({loadConnection: false}));
        // }catch(error){
        //     console.log(error);
        // }

    }

    render(){
        if(this.state.loadConnection){
            this.connectionMode();
        }

        if(this.state.checkLogin){
            this.checkIfLoggedIn();
        }
        return(
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image
                        style={styles.logo}
                        source={require('../../images/MulaLogoFiles/primary.png')}/>
                </View>
                <View style={styles.formContainer}>
                    <TextInput
                        style={styles.inputField}
                        placeholder={I18n.t('username')}
                        underlineColorAndroid="#ffd185"
                        placeholderTextColor="#fff"
                        returnKeyType="next"
                        keyboardType="email-address"
                        onChangeText={(usernameText) => this.setState({username: usernameText})}
                        onSubmitEditing={() => this.passwordInput.focus()}></TextInput>
                    <TextInput
                        style={styles.inputField}
                        secureTextEntry
                        placeholder={I18n.t('password')}
                        underlineColorAndroid="#ffd185"
                        placeholderTextColor="#fff"
                        returnKeyType="go"
                        onChangeText={(passwordText) => this.setState({password: passwordText})}
                        ref={(input) => this.passwordInput = input}
                        onSubmitEditing={() => this.getChallenge(this.state.username)}></TextInput>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.loginButton} onPress={() => this.getChallenge(this.state.username)}>
                        <Text style={styles.buttonText}>{I18n.t('login')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.registerButton} onPress={() => this.props.navigation.navigate('Register')}>
                        <Text style={styles.buttonText}>{I18n.t('register')}</Text>
                    </TouchableOpacity>
                </View>
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
    logoContainer:{
        marginTop: 100,
        alignItems: 'center',
        flexGrow: .3,
        justifyContent: 'center'
    },
    logo:{
        width: 150,
        height: 33
    },
    formContainer:{
        marginTop: 30
        // flexGrow:.3
    },
    inputField:{
        marginLeft: 30,
        marginRight: 30,
        fontSize: 17,
        padding: 10,
        marginBottom: 2,
        color: '#fff',
        borderRadius: 5
    },
    buttonContainer:{
        flex: 1,
        marginTop: 20,
        marginLeft: 30,
        marginRight: 30
    },
    loginButton: {
        height: 40,
        alignItems: 'center',
        backgroundColor: '#fff',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
    },
    registerButton: {
        height: 40,
        alignItems: 'center',
        backgroundColor: '#ffd185',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5
    },
    buttonText: {
        fontSize: 15,
        lineHeight: 28,
        color: '#303030',
        textAlign: 'center'
    }
});
