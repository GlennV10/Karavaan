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

  }

  getAllExpensesByTrip() {

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

  render() {
    return (
      <View style={styles.container}>
        <Text>TRIP CATEGORY</Text>
        {/* <ScrollView style={styles.categoryList}>
          {this.renderCategories()}
        </ScrollView> */}
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
  expenseContainer: {
    flex: .5,
    paddingLeft: 10
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
    backgroundColor: '#f7f7f7',
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    marginTop: 10,
    borderRadius: 2,
    borderColor: '#d3d3d3',
    borderWidth: .5,
    flex: 1,
    flexDirection: 'row'
  },
  categoryName: {
    fontSize: 16
  }
});
