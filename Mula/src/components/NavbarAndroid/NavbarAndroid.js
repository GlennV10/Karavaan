import React, {Component} from 'react';
import {Text, View, ToolbarAndroid, StyleSheet} from 'react-native';
import Hamburger from 'react-native-hamburger';
export default class NavbarAndroid extends Component{
    _renderScene(route, navigator){
        switch (route.id){
            case 'home':
                return (
                    <Dashboard/>
                )
        }
    }

    render(){
        return(
            <ToolbarAndroid
            style={styles.navBar}
            initialRoute={{id: 'home'}}
            renderScene={(route, navigator) => this._renderScene(route, navigator)}
            title='Mula'
            >
            <Hamburger type="spinCross" color="blue"/></ToolbarAndroid>
        );
    }
}

const styles = StyleSheet.create({
    navBar: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      height: 56
    }
  });