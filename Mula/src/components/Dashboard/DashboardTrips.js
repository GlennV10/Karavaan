import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, TextInput, Button, TouchableOpacity, ScrollView, Modal, Switch, RefreshControl, ActivityIndicator, BackHandler, Picker, AsyncStorage, Alert } from 'react-native';
import I18n from 'react-native-i18n';

// ############ Colors ############
const red = '#C42525';
const green = '#4F9628';
const yellow = '#D6A024';

export default class DashboardTrips extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",

      trips: [],
      userTrips: [],
      allTrips: [],

      isLoading: true,
      refreshing: false,
    }
  }

  componentWillMount() {
    // AsyncStorage.setItem('trips', JSON.stringify(trips))
    //   .then(res => console.log('Trips stored in AsyncStorage'))
    //   .catch(error => console.log('Error storing trips'));
  }

  componentDidMount() {
      AsyncStorage.getItem('userName').then((username)=>{
        console.log(username);
        this.setState({username});
        this.props.navigation.addListener("didFocus", () => this.componentOnFocus());
        this.props.navigation.addListener("willBlur", () => this.componentOnBlur());
    });


    // AsyncStorage.getItem('trips')
    //   .then(req => JSON.parse(req))
    //   .then(trips => console.log('Trips loaded from AsyncStorage') & console.log(trips) & this.setState({ trips }))
    //   .catch(error => console.log('Error loading trips'));
  }

  componentOnFocus() {
    this.setUserTrips();
    BackHandler.addEventListener('hardwareBackPress', this._handleBackButton);
  }

  componentOnBlur() {
    BackHandler.removeEventListener('hardwareBackPress', this._handleBackButton)
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this.setUserTrips();
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
      },], {
        cancelable: false
      }
    )
    return true;
  }

  getUserTrips() {
    let url = 'http://193.191.177.73:8080/karafinREST/getTripsOfPerson/' + this.state.username;

    return fetch(url, {
          method: 'GET',
          header: {
              'Content-Type': 'application/json'
          }
      })
      .then((res) => res.json())
      .then((userTrips) => {
        this.setState({userTrips});
      }).catch(error => console.log("network/rest error"));
  }

  async getAllTrips() {
    return await fetch('http://193.191.177.73:8080/karafinREST/allTrips', {
        method: 'GET',
        header: {
            'Content-Type': 'application/json'
        }
    })
    .then((res) => res.json())
    .then((allTrips) => {
      this.setState({allTrips});
    }).catch(error => console.log("network/rest error"));
  }

  async setUserTrips() {
    await this.getUserTrips();
    await this.getAllTrips();

    let trips = [];
    let tripIDs = [];
    if(this.state.userTrips.length !== 0 && this.state.allTrips.length !== 0) {
      Object.keys(this.state.userTrips).map((id) => {
        tripIDs.push({
            id: id
        })
      });
      for(trip of this.state.allTrips) {
        for(tripID of tripIDs) {
          if(trip.id == tripID.id) trips.push(trip);
        }
      }
    }
    console.log("Fetched new trips");
    this.setState({ trips, refreshing: false, isLoading: false });
  }

  navigateToTripSettings(trip) {
    let allowed = false;
    for (participant of trip.participants) {
      if(participant[0].email == this.state.username && (participant[1] == "ADMIN" || participant[1] == "GUIDE")) {
        allowed = true;
        this.props.navigation.navigate('TripSettings', { trip });
      }
    }
    if(!allowed) {
      Alert.alert(
           "",
           I18n.t('dashboardsettings'), [{
               text: 'Cancel',
               onPress: () => console.log('Cancel Pressed'),
               style: 'cancel'
           }, {
               text: 'OK'
           },], {
               cancelable: false
           }
       )
       return true;
    }
  }

  renderTrips() {
    if (this.state.trips.length === 0) {
      return (
        <View style={styles.noTripView}>
          <Text style={styles.noTripText}>{I18n.t('notripsfound')}</Text>
        </View>
      )
    } else {
      return this.state.trips.map((trip) => {
        return (
          <TouchableOpacity style={styles.trip} onLongPress={() => this.navigateToTripSettings(trip)} onPress={() => this.props.navigation.navigate('TripDashboard', { trip, user: this.state.username })} key={trip.id}>
            <View style={styles.splitRow}>
              <Text style={styles.tripName}>{trip.tripName}</Text>
            </View>
            <View style={styles.splitRow}>
              <Text style={styles.tripDate}>{trip.startDate.dayOfMonth}/{(trip.startDate.month)}/{trip.startDate.year} - {trip.endDate.dayOfMonth}/{(trip.endDate.month)}/{trip.endDate.year}</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={{ backgroundColor: "black" }}></View>
            </View>
          </TouchableOpacity>
        );
      });
    }
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.containerIndicator}>
          <ActivityIndicator />
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <ScrollView style={styles.tripList}
           refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        >
          <View style={styles.tripListView}>
            {this.renderTrips()}
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.addTripButton} onPress={() => this.props.navigation.navigate('AddTrip')}>
          <Text style={styles.addTripButtonText} >+</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  noTripView: {
    flex: 1,
    alignItems: "center",
    paddingTop: 10
  },
  noTripText: {
    color: "#a8a8a8",
    marginTop: 50,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 20
  },
  tripListView: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 75
  },
  trip: {
    backgroundColor: '#f7f7f7',
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    marginTop: 20,
    borderRadius: 5,
    borderColor: '#000',
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
