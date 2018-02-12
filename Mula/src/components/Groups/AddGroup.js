import React, {Component} from 'react';
import {StyleSheet, View, Image, Text, TextInput, Button, Modal, TouchableOpacity, ScrollView, Picker, AsyncStorage} from 'react-native';
import {StackNavigator} from 'react-navigation';

/**
|--------------------------------------------------
TODO::
- Naast online pushen ook offline schrijven
- offlineAddedGroup
- |
-  -> ID van bijhouden
- |
-  -> Lijst van members

|--------------------------------------------------
*/

export default class AddGroup extends Component{
    state ={
        disableSaveButton: false,
        personModalVisible: false,
        tempSelectedUser: "",
        friends: [],
        loadFriends: true,
        userEmail: "",
        friends: [],
        addedFriends: [],
        groupName: "",
        username: ""
    }

    writeToDevice(){

    }

    getLoggedinUsername(){
        try{
            AsyncStorage.getItem("userName")
                .then((userName)=> {
                    this.setState({username: userName})
                    this.getFriends();
                 });
        }catch(error){
            console.log(error);
        }
    }
    // getPossibleUsers(){
    //         return fetch('http://192.168.10.100:3000/users')
    //         //return fetch('http://192.168.0.195:3000/users')
    //         //return fetch('http://10.25.111.45:3000/users')
    //         .then((response) => response.json())
    //         .then((responseJson) => this.parseFriends(responseJson) );
    // }

    getFriends(){
        console.log("USERNAME");
        console.log(this.state.username);
        return fetch('http://193.191.177.169:8080/mula/Controller?action=getFriends',{
            method: 'POST',
            header:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: this.state.username
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({friends: responseJson.friends});
            console.log(this.state.friends);
        })
    }

    // parseFriendsV2(jsonToParse){
    //     console.log(jsonToParse);
    //     console.log(jsonToParse.friends.length);
    //     for(let i=0; i < jsonToParse.friends.length; i++){
    //         this.state.friends.push(jsonToParse.friends[i]);
    //     }
    //     console.log(this.state.friends);
    // }

    renderUsersSelection(){
        console.log(this.state.friends);
        return this.state.friends.map((vriendje, index) => {
            return(
                <Picker.Item value={vriendje.userName} label={vriendje.userName} key={index}/>
            )
        });
    }

    addUser(){
        var user = this.findUser(this.state.tempSelectedUser);
        //this.state.addedFriends.push(this.state.tempSelectedUser);
        if(user != null){
            this.state.addedFriends.push(user);
        }
    }

    addGroup(){
        // try{
        //     AsyncStorage.getItem('connection').then((connectionMode) => {
        //         if(connectionMode === "online"){
        return fetch('http://193.191.177.169:8080/mula/Controller?action=addGroup',{
          method: 'POST',
          header:{
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: this.state.username,
            group_name: this.state.groupName
          })
        })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(this.state.addedFriends.length);
          if(this.state.addedFriends.length === 0) {
            this.props.navigation.navigate('Dashboard');
          } else {
            this.addUsersToGroup(responseJson.group_id);
          }
        })
        //         }else{
        //             //Steek in to queue op mobile
        //         }
        //     })
        // }catch(error){
        //     console.log(error);
        // }
        // return fetch('http://193.191.177.169:8080/mula/Controller?action=addGroup',{
        //     method: 'POST',
        //     header:{
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         email: this.state.username,
        //         group_name: this.state.groupName
        //     })
        // }).then((response) => response.json())
        // .then((responseJson) => {
        //     this.addUsersToGroup(responseJson.group_id);
        // })
    }

    addUsersToGroup(groupId){
        console.log("TEST GROUP");
        console.log(groupId);
        console.log("ADDING USERS")
        console.log(this.state.addedFriends);
        console.log(this.state.addedFriends.length);
        //Add all users to the newly created group
        for(let i = 0; i < this.state.addedFriends.length; i++){
            console.log("ADDING NOW ["+i+"]:");
            console.log(this.state.addedFriends[i]);
          return fetch('http://193.191.177.169:8080/mula/Controller?action=AddUserInGroup',{
            method: 'POST',
            header:{
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              group_id: groupId.toString(),
              email: this.state.addedFriends[i].email
            })
          })
          .then((response) => response.json())
          .then((responseJson) => {
            console.log(this.props);
            this.props.navigation.navigate('Dashboard');
            console.log(responseJson);

          })
        }
    }

    renderAddedUsers(){
        console.log("BEGIN RENDER");
        console.log(this.state.addedFriends);
        console.log("END RENDER");
        return this.state.addedFriends.map((friend, index) => {
            return(
                <View key={index}>
                    <Text>{friend.userName} - {friend.email}</Text>
                </View>
            )
        })
    }

    findUser(name){
        var user = null;
        for(let i =0; i<this.state.friends.length; i++){
            if(this.state.friends[i].userName === name){
                console.log("UserFound");
                user= this.state.friends[i];
            }else{
                console.log("User Not Found");
            }
        }
        return user;
    }

    componentDidMount() {
        this.getLoggedinUsername();
    }

    render(){
        const {groupName} = this.state;
        return(
            <ScrollView style={styles.container}>
                <View>
                    <TextInput
                        placeholder="Name"
                        style={styles.inputField}
                        underlineColorAndroid="transparent"
                        placeholderTextColor="#818181"
                        onChangeText={(text)=>this.setState({groupName: text})}/>

                    {this.renderAddedUsers()}
                    <View>
                        <TouchableOpacity onPress={()=>this.setState({personModalVisible: true})} style={{flex:1, flexDirection:"row", backgroundColor:"#337ab7", alignContent:"center", borderRadius:5}}>
                            <Text style={{color: "#fff", fontSize:20, textAlign:"center", flex:1}}>+</Text>
                        </TouchableOpacity>
                    </View>

                    <Button style={styles.formButton}
                        title="Save"
                        disabled={!groupName}
                        onPress={()=> this.addGroup()}
                        />
                </View>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.personModalVisible}
                    onRequestClose={() => {alert("Modal has been closed.")}}>
                        <View style={styles.semiTransparant}>
                            <View style={styles.innerModal}>
                                <Text style={styles.title}>Add user</Text>
                                <Picker
                                    style={styles.threefourth}
                                    onValueChange={(cat)=>this.setState({tempSelectedUser: cat})}
                                    selectedValue={this.state.tempSelectedUser}>

                                    <Picker.Item value="select" label="Select user"/>
                                    {this.renderUsersSelection()}
                                </Picker>

                                <TouchableOpacity style={styles.modalAddButton} onPress={()=>this.addUser() & this.setState({personModalVisible: false})}><Text>Add</Text></TouchableOpacity>
                                <TouchableOpacity style={styles.modalCancelButton} onPress={()=>this.setState({personModalVisible: false})}><Text>Cancel</Text></TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: 'rgba(176,207,227,34)',
        paddingTop: 10,
        paddingLeft:20,
        paddingRight:20
    },
    inputField:{
        padding: 10,
        backgroundColor: 'rgba(255,255,255,0.5)',
        marginBottom: 15,
        borderBottomWidth: 2,
        borderRadius:5,
    },
    subItem:{
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius:5,
        paddingLeft:5,
        flexDirection:"row"
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
    }, modalButtonText:{
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
    },innerModal:{
        backgroundColor: "#a3a3a3",
        margin:50,
        paddingTop: 15

    },
});
