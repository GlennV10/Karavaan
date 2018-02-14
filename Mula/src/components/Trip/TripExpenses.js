import React, {Component} from 'react';
import {StyleSheet, View, Image, Text, TextInput, Button, TouchableOpacity, ScrollView, ActivityIndicator, AsyncStorage } from 'react-native';
import I18n from 'react-native-i18n';
// ############ Colors ############
const red = '#C42525';
const yellow = '#D6A024';
const green = '#4F9628';

export default class TripExpenses extends Component {
    constructor(props) {
      super(props);
      this.state = {
        expenses: [],
        username: "",
        isLoading: false
      }
    }

    componentWillMount() {
        this.setState({ isLoading: true });
        this.getAllExpensesByTrip();
    }

    componentDidMount() {
        this.setState({ isLoading: false });
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.expenses !== nextState.expenses) {
          return true;
        }
        return false;
    }

    getCurrencySymbol(expense) {
      if (expense.currency === 'EUR') {
        return '€';
      } else if (expense.currency === 'USD') {
        return '$';
      } else {
        return expense.currency;
      }
    }

    /*
      GET-request to get all Expenses from one trip
      trip-id(?) = this.props.navigation.state.params.trip(??)
    */
    getAllExpensesByTrip(){
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
                this.setState({ expenses: response.bills })
              });
            });
        } catch(error) {
          console.log(error);
        }
    }

    /*
      Rendering EXPENSES
      Change trip values (??)
    */
    renderExpenses() {
      if(this.state.expenses.length === 0){
          return(
              <View style={styles.noExpensesView}>
                <Text style={styles.noExpensesText}>NO EXPENSES FOUND</Text>
              </View>
          )
      } else {
          return this.state.expenses.map((expense) => {
              let image = null;
              if (expense.has_paid) {
                  image = <Image style={styles.whoPaidImage} source={require('../../images/in.png')}/>;
              } else {
                  image = <Image style={styles.whoPaidImage} source={require('../../images/out.png')}/>;
              }

              return(
              <TouchableOpacity style={styles.expense} onPress={() => this.props.navigator.navigate('DetailEvent', { /* CHANGE TO EXPENSE when DetailEvent changed*/event: expense })} key={ expense.id }>
                  <View style={styles.splitRow}>
                    <View style={[styles.whoPaidImageContainer, styles.half]}>
                        { image }
                    </View>
                    <Text style={[styles.expenseAmount, styles.half]}>{ this.getCurrencySymbol(expense) }{ expense.total_price.toFixed(2) }</Text>
                  </View>
                  <Text style={styles.expenseName}>{ expense.event }</Text>
                  <View style={styles.splitRow}>
                    <Text style={[styles.expenseDate, styles.half]}>{ expense.date }</Text>
                    <Text style={[styles.expenseAmountUsers, styles.half]}>{ expense.amount_already_paid }/{ expense.amount_users }</Text>
                  </View>
                  <View style={styles.progressBarContainer}>
                    <View style={{backgroundColor: barStyle(expense.amount_already_paid, expense.amount_users), flex: 0.05+((0.95/expense.amount_users)*expense.amount_already_paid)}}></View>
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
          <ScrollView style={styles.expenseList}>
              { this.renderExpenses() }
          </ScrollView>
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
        flex: 1,
        backgroundColor: '#d4e8e5'
    },
    containerIndicator: {
        flex: 1,
        paddingTop: 5,
        backgroundColor: '#d4e8e5'
    },
    splitRow: {
        flexDirection: 'row',
        marginBottom: 5
    },
    half: {
        flex: .5
    },
    noExpensesView: {
        flex: 1,
        alignItems: "center",
        paddingTop: 10
    },
    noExpensesText: {
        fontSize: 20,
        marginTop: 50,
        color: "#a8a8a8"
    },
    whoPaidImageContainer: {
        alignItems: 'center'
    },
    whoPaidImage: {
        width: 50,
        height: 50
    },
    expenseList: {
        marginLeft: 10,
        marginRight: 10
    },
    expense: {
        backgroundColor: '#f7f7f7',
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        marginTop: 20,
        borderRadius: 5,
        borderColor: '#000'
    },
    expenseAmount: {
        fontSize: 35,
        textAlign: 'right'
    },
    expenseName: {
        fontSize: 20,
        textAlign: 'right'
    },
    expenseAmountUsers: {
        flex: .5,
        textAlign:'right'
    },
    progressBarContainer: {
        flex: 1,
        height: 5,
        marginLeft: -10,
        marginBottom: -10,
        marginRight: -10,
        flexDirection: 'row',
        backgroundColor: '#213544',
    }
});
