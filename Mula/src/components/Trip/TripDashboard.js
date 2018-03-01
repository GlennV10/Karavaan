import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput, Button, ToolbarAndroid,  TouchableOpacity, ActivityIndicator, ScrollView, AsyncStorage, BackHandler, Alert} from 'react-native';
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
        expenses: []
      }
    }

    componentWillMount() {
        this.props.navigation.addListener("didFocus", () => this._handleUpdate());
        this.props.navigation.addListener("willBlur", () => BackHandler.removeEventListener('hardwareBackPress', this._handleBackButton));

        this.setState({ expenses: this.props.navigation.state.params.trip.expenseList });

        // let expenses = [{
        //     id: 1,
        //     name: 'Restaurant A',
        //     date: '9 maart 2018',
        //     paidBy: 'Glenn',
        //     consumers: [{
        //         user: "Annelore",
        //         amount: 10
        //     },
        //     {
        //         user: "Deni",
        //         amount: 10
        //     },
        //     {
        //         user: "Jens",
        //         amount: 10
        //     },
        //     {
        //         user: "Glenn",
        //         amount: 20
        //     }],
        //     category: 'Food',
        //     currency: 'USD',
        //     amount: 50,
        //     tripID: 1
        //   },
        //   {
        //     id: 2,
        //     name: 'Taxi',
        //     date: '10 maart 2018',
        //     paidBy: 'Annelore',
        //     consumers: [{user:"",amount:0}],
        //     category: 'Taxi',
        //     currency: 'CAD',
        //     amount: 75,
        //     tripID: 1
        //   },
        //   {
        //     id: 6,
        //     name: 'Drinks',
        //     date: '10 maart 2018',
        //     paidBy: 'Annelore',
        //     consumers: [{user:"",amount:0}],
        //     category: 'Drinks',
        //     currency: 'CAD',
        //     amount: 10,
        //     tripID: 1
        //   },
        //   {
        //     id: 5,
        //     name: 'Taxi 2',
        //     date: '11 maart 2018',
        //     paidBy: 'Glenn',
        //     consumers: [{user:"",amount:0}],
        //     category: 'Taxi',
        //     currency: 'CAD',
        //     amount: 55,
        //     tripID: 1
        //   },
        //   {
        //     id: 3,
        //     name: 'Restaurant B',
        //     date: '21 april 2018',
        //     paidBy: 'Deni',
        //     consumers: [{user:"",amount:0}],
        //     category: 'Food',
        //     currency: 'AUD',
        //     amount: 88,
        //     tripID: 2
        //   },
        //   {
        //     id: 4,
        //     name: 'Restaurant C',
        //     date: '12 september 2018',
        //     paidBy: 'Jens',
        //     consumers: [{user:"",amount:0}],
        //     category: 'Food',
        //     currency: 'EUR',
        //     amount: 10,
        //     tripID: 3
        //   }]
        //
        // AsyncStorage.setItem('expenses', JSON.stringify(expenses))
        //       .then(res => console.log('Expenses stored in AsyncStorage'))
        //       .catch(error => console.log('Error storing expenses'));
    }

    componentDidMount() {
        /*AsyncStorage.getItem('expenses')
              .then(req => JSON.parse(req))
              .then(expenses => console.log('Expenses loaded from AsyncStorage') & console.log(expenses) & this.setState({ expenses }) & this.setState({isLoading : false}))
              .catch(error => console.log('Error loading expenses'));
              console.log("geluktDash lolilol");*/
    }

    _handleUpdate = () => {
      BackHandler.addEventListener('hardwareBackPress', this._handleBackButton);
      // AsyncStorage.getItem('expenses')
      //         .then(req => JSON.parse(req))
      //         .then(expenses => console.log('Expenses loaded from AsyncStorage') & console.log(expenses) & this.setState({ expenses }) & this.setState({isLoading : false}))
      //         .catch(error => console.log('Error loading expenses'));
    }

    _handleBackButton = () => {
      this.props.navigation.navigate("DashboardTrips");
      return true;
    }

    render() {
      const nav = this.props.navigation;
      return (
        <ScrollableTabView
          tabBarUnderlineStyle={{backgroundColor:'#edc14f'}}
          tabBarBackgroundColor={'#e2e8e5'}
          tabBarActiveTextColor={'#303030'}
          tabBarInactiveTextColor={'#303030'}>
            <TripExpenses tabLabel={I18n.t('expenses')} navigator={nav} expenses={this.state.expenses}/>
            <TripCategory tabLabel={I18n.t('category')} navigator={nav} expenses={this.state.expenses} tripID={this.props.navigation.state.params.trip.id}/>
            <TripTotal tabLabel={I18n.t('balance')} navigator={nav} expenses={this.state.expenses}/>
        </ScrollableTabView>
      );
    }
  }

const styles = StyleSheet.create({
  container:{
    flex: 1
  },
  containerIndicator: {
    flex: 1,
    paddingTop: 5,
    backgroundColor: '#d4e8e5'
  },
});
