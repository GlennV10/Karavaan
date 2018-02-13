import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput, Button, ToolbarAndroid,  TouchableOpacity, ScrollView} from 'react-native';
import {StackNavigator} from 'react-navigation';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import DashboardTrips from '../Dashboard/DashboardTrips';
import DashboardBalance from '../Dashboard/DashboardBalance'
import DashboardPersons from '../Dashboard/DashboardPersons'

export default class Dashboard extends React.Component {
    render() {
      const nav = this.props.navigation;
      return (
        <ScrollableTabView
          tabBarUnderlineStyle={{backgroundColor:'#edc14f'}}
          tabBarBackgroundColor={'#e2e8e5'}
          tabBarActiveTextColor={'#303030'}
          tabBarInactiveTextColor={'#303030'}>
            <DashboardTrips tabLabel="Trips" navigator={nav} />
            <DashboardBalance tabLabel="Balance" navigator={nav} />
        </ScrollableTabView>
      );
    }
  }

const styles = StyleSheet.create({
   container:{
     flex: 1
   }
});
