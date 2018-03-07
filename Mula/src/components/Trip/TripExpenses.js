import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Image, Text, TextInput, RefreshControl, Button, TouchableOpacity, ScrollView, ActivityIndicator, AsyncStorage, Alert } from 'react-native';
import I18n from 'react-native-i18n';
// ############ Colors ############
const red = '#C42525';
const yellow = '#D6A024';
const green = '#4F9628';
const width = Dimensions.get('window').width;

export default class TripExpenses extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            isAdmin: false,
            expenses: [],
            originalExpenses: [],
            isLoading: true,
            refreshing: false
        }
    }

    componentWillMount() {
        AsyncStorage.getItem('userName').then((username) => {
            this.setState({ username });
            this.setState({ originalExpenses: this.props.expenses });
            this.setState({ expenses: this.props.expenses });
            this.checkAdmin();
        });
    }

    componentDidMount() {
        this.props.navigation.addListener("didFocus", () => this.componentOnFocus());
    }

    componentOnFocus() {
        this.checkAdmin();
    }

    askToDeleteExpense(expense) {
        Alert.alert(
            I18n.t('delete'),
            I18n.t('deleteexpense'), [{
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
            }, {
                text: 'OK',
                onPress: () => this.deleteExpense(expense)
            },], {
                cancelable: false
            }
        )
        return true;
    }

    deleteExpense(expense) {
        let url = 'http://193.191.177.73:8080/karafinREST/removeExpense/' + expense.id;
        return fetch(url, {
            method: 'DELETE',
            header: {
                'Content-Type': 'application/json'
            }
        })
        .then((res) => {
            console.log(res);
            this.props.navigation.navigate('TripDashboard', {trip: this.props.trip});
        })
        .catch((error) => console.log(error));
    }

    async checkAdmin() {
        let trip = this.props.navigation.state.params.trip;
        this.setState({ originalExpenses: trip.expenseList });
        this.setState({ expenses: trip.expenseList });
        this.setState({ isAdmin: false });

        for (participant of trip.participants) {
            if (participant[0].email == this.state.username && (participant[1] == "ADMIN" || participant[1] == "GUIDE")) {
                this.setState({ isAdmin: true });
            }
        }

        if (!this.state.isAdmin) {
            let expenses = [];
            this.state.originalExpenses.map((expense) => {
                let userExpense = 0;
                Object.keys(expense.consumers).map((user) => {
                    console.log("expenseUser: " + user);
                    if (user == this.state.username) {
                        userExpense = expense.consumers[user];
                        expense.userTotal = userExpense;
                        expenses.push(expense);
                    }
                });              
            });
            this.setState({ expenses }); 
        }
        await this.setState({ isLoading: false });
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
                    <TouchableOpacity style={styles.expense} onLongPress={() => this.askToDeleteExpense(expense) } onPress={() => this.props.navigation.navigate('DetailExpense', { expense })} key={expense.id}>
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
                                <Text style={styles.expenseAmount}>{(this.state.isAdmin) ? expense.total.toFixed(2) : expense.userTotal.toFixed(2)}</Text>
                            </View>
                            <View style={styles.splitRow}>
                                <Text style={styles.expenseCurrency}>{expense.currency}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )
            });
        }
    }

    render() {
        if (this.state.isLoading) {
            return (
              <View style={styles.containerIndicator}>
                <ActivityIndicator />
              </View>
            )
        } else {
            return (
                <View style={styles.container}>
                    <ScrollView style={styles.expenseList}>
                        <View style={styles.spaceView}>
                            {this.renderExpenses()}
                        </View>
                    </ScrollView>
                    <TouchableOpacity style={styles.addTripButton} onPress={() => this.props.navigation.navigate('AddExpense', { trip: this.props.navigation.state.params.trip })}>
                        <Text style={styles.addTripButtonText} >+</Text>
                    </TouchableOpacity>
                </View>
            )
        }
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
        // marginRight: 10,
    },
    spaceView: {
        marginBottom: 75
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
