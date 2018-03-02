import React, {Component} from 'react';
import {StyleSheet, View, Image, Text, TextInput, Button, TouchableOpacity, ScrollView, ActivityIndicator, AsyncStorage} from 'react-native';
import I18n from 'react-native-i18n';

var friends = [];

export default class DashboardGroups extends Component{
    constructor (props) {
      super(props);

      this.state = {
        isLoading: true,
        loadJSON: true,
        loadGroups: true,
        loadConnection: true,
        groups: [],
        username: "",
        localGroups: [],
        connection: ""
      };

      this.renderGroups = this.renderGroups.bind(this);
    }



    // getConnectionMode(){
    //     try{
    //         AsyncStorage.getItem('connectionStatus').then((status)=> {
    //             this.setState({connection: status, loadConnection: false});
    //         });
    //     }catch(error){
    //         console.log(error);
    //     }
    // }

    // getLoggedinUsername(){
    //     try{
    //         AsyncStorage.getItem("userName").then((userName)=> this.setState({username: userName}));
    //     }catch(error){
    //         console.log(error);
    //     }
    // }

    //Get All groups from users
    getAllGroups(){
        //Username uit memory halen
        try{
            AsyncStorage.getItem("userName").then((userName)=> this.setState({username: userName, loadGroups: false}))
            .then(res=>{
            try{
                //Connectie status ui memory halen
                AsyncStorage.getItem('connectionStatus').then((status)=> {
                    this.setState({connection: status});
                }).then(res=>{
                    //Als connectie 'online'is
                    if(this.state.connection === "online"){
                        return fetch('http://193.191.177.169:8080/mula/Controller?action=getUserGroups',{
                            method: 'POST',
                            header:{
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                email: this.state.username
                            })
                        }).then((response) => response.json())
                        .then((responseJson) => {
                            try{
                                // Group data uit memory halen
                                AsyncStorage.getItem('groups').then((groups)=>{
                                    // Als er nog geen group data in memory zit
                                    if(groups === null){
                                        try{
                                            //Online data naar offline data kopieren
                                            AsyncStorage.setItem('groups', JSON.stringify(responseJson)).then(this.setState({loadGroups: false, isLoading: false}));
                                        }catch(error){
                                            console.log(error);
                                        }
                                    }else{
                                        // Offline data naar online data schrijven ??
                                        // Vergelijk de offline data met de online data

                                    }
                                });
                            }catch(error){
                                console.log(error);
                            }
                            console.log("Setting loadingstatus to false");

                            //Verwerk groupdata.
                            this.parseGroups(responseJson);
                        })
                    }else{
                        // Als connectie Offline is.
                        try{
                            // Haal offline data
                            AsyncStorage.getItem("groups").then((groups)=>{
                                //Print offline data
                                console.log(JSON.parse(groups));

                                //Gebruik offliene data om te parsen
                                this.parseGroups(JSON.parse(groups));
                            })
                        }catch(error){
                            console.log(error);
                        }
                    }
                });
            }catch(error){
                console.log(error);
            }
        });
        }catch(error){
            console.log(error);
        }

