import React, {Component} from 'react';
import {StyleSheet, View, ScrollView, Image, Text, TextInput, Button, TouchableOpacity, ActivityIndicator, Modal, AsyncStorage} from 'react-native';
import I18n from 'react-native-i18n';

export default class DetailExpense extends Component{
    constructor(props) {
      super(props);
      this.state = {};
    }

    componentWillMount() {
        AsyncStorage.getItem('userName').then((username)=>{
            this.setState({username});
        })
    }

    componentDidMount() {
        console.log(this.props.navigation.state.params.category);
        console.log(this.props.navigation.state.params.expenses);
    }

    renderExpenses() {
      if(this.props.navigation.state.params.expenses === 0){
          return(
              <View style={styles.noExpensesView}>
                  <Text style={styles.noExpensesText}>{I18n.t('noexpensesfound')}</Text>
              </View>
          )
      } else {
          return this.props.navigation.state.params.expenses.map((expense) => {

            let userExpense = 0;

            Object.keys(expense.consumers).map((user) => {
                console.log("categoryExpenseUser: " + user);
                if(user == this.state.username) {
                    userExpense = expense.consumers[user];
                }
            });

              return(
                  <TouchableOpacity style={styles.expense} onPress={() => this.props.navigation.navigate('DetailExpense', { expense })} key={ expense.id }>
                      <View style={[styles.expenseContainer, styles.half]}>
                          <View style={styles.splitRow}>
                              <Text style={[styles.expenseName]}>{expense.expenseName}</Text>
                          </View>
                          <View style={styles.splitRow}>
                              <Text style={styles.expenseDate}>{expense.date.dayOfMonth}/{(expense.date.month + 1)}/{expense.date.year}</Text>
                          </View>
                      </View>
                      <View style={[styles.expenseAmountContainer, styles.half]}>
                          <View style={styles.splitRow}>
                              <Text style={styles.expenseAmount}>{ userExpense.toFixed(2) }</Text>
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

    render(){
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
      // marginLeft: 10,
      // marginRight: 10
  },
  expense: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: '#f7f7f7',
      padding: 10,
      // marginTop: 5,
      // borderRadius: 2,
      borderColor: '#d3d3d3',
      borderWidth: .3
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
  }
});
