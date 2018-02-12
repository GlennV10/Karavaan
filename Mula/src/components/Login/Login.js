import React, {Component} from 'react';
import {AsyncStorage, StyleSheet, View, Image, Text, TextInput, Button, TouchableOpacity} from 'react-native';
import {StackNavigator} from 'react-navigation';
import sha1 from 'sha1'

export default class Login extends Component{
    // constructor(props){
    //     super(props);

    //     this.state = {
    //         username: "",
    //         password: ""
    //     };
    // }

    state = {
        fetchedChallenge: false,
        autheticated: false,
        password: "",
        username: "" ,
        alreadyLoggedIn: false,
        checkLogin: true,
        loadConnection: true
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
                this.moveOn();
            }
        }).catch((error)=> console.log("ERROR: " + error));
    }

    moveOn(){
	    this.registerToDevice();
        if(this.state.autheticated){
            this.props.navigation.navigate('Dashboard');
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
                        placeholder="Username (email)"
                        underlineColorAndroid="transparent"
                        placeholderTextColor="#818181"
                        returnKeyType="next"
                        keyboardType="email-address"
                        onChangeText={(usernameText) => this.setState({username: usernameText})}
                        onSubmitEditing={() => this.passwordInput.focus()}></TextInput>
                    <TextInput
                        style={styles.inputField}
                        secureTextEntry
                        placeholder="Password"
                        underlineColorAndroid="transparent"
                        placeholderTextColor="#818181"
                        returnKeyType="go"
                        onChangeText={(passwordText) => this.setState({password: passwordText})}
                        ref={(input) => this.passwordInput = input}
                        onSubmitEditing={() => this.getChallenge(this.state.username)}></TextInput>
                </View>
                <View style={styles.buttonContainer}>
                    <Button style={styles.formButton}
                        title="Login"
                        onPress={() => this.getChallenge(this.state.username) /*& this.props.navigation.navigate('Dashboard')*/ }
                        />
                    <Button title="Register" color="#818181"
                        onPress={()=> this.props.navigation.navigate('Register')  }/>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'rgba(176,207,227,34)',
        alignSelf: 'stretch'
    },
    logoContainer:{
        alignItems: 'center',
        flexGrow: .3,
        justifyContent: 'center'
    },
    logo:{
        width: 150,
        height: 33
    },
    formContainer:{
        flexGrow:.3
    },
    inputField:{
        marginLeft: 50,
        marginRight: 50,
        fontSize: 20,
        padding: 10,
        backgroundColor: 'rgba(255,255,255,.2)',
        marginBottom: 15,
        color: '#000',
        borderBottomWidth: 0,
        borderRadius: 5
    },
    buttonContainer:{
        marginLeft: 50,
        marginRight:50,
        justifyContent: 'space-between'
    }
});
