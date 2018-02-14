import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput, Button, ToolbarAndroid,  TouchableOpacity, ScrollView} from 'react-native';
import {StackNavigator} from 'react-navigation';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TripExpenses from './TripExpenses'
import TripCategory from './TripCategory';
import TripTotal from './TripTotal';
import I18n from 'react-native-i18n';

export default class TripDashboard extends React.Component {
    render() {
      const nav = this.props.navigation;
      return (
        <ScrollableTabView
          tabBarUnderlineStyle={{backgroundColor:'#edc14f'}}
          tabBarBackgroundColor={'#e2e8e5'}
          tabBarActiveTextColor={'#303030'}
          tabBarInactiveTextColor={'#303030'}>
            <TripExpenses tabLabel="Expenses" navigator={nav} />
            <TripCategory tabLabel="Category" navigator={nav} />
            <TripTotal tabLabel="Total" navigator={nav} />
        </ScrollableTabView>
      );
    }
  }

const styles = StyleSheet.create({
   container:{
     flex: 1
   }
});
