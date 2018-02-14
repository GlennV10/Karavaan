import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput, Button, ToolbarAndroid,  TouchableOpacity, ScrollView, BackHandler, Alert} from 'react-native';
import {StackNavigator} from 'react-navigation';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import DashboardTrips from '../Dashboard/DashboardTrips';
import DashboardBalance from '../Dashboard/DashboardBalance'
import DashboardPersons from '../Dashboard/DashboardPersons'
import I18n from 'react-native-i18n';

export default class Dashboard extends React.Component {

  componentDidMount() {
    this.props.navigation.addListener("didFocus", () => BackHandler.addEventListener('hardwareBackPress', this._handleBackButton));
    this.props.navigation.addListener("willBlur", () => BackHandler.removeEventListener('hardwareBackPress', this._handleBackButton))
  }

  _handleBackButton = () => {
    Alert.alert(
         'Exit App',
         'Exiting the application?', [{
             text: 'Cancel',
             onPress: () => console.log('Cancel Pressed'),
             style: 'cancel'
         }, {
             text: 'OK',
             onPress: () => BackHandler.exitApp()
         }, ], {
             cancelable: false
         }
     )
      
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
      <DashboardTrips tabLabel={I18n.t('trips')} navigator={nav} />
      <DashboardBalance tabLabel={I18n.t('balance')} navigator={nav} />
      </ScrollableTabView>
    );
  }
}

const styles = StyleSheet.create({
   container:{
     flex: 1
   }
});
