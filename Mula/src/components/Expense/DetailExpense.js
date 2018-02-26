import React, {Component} from 'react';
import {StyleSheet, View, ScrollView, Image, Text, TextInput, Button, TouchableOpacity, ActivityIndicator, Modal} from 'react-native';
import I18n from 'react-native-i18n';

export default class DetailExpense extends Component{
    constructor(props) {
      super(props);
      this.state = {};
    }

    componentDidMount() {
        console.log(this.props.navigation.state.params.expense);
    }

    renderUsers() {
      return this.props.navigation.state.params.expense.consumers.map((consumer, index) => {
        return (
          <View style={styles.userDetails} key={index}>
              <View style={styles.userNameContainer}>
                  <Text style={styles.userName}>{ consumer.user }</Text>
              </View>
              <View style={{flex: .3}}>
                  <Text style={styles.userAmount}>{ consumer.amount.toFixed(2) }</Text>
                  <Text style={styles.expenseCurrency}>{ this.props.navigation.state.params.expense.currency }</Text>
              </View>
          </View>
        )
      });
    }

    render(){
        const {expense} = this.props.navigation.state.params;

        return(
            <ScrollView style={styles.container}>
                <View style={styles.expenseDetails}>
                    <View style={{flex: .7}}>
                        <Text style={styles.expenseName}>{ expense.name }</Text>
                        <Text style={styles.expenseDate}>Paid by { expense.paidBy } on { expense.date }</Text>
                    </View>
                    <View style={{flex: .3}}>
                        <Text style={styles.expensePrice}>{ expense.amount.toFixed(2) }</Text>
                        <Text style={styles.expenseCurrency}>{ expense.currency }</Text>
                    </View>
                </View>

                { this.renderUsers() }
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#d4e8e5'
    },
    expenseDetails: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 25,
        paddingTop: 35,
        paddingBottom: 35
    },
    userNameContainer: {
        flex: .7,
        justifyContent: 'center'
    },
    expenseName: {
        fontSize: 18
    },
    expensePrice: {
        fontSize: 23,
        fontWeight: 'bold',
        textAlign: 'right'
    },
    expenseDate: {
        marginTop: 5,
        fontSize: 12,
        // color: '#494949'
        color: '#bababa'
    },
    expenseCurrency: {
        fontSize: 12,
        color: '#bababa',
        textAlign: 'right'
    },
    userDetails: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 10,
        paddingLeft: 25,
        paddingRight: 25,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        opacity: .7
    },
    userAmount: {
        textAlign: 'right'
    }
});
