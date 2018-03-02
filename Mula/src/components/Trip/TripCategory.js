import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, TextInput, Button, TouchableOpacity, ScrollView, Picker, ActivityIndicator, AsyncStorage } from 'react-native';
import I18n from 'react-native-i18n';

export default class TripCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            categories: [],
            baseCurrency: "",
            selectedCurrency: "",
            rates: [],
            isLoading: true
        }
    }

    componentWillMount() {
        /*AsyncStorage.getItem('expenses')
              .then(req => JSON.parse(req))
              .then(expenses => console.log('Expenses loaded from AsyncStorage') & console.log(expenses) & this.setState({ expenses }) & this.setState({isLoading : false}))
              .catch(error => console.log('Error loading expenses'));*/
        AsyncStorage.getItem('userName').then((username) => {
            this.setState({ username });
            this.calculateCategorytotal();
        })
    }

    renderValutaToArray(rate) {
        var array = [];
        array.push({ name: this.state.baseCurrency, value: 1 });
        Object.keys(rate).map((val) => {
            array.push({
                name: val,
                value: rate[val]
            })
        });
        this.setState({ rates: array });
    }

    getExchangeRates() {
        console.log("Getting rates...");
        var url = "http://193.191.177.73:8080/karafinREST/getTrip/" + this.props.navigator.state.params.trip.id;
        //if (this.state.loadRates) {
        return fetch(url, {
            method: 'GET',
            header: {
                'Content-Type': 'application/json'
            }
        })
            .then((resp) => resp.json())
            .then((trip) => (console.log(trip.rates) &
                this.setState({ baseCurrency: trip.baseCurrency }) &
                this.renderValutaToArray(trip.rates)));
        //}
    }

    async calculateCategorytotal() {
        let categories = [];

        await this.getExchangeRates();
        this.setState({ selectedCurrency: this.state.baseCurrency });
        console.log(this.state.selectedCurrency);
        for (expense of this.props.expenses) {
            let userExpense = 0;
            Object.keys(expense.consumers).map((user) => {
                console.log(user);
                if (user == this.state.username) {
                    userExpense = expense.consumers[user];
                }
            });
            console.log(userExpense);
            if (categories.findIndex(i => i.category === expense.category) < 0) {
                if (expense.currency == this.state.baseCurrency) {
                    let category = {
                        category: expense.category,
                        total: userExpense,
                        expenses: 1
                    };
                    for (currency of this.state.rates) {
                        if (expense.currency == currency.name) category.total = userExpense / currency.value;
                    }
                    categories.push(category);
                }
            } else {
                for (let j = 0; j < categories.length; j++) {
                    if (categories[j].category === expense.category) {
                        if (expense.currency == this.state.baseCurrency) {
                            let category = {
                                category: expense.category,
                                total: userExpense,
                                expenses: 1
                            };
                            categories.push(category);
                        }
                        for (currency of this.state.rates) {
                            if (expense.currency == currency.name) {
                                categories[j].total += (userExpense / currency.value);
                                categories[j].expenses++;
                            }
                        }
                    }
                }
            }
        }
        this.setState({ categories });
        this.setState({ isLoading: false })
    }

    async updateCurrency(newCurrency) {
        await this.getExchangeRates();
        for (element of this.state.rates) {
            console.log("rates: " + element.name);
        }
        let categories = this.state.categories;
        let currentRate = 1;
        let newRate = 1;
        for (category of categories) {
            for (currency of this.state.rates) {
                if (currency.name == this.state.selectedCurrency) {
                    console.log("current: " + currency.name + " , " + this.state.selectedCurrency);
                    currentRate = currency.value;
                } else if (currency.name == newCurrency) {
                    console.log("new: " + currency.name + " , " + newCurrency);
                    newRate = currency.value;
                }
            }
            category.total = category.total / currentRate * newRate;
        }
        console.log("current: " + currentRate + ", newRate: " + newRate);
        this.setState({ categories });
        this.setState({ selectedCurrency: newCurrency });
    }

    getCategoryExpenses(category) {
        let expenses = [];
        for (expense of this.props.expenses) {
            if (expense.category === category) {
                expenses.push(expense);
            }
        }
        return expenses;
    }

    renderCategories() {
        if (this.state.isLoading) {
            return (
                <View style={styles.containerIndicator}>
                    <ActivityIndicator />
                </View>
            )
        } else {
            if (this.state.categories.length === 0) {
                return (
                    <View style={styles.noCategoriesView}>
                        <Text style={styles.noCategoriesText}>{I18n.t('nocategoriesfound')}</Text>
                    </View>
                )
            } else {
                return this.state.categories.map((category, index) => {
                    return (
                        <TouchableOpacity style={styles.category} onPress={() => this.props.navigator.navigate('TripCategoryExpenses', { category: category.category, expenses: this.getCategoryExpenses(category.category) })} key={index}>
                            <View style={[styles.categoryContainer, styles.half]}>
                                <View style={styles.splitRow}>
                                    <Text style={[styles.categoryName]}>{category.category}</Text>
                                </View>
                                <View style={styles.splitRow}>
                                    <Text style={styles.categoryExpensesCount}>{category.expenses} {I18n.t('exp')}</Text>
                                </View>
                            </View>
                            <View style={[styles.categorytotalContainer, styles.half]}>
                                <View style={styles.splitRow}>
                                    <Text style={styles.categorytotal}>{category.total.toFixed(2)}</Text>
                                </View>
                                <View style={styles.splitRow}>
                                    <Text style={styles.categoryCurrency}>{this.state.selectedCurrency}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )
                });
            }
        }
    }

    renderPicker() {
        let trip = this.props.navigator.state.params.trip;
        if (this.props.expenses.length > 0) {
            return (
                <Picker
                    style={styles.currencyPicker}
                    selectedValue={this.state.selectedCurrency}
                    onValueChange={(itemValue, itemIndex) => this.updateCurrency(itemValue)}>
                    {this.state.rates.map((item, index) => {
                        return (<Picker.Item label={item.name} value={item.name} key={index} />)
                    })}
                </Picker>
            )
        } else return null;
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderPicker()}
                <ScrollView style={styles.categoryList}>
                    <View style={styles.spaceView}>
                        {this.renderCategories()}
                    </View>
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
    splitRow: {
        flexDirection: 'row'
    },
    half: {
        flex: .5
    },
    noCategoriesView: {
        flex: 1,
        alignItems: "center",
        paddingTop: 10
    },
    noCategoriesText: {
        fontSize: 20,
        marginTop: 50,
        marginLeft: 10,
        marginRight: 10,
        color: "#a8a8a8"
    },
    categoryList: {
        // marginLeft: 10,
        // marginRight: 10
    },
    spaceView: {
        marginBottom: 75
    },
    category: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#f7f7f7',
        padding: 10,
        // marginTop: 5,
        // borderRadius: 2,
        borderColor: '#d3d3d3',
        borderWidth: .3
    },
    categoryName: {
        fontSize: 16
    },
    categoryExpensesCount: {
        fontSize: 12,
        color: '#bababa'
    },
    categorytotal: {
        fontSize: 16,
        textAlign: 'right'
    },
    categoryCurrency: {
        fontSize: 12,
        color: '#bababa',
        textAlign: 'right'
    },
    categoryContainer: {
        flex: .5,
        paddingLeft: 10
    },
    categorytotalContainer: {
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
    },
    currencyPicker: {
        backgroundColor: "white",
    },
    containerIndicator: {
        flex: 1,
        paddingTop: 5,
        backgroundColor: '#d4e8e5'
    },
});
