import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput, Button, ToolbarAndroid,  TouchableOpacity, ScrollView} from 'react-native';
import {StackNavigator} from 'react-navigation';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TripExpenses from './TripExpenses'
import TripCategory from './TripCategory';
import TripTotal from './TripTotal';
import I18n from 'react-native-i18n';

export default class TripDashboard extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        expenses: [{
          id: 1,
          name: 'Restaurant A',
          date: '9 maart 2018',
          paidBy: 'Glenn',
          category: 'Food',
          currency: 'USD',
          amount: 50,
          tripID: 1
        },
        {
          id: 2,
          name: 'Taxi',
          date: '10 maart 2018',
          paidBy: 'Annelore',
          category: 'Taxi',
          currency: 'CAD',
          amount: 75,
          tripID: 1
        },
        {
          id: 3,
          name: 'Restaurant B',
          date: '21 april 2018',
          paidBy: 'Deni',
          category: 'Food',
          currency: 'AUD',
          amount: 88,
          tripID: 2
        },
        {
          id: 4,
          name: 'Restaurant C',
          date: '12 september 2018',
          paidBy: 'Jens',
          category: 'Food',
          currency: 'EUR',
          amount: 10,
          tripID: 3
        }]
      }
    }

    getTripExpenses() {
        let tripExpenses = [];
        for(let expense of this.state.expenses) {
            if (expense.tripID === this.props.navigation.state.params.trip.id) {
                tripExpenses.push(expense);
            }
        }
        return tripExpenses;
    }

    render() {
      const nav = this.props.navigation;
      return (
        <ScrollableTabView
          tabBarUnderlineStyle={{backgroundColor:'#edc14f'}}
          tabBarBackgroundColor={'#e2e8e5'}
          tabBarActiveTextColor={'#303030'}
          tabBarInactiveTextColor={'#303030'}>
            <TripExpenses tabLabel={I18n.t('expenses')} navigator={nav} expenses={this.getTripExpenses()}/>
            <TripCategory tabLabel={I18n.t('category')} navigator={nav} expenses={this.getTripExpenses()}/>
            <TripTotal tabLabel={I18n.t('balance')} navigator={nav} expenses={this.getTripExpenses()}/>
        </ScrollableTabView>
      );
    }
  }

const styles = StyleSheet.create({
   container:{
     flex: 1
   }
});
