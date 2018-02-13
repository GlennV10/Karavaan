import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput, Button, ToolbarAndroid, Image} from 'react-native';
import {StackNavigator} from 'react-navigation';
import { NavigationActions } from 'react-navigation';

export default class Splashscreen extends React.Component {

    componentWillMount() {
       /*const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
              
              NavigationActions.navigate({ routeName: 'Login'}),
            ]
          })
          this.props.navigation.dispatch(resetAction)*/

        setTimeout(() => this.props.navigation.navigate('Login'), 3000);
        
    }

    render() {
        return (
        <View style={styles.container}>
            <Image 
                style={{width: 200, height: 133}}
                source={require('../../images/Karavaan_pos.png')}
            />
        </View>
        );
    }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#6FC2B0',
    alignItems: 'center',
    justifyContent: 'center'
  }
});