import React, {Component, cloneElement} from 'react';
import {StyleSheet, View, Image, Text, TextInput, Button, Modal, TouchableOpacity, ScrollView, Picker, AsyncStorage} from 'react-native';
import {StackNavigator} from 'react-navigation';
import DatePicker from 'react-native-datepicker';
import {Switch} from 'react-native-switch' ;
import Autocomplete from 'react-native-autocomplete-input';
import CheckBox from 'react-native-checkbox-heaven';
import FontAwesome, {Icons} from 'react-native-fontawesome';
import I18n from 'react-native-i18n';
// var friends = [];
var groups = [];
var autoData = [];

export default class AddEvent extends Component{
    state = {
        switchPos: true,
        selectedDate: null,
        modalVisible: false,
        itemModalvisible: false,
        modalVisibleShare: false,
        data: null,
        addPersonButtonHeight: 0,
        betaler: '',
        group: '' ,
        friends: [],
        groups: [],
        loadGroups: true,
        loadFriends: true,
        loadRates: true,
        totalCost:0,
        tempUpdateCost:0,
        baseValuta:'EUR',
        editPersonCost: false,
        splitMethode: "split",
        items:[],
        currentItem: "",
        currentItemPrice: "",
        tempShare: false,
        tempItemUser:"",
        tempItemAmount: 1,
        tempAddItemUser: Object,
        disableAddItemButton: true,
        disableSaveButton: true,
        categorie: "",
        rates: Object,
        randerPayer: false,
        renderCat: true,
        readyToSave: false,
        userName:'',
        title: '',
        userDebts: []
    }


    // ====================================================================
    // API calls
    // ====================================================================
    // getAllGroups(){
    //     //return fetch('http://192.168.10.100:3000/groups')
    //     //return fetch('http://192.168.0.195:3000/groups')
    //     return fetch('http://10.25.109.226:3000/groups')
    //     .then((response) => response.json())
    //     .then((responseJson) => this.parseGroups(responseJson));
    // }

