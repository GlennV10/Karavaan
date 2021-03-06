import React, { Component } from 'react';
import { AsyncStorage, StyleSheet, View, Image, Text, TextInput, Button, TouchableOpacity, BackHandler, Picker, Alert, ScrollView } from 'react-native';
import { StackNavigator } from 'react-navigation';
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
            currency: "",
            friendtoadd: "",
            currentpass: "",
            newpass: "",
            repeatnewpass: "",
            user: ""
        }
    }

    UNSAFE_componentWillMount() {
        AsyncStorage.getItem('userName').then((username) => {
            this.setUser(username);
            this.setState({ username });
        });
        AsyncStorage.getItem('language').then((language) => {
            this.setState({ language });
            if (language == "English") this.setState({ chosenLanguage: "English" });
            if (language == "Dutch") this.setState({ chosenLanguage: "Nederlands" });
        });
    }

    componentDidMount() {
        AsyncStorage.getItem('currency').then((currency) => {
            this.setState({ currency });
        });
    }

    setUser(username) {
        let url = 'http://193.191.177.73:8080/karafinREST/getPerson/' + username;

        return fetch(url, {
              method: 'GET',
              header: {
                  'Content-Type': 'application/json'
              }
          })
          .then((res) => res.json())
          .then((user) => {
            this.setState({ user });
            this.setState({name: user.firstName + " " + user.lastName});
          }).catch(error => console.log("network/rest error"));
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

    renderLanguagePicker = () => {
        console.log("chosen: " + this.state.chosenLanguage)
        if (this.state.chosenLanguage == 'English') {
            return (
                <Picker selectedValue={this.state.language} onValueChange={(itemValue) => this.updateLanguage(itemValue)}>
                    <Picker.Item label="English" value="English" />
                    <Picker.Item label="Dutch" value="Dutch" />
                </Picker>
            );
        }
        else if (this.state.chosenLanguage == 'Nederlands') {
            return (
                <Picker selectedValue={this.state.language} onValueChange={(itemValue) => this.updateLanguage(itemValue)}>
                    <Picker.Item label="Nederlands" value="Dutch" />
                    <Picker.Item label="Engels" value="English" />
                </Picker>
            );
        }
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

    checkPassword() {
      url = "http://193.191.177.73:8080/karafinREST/checkPassword/" + this.state.username;
      return fetch(url,{
          method: 'POST',
          body: JSON.stringify({
              password: this.state.currentpass
          })
      })
      .then((response) => {
          return response._bodyText
      })
      .catch((error)=> console.log("ERROR: " + error));
    }

    changePass() {
        if(this.checkPassword())  {
            if (this.state.newpass == this.state.repeatnewpass) {
                let user = this.state.user;
                user.password = this.state.newpass;
                user.oldPassword = this.state.currentpass;
                try {
                    return fetch('http://193.191.177.73:8080/karafinREST/updatePerson/' + this.state.username, {
                        method: 'PUT',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(user)
                    })
                    .then((res) => alert(res._bodyText))
                }
                catch (error) {
                    alert(I18n.t('notexist'));
                }
            } else {
                alert(I18n.t('nomatch'))
            }
        } else {
            alert("Old password didn't match");
        }
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.separator}>
                    <View style={styles.profilesettings}>
                        <TouchableOpacity style={styles.profileButton}>
                            <Image source={require('../../images/placeholder_user.png')} style={styles.profileImage} />
                        </TouchableOpacity>
                    </View>
                    <Text style={{  alignSelf: 'center', fontSize: 19, marginBottom: 20 }}>{this.state.name}</Text>
                    <Text>{I18n.t('lang')} {this.state.chosenLanguage} </Text>
                    {this.renderLanguagePicker()}
                    <Text>{I18n.t('currency')} {this.state.currency}</Text>
                    <Picker selectedValue={this.state.currency} onValueChange={(itemValue) => this.updateCurrency(itemValue)}>
                        <Picker.Item label="EUR" value="EUR" />
                        <Picker.Item label="USD" value="USD" />
                    </Picker>
                </View>

                <View>
                    <TextInput
                        style={styles.inputField}
                        placeholder={I18n.t('currentpass')}
                        secureTextEntry
                        underlineColorAndroid="#ffd185"
                        placeholderTextColor="#bfbfbf"
                        returnKeyType="next"
                        onChangeText={(current) => this.setState({ currentpass: current })}
                        ref={(input) => this.currentpassinput = input}
                        onSubmitEditing={() => this.newpassinput.focus()}></TextInput>
                    <TextInput
                        style={styles.inputField}
                        placeholder={I18n.t('newpass')}
                        secureTextEntry
                        underlineColorAndroid="#ffd185"
                        placeholderTextColor="#bfbfbf"
                        returnKeyType="next"
                        onChangeText={(newpas) => this.setState({ newpass: newpas })}
                        ref={(input) => this.newpassinput = input}
                        onSubmitEditing={() => this.repeatnewpassinput.focus()}></TextInput>
                    <TextInput
                        style={styles.inputField}
                        secureTextEntry
                        placeholder={I18n.t('repeatpass')}
                        underlineColorAndroid="#ffd185"
                        placeholderTextColor="#bfbfbf"
                        returnKeyType="done"
                        ref={(input) => this.repeatnewpassinput = input}
                        onChangeText={(repeat) => this.setState({ repeatnewpass: repeat })}
                    ></TextInput>

                    <TouchableOpacity style={styles.button} onPress={() => this.changePass()}>
                        <Text style={styles.buttonText}>{I18n.t('changepass')}</Text>
                    </TouchableOpacity>

                </View>

                <TouchableOpacity style={styles.button} onPress={() => this.logout()}>
                    <Text style={styles.buttonText}>{I18n.t('logout')}</Text>
                </TouchableOpacity>

                <Text> {'\n'} </Text>
            </ScrollView>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        alignSelf: 'stretch',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 25
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40
    },
    profileButton: {
        alignSelf: 'center',
        marginBottom: 10
    },
    inputField: {
        padding: 10
    },
    button: {
        height: 40,
        alignItems: 'center',
        backgroundColor: '#ffd185',
        borderRadius: 5,
        marginTop: 10
    },
    buttonText: {
        fontSize: 15,
        lineHeight: 28,
        color: '#303030',
        textAlign: 'center'
    },
    addFriend: {
        marginBottom: 10,

    },
    separator: {
        borderBottomColor: '#bbb',
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginBottom: 5,
        marginTop: 5
    }
});
