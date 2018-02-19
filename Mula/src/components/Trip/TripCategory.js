import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, TextInput, Button, TouchableOpacity, ScrollView } from 'react-native';
import I18n from 'react-native-i18n';

export default class TripCategory extends Component {
    constructor(props) {
      super(props);
      this.state = {
        categories: [],
      }
    }

    componentDidMount() {
        this.calculateCategoryAmount();
    }

    getAllExpensesByTrip() {

    }

    calculateCategoryAmount() {
        let categories = [];
        for(expense of this.props.expenses) {
            if(categories.findIndex(i => i.category === expense.category) < 0) {
                let category = {
                    category: expense.category,
                    amount: expense.amount
                };
                categories.push(category);
            } else {
                for (let j = 0; j < categories.length; j++) {
                    if (categories[j].category === expense.category) {
                        categories[j].amount += expense.amount;
                    }
                }
            }
        }
        this.setState({ categories });
    }

    // renderCategories() {
    //   if(this.props.categories.length === 0){
    //      return(
    //          <View style={styles.noCategoriesView}>
    //              <Text style={styles.noCategoriesText}>NO noCategoriesText FOUND</Text>
    //          </View>
    //      )
    //    } else {
    //     return this.props.categories.map((category) => {
    //         return(
    //             <TouchableOpacity style={styles.category} onPress={() => this.props.navigator.navigate('', { category })}>
    //                 <View style={[styles.categoryContainer, styles.half]}>
    //                     <View style={styles.splitRow}>
    //                         <Text style={[styles.categoryName]}>{ category.name }</Text>
    //                     </View>
    //                 </View>
    //             </TouchableOpacity>
    //         )
    //     });
    //   }
    // }

    renderCategories() {
        if(this.state.categories.length === 0){
            return(
                <View style={styles.noCategoriesView}>
                    <Text style={styles.noCategoriesText}>NO CATEGORIES FOUND</Text>
                </View>
            )
        } else {
            return this.state.categories.map((category, index) => {
                return(
                    <View style={styles.categoryDetails} key={index}>
                        <View style={{flex: .7}}>
                            <Text style={styles.categoryName}>{ category.category }</Text>
                        </View>
                        <View style={{flex: .3}}>
                            <Text style={styles.categoryAmount}>{ category.amount.toFixed(2) }</Text>
                        </View>
                    </View>
                )
            });
        }
    }

    render() {
      return (
        <View style={styles.container}>
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
    color: "#a8a8a8"
  },
  categoryList: {
    marginLeft: 10,
    marginRight: 10
  },
  category: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f7f7f7',
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    marginTop: 10,
    borderRadius: 2,
    borderColor: '#d3d3d3',
    borderWidth: .5
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
      marginTop: 10,
      backgroundColor: '#f7f7f7',
      alignItems: 'center',
      borderRadius: 2,
      borderColor: '#d3d3d3',
      borderWidth: .5
  },
  categoryName: {
      fontSize: 18,
      fontWeight: 'bold',
      opacity: .7
  },
  categoryAmount: {
      textAlign: 'right'
  }
});