    getAllGroupsServer(){
        AsyncStorage.getItem('userName').then((userName)=>this.setState({userName})).then(()=>{
            return fetch('http://193.191.177.169:8080/mula/Controller?action=getUserGroups', {
                method: 'POST',
                header: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: this.state.userName
                })
            }).then((res)=> res.json())
            .then((responseJSon)=>{
                this.setState({groups: responseJSon.groups});
                console.log("ALLGROUPSSERVER RESPONSE");
                console.log(responseJSon);
            });
        });
    }

    //---------------------------------------------------------------------
    // GROEPEN
    //---------------------------------------------------------------------
    // getAllGroups(){
    //     return fetch('http://193.191.177.169:8080/mula/Controller?action=getUserGroups',{
    //         method: 'POST',
    //         header:{
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             email: "tibo@mula.be"
    //         })
    //     }).then((response) => response.json())
    //     .then((responseJson) => {
    //         this.parseGroups(responseJson);
    //     })
    // }

    // parseGroups(jsonToParse){
    //     for(let i=0; i<jsonToParse.groups.length; i++){
    //         this.state.groups.push(jsonToParse.groups[i]);
    //     }
    //     this.setState({loadGroups: false, isLoading: false});
    // }


    //---------------------------------------------------------------------
    // USERS
    //---------------------------------------------------------------------
    // getAllUsers() {
    //     //return fetch('http://192.168.10.100:3000/users')
    //     //return fetch('http://192.168.0.195:3000/users')
    //     return fetch('http://10.25.109.226:3000/users')
    //     .then((response) => response.json())
    //     .then((responseJson) => this.parseFriends(responseJson) );
    // }

    getAllUsersServer(groupId){
        console.log("STATE GROUPS");
        console.log(this.state.group);

        return fetch('http://193.191.177.169:8080/mula/Controller?action=getUsersFromGroup', {
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                group_id: groupId
            })
        }).then((res)=> res.json())
        .then((responseJSon)=>{
            this.setState({friends: responseJSon.users});
            console.log("USERSSERVER FRIENDS")
            console.log(this.state.friends);
            // this.renderGroupMembers();
            this.renderPayer();
        });
    }

    getFriends(){
        return fetch('http://193.191.177.169:8080/mula/Controller?action=getFriends',{
            method: 'POST',
            header:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: this.state.userName
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {

            this.setState({friends: responseJson.friends});
        })
    }

    //GET EXCHANGE RATES
    getExchangeRates(){
        if(this.state.loadRates){
            return fetch('https://api.fixer.io/latest')
            .then((resp) => resp.json())
            .then((data) => this.parseRates(data));
        }
    }

    // ====================================================================
    // PARSE API CALLS
    // ====================================================================
    parseFriends(jsonToParse){
        if(this.state.loadFriends){
            let newArray=this.state.friends.splice()
            for(let i = 0; i < jsonToParse.length; i++) {
                let vriend = {
                    name: jsonToParse[i][1],
                    cost: 0,
                    active: true
                }
                //newArray.push(jsonToParse[i][1])
                newArray.push(vriend);
            }
            this.setState({friends:newArray, loadFriends: false})
        }
    }

    parseGroups(jsonToParse){
        if(this.state.loadGroups){
            newArray=this.state.groups.splice()
            for(let i = 0; i < jsonToParse.length; i++){
                newArray.push(jsonToParse[i][1])
            }
            this.setState({groups: newArray, loadGroups: false})
        }
    }

    parseRates(data){
        if(this.state.loadRates){
            this.setState({loadRates: false, rates: data.rates});
        }
    }

    // ====================================================================
    // RENDER FUNCTIONS
    // ====================================================================
    renderGroups(){
        console.log(this.state.groups);
        return this.state.groups.map( (groepeke) => {
            return(
                <Picker.Item value={groepeke} label={groepeke.userName} key={groepeke.id}/>
            );
        });
    }
    renderFriends(){
        console.log(this.state.friends);
        return this.state.friends.map((vriendje, index) => {
            console.log("INDEX: " + index);
            return(
                <Picker.Item value={vriendje} label={vriendje.userName} key={index}/>
            )
        });
    }
    renderGroupMembers(){

        // TOBE: this.state.group
        return this.state.friends.map((vriendje, index) => {
            if(this.state.editPersonCost){
                return(
                    <View style={{flex:1, flexDirection:"row"}} key={index}>
                        {/* <View style={{flex:.1, flexDirection:"row"}}>
                            <CheckBox
                                checked={true}/>
                        </View> */}
                        <View style={{flex:1, flexDirection:"row"}}>
                            <Text>{vriendje.userName}</Text>
                        </View>
                        <TextInput style={{flex:.4}} keyboardType="numeric" onBlur={()=>this.updateTotalCost() & this.addUserDebts(vriendje)} placeholder="000.00" onChangeText={(newVal)=>this.setState({tempUpdateCost: newVal})}/>
                    </View>
                )
            }else{
                //if split is even
                if(this.state.splitMethode === "split"){
                    return(
                        <View style={{flex:1, flexDirection:"row"}} key={index}>
                            {/* <View style={{flex:.1, flexDirection:"row"}}>
                                <CheckBox
                                    checked={true}
                                    onChange={(value)=> console.log("Checkbutton changed to: " +value)}/>
                            </View> */}
                            <View style={{flex:1, flexDirection:"row"}}>
                                <Text>{vriendje.userName}</Text>
                            </View>
                            <Text style={{flex:.4}}>{this.state.totalCost/this.state.friends.length} {this.state.baseValuta} {vriendje.cost}</Text>
                        </View>
                    )
                }

            }

        });
    }
    renderBillItems(){
        return this.state.items.map((item, index) => {
            if(item.shared){
                return(
                    <View key={index}>
                        <View style={{flex:1, flexDirection:"row"}}>
                            <Text style={{flex:1}}>*{item.name}</Text><Text style={{flex:.2}}>€{item.price}</Text>

                            <TouchableOpacity style={{alignContent:"center", flex:.1,  backgroundColor:"#337ab7", borderRadius:100}} onPress={()=>this.setState({tempAddItemUser: item, tempShare: false,modalVisibleShare: true})}>
                                    <Text style={{color: "#fff", fontSize:20, textAlign:"center"}}>+</Text>
                                </TouchableOpacity>

                        </View>
                        <View>
                            {this.renderBillItemsUsers(item)}
                        </View>
                    </View>
                )
            }else{
                return(
                    <View key={index}>
                        <View style={{flex:1, flexDirection:"row"}}>
                            <Text style={{flex:1}}>{item.name}</Text><Text style={{flex:.2}}>€{item.price}</Text>

                            <TouchableOpacity style={{alignContent:"center", flex:.1,  backgroundColor:"#337ab7", borderRadius:100}} onPress={()=>this.setState({tempAddItemUser: item, tempShare: false,modalVisible: true})}>
                                    <Text style={{color: "#fff", fontSize:20, textAlign:"center"}}>+</Text>
                                </TouchableOpacity>
                        </View>
                        <View >
                            {this.renderBillItemsUsers(item)}
                        </View>
                    </View>
                )
            }
       })
    }
    renderBillItemsUsers(item){
        if(item.shared){
            return item.users.map((user)=>{
                return(
                    <View style={{flex:1, flexDirection:"row"}}>
                        <Text>{user.user}{item.price/item.users.length}</Text>
                    </View>
                )
            });
        }else{
            return item.users.map((user)=>{
                var newTotalCost = this.state.totalCost;
                newTotalCost =+ item.price*user.amount;
                console.log("USER LOGGED");
                console.log(user);
                return(
                    <View style={{flex:1, flexDirection:"row"}} >
                        <Text>{user.user}x{user.amount}={item.price*user.amount}</Text>
                    </View>
                )
            });
        }

    }
    renderAddItemButton(){
        if(this.state.splitMethode === "bill"){
            return(
                <View>
                    {this.renderBillItems()}
                    <TouchableOpacity onPress={()=>this.setState({itemModalvisible: true})} style={{flex:1, flexDirection:"row", backgroundColor:"#337ab7", alignContent:"center", borderRadius:5}}>
                        <Text style={{color: "#fff", fontSize:20, textAlign:"center", flex:1}}>+</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }
    renderTotalCost(){
        if(this.state.splitMethode === "split"){
            return(
                <TextInput
                placeholder="0"
                style={{flex:.25}}
                placeholderTextColor="#818181"
                keyboardType="numeric"
                onChangeText={(newCost) => this.setState({totalCost: newCost})}
                // value={this.state.totalCost}
            />
            )
        }else{
            return(
               <Text style={styles.totalCostStyle}>{this.state.totalCost}</Text>
            )
        }
    }
    renderCategory(){
        if(this.state.renderCat){
            return(
                <View style={[styles.splitRow, styles.subItem]}>
                    <Text style={[styles.fourth, styles.allRoundText]}>Categorie:</Text>
                    <Picker
                        style={styles.threefourth}
                        // mode="dropdown"
                        onValueChange={(cat)=>this.setState({categorie: cat})}
                        selectedValue={this.state.categorie}>

                        {/* <Picker.Iten value="" label=""/> */}
                        <Picker.Item value="choose" label="Choose Category"/>
                        <Picker.Item value="dinner" label="Dinner"/>
                        <Picker.Item value="taxi" label="Taxi"/>
                        <Picker.Item value="bowling" label="Bowling"/>
                        <Picker.Item value="other" label="Other"/>
                    </Picker>
                </View>
            )
        }
    }
    renderPayer(){
        if(this.state.renderPayer){
            return(
                <View style={[styles.splitRow, styles.subItem]}>
                    <Text style={[styles.fourth, styles.allRoundText]}>Betaler:</Text>
                    <Picker
                        style={styles.threefourth}
                        mode="dropdown"
                        onValueChange={(vriendje)=>this.setState({betaler: vriendje})}
                        selectedValue={this.state.betaler}>
                        <Picker.Item value="choose" label="Choose payers"/>
                        {this.renderFriends()}
                    </Picker>
                </View>
            )
        }
    }
    renderValuta(rate){
        return Object.keys(rate).map((val)=> {
            var label= val+"("+ rate[val]+")";
            return(
                <Picker.Item value={val} label={label} key={val}/>
            )
        });

    }
    // ====================================================================
    // CALC FUNCTIONS
    // ====================================================================
    saveItem(){
        var item = {
            name: this.state.currentItem,
            price: this.state.currentItemPrice,
            shared: this.state.tempShare,
            users: []
        };
        if(this.state.tempShare){
            var temp = Number.parseInt(this.state.currentItemPrice) + Number.parseInt(this.state.totalCost);
            this.setState({totalCost: temp});
        }
        var lijstItems = this.state.items.slice();
        lijstItems.push(item);
        this.setState({items: lijstItems})
    }
    addUserToProduct(item){
        var user={
            user: this.state.tempItemUser,
            amount: this.state.tempItemAmount,
            cost: 0
        }
        if(!item.shared){
            var tempTotalCost = this.state.totalCost;
            tempTotalCost = tempTotalCost+Number.parseInt(user.amount)*Number.parseInt(item.price);
            this.setState({totalCost: tempTotalCost});
        }

        item.users.push(user.user);

        var allFriends = this.state.friends.slice();
        if(!item.shared){
            allFriends.map((vriend)=>{
                if(vriend.name === this.state.tempItemUser){
                    vriend.cost = Number.parseInt(vriend.cost) + Number.parseInt(item.price)*Number.parseInt(this.state.tempItemAmount);
                }
            });
        }else{
            console.log("Not shared");
        }

    }

    addUserDebts(friend) {
      let share = {
        email: friend.email,
        share: this.state.tempUpdateCost
      }
      let userDebts = this.state.userDebts.slice();
      userDebts.push(share);
      this.setState({userDebts});
    }

    splitMethodChanged(newMethod){
        if(newMethod !== "share"){
            this.setState({editPersonCost: false, totalCost: 0, tempUpdateCost:0})
        }else{
            if(newMethod === "split"){
                this.setState({editPersonCost: true, totalCost: 0, tempUpdateCost:0})
            }else{
                this.setState({editPersonCost: true, totalCost: 0, tempUpdateCost:0})
            }
        }
    }
    updateTotalCost(){
        console.log("out of focus");
        var toAdd = Number.parseInt(this.state.tempUpdateCost) +Number.parseInt(this.state.totalCost);
        this.setState({totalCost: toAdd});
    }

    // ====================================================================
    // CHECK FUNCTIONS
    // ====================================================================
    checkBeforeSave(){

    }

    changeGroup(groupie){
        console.log("GROUPOE")
        console.log(groupie);
        if(groupie == "choose"){
            this.setState({group: groupie, renderPayer: false});
        }else{
            this.setState({group: groupie, renderPayer: true});
        }
        if(groupie !== "choose"){
            this.getAllUsersServer(groupie.id);
        }
        if(groupie == "none"){
            this.getFriends();
        }
    }
    // checkToEnablebutton(){
    //     console.log("Title:");
    //     console.log(this.state.title);
    //     console.log("Date:");
    //     console.log(this.state.selectedDate);
    //     console.log("Categorie:");
    //     console.log(this.state.categorie);
    //     console.log("Group:");
    //     console.log(this.state.group);
    //     console.log("Totalcost:");
    //     console.log(this.state.totalCost);
    //     if(this.state.title !== ''){
    //         // if(this.state.categorie !== '' || this.state.categorie !== 'choose'){
    //         //     if(this.state.totalCost > 0){
    //         //         if(this.state.group !== "choose" || this.state.group !== ''){
    //         //             if(this.state.betaler !== "choose" || this.state.betaler !== ''){
    //                         this.setState({disableSaveButton: false})
    //         //             }
    //         //         }
    //         //     }
    //         // }
    //     }
    // }

    componentDidMount(){
        this.getAllGroupsServer();
        this.getExchangeRates();
    }

    addBill(){
      return fetch('http://193.191.177.169:8080/mula/Controller?action=addBill',{
        method: 'POST',
        header:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: this.state.userName,
          group_id: this.state.group.id,
          event: this.state.title,
          currency: this.state.baseValuta,
          category: this.state.categorie,
          date: this.state.selectedDate,
          method: this.state.splitMethode
        })
      })
      .then((res) => res.json())
      .then((response) => {
        if(this.state.items.length === 0) {
          //this.addShare(response.billId);
          this.addShare(response.bills[response.bills.length - 1].id);
        } else {
          //this.addItems(response.billId);
          this.addItems(response.bills[response.bills.length - 1].id);
        }
      })
    }

    addItems(billId) {
      console.log(this.state.items);
      for(item of this.state.items){
        return fetch('http://193.191.177.169:8080/mula/Controller?action=addItems',{
          method: 'POST',
          header: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            bill_id: billId,
            description: item.name,
            price: item.price,
            users: item.users
          })
        })
        .then((res) => res.json())
        .then((response) => {
          this.props.navigation.navigate('Dashboard');
        })
      }
    }

    addShare(billId) {
      for (user of this.state.userDebts) {
        return fetch('http://193.191.177.169:8080/mula/Controller?action=addShare', {
          method: 'POST',
          header: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            bill_id: billId,
            email: user.email,
            share: user.share
          })
        })
        .then((res) => res.json())
        .then((response) => {
          this.props.navigation.navigate('Dashboard');
        })
      }
    }

    render(){
        return(
            <ScrollView style={styles.container}>
                <View >
                    <TextInput
                        placeholder="Subject (Taxi, Restaurant, ...)"
                        style={styles.inputField}
                        underlineColorAndroid="transparent"
                        placeholderTextColor="#818181"
                        onChangeText={(text)=>console.log(text) & this.setState({title: text})}/>
                    <DatePicker
                        mode='date'
                        format='YYYY-MM-DD'
                        showIcon={true}
                        placeholder="Select date..."
                        // date={this.state.selectedDate}
                        style={[styles.inputField, styles.datePickerStyle]}
                        onDateChange={(date) => this.setState({selectedDate: date})}
                        />

                    <View style={[styles.subItem]}>
                        <Picker style={{flex:.50}}
                            onValueChange={(valuta)=>this.setState({baseValuta: valuta})}
                            selectedValue={this.state.baseValuta}>
                            <Picker.Item value="EUR" label="EUR(1)" key="EUR"/>
                            {this.renderValuta(this.state.rates)}
                        </Picker>

                        {this.renderTotalCost()}
                        <View style={{flex:.25}}>
                            <Text style={styles.allRoundText}>Split:</Text>
                        </View>
                        <View style={{flex:1}}>
                            <Picker onValueChange={(split)=>this.setState({splitMethode: split}) & this.splitMethodChanged(split)} selectedValue={this.state.splitMethode}>
                                <Picker.Item value="split" label="Even" />
                                <Picker.Item value="share" label="Own share" />
                                <Picker.Item value="bill" label="By bill" />
                            </Picker>
                        </View>
                    </View>
                </View>
                {this.renderCategory()}
                <View style={[styles.splitRow, styles.subItem]}>
                    <Text style={[styles.fourth, styles.allRoundText]}>Groep:</Text>
                    <Picker
                        style={styles.threefourth}
                        mode="dropdown"
                        // onValueChange={(groepeke)=>this.setState({group: groepeke})}
                        onValueChange={(groepeke)=> this.setState({group: groepeke}) & this.changeGroup(groepeke)}
                        selectedValue={this.state.group}>
                            <Picker.Item label="Choose Group" value="choose"/>
                            <Picker.Item label="None" value="none"/>
                            {this.renderGroups()}
                            {/* {this.getAllUsersServer()} */}
                    </Picker>
                </View>
                {this.renderPayer()}
                <View style={styles.subItemCol}>
                    {this.renderGroupMembers()}
                </View>

                {this.renderAddItemButton()}
                <Button style={styles.formButton}
                        title="Save"
                        // disabled={ !title || !group || !betaler || !categorie /*|| totalCost > 0*/ || selectedDate === null }
                        onPress={()=> this.addBill() & console.log("Waiting for backend...")}
                        //onPress={() => this.props.navigation.navigate('Dashboard') & alert(this.state.username + "-"+this.state.password)}
                        //onPress={() => loginAPICall() & this.props.navigation.navigate('Dashboard') }
                        />
                <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {alert("Modal has been closed.")}}>
                    <View style={styles.semiTransparant}>
                        <View style={styles.innerModal}>
                            <Text style={styles.title}>Add person</Text>
                            <Picker
                                mode="dropdown"
                                onValueChange={(vriendje)=>this.setState({tempItemUser: vriendje.email})}
                                selectedValue={this.state.tempItemUser}>
                                <Picker.Item value="0" label="Choose person"/>
                                {this.renderFriends()}
                            </Picker>

                            <TextInput
                                keyboardType="numeric"
                                placeholder="aantal"
                                value={this.state.tempItemAmount.toString()}
                                style={styles.modalTextInput}
                                onChangeText={(val)=>this.setState({tempItemAmount: val})}>
                            </TextInput>
                            <TouchableOpacity style={styles.modalAddButton} onPress={()=>this.setState({modalVisible: false}) & this.addUserToProduct(this.state.tempAddItemUser)}><Text>Add</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.modalCancelButton} onPress={()=>this.setState({modalVisible: false})}><Text>Cancel</Text></TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.itemModalvisible}
                onRequestClose={() => {alert("Modal has been closed.")}}>
                    <View style={styles.semiTransparant}>
                        <View style={styles.innerModal}>
                            <Text style={styles.title}>Add item</Text>
                            <TextInput placeholder="Name item" style={styles.modalTextInput} onChangeText={(text)=>this.setState({currentItem: text})}></TextInput>
                            <TextInput keyboardType="numeric" style={styles.modalTextInput} onChangeText={(text)=>this.setState({currentItemPrice: text})}></TextInput>

                            <CheckBox checked={this.state.tempShare} onChange={(share)=>this.setState({tempShare: share})} />
                            <Text >Shared item?</Text>

                            <TouchableOpacity style={styles.modalAddButton} onPress={()=>this.saveItem() & this.setState({itemModalvisible: false})}><Text>Add</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.modalCancelButton} onPress={()=>this.setState({itemModalvisible: false})}><Text>Cancel</Text></TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* ADD PERSON SHARED ITEM */}
                <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisibleShare}
                onRequestClose={() => {alert("Modal has been closed.")}}>
                    <View style={styles.semiTransparant}>
                    <View style={styles.innerModal}>
                        <Text style={styles.title}>Add Person to shared product</Text>
                        <Picker
                            mode="dropdown"
                            onValueChange={(vriendje)=>this.setState({tempItemUser: vriendje})}
                            selectedValue={this.state.tempItemUser}>
                            <Picker.Item value="0" label="Choose person"/>
                            {this.renderFriends()}
                        </Picker>

                        <TouchableOpacity style={styles.modalAddButton} onPress={()=>this.setState({modalVisibleShare: false}) & this.addUserToProduct(this.state.tempAddItemUser)}><Text>Add</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.modalCancelButton} onPress={()=>this.setState({modalVisibleShare: false})}><Text>Cancel</Text></TouchableOpacity>
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
        backgroundColor: '#fffff',
        paddingTop: 10,
        paddingLeft:20,
        paddingRight:20
    },
    splitRow:{
        flexDirection: 'row',
        marginBottom: 5
    },
    addButton:{
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
    buttonStyle:{
        flex:1,
        textAlign: 'center',
        color: "#ffffff",
        textAlignVertical: 'center'
    },
    inputField:{
        padding: 10,
        backgroundColor: 'rgba(255,255,255,0.5)',
        marginBottom: 15,
        borderBottomWidth: 2,
        borderRadius:5,
    },
    half:{
        flex:.5
    },
    fourth:{
        flex:.25
    },
    threefourth:{
        flex:.75
    },
    datePickerStyle:{
        width: 300
    },
    numberInput:{
        fontSize: 20,
        backgroundColor: 'rgba(255,255,255,0)',
        color: '#000',
        borderBottomWidth: 2,
    },
    choose:{
        flexDirection:'row',
        flex:.5,
        marginTop: 10
    },
    chooseText:{
        textAlignVertical: 'center',
        flex:.5,
        fontSize: 20,
        color: '#818181'
    },
    autofillmodal:{
        width: 100,
        height: 100,
        backgroundColor: "#fff"
    },
    searchItem:{
        height: 40,
        backgroundColor:  "#acacac",
        flexDirection: "row",
    },
    searchItemText:{
        textAlignVertical:"center",
        flex:1,
        flexDirection: 'row',
        textAlign: 'center'
    },
    test:{
        backgroundColor: "#fff",
        position: "absolute",
        top: 50,
        marginLeft: 30,
        marginRight: 30,
        width:250
    },
    addPersonButton:{

    },
    placeholderText:{
        color: '#818181'
    },
    innerModal:{
        backgroundColor: "#a3a3a3",
        margin:50,
        paddingTop: 15

    },
    subItem:{
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius:5,
        paddingLeft:5,
        flexDirection:"row"
    },
    subItemCol:{
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius:5,
        paddingLeft:5,
    },
    allRoundText:{
        color: "#818181",
        marginTop: 10,
        marginBottom:10,
        fontSize: 15

    },
    totalCostStyle:{
        color: "#818181",
        marginTop: 15,
        marginBottom:10,
        fontSize: 15,
        marginRight: 30
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
    }
});
