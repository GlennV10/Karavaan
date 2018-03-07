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

                if(this.state.email == null){
                    console.log("dummy")
                    var url = "http://193.191.177.73:8181/karafinREST/addDummyPerson/"+this.state.firstName+"/"+this.state.lastName
                    return fetch(url, {
                        method: 'GET',
                        header: {
                            'Content-Type': 'application/json'
                        }
                        
                    })
                    
                    .then((response) => {
                        console.log("added dummy successfully: ");
                        this.setState({email: response})
                    }).catch(error => console.log("network/rest error"));
                }
                    
                
                var url = "http://193.191.177.73:8181/karafinREST/addPersonToTripFromEmail/"+this.state.email+"/"+this.state.trip
                    return fetch(url, {
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