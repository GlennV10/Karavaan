import React, { Component, cloneElement } from 'react';
import { StyleSheet, KeyboardAvoidingView, View, Image, Text, TextInput, Button, Modal, TouchableOpacity, ScrollView, Picker, AsyncStorage, Label,FlatList  } from 'react-native';
import { StackNavigator } from 'react-navigation';

export default class TripParticipants extends Component{

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            firstName: "",
            lastName: "",
            email:"",
            trip: 0,
            participants:[],
            online: false
        };
    }

    componentDidMount() {

    }

    addParticipant() {

        this.state.errors = [];
   
        //if(this.isValid()){
            console.log(this.state.paling)            
    
            if (this.state.online === true) {
                if(this.state.email == null){
                    var url = "https://193.191.177.73:8181/karafinREST/addPersonToTripFromEmail/"+this.state.userName+"/"+this.props.navigation.state.params.trip.id
                    return fetch('url', {
                        method: 'GET',
                        header: {
                            'Content-Type': 'application/json'
                        }
                        
                    })
                        .then((res) => res.json())
                        .then((response) => {
                            console.log("added participants successfully: ");
                            this.moveOn();
                            
                        }).catch(error => console.log("network/rest error"));
                }
                else{
                    var url = "dummy"
                    return fetch('url', {
                        method: 'GET',
                        header: {
                            'Content-Type': 'application/json'
                        }
                        
                    })
                    .then((res) => res.json())
                    .then((response) => {
                        console.log("added participants successfully: ");
                        this.moveOn();
                        
                    }).catch(error => console.log("network/rest error"));
                }
            }
                
            else {
                AsyncStorage.getItem('participants')
                .then(req => JSON.parse(req))
                .then((trips) => {
                    this.setState({ participants: participants})
                })
                .catch(error => console.log('Error loading participants'));
                if(this.state.email != null){
                    this.state.participants.push(
                        {
                            "trip": this.state.trip,
                            "email": this.state.email
                        }
                    )
                }
                else{
                    this.state.participants.push(
                        {
                            "trip": this.state.trip,
                            "firstName": this.state.firstName,
                            "lastName": this.state.lastName
                        }
                    )
                }   
                    
                AsyncStorage.setItem('participants', JSON.stringify(this.state.participants))
                .then(res => console.log(trips) & this.moveOn())
                .catch(error => console.log('Error storing participants'));
            }
    
                
        
        
        
        //}
        //alert(this.state.errors)
        
    }

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
                                placeholder="firstName"
                                style={styles.inputField}
                                underlineColorAndroid="transparent"
                                placeholderTextColor="#818181"
                                onChangeText={(text) => console.log(text) & this.setState({ firstName: text })} />
                        </View>
                        <View style={styles.separator}>
                            <TextInput
                                ref="lastName"
                                placeholder="lastName"
                                style={styles.inputField}
                                underlineColorAndroid="transparent"
                                placeholderTextColor="#818181"
                                onChangeText={(text) => console.log(text) & this.setState({ lastName: text })} />
                        </View>
                        <View style={styles.separator}>
                            <TextInput
                                ref="email"
                                placeholder="email"
                                style={styles.inputField}
                                underlineColorAndroid="transparent"
                                placeholderTextColor="#818181"
                                onChangeText={(text) => console.log(text) & this.setState({ email: text })} />
                        </View>
                    
                
                <Button color="#edc14f"
                    title= "add Participant"
                    onPress={() => this.addParticipant() }

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
    }




});