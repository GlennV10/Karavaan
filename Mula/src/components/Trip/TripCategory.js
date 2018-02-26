import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, TextInput, Button, TouchableOpacity, ScrollView, Picker } from 'react-native';
import I18n from 'react-native-i18n';

export default class TripCategory extends Component {
    constructor(props) {
      super(props);
      this.state = {
        user: "",
        categories: [],
        currency: "USD"
      }
    }

    componentWillMount() {
        /*AsyncStorage.getItem('expenses')
              .then(req => JSON.parse(req))
              .then(expenses => console.log('Expenses loaded from AsyncStorage') & console.log(expenses) & this.setState({ expenses }) & this.setState({isLoading : false}))
              .catch(error => console.log('Error loading expenses'));*/
        this.calculateCategoryAmount();
    }

    /*=================================
      Check currencies,
      convert to selected currency(?)
    =================================*/
    calculateCategoryAmount() {
        let categories = [];
        for(expense of this.props.expenses) {
            if(categories.findIndex(i => i.category === expense.category) < 0) {
                let category = {
                    category: expense.category,
                    amount: expense.amount,
                    expenses: 1
                };
                categories.push(category);
            } else {
                for (let j = 0; j < categories.length; j++) {
                    if (categories[j].category === expense.category) {
                        categories[j].amount += expense.amount;
                        categories[j].expenses++;
                    }
                }
            }
        }
        this.setState({ categories });
    }

    updateCurrency(newCurrency) {
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
        if(this.state.categories.length === 0){
            return(
                <View style={styles.noCategoriesView}>
                    <Text style={styles.noCategoriesText}>{I18n.t('nocategoriesfound')}</Text>
                </View>
            )
        } else {
            return this.state.categories.map((category, index) => {
                return(
                    <TouchableOpacity style={styles.categoryDetails} onPress={() => this.props.navigator.navigate('TripCategoryExpenses', { category: category.category, expenses: this.getCategoryExpenses(category.category) })} key={ index }>
                          <View style={{flex: .7}}>
                              <Text style={styles.categoryName}>{ category.category }</Text>
                              <Text style={styles.categoryExpensesCount}>{ category.expenses } {I18n.t('exp')}</Text>
                          </View>
                          <View style={{flex: .3}}>
                              <Text style={styles.categoryAmount}>{ category.amount.toFixed(2) }</Text>
                          </View>
                    </TouchableOpacity>
                )
            });
        }
    }

    renderPicker() {
        if(this.props.expenses.length !== 0) {
            let myTrips = [];
            let currencies = null;
            AsyncStorage.getItem('trips')
              .then(req => JSON.parse(req))
              .then(trips => console.log('Trips loaded from AsyncStorage') & console.log(trips) & (myTrips = trips))
              .catch(error => console.log('Error loading trips'));
            for(trip of myTrips) {
                if(trip.id == this.props.expenses[0].tripID) {
                    return(
                        <Picker
                            mode="dropdown"
                            selectedValue={this.state.selected}
                            onValueChange={(itemValue, itemIndex) => this.updateCurrency(itemValue)}>
                            {trip.currencies.map((item, index) => {
                                return (<Item label={item} value={index} key={index}/>) 
                            })}
                        </Picker>
                    )
                }
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
  categoryDetails: {
      flex: 1,
      flexDirection: 'row',
      padding: 10,
      paddingLeft: 25,
      paddingRight: 25,
      // marginTop: 10,
      backgroundColor: '#f7f7f7',
      alignItems: 'center',
      // borderRadius: 2,
      borderColor: '#d3d3d3',
      borderWidth: .3
  },
  categoryName: {
      fontSize: 16,
      // fontWeight: 'bold',
      // opacity: .7
  },
  categoryExpensesCount: {
      fontSize: 12,
      color: '#bababa'
  },
  categoryAmount: {
      textAlign: 'right'
  }
});
