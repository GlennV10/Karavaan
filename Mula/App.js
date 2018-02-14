import React from 'react';
import { StyleSheet, Text, View, Button, Icon, Image,TouchableOpacity, AsyncStorage} from 'react-native';
import { StackNavigator} from 'react-navigation';
import Hamburger from 'react-native-hamburger';

import Splashscreen from './src/components/Splashscreen/Splashscreen';
import Login from './src/components/Login/Login';
import Dashboard from './src/components/Dashboard/Dashboard';
import TripDashboard from './src/components/Trip/TripDashboard'
import Register from './src/components/Register/Register';
import AddEvent from './src/components/Event/AddEvent';
import DetailEvent from './src/components/Event/DetailEvent';
import DetailPerson from './src/components/User/DetailPerson';
import DetailGroup from './src/components/Groups/DetailGroup';
import AddGroup from './src/components/Groups/AddGroup';
import DashboardBills from './src/components/Dashboard/DashboardBills';
import DashboardTrips from './src/components/Dashboard/DashboardTrips';
// import DashboardGroups from './src/components/Dashboard/DashboardGroups';

// import { AsyncStorage } from '../../../../.cache/typescript/2.6/node_modules/@types/react-native';
// import { TouchableOpacity } from '../../../../.cache/typescript/2.6/node_modules/@types/react-native';

// class DashboardScreen extends React.Component{
//   static navigationOptions = {title: "Dashboard"};
//   render(){
//       return <Dashboard/>
//   }
// };

// class LoginScreen extends React.Component{
//   static navigationOptions = {title: "Login"};
//   render(){
//       return  <Login/>
//   }
// }

