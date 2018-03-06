import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput, Button, ToolbarAndroid, Image, TouchableOpacity} from 'react-native';
import {StackNavigator} from 'react-navigation';
import I18n from 'react-native-i18n';

export default class Register extends React.Component {
    state = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    }

    checkReqs() {
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
    }

    validMail(mail){
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(mail);
    }

    render() {
      return (
        <View style={styles.container}>
             <View style={styles.logoContainer}>
             <Image
                 style={styles.logo}
                 source={require('../../images/placeholder_user.png')}
                 />
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
        width: 100,
        height: 100,
        backfaceVisibility: 'hidden',
        backgroundColor: 'transparent',
        borderRadius: 50
    },
});
