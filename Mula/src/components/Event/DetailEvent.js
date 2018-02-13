import React, {Component} from 'react';
import {StyleSheet, View, ScrollView, Image, Text, TextInput, Button, TouchableOpacity, ActivityIndicator, Modal} from 'react-native';

// ############ Colors ############
const red = '#C42525';
const green = '#4F9628';

export default class DetailEvent extends Component{
    constructor(props) {
      super(props);
      this.state = {
        modalPay: false,
        pay: null,
        items: [],
        userDebts: []
      };
    }

    componentDidMount() {
        this.getItems();
    }

    getCurrencySymbol() {
      if (this.props.navigation.state.params.event.currency === 'EUR') {
        return '€';
      } else if (this.props.navigation.state.params.event.currency === 'USD') {
        return '$';
      } else {
        return this.props.navigation.state.params.event.currency
      }
    }

    getItems() {
      return fetch('http://193.191.177.169:8080/mula/Controller?action=getItems', {
        method: 'POST',
        header:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bill_id: this.props.navigation.state.params.event.id
        })
      })
      .then((res) => res.json())
      .then((response) => {
        this.setState({ items: response.items });
        this.calculateUserDebts();
      });
    }

    payUserDebts() {

    }

    calculateUserDebts() {
      console.log(this.props.navigation.state.params.event.users);
      let userDebts = [];
      for(item of this.state.items) {
        for(user of this.props.navigation.state.params.event.users) {
          if(user.email === item.user) {
            if(userDebts.findIndex(i => i.user === item.user) < 0) {
              let user = {
                user: item.user,
                debt: item.prijs,
                // paid: user.is_paid,
                items: []
              };
              user.items.push(item);
              userDebts.push(user);
            } else {
              for (let j = 0; j < userDebts.length; j++) {
                if (userDebts[j].user === item.user) {
                  userDebts[j].debt += item.prijs;
                  userDebts[j].items.push(item);
                }
              }
            }
          }
        }
      }
      this.setState({ userDebts });
    }

    renderUsers() {
      return this.state.userDebts.map((userDebt, index) => {
        return (
          <View key={index}>
            <TouchableOpacity style={[styles.userDebt, userDebt.paid ? styles.paid : styles.notPaid]} disabled={userDebt.paid} onPress={() => this.setState({modalPay: true, pay: userDebt.user})}>
              <Text style={styles.user}>{ userDebt.user.toUpperCase() }</Text>
              <Text style={styles.debt}>{ this.getCurrencySymbol() }{ userDebt.debt.toFixed(2) }</Text>
            </TouchableOpacity>
            { this.renderItems(userDebt) }
          </View>
        )
      });
    }

    // checkMethod(userDebt) {
    //   if(this.props.navigation.state.params.event.method === "bybill") {
    //     return this.renderItems(userDebt);
    //   }
    // }

    renderItems(userDebt) {
      if(userDebt.items.length > 0) {
        return userDebt.items.map((item) => {
          return (
            <View>
              <View style={styles.items} key={item.id}>
                <Text>{item.id} {item.description} { this.getCurrencySymbol() }{item.prijs.toFixed(2)}</Text>
              </View>
            </View>
          )
        });
      } else {
        return null;
      }
    }

    render(){
      const {event} = this.props.navigation.state.params;

      return(
        <ScrollView style={styles.container}>
          <View style={styles.eventDetails}>
            <Text style={styles.eventName}>{ event.event } </Text>
            <Text style={styles.eventPrice}>{ this.getCurrencySymbol() }{ Number(event.total_price).toFixed(2) } </Text>
            <Text style={styles.eventDate}>Paid by { event.person_paid } on { event.date } </Text>
          </View>
          <View style={styles.lineStyle}></View>
          <View>
            { this.renderUsers() }
          </View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalPay}
            onRequestClose={() => {alert("Modal has been closed.")}}>
              <View style={styles.semiTransparant}>
                <View style={styles.innerModal}>
                  <Text style={styles.modalText}>Are you sure { this.state.pay } has paid?</Text>
                  <TouchableOpacity style={styles.modalPayButton} onPress={()=>this.setState({modalPay: false})}>
                    <Text>Pay</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalCancelButton} onPress={()=>this.setState({modalPay: false})}>
                    <Text>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
          </Modal>
        </ScrollView>
      )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(176,207,227,34)',
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20
  },
  eventName: {
    fontSize: 18
  },
  eventPrice: {
    fontSize: 23,
    fontWeight: 'bold'
  },
  eventDate: {
    marginTop: 5,
    color: '#494949',
    fontSize: 12
  },
  lineStyle: {
    borderWidth: 0.3,
    borderColor: '#494949',
    marginTop: 20
  },
  userDebt:{
    backgroundColor: '#ededed',
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    marginTop: 10,
    borderRadius: 2,
    flexDirection: 'row',
    flex: 1
  },
  user: {

  },
  debt: {
    marginLeft: 'auto'
  },
  items: {
    paddingLeft: 15
  },
  paid: {
    borderWidth: 3,
    borderColor: green
  },
  notPaid: {
    borderWidth: 3,
    borderColor: red
  },
  semiTransparant: {
    backgroundColor: "rgba(0,0,0,.5)",
    flex:1
  },
  innerModal: {
    backgroundColor: "#a3a3a3",
    margin:50,
    paddingTop: 15
  },
  modalText: {
    textAlign: 'center',
    fontSize: 20,
    paddingBottom: 10
  },
  modalPayButton: {
    backgroundColor: "#6699ff",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 5,
    paddingBottom:5,
    marginLeft: 25,
    marginRight: 25,
    marginBottom:10
  },
  modalCancelButton:{
    backgroundColor: "#66ccff",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 5,
    paddingBottom:5,
    marginLeft: 25,
    marginRight: 25,
    marginBottom:10
  }
});
