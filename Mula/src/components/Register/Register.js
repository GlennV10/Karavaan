import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput, Button, BackHandler, ToolbarAndroid, NetInfo, Image, TouchableOpacity, Alert} from 'react-native';
import {StackNavigator} from 'react-navigation';
import I18n from 'react-native-i18n';

export default class Register extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            online: false
        }
        this._handleFirstConnectivityChange = this._handleFirstConnectivityChange.bind(this);
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
        this.props.navigation.navigate('Login');
        return true;
     }
 
     _handleFirstConnectivityChange() {
        NetInfo.getConnectionInfo().then((connectionInfo) => {
            if(connectionInfo.type == "none" || connectionInfo.type == "unknown") this.setState({ online: false }) & console.log("went offline");
            else this.setState({ online: true }) & console.log("went online");
        }).catch((error) => console.log(error));
    }

    checkReqs() {
        if(this.state.online) {
            if(this.state.firstName !== "" &
            this.state.lastName !== "" &
            this.state.email !== "" &
            this.validMail(this.state.email) &
            this.state.password !== "") {

                let person = {
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    email: this.state.email,
                    password: this.state.password
                }

                console.log(person);

                //POST Request
                return fetch('http://193.191.177.73:8080/karafinREST/addPerson', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(person)
                })
                .then((res) => this.props.navigation.navigate('Login'))
                .catch((error)=> console.log(error))
            } else {
                alert("Not everything matched");
            }
        } else {
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

    validMail(mail){
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(mail);
    }

    render() {
      return (
        <View style={styles.container}>
             <View style={styles.logoContainer}>
             <Text style={styles.logo}>KARAFIN</Text>
         </View>
            <TextInput
                placeholder={I18n.t('firstname')}
                style={styles.inputField}
                underlineColorAndroid="transparent"
                placeholderTextColor="#bfbfbf"
                onChangeText={(text)=>this.setState({firstName: text})}
                onSubmitEditing={() => this.lastNameInput.focus()}
                returnKeyType="go"/>
            <TextInput
                placeholder={I18n.t('lastname')}
                style={styles.inputField}
                underlineColorAndroid="transparent"
                placeholderTextColor="#bfbfbf"
                onChangeText={(text)=>this.setState({lastName: text})}
                ref={(input) => this.lastNameInput = input}
                onSubmitEditing={() => this.emailInput.focus()}
                returnKeyType="go"/>
            <TextInput
                placeholder={I18n.t('email')}
                style={styles.inputField}
                underlineColorAndroid="transparent"
                placeholderTextColor="#bfbfbf"
                keyboardType="email-address"
                onChangeText={(text)=>this.setState({email: text})}
                ref={(input) => this.emailInput = input}
                onSubmitEditing={() => this.password1Input.focus()}
                returnKeyType="go"/>
            <TextInput
                placeholder={I18n.t('password')}
                style={styles.inputField}
                secureTextEntry={true}
                underlineColorAndroid="transparent"
                placeholderTextColor="#bfbfbf"
                onChangeText={(text)=>this.setState({password: text})}
                ref={(input) => this.password1Input = input}
                returnKeyType="go"/>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.registerButton}
                  onPress={() => this.checkReqs()}>
                  <Text style={styles.buttonText}>{I18n.t('register')}</Text>
                </TouchableOpacity>
            </View>
        </View>
      );
    }
  }

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#fff',
        alignSelf: 'stretch'
    },
    inputField:{
        marginLeft: 30,
        marginRight: 30,
        fontSize: 17,
        padding: 10,
        marginBottom: 2,
        color: '#303030',
        borderBottomWidth: 0,
        borderRadius: 5
    },
    buttonContainer:{
        flex: 1,
        marginTop: 20,
        marginLeft: 30,
        marginRight: 30
    },
    registerButton: {
        height: 40,
        alignItems: 'center',
        backgroundColor: '#ffd185'
    },
    buttonText: {
        fontSize: 15,
        lineHeight: 28,
        color: '#303030',
        textAlign: 'center'
    },
    logoContainer:{
        alignItems: 'center',
        flexGrow: .3,
        justifyContent: 'center'
    },
    logo:{
        fontSize: 40,
        color: 'black'
    },
});
