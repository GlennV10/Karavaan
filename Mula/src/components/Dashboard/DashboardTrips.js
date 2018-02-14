import React, {Component} from 'react';
import {StyleSheet, View, Image, Text, TextInput, Button, TouchableOpacity, ScrollView, Modal, Switch, ActivityIndicator, Picker, AsyncStorage} from 'react-native';

// ############ Colors ############
const red = '#C42525';
const green = '#4F9628';
const yellow = '#D6A024';

export default class DashboardTrips extends Component {
    constructor(props) {
      super(props);
      this.state = {
        trips: [],
        username: "",
        isLoading: false
      }
    }

    componentDidMount() {
      this.getAllTrips();
    }

    getCurrencySymbol(trip) {
      if (trip.currency === 'EUR') {
        return '€';
      } else if (trip.currency === 'USD') {
        return '$';
      } else {
        return trip.currency;
      }
    }

    getAllTrips(){
      this.setState({ isLoading: true });
      try {
        AsyncStorage.getItem('userName').then((username) => {
            this.setState({ username });
          })
          .then(res => {
            return fetch('http://193.191.177.169:8080/mula/Controller?action=getBills', {
              method: 'POST',
              header:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                email: this.state.username
              })
            })
            .then((res) => res.json())
            .then((response) => {
              this.setState({ trips: response.bills, isLoading: false })
            });
          });
      } catch(error) {
        console.log(error);
      }
    }

    renderTrips() {
        if(this.state.trips.length === 0){
          return(
            <View style={styles.noBillView}>
              <Text style={styles.noBillText}>NO TRIPS FOUND</Text>
            </View>
          )
        } else {
        return this.state.trips.map((trip) => {
            let image = null;
            if (trip.has_paid) {
                image = <Image style={styles.way} source={require('../../images/in.png')}/>;
            } else {
                image = <Image style={styles.way} source={require('../../images/out.png')}/>;
            }

            return(
              <TouchableOpacity style={styles.eventItem} onPress={() => this.props.navigator.navigate('TripDashboard', { trip: trip })} key={ trip.id }>
                <View style={styles.splitRow}>
                  <View style={[styles.half, styles.wayContainer]}>
                    { image }
                  </View>
                  <Text style={[styles.eventAmount, styles.half]}>{ this.getCurrencySymbol(trip) }{ trip.total_price.toFixed(2) }</Text>
                </View>
                <Text style={styles.eventName}>{ trip.event }</Text>
                <View style={styles.splitRow}>
                  <Text style={[styles.eventDate, styles.half]}>{ trip.date }</Text>
                  <Text style={[styles.eventAmountUsers, styles.half]}>{ trip.amount_already_paid }/{ trip.amount_users }</Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View style={{backgroundColor: barStyle(trip.amount_already_paid, trip.amount_users), flex: 0.05+((0.95/trip.amount_users)*trip.amount_already_paid)}}></View>
                </View>
              </TouchableOpacity>
            );
        });
        }
    }

    render() {
      if(this.state.isLoading) {
        return(
          <View style={styles.containerIndicator}>
            <ActivityIndicator />
          </View>
        )
      }

      return(
      <View style={styles.container}>
        <ScrollView style={styles.eventList}>
          { this.renderTrips() }
        </ScrollView>
        <TouchableOpacity style={styles.addButton} onPress={() => this.props.navigator.navigate('AddEvent') /*& this.setModalVisible(true) & this.getCurrentLocation()*/ }>
          <Text style={styles.addButtonText} >+</Text>
        </TouchableOpacity>
      </View>
      )
    }
}

function barStyle(paid, total){
  if(paid == total) {
    return green
  } else if(paid > 0) {
    return yellow
  } else {
    return red
  }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#d4e8e5'
        //backgroundColor: 'rgba(176,207,227,34)',
    },
    containerIndicator: {
        flex: 1,
        paddingTop: 5,
        backgroundColor: '#d4e8e5'
    },
    eventList: {
        //flex:1,
        marginLeft: 10,
        marginRight: 10
    },
    eventItem: {
        backgroundColor: '#f7f7f7',
        paddingBottom:10,
        paddingLeft:10,
        paddingRight:10,
        paddingTop:10,
        marginTop: 20,
        borderRadius:5,
        // flex:.5,
        // height: 115,
        borderColor: '#000'
    },eventAmount: {
        fontSize: 35,
        textAlign: 'right',
    },eventName: {
        textAlign: 'right',
        fontSize: 20,
    },eventDate: {
        // flex:.5,
    },splitRow: {
        flexDirection: 'row',
        marginBottom: 5
    },eventAmountUsers: {
        textAlign:'right',
        flex:.5
    },progressBarContainer: {
        flex:1,
        height: 5,
        marginLeft: -10,
        marginBottom:-10,
        marginRight:-10,
        flexDirection: 'row',
        backgroundColor: '#213544',
    },addButton: {
        backgroundColor: '#3B4859',
        width: 50,
        height: 50,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 10,
        right: 10,
    },addButtonText: {
        color: '#fff'
    },
    innerModalStyle: {
        backgroundColor: 'rgba(0,0,0,.75)',
        flex:1,
        justifyContent: 'center'
    },
    innerModalContentStyle: {
        backgroundColor: '#EFF2F7',
        // paddingLeft: 10,
        // paddingRight:10,
        paddingTop:50,
        margin: 15,
        borderRadius:5,
        flex:.7,
    },
    modalAddEventSave: {
        flex:.5,
        backgroundColor:green,
    },
    modalAddEventCancel: {
      flex:.5  ,
      backgroundColor: red,
    },
    modalButtons: {
        flex:.1,
        flexDirection:'row',
        marginRight:-20,
        marginLeft:-20
    },
    modalContent: {
        flex:1,
    },
    buttonStyle: {
        flex:1,
        textAlign: 'center',
        color: "#ffffff",
        textAlignVertical: 'center'
    },
    inputField: {
        marginLeft: 50,
        marginRight: 50,
        fontSize: 20,
        padding: 10,
        backgroundColor: 'rgba(255,255,255,0)',
        marginBottom: 15,
        color: '#000',
        borderBottomWidth: 2,
        borderRadius:5,
    },
    half: {
        flex:.5
    },
    way: {
        width:50,
        height: 50
    },
    wayContainer: {
        alignItems: 'center',
    },
    datePickerStyle: {
        width: 300
    },
    threequarter: {
        flex: .75,
    },
    quarter: {
        flex: .25

    },
    splitRowModal: {
        flexDirection: 'row',
        marginBottom: 5,
        marginLeft: 50,
        marginRight: 50
    },
    itemsRight: {
        alignItems: 'flex-end'
    },
    testRed: {
        backgroundColor: red
    },
    modalNumberInput: {
        fontSize: 20,
        backgroundColor: 'rgba(255,255,255,0)',
        color: '#000',
        borderBottomWidth: 2,
    },
    choose: {
        flexDirection:'row',
    },
    addButtonLeft: {
        backgroundColor: '#3B4859',
        width: 50,
        height: 50,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 10,
        left: 10,
    },
    innerModal:{
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
