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
        expenses: [],
        isLoading: true
      }
    }

    componentWillMount() {

      this.props.navigation.addListener("didFocus", () => this._handleUpdate());
      this.props.navigation.addListener("willBlur", () => BackHandler.removeEventListener('hardwareBackPress', this._handleBackButton));

        let expenses = [{
            id: 1,
            name: 'Restaurant A',
            date: '9 maart 2018',
            paidBy: 'Glenn',
            users: [{
                name: "Annelore",
                amount: 10
            },
            {
                name: "Deni",
                amount: 10
            },
            {
                name: "Jens",
                amount: 10
            },
            {
                name: "Glenn",
                amount: 20
            }],
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
            users: [{name:"",amount:0}],
            category: 'Taxi',
            currency: 'CAD',
            amount: 75,
            tripID: 1
          },
          {
            id: 6,
            name: 'Drinks',
            date: '10 maart 2018',
            paidBy: 'Annelore',
            users: [{name:"",amount:0}],
            category: 'Drinks',
            currency: 'CAD',
            amount: 10,
            tripID: 1
          },
          {
            id: 5,
            name: 'Taxi 2',
            date: '11 maart 2018',
            paidBy: 'Glenn',
            users: [{name:"",amount:0}],
            category: 'Taxi',
            currency: 'CAD',
            amount: 55,
            tripID: 1
          },
          {
            id: 3,
            name: 'Restaurant B',
            date: '21 april 2018',
            paidBy: 'Deni',
            users: [{name:"",amount:0}],
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
            users: [{name:"",amount:0}],
            category: 'Food',
            currency: 'EUR',
            amount: 10,
            tripID: 3
          }]

        /*AsyncStorage.setItem('expenses', JSON.stringify(expenses))
              .then(res => console.log('Expenses stored in AsyncStorage'))
              .catch(error => console.log('Error storing expenses'));*/
    }

    componentDidMount() {
        AsyncStorage.getItem('expenses')
              .then(req => JSON.parse(req))
              .then(expenses => console.log('Expenses loaded from AsyncStorage') & console.log(expenses) & this.setState({ expenses }) & this.setState({isLoading : false}))
              .catch(error => console.log('Error loading expenses'));
              console.log("geluktDash lolilol");
    }

    _handleUpdate = () => {
      BackHandler.addEventListener('hardwareBackPress', this._handleBackButton);
      console.log("VISIBLE");
    }

    _handleBackButton = () => {
      this.props.navigation.navigate("DashboardTrips");
      return true;
    }

    /*shouldComponentUpdate(nextProps, nextState) {
      if (this.props.navigation.params.trip !== nextProps.navigation.params.trip) {
        return true;
      }
      return false;
    }*/

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
      if(this.state.isLoading) {
        return(
          <View style={styles.containerIndicator}>
            <ActivityIndicator />
          </View>
        )
      }
      if(!this.state.isLoading) {
        return (
          <ScrollableTabView
            tabBarUnderlineStyle={{backgroundColor:'#edc14f'}}
            tabBarBackgroundColor={'#e2e8e5'}
            tabBarActiveTextColor={'#303030'}
            tabBarInactiveTextColor={'#303030'}>
              <TripExpenses tabLabel={I18n.t('expenses')} navigator={nav} update={this.props.navigation.state.params.update} expenses={this.getTripExpenses()}/>
              <TripCategory tabLabel={I18n.t('category')} navigator={nav} expenses={this.getTripExpenses()}/>
              <TripTotal tabLabel={I18n.t('balance')} navigator={nav} expenses={this.getTripExpenses()}/>
          </ScrollableTabView>
        );
      }
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
