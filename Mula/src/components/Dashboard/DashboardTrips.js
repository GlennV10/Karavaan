import React, {Component} from 'react';
import {StyleSheet, View, Image, Text, TextInput, Button, TouchableOpacity, ScrollView, Modal, Switch, ActivityIndicator, BackHandler, Picker, AsyncStorage, Alert} from 'react-native';
import I18n from 'react-native-i18n';
// ############ Colors ############
const red = '#C42525';
const green = '#4F9628';
const yellow = '#D6A024';

export default class DashboardTrips extends Component {
    constructor(props) {
      super(props);
      this.state = {
        trips: [],
        username: "",
        isLoading: false,
      }
    }

    componentWillMount() {
        //this.setState({ isLoading: true });
        //this.getAllTrips();

        /* ================================================================
                  CODE TO STORE HARDCODED DATA INTO ASYNCSTORAGE
                         CHANGE TO DATA FROM SERVER(??)
        ================================================================ */

        let trips = [{
          id: 1,
          name: 'Amsterdam',
          startDate: '9 maart 2018',
          endDate: '11 maart 2018',
          currencies: ['USD', 'CAD'],
          categories: ['Restaurant', 'Taxi', 'Drank']
        },
        {
          id: 2,
          name: 'Ardennen',
          startDate: '20 april 2018',
          endDate: '22 april 2018',
          currencies: ['AUD', 'NZD'],
          categories: ['Restaurant', 'Taxi', 'Drank']
        },
        {
          id: 3,
          name: 'Thailand',
          startDate: '8 september 2018',
          endDate:'23 september 2018',
          currencies: ['USD', 'EUR', 'THD'],
          categories: ['Restaurant', 'Taxi', 'Drank']
        }]

        AsyncStorage.setItem('trips', JSON.stringify(trips))
            .then(res => console.log('Trips stored in AsyncStorage'))
            .catch(error => console.log('Error storing trips'));

        /* ============================================================== */
    }

    componentDidMount() {
        this.setState({ isLoading: false });
        this.props.navigation.addListener("didFocus", () => BackHandler.addEventListener('hardwareBackPress', this._handleBackButton));
        this.props.navigation.addListener("willBlur", () => BackHandler.removeEventListener('hardwareBackPress', this._handleBackButton));

        AsyncStorage.getItem('trips')
            .then(req => JSON.parse(req))
            .then(trips => console.log('Trips loaded from AsyncStorage') & console.log(trips) & this.setState({ trips }))
            .catch(error => console.log('Error loading trips'));

    }

    _handleBackButton = () => {
      Alert.alert(
           I18n.t('closeapp'),
           I18n.t('closeappmessage'), [{
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

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.trips !== nextState.trips) {
          return true;
        }
        return false;
    }

    getCurrencySymbol(trip) {
      if (trip.currency === 'EUR') {
        return '€';
      } else if (trip.currency === 'USD') {
        return '$';
      } else {
        return trip.currency;
      }
    }

    getAllTrips(){
      try {
        AsyncStorage.getItem('userName').then((username) => {
            this.setState({ username });
          })
          .then(res => {
            return fetch('http://193.191.177.169:8080/mula/Controller?action=getBills', {
              method: 'POST',
              header:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                email: this.state.username
              })
            })
            .then((res) => res.json())
            .then((response) => {
              this.setState({ trips: response.bills })
            });
          });
      } catch(error) {
        console.log(error);
      }
    }

    renderTrips() {
        if(this.state.trips.length === 0){
            return(
                <View style={styles.noTripView}>
                  <Text style={styles.noTripText}>{I18n.t('notripsfound')}</Text>
                </View>
            )
        } else {
            return this.state.trips.map((trip) => {
                return(
                  <TouchableOpacity style={styles.trip} onLongPress={() => this.props.navigation.navigate('TripSettings', { trip })} onPress={() => this.props.navigation.navigate('TripDashboard', { trip })} key={ trip.id }>
                      <View style={styles.splitRow}>
                        <Text style={styles.tripName}>{ trip.name }</Text>
                      </View>
                      <View style ={styles.splitRow}>
                        <Text style={styles.tripDate}>{ trip.startDate } - { trip.endDate}</Text>
                      </View>
                      <View style={styles.progressBarContainer}>
                        <View style={{backgroundColor: barStyle(trip.startDate, trip.endDate)}}></View>
                      </View>
                  </TouchableOpacity>
                );
            });
        }
    }

    render() {
      if(this.state.isLoading) {
        return(
          <View style={styles.containerIndicator}>
            <ActivityIndicator />
          </View>
        )
      }

      return(
      <View style={styles.container}>
        <ScrollView style={styles.tripList}>
          { this.renderTrips() }
        </ScrollView>
        <TouchableOpacity style={styles.addTripButton} onPress={() => this.props.navigation.navigate('AddTrip')}>
          <Text style={styles.addTripButtonText} >+</Text>
        </TouchableOpacity>
      </View>
      )
    }
}

function barStyle(startDate, endDate) {
  if(startDate === endDate) {
    return green
  } else if(startDate < new Date() && endDate > new Date()) {
    return yellow
  } else {
    return red
  }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#d4e8e5'
    },
    containerIndicator: {
        flex: 1,
        paddingTop: 5,
        backgroundColor: '#d4e8e5'
    },
    splitRow: {
        flexDirection: 'row',
        marginBottom: 5
    },
    noTripView:{
        flex:1,
        alignItems: "center",
        paddingTop: 10
    },
    noTripText:{
        color: "#a8a8a8",
        marginTop: 50,
        marginLeft: 10,
        marginRight: 10,
        fontSize: 20
    },
    tripList: {
        marginLeft: 10,
        marginRight: 10
    },
    trip: {
        backgroundColor: '#f7f7f7',
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        marginTop: 20,
        borderRadius:5,
        borderColor: '#000'
    },
    tripName: {
        color: '#edc14f',
        fontSize: 32,
        fontWeight: 'bold'
    },
    tripDate: {
        fontSize: 13,
        fontStyle: 'italic',
        marginBottom: 10
    },
    progressBarContainer: {
        flex: 1,
        height: 5,
        marginLeft: -10,
        marginBottom: -10,
        marginRight: -10,
        flexDirection: 'row',
        backgroundColor: '#213544',
    },
    addTripButton: {
        backgroundColor: '#3B4859',
        width: 50,
        height: 50,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 10,
        right: 10,
    },
    addTripButtonText: {
        color: '#fff'
    }
});
