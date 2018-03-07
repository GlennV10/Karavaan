import React, {Component} from 'react';
import {AsyncStorage, StyleSheet, Vibration, View, Image, Text, TextInput, NetInfo, Button, TouchableOpacity, BackHandler, Alert} from 'react-native';
import {StackNavigator} from 'react-navigation';
import I18n from 'react-native-i18n';

import sha1 from 'sha1';

export default class Login extends Component{

    constructor(props) {
        super(props);
        this.state = {
            fetchedChallenge: false,
            autheticated: false,
            password: "",
            username: "" ,
            alreadyLoggedIn: false,
            checkLogin: true,
            online: false
        }
        this._handleFirstConnectivityChange = this._handleFirstConnectivityChange.bind(this);
    }

    componentWillMount() {

    }

    componentDidMount() {
        this.props.navigation.addListener("didFocus", () => this.componentOnFocus());
        this.props.navigation.addListener("willBlur", () => this.componentOnBlur());
    }

    componentOnFocus() {
        NetInfo.addEventListener('connectionChange', this._handleFirstConnectivityChange);
        this._handleFirstConnectivityChange();
        BackHandler.addEventListener('hardwareBackPress', this._handleBackButton);
    }
    
    componentOnBlur() {
        NetInfo.removeEventListener('connectionChange', this._handleFirstConnectivityChange);
        BackHandler.removeEventListener('hardwareBackPress', this._handleBackButton)
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

    _handleFirstConnectivityChange() {
        NetInfo.getConnectionInfo().then((connectionInfo) => {
            if(connectionInfo.type == "none" || connectionInfo.type == "unknown") this.setState({ online: false }) & console.log("went offline");
            else this.setState({ online: true }) & console.log("went online");
        }).catch((error) => console.log(error));
    }

    sendLoginRequest(){
        if(this.state.online) {
            url = "http://193.191.177.73:8080/karafinREST/checkPassword/" + this.state.username;
            return fetch(url,{
                method: 'POST',
                body: JSON.stringify({
                    password: this.state.password
                })
            })
            .then((response) => {
                if(response._bodyText === "true"){
                    this.setState({autheticated: true});
                    this.moveOn();
                } else {
                    Vibration.vibrate(500);
                    this.setState({autheticated: false});
                    Alert.alert(
                        I18n.t('error'),
                        I18n.t('errormessage'), [{
                            text: 'OK',
                            onPress: () => console.log('Ok pressed on Login error message'),
                        }], {
                            cancelable: false
                        }
                    )
                }
            }).catch((error)=> console.log("ERROR: " + error));
        }
        else {
            Alert.alert(
                I18n.t('error'),
                I18n.t('errorinternet'), [{
                    text: 'OK',
                    onPress: () => console.log('Ok pressed on Login internet error message'),
                }], {
                    cancelable: false
                }
            )
        }
    }

    moveOn(){
	    this.registerToDevice();
        if(this.state.autheticated){
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

    render(){
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
                        placeholder={I18n.t('email')}
                        underlineColorAndroid="transparent"
                        placeholderTextColor="#fff"
                        returnKeyType="next"
                        keyboardType="email-address"
                        onChangeText={(usernameText) => this.setState({username: usernameText})}
                        onSubmitEditing={() => this.passwordInput.focus()}></TextInput>
                    <TextInput
                        style={styles.inputField}
                        secureTextEntry
                        placeholder={I18n.t('password')}
                        underlineColorAndroid="transparent"
                        placeholderTextColor="#fff"
                        returnKeyType="go"
                        onChangeText={(passwordText) => this.setState({password: passwordText})}
                        ref={(input) => this.passwordInput = input}
                        onSubmitEditing={() => this.sendLoginRequest()}></TextInput>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.loginButton} onPress={() => this.sendLoginRequest()}>
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
        borderBottomWidth: 0,
        borderRadius: 5
    },inputField:{
        marginLeft: 30,
        marginRight: 30,
        fontSize: 17,
        padding: 10,
        marginBottom: 2,
        color: '#fff',
        borderBottomWidth: 0,
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
