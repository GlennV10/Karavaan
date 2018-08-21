import React, { Component, cloneElement } from 'react';
import { StyleSheet, KeyboardAvoidingView, View, Image, NetInfo, Text, TextInput, Button, Modal, TouchableOpacity, ScrollView, Picker, AsyncStorage, Label, FlatList } from 'react-native';
import { StackNavigator } from 'react-navigation';
import I18n from 'react-native-i18n';

export default class TripParticipants extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            firstName: "",
            lastName: "",
            email: "",
            trip: 0,
            participants: [],
            connectionMode: false
        };
        this._handleFirstConnectivityChange = this._handleFirstConnectivityChange.bind(this);
    }

    UNSAFE_componentWillMount() {

    }

    componentDidMount() {
        this.props.navigation.addListener("didFocus", () => this.componentOnFocus());
        this.props.navigation.addListener("willBlur", () => this.componentOnBlur());
    }

    componentOnFocus() {
        NetInfo.addEventListener('connectionChange', this._handleFirstConnectivityChange);
        this._handleFirstConnectivityChange();
    }

    componentOnBlur() {
        NetInfo.removeEventListener('connectionChange', this._handleFirstConnectivityChange);
    }

    _handleFirstConnectivityChange() {
        NetInfo.getConnectionInfo().then((connectionInfo) => {
            if (connectionInfo.type == "none" || connectionInfo.type == "unknown") this.setState({ connectionMode: "offline" }) & console.log("went offline");
            else this.setState({ connectionMode: "online" }) & console.log("went online");
        }).catch((error) => console.log(error));
    }

    async checkEmail() {
        if (this.state.email === null || this.state.email === "") {
            await this.addDummyParticipant()
            await this.addParticipant()
        } else {
            await this.addParticipant()
        }
    }

    addDummyParticipant() {
        this.state.errors = [];
        console.log("dummy")
        var url = "http://193.191.177.73:8080/karafinREST/addDummyPerson/" + this.state.firstName + "/" + this.state.lastName
        return fetch(url, {
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            }

        })

            .then((res) => res.json())
            .then((response) => {
                console.log("added dummy successfully: ");
                console.log(response.email)
                this.setState({ email: response.email })
            }).catch(error => this.checkError(error));
    }

    checkError(error) {
        if (error === "Participant already added.") {
            alert(I18n.t('alreadyadded'))
            this.clearFields()
        } else if (error === "Invalid arguments") {
            this.clearEmail()
            alert(I18n.t('falseemail'))
        } else {
            this.clearFields()
        }


    }

    addParticipant() {
        console.log("addParticipant");
        try {
        if (this.state.firstName === null || this.state.firstName === "") {
            alert("Firstname cannot be empty")
        } else if (this.state.lastName === null || this.state.lastName === ""){
            alert("Lastname cannot be empty")
        } else {
            console.log(this.props.navigation.state.params.trip.id)
        var url = "http://193.191.177.73:8080/karafinREST/addPersonToTripFromEmail/" + this.state.email + "/" + this.props.navigation.state.params.trip.id
        console.log(url);
        alert(this.state.firstName + " " + this.state.lastName + " toegevoegd");
        return fetch(url, {
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            }

        })
            .then((response) => {
                this.checkError(response._bodyText)
                

            }).catch(error => console.log("network/rest error"));
        }
    } catch (error) {
        alert("Email bestaat niet")
        }

        
    }

    clearFields() {
        this.setState({ firstName: "", lastName: "", email: "" })
    }

    clearEmail() {
        this.setState({ email: "" })
    }

    //}
    //alert(this.state.errors)



    //////////////////////////////////////////////////////////
    ////////////////////CURRENCY//////////////////////////////
    moveOn() {
        console.log('moveOn');
        this.props.navigation.navigate('DashboardTrips');
    }





    render() {
        return (
            <ScrollView style={styles.container}>


                <View style={styles.separator}>
                    <TextInput
                        ref="firstName"
                        placeholder={I18n.t('first')}
                        value={this.state.firstName}
                        style={styles.inputField}
                        underlineColorAndroid="transparent"
                        placeholderTextColor="#818181"
                        onChangeText={(text) => console.log(text) & this.setState({ firstName: text })} />
                </View>
                <View style={styles.separator}>
                    <TextInput
                        ref="lastName"
                        placeholder={I18n.t('last')}
                        value={this.state.lastName}
                        style={styles.inputField}
                        underlineColorAndroid="transparent"
                        placeholderTextColor="#818181"
                        onChangeText={(text) => console.log(text) & this.setState({ lastName: text })} />
                </View>
                <View style={styles.separator}>
                    <TextInput
                        ref="email"
                        placeholder="Email"
                        value={this.state.email}
                        style={styles.inputField}
                        underlineColorAndroid="transparent"
                        placeholderTextColor="#818181"
                        onChangeText={(text) => console.log(text) & this.setState({ email: text })} />
                </View>

                <View style={styles.addParticipantStyle}>
                    <Button color="#edc14f"
                        title={I18n.t('addparticipant')}
                        onPress={() => this.checkEmail()}

                    />
                </View>

                <Button color="#edc14f"
                    title={I18n.t('createtrip')}
                    onPress={() => this.moveOn()}

                />


            </ScrollView>

        );
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#d4e8e5',
        paddingTop: 10,
        paddingLeft: 20,
        paddingRight: 20
    },
    multi: {
        backgroundColor: '#d4e8e5',
        margin: 10
    },
    parts: {

    },
    input: {
        backgroundColor: '#d4e8e5',
        flex: 0.2
    },
    inputdate: {
        backgroundColor: '#d4e8e5',
        flex: 0.75
    },
    textfield: {
        paddingBottom: 8,
        marginBottom: 10

    },
    separator: {
        borderBottomColor: '#bbb',
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginBottom: 5
    },
    addParticipantStyle: {
        marginBottom: 10
    }




});