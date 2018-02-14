import React, {Component} from 'react';
import {StyleSheet, View, ScrollView, Image, Text, TextInput, Button, TouchableOpacity, ActivityIndicator, AsyncStorage} from 'react-native';
import I18n from 'react-native-i18n';

// ############ Colors ############
const red = '#C42525';
const green = '#4F9628';
const yellow = '#D6A024';

export default class DetailPerson extends Component{
    constructor(props) {
      super(props);
      this.state = {
        username: "",
        bills: []
      };
    }

    componentDidMount() {
      this.getUserBills();
    }

    getCurrencySymbol(bill) {
      if (bill.currency === 'EUR') {
        return '€';
      } else if (bill.currency === 'USD') {
        return '$';
      } else {
        return bill.currency;
      }
    }

    getUserBills() {
      try {
        AsyncStorage.getItem('userName').then((username) => {
          this.setState({ username });
        })
        .then(res => {
          console.log(this.props.navigation.state.params.email2);
          console.log(this.state.username);
          return fetch('http://193.191.177.169:8080/mula/Controller?action=getBills', {
            method: 'POST',
            header:{
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: this.state.username,
              email_2: this.props.navigation.state.params.email2
            })
          })
          .then((res) => res.json())
          .then((response) => {
            this.setState({ bills: response.bills })
          });
        });
      } catch(error) {
        console.log(error);
      }
    }

    removeFriend(){
      console.log("Removing friend");
      console.log(this.state.username);
      console.log(this.props.navigation.state.params.email2);
      return fetch("http://193.191.177.169:8080/mula/Controller?action=removeFriend", {
        method: 'POST',
        header:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: this.state.username,
          friend: this.props.navigation.state.params.email2
        })
      }).then((response)=>{
        console.log(response);
        this.props.navigation.navigate('DashboardPersons');
      })
    }

    renderBills() {
      return this.state.bills.map((bill) => {
        let image = null;
        if (bill.has_paid) {
            image = <Image style={styles.way} source={require('../../images/in.png')}/>;
        } else {
            image = <Image style={styles.way} source={require('../../images/out.png')}/>;
        }

        return(
            <TouchableOpacity style={styles.eventItem} onPress={() => this.props.navigation.navigate('DetailEvent', { event: bill })} key={ bill.id }>
                <View style={styles.splitRow}>
                    <View style={[styles.half, styles.wayContainer]}>
                        { image }
                    </View>

                  <Text style={[styles.eventAmount, styles.half]}>{ this.getCurrencySymbol(bill) }{ bill.total_price.toFixed(2) }</Text>
                </View>
                <Text style={styles.eventName}>{ bill.event }</Text>
                <View style={styles.splitRow}>
                    <Text style={[styles.eventDate, styles.half]}>{ bill.date }</Text>
                    <Text style={[styles.eventAmountUsers, styles.half]}>{ bill.amount_already_paid }/{ bill.amount_users }</Text>
                </View>
                <View style={styles.progressBarContainer}>
                    <View style={{backgroundColor: barStyle(bill.amount_already_paid, bill.amount_users), flex: 0.05+((0.95/bill.amount_users)*bill.amount_already_paid)}}></View>
                </View>
            </TouchableOpacity>
        );
      });
    }

    render(){
      return(
        <View style={styles.container}>
          <ScrollView styles={styles.eventList}>
            { this.renderBills() }
          </ScrollView>
          <Button title="Remove Friend" onPress={()=>this.removeFriend()} color="#FF0000"/>
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
  container:{
    flex: 1,
    backgroundColor: 'rgba(176,207,227,34)',
  },
  eventList:{
    marginLeft: 10,
    marginRight: 10
  },
  eventItem:{
    backgroundColor: '#EFF2F7',
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    marginTop: 20,
    borderRadius:5,
    borderColor: '#000'
  },
  eventAmount:{
    fontSize: 35,
    textAlign: 'right',
  },
  eventName:{
    textAlign: 'right',
    fontSize: 20,
  },
  eventDate:{
    // flex:.5,
  },
  splitRow:{
    flexDirection: 'row',
    marginBottom: 5
  },
  eventAmountUsers:{
    textAlign:'right',
    flex:.5
  },
  progressBarContainer:{
    flex: 1,
    height: 5,
    marginLeft: -10,
    marginBottom: -10,
    marginRight: -10,
    flexDirection: 'row',
    backgroundColor: '#213544',
  },
  half:{
    flex: .5
  },
  way:{
    width: 50,
    height: 50
  },
  wayContainer:{
      alignItems: 'center',
  }
});
