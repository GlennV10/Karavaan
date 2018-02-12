import React, {Component} from 'react';
import {StyleSheet, View, Image, Text, TextInput, Button, TouchableOpacity, ScrollView, ActivityIndicator,Modal,Picker, AsyncStorage, NetInfo} from 'react-native';
import CheckBox from 'react-native-checkbox-heaven';
import sha1 from 'sha1';


//SET ASYNC DATA
//AsyncStorage.setItem('uid123', 'testString');
//GET ASYNC DATA
// AsyncStorage.getItem('uid123', (err, result)=>{
//     console.log(result);
// });
NetInfo.getConnectionInfo().then((connectionInfo) => {
    console.log('Initial, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
  });

export default class DashboardPersons extends Component{
    // constructor(props) {
    //     super(props);
    // }
    constructor(props) {
        super(props);
    
        // Assign state itself, and a default value for items
        this.state = {
            isLoading: true,
            loadJSON: true,
            modalVisible: false,
            friendEmail: "",
            friendFirstName: "",
            friendLastName: "",
            // friends: {
            //     friends:[]
            // },
            friends: [],
            friendUsername: "",
            username: "",
            loadUsername: true,
            connectionMode: "",
            offlineFriends: {
                friends: []
            },
            loadTests: true,
            onlineFriends: {},
        }
      }

    getLoggedinUsername(){
        try{
            AsyncStorage.getItem("userName").then((userName)=> this.setState({username: userName, loadUsername: false}));
        }catch(error){
            console.log(error);
        }
    }

    parseFriendsV2(jsonToParse){
        console.log("Parsing friends data");
        console.log(jsonToParse);
        for(let i=0; i < jsonToParse.friends.length; i++){
            this.state.friends.push(jsonToParse.friends[i]);
        }
    }

    // parseOfflineFriends(jsonToParse){
    //     console.log("Parsing offline friends data");
    //     console.log("To parse object looks like:");
    //     console.log(JSON.parse(jsonToParse));
    //     var dataToParse = JSON.parse(jsonToParse);
    //     for(let i=0; i < dataToParse.length; i++){
    //         this.state.offlineFriends.friends.push(dataToParse[i]);
    //     }
    //     console.log("Offline friend state looks like: ");
    //     console.log(this.state.offlineFriends);
    //     // Schrijf offline vrienden naar online vrienden

    // }

    compareOfflineWithOnline(){
        var toAddToOnline = [];
        for(let i=0; i<this.state.offlineFriends.friends.length; i++){
            var adding = true;
            for(let j=0; j<this.state.onlineFriends.friends.length; j++){
                if(JSON.stringify(this.state.offlineFriends.friends[i]) == JSON.stringify(this.state.onlineFriends.friends[j])){
                    adding= false;
                }
            }
            if(adding){
                toAddToOnline.push(this.state.offlineFriends.friends[i]);
            }
        }
        for(let i=0; i<toAddToOnline.length; i++){
            var toRegisterFriend = "";

            if(this.validMail(toAddToOnline[i].email)){
                toRegisterFriend = toAddToOnline[i].email;
            }else{
                toRegisterFriend = toAddToOnline[i].userName;
            }

            return fetch('http://193.191.177.169:8080/mula/Controller?action=addFriend',{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: this.state.username,
                    friend: toRegisterFriend
                })
            })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
            }).catch((error)=> console.log("ERROR: " + error));
        }
    }

    compareOnlineWithOffline(){
        console.log("COMPARING OFFLINE WITH ONLINE");
        console.log(this.state.offlineFriends);
        console.log(this.state.onlineFriends);
        var toAddToOffline = [];
        for(let i=0; i<this.state.onlineFriends.friends.length; i++){
            var adding = true;
            var tempToAdd = {};
            for(let j=0; j<this.state.offlineFriends.friends.length; j++){
                if(JSON.stringify(this.state.onlineFriends.friends[i]) == JSON.stringify(this.state.offlineFriends.friends[j])){
                    //toAddToOffline.push(this.state.onlineFriends.friends[i]);
                    adding=false;
                }
            }
            if(adding){
                toAddToOffline.push(this.state.onlineFriends.friends[i]);
            }
        }

        // Add to state
        console.log(this.state.onlineFriends);
        for(let i=0; i<toAddToOffline.length; i++){
            this.state.offlineFriends.friends.push(toAddToOffline[i]);
        }
    
        // Add to device
        AsyncStorage.setItem('friends', JSON.stringify(this.state.offlineFriends)).then(()=>{
            console.log("offline friends updated");
        });
    }

    mainFetch(){
        // Get gerbuikersnaam uit memory
        AsyncStorage.getItem('userName').then((userName, error)=>{
            if(error){
                console.log(error);
            }
            // Set username state
            this.setState({username: userName, loadJSON: false});
            console.log("Setting username state #1");
            // Get connection status
            AsyncStorage.getItem('connectionStatus').then((connection, error)=>{
                if(error){
                    console.log(error);
                }
                this.setState({connectionMode: connection});
                if(this.state.connectionMode == "online"){
                    // =======================================================
                    // Get online data
                    // =======================================================
                    console.log("Fetching online data #2");
                    return fetch('http://193.191.177.169:8080/mula/Controller?action=getFriends',{
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
                        // OBSOLETE
                        //this.parseFriendsV2(responseJson);
                        // \OBSOLETE
                        console.log("Set loadingStates to false #3");
                        this.setState({isLoading: false, loadJSON: false, onlineFriends: responseJson});
                    }).then(()=>{
                        // =======================================================
                        // Get offline data
                        // =======================================================

                        console.log("Getting offline friends data #4");
                        AsyncStorage.getItem('friends').then((friendsJson, error) =>{
                            if(error){
                                console.log(error);
                            }
                            this.setState({offlineFriends: JSON.parse(friendsJson)});
                            console.log("CHECK HERE");
                            console.log(this.state.offlineFriends);
                        });
                    }).then(()=>{
                        // Compare offline with online friends
                        if(this.state.offlineFriends.friends.length == 0){
                            console.log("There are no friends in the offline memory");
                        }
                        this.compareOfflineWithOnline();
                        this.compareOnlineWithOffline();
                        
                        AsyncStorage.getItem('friends').then((result)=>{
                            console.log("RESULT:")
                            console.log(result);
                            this.setState({friends: this.state.onlineFriends, loadMainFetch: false, loadJSON: false, isLoading: false});
                        })
                    });
                }else{
                    // Get offline data en render
                    console.log("Connection is offline");
                    AsyncStorage.getItem('friends').then((friendsJson, error) =>{
                        if(error){
                            console.log(error);
                        }
                        // Send JSON to renderfriends
                        console.log("Parse friends with offline data #8");
                        this.setState({friends: JSON.parse(friendsJson), offlineFriends: JSON.parse(friendsJson), loadJSON: false, isLoading: false});
                    });
                }
            })
        })
        //console.log("Setting loadJSON to false #9");
        //this.setState({loadJSON: false});
        
        // this.setState({isLoading: false, loadJSON: false, loadMainFetch: false});
    }

    // compareFriendLists(){
    //     // Compare 2 json lists
    //     // Iterate over the offline friendslist
    //     var objectToAdd = [];
    //     for(let i=0;i<this.state.offlineFriends.length; i++){
    //         // Iterate over the online friends list
    //         for(let j=0; j<this.state.friends.length; j++){
    //             if(this.state.offlineFriends[i].toString() != this.state.friends[j].toString()){
    //                 objectToAdd.push(this.state.offlineFriends[i]);
    //             }else{
    //                 console.log("No need to add");
    //             }
    //         }
    //     }

    //     if(objectToAdd.length != 0){
    //         // Add list to online;
    //         var properJson = JSON.parse(objectToAdd);
    //         for(let i=0; i<properJson.length; i++){
    //             // als email leeg is gebruik naam
    //             var toRegister = "";
    //             if(properJson[i].email != null || properJson[i].email != ""){
    //                 console.log("Email is filled in");
    //                 toRegister = properJson[i].email;
    //             }else{
    //                 console.log("Email is not filed in, using username instead");
    //                 toRegister = properJson[i].userName;
    //             }

    //             // Register user
    //             this.registerFriend(toRegister);
    //         }
    //     }else{
    //         console.log("Nothing to add.");
    //     }
    // }

    // getFriends(){
    //     try{
    //         AsyncStorage.getItem("userName").then((userName)=> this.setState({username: userName, loadUsername: false, loadJSON: false}))
    //     .then(res=>{
    //         return fetch('http://193.191.177.169:8080/mula/Controller?action=getFriends',{
    //             method: 'POST',
    //             header:{
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({
    //                 email: this.state.username
    //             })
    //         }).then((response) => response.json())
    //         .then((responseJson) => {
    //             console.log("Result: ");
    //             console.log(responseJson);
    //             this.parseFriendsV2(responseJson);
    //             this.setState({isLoading: false, loadJSON: false});
    //         })
    //     });
    //     }catch(error){
    //         console.log(error);
    //     }
    //     // return fetch('http://193.191.177.169:8080/mula/Controller?action=getFriends',{
    //     //     method: 'POST',
    //     //     header:{
    //     //         'Accept': 'application/json',
    //     //         'Content-Type': 'application/json'
    //     //     },
    //     //     body: JSON.stringify({
    //     //         email: this.state.username
    //     //     })
    //     // }).then((response) => response.json())
    //     // .then((responseJson) => {
    //     //     console.log("Result: ");
    //     //     console.log(responseJson);
    //     //     this.parseFriendsV2(responseJson);
    //     //     this.setState({isLoading: false, loadJSON: false});
    //     // })
    // }

    registerFriend(toRegisterFriend){
        // Checken als connection online is al dan niet
        AsyncStorage.getItem('connectionStatus').then((status, error)=>{
            if(error){
                console.log(error);
            }
            if(status === "online"){
                // Write to online
                return fetch('http://193.191.177.169:8080/mula/Controller?action=addFriend',{
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: this.state.username,
                        friend: toRegisterFriend
                    })
                })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson);
                    if(responseJson.success){
                        this.setState({modalVisible: false});
                        console.log(this.state.friends);
                        // this.compareOnlineWithOffline();
                        // this.compareOfflineWithOnline();
                        // this.forceUpdate();
                        this.mainFetch();
                    }
                }).catch((error)=> console.log("ERROR: " + error));
                this.compareOfflineWithOnline();
                this.compareOnlineWithOffline();

                // Write to offline code
                // try{
                //     // Get current offline list
                //     AsyncStorage.getItem('friends').then((friendsList)=>{
                //         var friendsObject = JSON.parse(friendsList);
                //         console.log("LINE 322");
                //         console.log(friendsObject);
                //         var newFriendObject = {};
                //         if(this.validMail(toRegisterFriend)){
                //             // It is an email address
                //             newFriendObject = {
                //                 "email": toRegisterFriend,
                //                 "userName": ""
                //             };

                //         }else{
                //             // It is a username
                //             newFriendObject = {
                //                 "email": "",
                //                 "userName": toRegisterFriend
                //             };
                //         }
                //         friendsObject.push(newFriendObject);
                //         try{
                //             AsyncStorage.setItem('friends', friendsObject).then(()=>{
                //                 console.log("Online friends added to offline");
                //                 console.log(friendsObject);
                //             });
                //         }catch(error){
                //             console.log(error);
                //         }
                //     });
                // }catch(error){
                //     console.log(error);
                // }
            }else{
                // Write to offline
                // Get current offline list
                AsyncStorage.getItem('friends').then((friendsList, error)=>{
                    if(error){
                        console.log(error);
                    }

                    var friendsObject = JSON.parse(friendsList);
                    var newFriendObject = {};
                    // if(this.validMail(toRegisterFriend)){
                    //     // It is an email address
                    //     newFriendObject = {
                    //         "email": toRegisterFriend,
                    //         "userName": ""
                    //     };
                    // }else{
                    //     // It is a username
                    //     newFriendObject = {
                    //         "email": "",
                    //         "userName": toRegisterFriend
                    //     };
                    // }
                    newFriendObject = {
                        "email": this.state.username,
                        "userName": toRegisterFriend
                    }
                    friendsObject.friends.push(newFriendObject);
                    AsyncStorage.setItem('friends', JSON.stringify(friendsObject)).then(()=>console.log("friend added for upload when connection is regained"));
                });
            }
        })
        
        // return fetch('http://193.191.177.169:8080/mula/Controller?action=addFriend',{
        //     method: 'POST',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         email: this.state.username,
        //         friend: toRegisterFriend
        //     })
        // })
        // .then((response) => response.json())
        // .then((responseJson) => {
        //     console.log(responseJson);
        //     if(responseJson.success){
        //         this.setState({modalVisible: false});
        //     }
        // }).catch((error)=> console.log("ERROR: " + error));
    }


    renderFriends(){
        if(this.state.friends.friends == null){
            return(
                <View>
                    <ActivityIndicator/>
                </View>
            )
        }else{
            console.log("STATE FRIENDS RENDER");
            console.log(this.state.offlineFriends);
            return this.state.friends.friends.map((friend, index) => {
                return (
                  <TouchableOpacity style={[styles.person, styles.odd]} onPress={() => this.props.navigator.navigate('DetailPerson', { email2: friend.email })} key={index}>
                    <View style={styles.personImage}></View>
                    <View style={styles.personName}>
                      <Text style={styles.right}>{friend.userName}</Text>
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
    //   return this.state.friends.map((friend) => {
    //     return (
    //       <TouchableOpacity style={[styles.person, styles.odd]} onPress={() => this.props.navigator.navigate('DetailPerson', { email2: friend.email })} key={friend.userName}>
    //         <View style={styles.personImage}></View>
    //         <View style={styles.personName}>
    //           <Text style={styles.right}>{friend.userName}</Text>
    //         </View>
    //         <View style={styles.goto}>
    //           <Image
    //               style={styles.logo}
    //               source={require('../../images/chevron_right.png')}
    //           />
    //         </View>
    //       </TouchableOpacity>
    //     );
    //   });
    }

    saveItem(){
        if(this.state.friendEmail === ""){
            this.registerFriend(this.state.friendUsername);
        }else{
            if(this.validMail(this.state.friendEmail)){
                this.registerFriend(this.state.friendEmail);
            }
        }
    }

    validMail(mail){
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(mail);
    }

    componentDidMount(){
        if(this.state.loadJSON){
            console.log("EXECUTING COMPONENWILLMOUNT");
            this.mainFetch();    
        }
    }

    render(){

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
                {this.renderFriends()}
            </ScrollView>
            <TouchableOpacity style={styles.addButton} onPress={() => this.setState({modalVisible: true})}>
                <Text style={styles.addButtonText} >+</Text>
            </TouchableOpacity>

                <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {alert("Modal has been closed.")}}>
                    <View style={styles.semiTransparant}>
                    <View style={styles.innerModal}>
                        <Text style={styles.title}>Add Friend</Text>
                        {/* <TextInput placeholder="Name" style={styles.modalTextInput} underlineColorAndroid="transparent" onChangeText={(firstNameText) => this.setState({friendFirstName: firstNameText})}/> */}
                        <TextInput placeholder="Username" style={styles.modalTextInput} underlineColorAndroid="transparent" onChangeText={(friendUsername) => this.setState({friendUsername: friendUsername})}/>
                        {/* <TextInput placeholder="Last Name" style={styles.modalTextInput} underlineColorAndroid="transparent" onChangeText={(lastNameText) => this.setState({friendLastName: lastNameText})}/> */}
                        <TextInput placeholder="Email (optional)" keyboardType="email-address" style={styles.modalTextInput} underlineColorAndroid="transparent" onChangeText={(text)=> this.setState({friendEmail: text})}/>
                        <TouchableOpacity onPress={()=>this.saveItem()} style={styles.modalAddButton}><Text style={styles.modalButtonText}>Add</Text></TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.setState({modalVisible: false})} style={styles.modalCancelButton}><Text style={styles.modalButtonText}>Cancel</Text></TouchableOpacity>
                    </View>
                    </View>
                </Modal>
          </View>
      )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: 'rgba(176,207,227,34)',
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
    }, innerModal:{
        backgroundColor: "#a3a3a3",
        margin:50,
        paddingTop: 15
    },modalAddButton:{
        backgroundColor: "#6699ff",
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 5,
        paddingBottom:5,
        marginLeft: 25,
        marginRight: 25,
        marginBottom:10
    },modalCancelButton:{
        backgroundColor: "#66ccff",
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 5,
        paddingBottom:5,
        marginLeft: 25,
        marginRight: 25,
        marginBottom:10
    },
    modalButtonText:{
        textAlign: "center"
    },
    semiTransparant:{
        backgroundColor: "rgba(0,0,0,.5)",
        flex:1
    },modalTextInput:{
        backgroundColor: "#ffffff",
        marginLeft: 25,
        marginRight: 25,
        borderRadius:5,
        marginBottom: 5,
        paddingLeft: 5
    },
    title:{
        fontSize: 25,
        marginLeft: 15,
        color:"#000035"
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
