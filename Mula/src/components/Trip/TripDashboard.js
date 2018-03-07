import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Button, ToolbarAndroid, NetInfo, TouchableOpacity, ActivityIndicator, ScrollView, AsyncStorage, BackHandler, Alert } from 'react-native';
import { StackNavigator } from 'react-navigation';
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
      online: true,
      activeUser: null,
    }
    this._handleFirstConnectivityChange = this._handleFirstConnectivityChange.bind(this);
  }

  componentWillMount() {
    this.setState({ expenses: this.props.navigation.state.params.trip.expenseList });
  }

  componentDidMount() {
    this.props.navigation.addListener("didFocus", () => this.componentOnFocus());
    this.props.navigation.addListener("willBlur", () => this.componentOnBlur());
    this._handleFirstConnectivityChange();
  }

  _handleBackButton = () => {
    this.props.navigation.navigate('DashboardTrips');
    return true;
  }

  componentOnFocus() {
    NetInfo.addEventListener('connectionChange', this._handleFirstConnectivityChange);
    this._handleFirstConnectivityChange();
    BackHandler.removeEventListener('hardwareBackPress', this._handleBackButton);
  }

  componentOnBlur() {
    NetInfo.removeEventListener('connectionChange', this._handleFirstConnectivityChange);
    BackHandler.removeEventListener('hardwareBackPress', this._handleBackButton);
  }

  _handleFirstConnectivityChange() {
    NetInfo.getConnectionInfo().then((connectionInfo) => {
        if(connectionInfo.type == "none" || connectionInfo.type == "unknown") this.setState({ online: false }) & console.log("went offline");
        else this.setState({ online: true }) & console.log("went online");
    }).catch((error) => console.log(error));
  }

  render() {
    const nav = this.props.navigation;
    return (
      <ScrollableTabView
        tabBarUnderlineStyle={{ backgroundColor: '#edc14f' }}
        tabBarBackgroundColor={'#e2e8e5'}
        tabBarActiveTextColor={'#303030'}
        tabBarInactiveTextColor={'#303030'}>
        <TripTotal tabLabel={I18n.t('balance')} navigation={nav} user={this.props.navigation.state.params.user} expenses={this.state.expenses} tripID={this.props.navigation.state.params.trip.id} />
        <TripExpenses tabLabel={I18n.t('expenses')} navigation={nav} user={this.props.navigation.state.params.user} expenses={this.state.expenses} trip={this.props.navigation.state.params.trip} />
        <TripCategory tabLabel={I18n.t('category')} ref="category" navigation={nav} user={this.props.navigation.state.params.user} expenses={this.state.expenses} tripID={this.props.navigation.state.params.trip.id} />
      </ScrollableTabView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  containerIndicator: {
    flex: 1,
    paddingTop: 5,
    backgroundColor: '#d4e8e5'
  },
});
