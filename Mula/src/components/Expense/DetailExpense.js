import React, {Component} from 'react';
import {StyleSheet, View, ScrollView, Image, Text, TextInput, Button, TouchableOpacity, ActivityIndicator, Modal} from 'react-native';
import I18n from 'react-native-i18n';

export default class DetailExpense extends Component{
    constructor(props) {
      super(props);
      this.state = {
          consumers: [],
          payers: []
      };
    }

    componentWillMount() {
        this.setState({ consumers: Object.keys(this.props.navigation.state.params.expense.consumers) });
        this.setState({ payers: Object.keys(this.props.navigation.state.params.expense.payers) });
    }

    componentDidMount() {
        let consumers = this.state.consumers.slice();
        for(payer of this.state.payers) {
            if(!(this.state.consumers.includes(payer))) {
                consumers.push(payer);
            }
        }
        this.setState({ consumers });
    }

    renderUsers() {
        const amounts = Object.values(this.props.navigation.state.params.expense.consumers);
        const payerAmounts = Object.values(this.props.navigation.state.params.expense.payers);

        return this.state.consumers.map((consumer, index) => {
            let paid = null;
            let amount = null;
            if(this.state.payers.includes(consumer)) {
                paid = <Text style={styles.userPaid}>Paid: { payerAmounts[this.state.payers.indexOf(consumer)] }</Text>
            }
            if(amounts.length > index) {
                amount = amounts[index].toFixed(2)
            } else {
                amount = "--"
            }
            return (
                <View style={styles.userDetails} key={index}>
                    <View style={styles.userNameContainer}>
                        <Text style={styles.userName}>{ consumer }</Text>
                        { paid }
                    </View>
                    <View style={{flex: .3}}>
                        <Text style={styles.userAmount}>{ amount }</Text>
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
                        <Text style={styles.expenseName}>{ expense.expenseName }</Text>
                        <Text style={styles.expenseDate}>Paid on { expense.date.dayOfMonth }/{ (expense.date.month + 1) }/{ expense.date.year }</Text>
                    </View>
                    <View style={{flex: .3}}>
                        <Text style={styles.expensePrice}>{ expense.total.toFixed(2) }</Text>
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
        color: '#000'
    },
    userAmount: {
        textAlign: 'right'
    },
    userPaid: {
        fontSize: 12,
        color: '#bababa',
    }
});