export default App = StackNavigator({
  Splashscreen: {
    navigationOptions: {
      title: 'Splashscreen',
      header: null,
    },
    screen: Splashscreen
  },
  Login: {
    navigationOptions: {
      title: 'Login',
      header: null,
    },
    screen: Login
  },
  Dashboard: {
    navigationOptions: ({ navigation }) => ({
      title: 'Dashboard',
      headerStyle:{
        backgroundColor: '#6fc2b0'
        // marginTop: 24,
    },
    headerTitleStyle:{
        color: '#FFF'
    },
    headerBackTitleStyle:{
        color: "#FFF"
    },
    gesturesEnabled: false,
    headerLeft: null,
    // headerRight: <Hamburger active={true} type="spinCross" color="white" style={styles.hamburgerStyle} onPress={()=> state = !state & navigation.navigate('Dashboard')}/>,
    headerRight: <TouchableOpacity onPress={()=>{
      try{
        AsyncStorage.removeItem("userName").then(console.log("Logged out"));
        AsyncStorage.clear().then(()=>console.log("Cleared... APP.JS"));
      }catch(error){
        console.log(error);
      }
    }}><Image source={require('./imgMain/logout.png')} style={{width: 25, height: 25, marginRight: 10}}/></TouchableOpacity>,
      drawer:() => ({
        label: 'Home'
      })
    }),
    screen: Dashboard
  },
  TripDashboard: {
    navigationOptions: ({ navigation }) => ({
      title: 'Trip',
      headerStyle:{
        backgroundColor: '#6fc2b0'
    },
    headerTitleStyle:{
        color: '#FFF'
    },
    headerBackTitleStyle:{
        color: "#FFF"
    },
    // gesturesEnabled: false,
    // headerLeft: null
    }),
    screen: TripDashboard
  },
  DashboardTrips: {
    navigationOptions: ({ navigation }) => ({
      title: 'Trips',
      headerStyle:{
        backgroundColor: '#6fc2b0'
      },
      headerTitleStyle:{
        color: '#FFF'
      },
      headerBackTitleStyle:{
        color: "#FFF"
      },
      // gesturesEnabled: false,
      // headerLeft: null,
      // headerRight: <Hamburger active={state} type="spinCross" color="white" style={styles.hamburgerStyle} onPress={()=> state = !state & navigation.navigate('DashboardBills')}/>,
      drawer:() => ({
        label: 'Home'
      })
    }),
    screen: DashboardTrips
  },
  // DashboardGroups: {
  //   navigationOptions: ({ navigation }) => ({
  //     title: 'DashboardGroups',
  //     headerStyle:{
  //       backgroundColor: '#0992ef',
  //       marginTop: 24
  //     },
  //     headerTitleStyle:{
  //       color: '#FFF'
  //     },
  //     headerBackTitleStyle:{
  //       color: "#FFF"
  //     },
  //     gesturesEnabled: false,
  //     headerLeft: null,
  //     // headerRight: <Hamburger active={state} type="spinCross" color="white" style={styles.hamburgerStyle} onPress={()=> state = !state & navigation.navigate('DashboardGroups')}/>,
  //     drawer:() => ({
  //       label: 'Home'
  //     })
  //   }),
  //   screen: DashboardGroups
  // },
  AddEvent: {
    navigationOptions: ({ navigation }) => ({
      title: 'Add Event',
      headerStyle:{
         backgroundColor: '#0992ef',
         marginTop: 24
      },
      headerTitleStyle:{
         color: '#FFF'
      },
      headerBackTitleStyle:{
         color: "#FFF"
      },
      headerLeftStyle:{
        color:'#fff'
      },
      // headerRight: <Hamburger active={state} type="spinCross" color="white" style={styles.hamburgerStyle} onPress={()=> state = !state & navigation.navigate('Dashboard')}/>,
       drawer:() => ({
         label: 'Home'
      })
    }),
    screen: AddEvent
  },
  AddGroup: {
    navigationOptions: ({ navigation }) => ({
      title: 'Add Group',
      headerStyle:{
         backgroundColor: '#0992ef',
         marginTop: 24
      },
      headerTitleStyle:{
         color: '#FFF'
      },
      headerBackTitleStyle:{
         color: "#FFF"
      },
      headerLeftStyle:{
        color:'#fff'
      },
      // headerRight: <Hamburger active={state} type="spinCross" color="white" style={styles.hamburgerStyle} onPress={()=> state = !state & navigation.navigate('Dashboard')}/>,
      drawer:() => ({
        label: 'Home'
      })
    }),
    screen: AddGroup
  },
  DetailEvent: {
    navigationOptions: ({ navigation }) => ({
      title: 'Detail Event',
      headerStyle: {
         backgroundColor: '#0992ef',
         marginTop: 24
      },
      headerTitleStyle: {
         color: '#FFF'
      },
      headerBackTitleStyle: {
         color: "#FFF"
      },
      headerLeftStyle: {
        color:'#fff'
      },
      drawer:() => ({
        label: 'Home'
      })
    }),
    screen: DetailEvent
  },
  DetailPerson: {
    navigationOptions: ({ navigation }) => ({
      title: 'Detail Person',
      headerStyle: {
         backgroundColor: '#0992ef',
         marginTop: 24
      },
      headerTitleStyle: {
         color: '#FFF'
      },
      headerBackTitleStyle: {
         color: "#FFF"
      },
      headerLeftStyle: {
        color:'#fff'
      },
      drawer:() => ({
        label: 'Home'
      })
    }),
    screen: DetailPerson
  },
  DetailGroup: {
    navigationOptions: ({ navigation }) => ({
      title: 'Detail Group',
      headerStyle: {
         backgroundColor: '#0992ef',
         marginTop: 24
      },
      headerTitleStyle: {
         color: '#FFF'
      },
      headerBackTitleStyle: {
         color: "#FFF"
      },
      headerLeftStyle: {
        color:'#fff'
      },
      drawer:() => ({
        label: 'Home'
      })
    }),
    screen: DetailGroup
  },
  Register: {
    navigationOptions: {
      title: "Register account",
      headerStyle:{
        backgroundColor: '#0992ef',
        marginTop: 24
      },
      headerTitleStyle:{
        color: '#FFF'
      },
      headerBackTitleStyle:{
        color: "#FFF"
      }
    },
    screen: Register
  }

  },{headerMode: 'screen'}
);

const styles = StyleSheet.create({
  hamburgerStyle:{
    marginRight: 10
  }
});
