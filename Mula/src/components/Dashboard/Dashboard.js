import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput, Button, ToolbarAndroid,  TouchableOpacity, ScrollView} from 'react-native';
import {StackNavigator} from 'react-navigation';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import DashboardBills from '../Dashboard/DashboardBills';
import DashboardGroups from '../Dashboard/DashboardGroups';
import DashboardPersons from '../Dashboard/DashboardPersons'

export default class Dashboard extends React.Component {
    render() {
      const nav = this.props.navigation;
      return (
        <ScrollableTabView>
          <DashboardBills tabLabel="Bills" navigator={nav} />
          <DashboardPersons tabLabel="Persons" navigator={nav} />
          <DashboardGroups tabLabel="Groups" navigator={nav} />
        </ScrollableTabView>
      );
    }
  }


const styles = StyleSheet.create({
   container:{
       flex: 1
   }
});
