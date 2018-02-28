import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, TextInput, Button, TouchableOpacity, ScrollView, Picker, ActivityIndicator, AsyncStorage } from 'react-native';
import I18n from 'react-native-i18n';

export default class TripCategory extends Component {
    constructor(props) {
      super(props);
      this.state = {
        user: "",
        categories: [],
        currency: "USD",
        rates: [],
        pickerRate: 0,
        isLoading: true
      }
    }

    componentDidMount() {
        /*AsyncStorage.getItem('expenses')
              .then(req => JSON.parse(req))
              .then(expenses => console.log('Expenses loaded from AsyncStorage') & console.log(expenses) & this.setState({ expenses }) & this.setState({isLoading : false}))
              .catch(error => console.log('Error loading expenses'));*/
        this.calculateCategoryAmount();
        
    }

    renderValutaToArray(rate) {
        var array = [];
        Object.keys(rate).map((val) => {
            array.push({
                name: val,
                value: rate[val]
            })
        });
        if(array.length == 1) {
            this.setState({ pickerRate: array[0].value });
        } else this.setState({ rates: array });
    }

    parseRates(data) {
        console.log(data.rates)
        //if (this.state.loadRates) {
            this.renderValutaToArray(data.rates);
        //}
    }

    getExchangeRatesWithBase(baseCurrency) {
        console.log("Rates met base '" + baseCurrency + "' wordt uitgevoerd ")
        var url = "https://api.fixer.io/latest?base=" + baseCurrency;
        //if (this.state.loadRates) {
            return fetch(url)
                .then((resp) => resp.json() )
                .then((data) => this.parseRates(data));
        //}
    }

    getExchangeRatesWithBasePicker(newCurrency) {
        console.log(newCurrency + " en current: " + this.state.currency);
        console.log("Rates met base '" + this.state.currency + "' wordt uitgevoerd ")
        var url = "https://api.fixer.io/latest?symbols=" + newCurrency + "&base=" + this.state.currency;
        //if (this.state.loadRates) {
            return fetch(url)
                .then((resp) => resp.json() )
                .then((data) => this.parseRates(data));
        //}
    }

    async calculateCategoryAmount() {
        let categories = [];
        
        await this.getExchangeRatesWithBase(this.state.currency);
        for(expense of this.props.expenses) {
            if(categories.findIndex(i => i.category === expense.category) < 0) {
                if(expense.currency == this.state.currency){
                    let category = {
                        category: expense.category,
                        amount: expense.amount,
                        expenses: 1
                    };
                    categories.push(category);
                }
                for(currency of this.state.rates) {
                    if(expense.currency == currency.name) {
                        let category = {
                            category: expense.category,
                            amount: expense.amount/currency.value,
                            expenses: 1
                        };
                        categories.push(category);
                    }
                }
            } else {
                for (let j = 0; j < categories.length; j++) {
                    if (categories[j].category === expense.category) {
                        if(expense.currency == this.state.currency){
                            let category = {
                                category: expense.category,
                                amount: expense.amount,
                                expenses: 1
                            };
                            categories.push(category);
                        }
                        for(currency of this.state.rates) {
                            if(expense.currency == currency.name) {
                                categories[j].amount += (expense.amount/currency.value);
                                categories[j].expenses++;
                            }
                        }
                    }
                }
            }
        }
        this.setState({ categories });
        this.setState({ isLoading: false})
    }

    async updateCurrency(newCurrency) {
        await this.getExchangeRatesWithBasePicker(newCurrency);
        let categories = this.state.categories;
        console.log(this.state.pickerRate);
        for(category of categories) {
            category.amount = category.amount*this.state.pickerRate;
        }
        this.setState(categories);
        this.setState({ currency: newCurrency});
    }

    getCategoryExpenses(category) {
        let expenses = [];
        for(expense of this.props.expenses) {
            if(expense.category === category) {
                expenses.push(expense);
            }
        }
        return expenses;
    }

    renderCategories() {
        if(this.state.isLoading) {
            return(
              <View style={styles.containerIndicator}>
                <ActivityIndicator />
              </View>
            )
        } else {
            if(this.state.categories.length === 0){
                return(
                    <View style={styles.noCategoriesView}>
                        <Text style={styles.noCategoriesText}>{I18n.t('nocategoriesfound')}</Text>
                    </View>
                )
            } else {
                return this.state.categories.map((category, index) => {
                    return(
                        <TouchableOpacity style={styles.category} onPress={() => this.props.navigator.navigate('TripCategoryExpenses', { category: category.category, expenses: this.getCategoryExpenses(category.category) })} key={ index }>
                            <View style={[styles.categoryContainer, styles.half]}>
                                <View style={styles.splitRow}>
                                    <Text style={[styles.categoryName]}>{category.category}</Text>
                                </View>
                                <View style={styles.splitRow}>
                                    <Text style={styles.categoryExpensesCount}>{ category.expenses } {I18n.t('exp')}</Text>
                                </View>
                            </View>
                            <View style={[styles.categoryAmountContainer, styles.half]}>
                                <View style={styles.splitRow}>
                                    <Text style={styles.categoryAmount}>{category.amount.toFixed(2)}</Text>
                                </View>
                                <View style={styles.splitRow}>
                                    <Text style={styles.categoryCurrency}>{this.state.currency}</Text>
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
        if(this.props.expenses.length > 0) {
            let currencies = null;  
                if(trip.id == this.props.expenses[0].tripID) {                  
                    return(
                        <Picker
                            style={styles.currencyPicker}
                            selectedValue={this.state.currency}
                            onValueChange={(itemValue, itemIndex) => this.updateCurrency(itemValue)}>
                            {trip.currencies.map((item, index) => {
                                return (<Picker.Item label={item} value={item} key={index}/>)
                            })}
                        </Picker>
                    )
                }
            }
        else return null;
    }

    render() {
        return (
            <View style={styles.container}>
                { this.renderPicker() }
                <ScrollView style={styles.categoryList}>
                    { this.renderCategories() }
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
    categoryAmount: {
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
    categoryAmountContainer: {
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
