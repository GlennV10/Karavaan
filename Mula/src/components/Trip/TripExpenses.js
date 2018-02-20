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
        // this.setState({ isLoading: true });
        // this.getAllExpensesByTrip();
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

    renderExpenses() {
      if(this.props.expenses.length === 0){
          return(
              <View style={styles.noExpensesView}>
                  <Text style={styles.noExpensesText}>{I18n.t('noexpensesfound')}</Text>
              </View>
          )
      } else {
          return this.props.expenses.map((expense) => {
              return(
                  <TouchableOpacity style={styles.expense} onPress={() => this.props.navigator.navigate('DetailExpense', { expense })} key={ expense.id }>
                      <View style={[styles.expenseContainer, styles.half]}>
                          <View style={styles.splitRow}>
                              <Text style={[styles.expenseName]}>{ expense.name }</Text>
                          </View>
                          <View style={styles.splitRow}>
                              <Text style={styles.expenseDate}>{ expense.date }</Text>
                          </View>
                      </View>
                      <View style={[styles.expenseAmountContainer, styles.half]}>
                          <View style={styles.splitRow}>
                              <Text style={styles.expenseAmount}>{ expense.amount.toFixed(2) }</Text>
                          </View>
                          <View style={styles.splitRow}>
                              <Text style={styles.expenseCurrency}>{ expense.currency }</Text>
                          </View>
                      </View>
                  </TouchableOpacity>
              )
          });
      }
    }

    render() {
      if(this.state.isLoading) {
        return(
          <View style={styles.containerIndicator}>
              <ActivityIndicator />
              <TouchableOpacity style={styles.addTripButton} onPress={() => this.props.navigator.navigate('AddExpense', {trip: this.props.navigator.state.params.trip})}>
                  <Text style={styles.addTripButtonText} >+</Text>
              </TouchableOpacity>
          </View>
        )
      }

      return(
        <View style={styles.container}>
            <ScrollView style={styles.expenseList}>
                { this.renderExpenses() }
            </ScrollView>
            <TouchableOpacity style={styles.addTripButton} onPress={() => this.props.navigator.navigate('AddExpense', {trip: this.props.navigator.state.params.trip})}>
                <Text style={styles.addTripButtonText} >+</Text>
            </TouchableOpacity>
        </View>
      )
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
        flexDirection: 'row'
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
        marginLeft: 10,
        marginRight: 10,
        color: "#a8a8a8"
    },
    expenseList: {
        marginLeft: 10,
        marginRight: 10
    },
    expense: {
        backgroundColor: '#f7f7f7',
        padding: 10,
        marginTop: 10,
        borderRadius: 2,
        borderColor: '#d3d3d3',
        borderWidth: .5,
        flex: 1,
        flexDirection: 'row'
    },
    expenseName: {
        fontSize: 16
    },
    expenseDate: {
        fontSize: 12,
        color: '#bababa'
    },
    expenseAmount: {
        fontSize: 16,
        textAlign: 'right'
    },
    expenseCurrency: {
        fontSize: 12,
        color: '#bababa',
        textAlign: 'right'
    },
    expenseContainer: {
        flex: .5,
        paddingLeft: 10
    },
    expenseAmountContainer: {
        flex: .5,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    addTripButton: {
        backgroundColor: '#3B4859',
        width: 50,
        height: 50,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 10,
        right: 10,
    },
    addTripButtonText: {
        color: '#fff'
    }
});
