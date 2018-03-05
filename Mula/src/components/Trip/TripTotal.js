import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, TextInput, Button, TouchableOpacity, ActivityIndicator, ScrollView, Picker, AsyncStorage } from 'react-native';
import I18n from 'react-native-i18n';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

export default class TripTotal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      overview: {},
      username: "",
      activeUser: "",
      users: [],
      isLoading: true
    }
  }

  componentWillMount() {
    this.getTripOverview();
    this.getTripUsers();

    AsyncStorage.getItem('userName').then((username) => {
      this.setState({ username });
      this.setState({ activeUser: username });
    })
  }

  updateUser(newActiveUser) {
    this.setState({ activeUser: newActiveUser });
  }


  getTripOverview() {
    return fetch('http://193.191.177.73:8080/karafinREST/getTripOverview/' + this.props.tripID, {
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((overview) => this.setState({ overview }))
  }

  getTripUsers() {
    let trip = this.props.navigation.state.params.trip;
    let users = [];
    for (participant of trip.participants) {
      users.push(participant[0]);
    }
    this.setState({ users });
  }

  renderUserPicker() {
    let trip = this.props.navigation.state.params.trip;
    let isAdmin = false;
    for (participant of trip.participants) {
      if (participant[0].email == this.state.username && (participant[1] == "ADMIN" || participant[1] == "GUIDE")) {
        isAdmin = true;
      }
    }
    if (this.props.expenses.length > 0 && isAdmin) {
      return (
        <View style={{ backgroundColor: '#d1d5da' }}>
          <Picker
            style={styles.userPicker}
            selectedValue={this.state.activeUser}
            onValueChange={(itemValue, itemIndex) => this.updateUser(itemValue)}>
            {this.state.users.map((item, index) => {
              return (<Picker.Item label={item.firstName + " " + item.lastName} value={item.email} key={index} />)
            })}
          </Picker>
        </View>
      )
    } else return null;
  }

  renderTable() {
    // let table = [
    //   ['Payer', 'Paid', 'Consumed', 'Pay/receive']
    // ];
    // for (payerKey of Object.keys(this.state.overview)) {
    //   let payerData = [];
    //   payerData.push(payerKey);
    //   for (amount of this.state.overview[payerKey]) {
    //     payerData.push(amount.toString());
    //   }
    //   table.push(payerData);
    // }
    // return table;

    let data = [];
    for (payerKey of Object.keys(this.state.overview)) {
      let payerData = [];
      payerData.push(payerKey);
      for (amount of this.state.overview[payerKey]) {
        payerData.push(amount.toString());
      }
      data.push(payerData);
    }
    return (

      <View>
        {this.state.users.map((item, index) => {
          if (item.email === this.state.activeUser) {
            for (let i = 0; i < data.length; i++) {
              console.log("test")
              console.log(data[i][0])
              if (data[i][0] === item.email) {
                return (
                  <View style={styles.shownView} key={i + "view1"}>
                    <View style={styles.separator} key={i + "view2"}>
                      <Text key={index} style={styles.nameField}>{I18n.t('balancefor')} {item.firstName + " " + item.lastName}</Text>
                    </View>
                    <View key={i + "balanceContainerView"} style={styles.balanceContainer}>
                      <View key={i + "paidFlexView"} style={styles.flexViewContainer}>
                        <View key={i + "paidLeftFlexView"} style={styles.leftFlexView}>
                          <Text key={i + "paidText"} style={styles.label}>{I18n.t('amountpaid')} </Text>
                        </View>
                        <View key={i + "paidrRghtFlexView"} style={styles.rightFlexView}>
                          <Text key={i + "paidAmount"}>{parseFloat(data[i][1]).toFixed(2)}</Text>
                        </View>
                      </View>

                      <View key={i + "consumedFlexView"} style={styles.flexViewContainer}>
                        <View key={i + "consumedLeftFlexView"} style={styles.leftFlexView}>
                          <Text key={i + "consumedText"} style={styles.label}>{I18n.t('amountconsumed')} </Text>
                        </View>
                        <View key={i + "consumedRightFlexView"} style={styles.rightFlexView}>
                          <Text key={i + "consumedAmount"}>{parseFloat(data[i][2]).toFixed(2)}</Text>
                        </View>
                      </View>

                      <View key={i + "balanceFlexView"} style={styles.flexViewContainer}>
                        <View key={i + "balanceLeftFlexView"} style={styles.leftFlexView}>
                          <Text key={i + "balanceText"} style={styles.label}>{I18n.t('balans')} </Text>
                        </View>
                        <View key={i + "balanceRightFlexView"} style={styles.rightFlexView}>
                          <Text key={i + "balanceAmount"}>{parseFloat(data[i][3]).toFixed(2)}</Text>
                        </View>
                      </View>
                    </View>

                    {/* <Text key={i + "consumed"}>Amount consumed: {parseFloat(table[i][2]).toFixed(2)}</Text>
                    <Text key={i + "balance"}>Balance: {parseFloat(table[i][3]).toFixed(2)}</Text> */}
                  </View>
                )
              }
            }
          }
        })}

      </View>
    )
    this.setState({ isLoading: false })
  }

  render() {
    const tableData = this.renderTable();


     if (this.isLoading) {
       return (
         <View style={styles.containerIndicator}>
           <ActivityIndicator />
         </View>
       )
     } else {
      return (
        <View style={styles.container}>
          {this.renderUserPicker()}
          {tableData}
          {/* <Table>
            <Rows data={tableData} style={styles.row} textStyle={styles.text} />
          </Table> */}
          <TouchableOpacity style={styles.addTripButton} onPress={() => this.props.navigation.navigate('AddExpense', { trip: this.props.navigation.state.params.trip })}>
              <Text style={styles.addTripButtonText} >+</Text>
          </TouchableOpacity>
        </View>

      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d4e8e5',
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
  },
  shownView: {
    padding: 20
  },
  balanceContainer: {
    width: '80%',
    marginLeft: '20%'
  },
  userPicker: {
    backgroundColor: "white",
    borderWidth: 1,
  },
  separator: {
    borderBottomColor: '#bbb',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 5
  },
  flexViewContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  leftFlexView: {
    flex: 0.5,
    //alignItems: 'flex-end'
  },
  rightFlexView: {
    flex: 0.4,
    marginLeft: 2,
    marginBottom: 2,
  },
  nameField: {
    textAlign: 'center',
    fontSize: 17
  },
  label: {
    fontSize: 15
  },
  text: { marginLeft: 5, padding: 5 },
  row: { height: 30 },
  btn: { width: 58, height: 18, backgroundColor: '#ccc', marginLeft: 15 },
  btnText: { textAlign: 'center', color: '#fff' }
});