        // if(this.state.connection === "online"){
        //     return fetch('http://193.191.177.169:8080/mula/Controller?action=getUserGroups',{
        //         method: 'POST',
        //         header:{
        //             'Accept': 'application/json',
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({
        //             email: this.state.username
        //         })
        //     }).then((response) => response.json())
        //     .then((responseJson) => {
        //         try{
        //             // Kijk als er al groupen in geheugen zitten
        //             // Vergelijk de groepen met de online groepen
        //             // De verschillen bijwerken
        //             AsyncStorage.getItem('groups').then((groups)=>{
        //                 if(groups === null){
        //                     // Steek alles van online in de offline
        //                     try{
        //                         AsyncStorage.setItem('groups', JSON.stringify(responseJson)).then(this.setState({loadGroups: false, isLoading: false}));
        //                     }catch(error){
        //                         console.log(error);
        //                     }
        //                 }
        //             });
        //         }catch(error){
        //             console.log(error);
        //         }
        //         console.log("Setting loadingstatus to false");

        //         this.parseGroups(responseJson);
        //     })
        // }else{
        //     //Haal groups uit de localstorage
        //     try{
        //         AsyncStorage.getItem("groups").then((groups)=>{
        //             console.log(groups);
        //             //this.parseGroups(groups);
        //         })
        //     }catch(error){
        //         console.log(error);
        //     }
        // }

    }

    parseGroups(jsonToParse){
        for(let i=0; i<jsonToParse.groups.length; i++){
            this.state.groups.push(jsonToParse.groups[i]);
        }
        this.setState({loadGroups: false, isLoading: false});
    }

    renderFriends(){
      return friends.map(function(friend){
        return (
          <TouchableOpacity style={[styles.person, styles.odd]} key={friend[0]}>
              <View style={styles.personImage}></View>
              <View style={styles.personName}>
                  <Text style={styles.right}>{friend[1]}</Text>
              </View>
              <View style={styles.goto}>
                  <Image
                  style={styles.logo}
                  source={require('../../images/chevron_right.png')}
                  />
              </View>
          </TouchableOpacity>
        );
      });
    }

    renderGroups(){
        console.log("Groups lenght");
        console.log(this.state.groups.length);
        if(this.state.groups.length == 0){
            return(
                <View style={styles.noBillView}>
                    <Text style={styles.noBillText}>NO GROUPS FOUND</Text>
                </View>
            )
        }else{
            return this.state.groups.map((group) => {
                return(
                  <TouchableOpacity style={[styles.person, styles.odd]} onPress={() => this.props.navigation.navigate('DetailGroup', { group_id: group.id }) } key={group.id}>
                    <View style={styles.personImage}></View>
                    <View style={styles.personName}>
                      <Text style={styles.right}>{group.userName}</Text>
                    </View>
                    <View style={styles.goto}>
                      <Image
                      style={styles.logo}
                      source={require('../../images/chevron_right.png')}
                      />
                    </View>
                  </TouchableOpacity>
                )
            });
        }
    }

    render(){
        // if(this.state.loadConnection){
        //     this.getConnectionMode();
        // }
        if(this.state.loadGroups){
            this.getAllGroups();
            // this.getLoggedinUsername();
        }
        if(this.state.isLoading){
            return(
                <View>
                    <ActivityIndicator/>
                </View>
            )
        }
      return(
        <View style={styles.container}>
          <ScrollView style={styles.personList}>
              {/* {this.renderFriends()} */}
              {this.renderGroups()}
          </ScrollView>
          <TouchableOpacity style={styles.addButton} onPress={() => this.props.navigation.navigate('AddGroup') /*& this.setModalVisible(true) & this.getCurrentLocation() */}>
              <Text style={styles.addButtonText} >+</Text>
          </TouchableOpacity>
        </View>
      )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#d4e8e5'
    },
    personList:{
    },
    person:{
        paddingBottom:10,
        paddingLeft:10,
        paddingRight:10,
        paddingTop:10,
        flexDirection: 'row',
        // height: 115,
        borderColor: '#000',
        borderBottomWidth: 1
    },
    personImage:{
        flex:.25,
        backgroundColor: '#ACACAC',
        margin: -10
    },
    personName:{
        flex:.65,
    },
    goto:{
        flex: .1
    },
    right:{
        textAlign: 'right',
        fontSize: 20
    },
    even:{
        backgroundColor: '#EFF2F7'
    },
    odd:{
        backgroundColor: '#E5E5E5'
    },logo:{
        width: 50,
        height: 50,

    },addButton:{
        backgroundColor: '#3B4859',
        width: 50,
        height: 50,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 10,
        right: 10,
    },addButtonText:{
        color: '#fff'
    },
    noBillView:{
        flex:1,
        alignItems: "center",
        paddingTop: 10
    },
    noBillText:{
        color: "#a8a8a8",
        marginTop: 50,
        fontSize: 20
    }
});
