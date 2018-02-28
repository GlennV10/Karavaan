import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, TextInput, Button, TouchableOpacity, ScrollView, ActivityIndicator, AsyncStorage } from 'react-native';
import I18n from 'react-native-i18n';
// ############ Colors ############
const red = '#C42525';
const yellow = '#D6A024';
const green = '#4F9628';

export default class TripExpenses extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expenses: []
        }
    }

    componentWillMount() {
        this.setState({ expenses: this.props.expenses });
    }

    renderExpenses() {
        if (this.state.expenses.length === 0) {
            return (
                <View style={styles.noExpensesView}>
                    <Text style={styles.noExpensesText}>{I18n.t('noexpensesfound')}</Text>
                </View>
            )
        } else {
            return this.state.expenses.map((expense) => {
                return (
                    <TouchableOpacity style={styles.expense} onPress={() => this.props.navigator.navigate('DetailExpense', { expense })} key={expense.id}>
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
                                <Text style={styles.expenseAmount}>{ expense.total.toFixed(2) }</Text>
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
        return (
            <View style={styles.container}>
                <ScrollView style={styles.expenseList}>
                    {this.renderExpenses()}
                </ScrollView>
                <TouchableOpacity style={styles.addTripButton} onPress={() => this.props.navigator.navigate('AddExpense', { trip: this.props.navigator.state.params.trip })}>
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
