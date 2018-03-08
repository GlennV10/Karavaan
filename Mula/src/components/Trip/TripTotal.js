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
      isLoading: true,
      isLoadingPayments: true,
      isLoadingPaymentsToComplete: true,
      payments: [],
      paymentsToComplete: [],
      baseCurrency: "",
      expenses: [],
      participants: [],
      rates: [],
    }
  }

  async componentWillMount() {
    this.getExpenses();

    await AsyncStorage.getItem('userName').then((username) => {
      this.setState({ username });
      this.setState({ activeUser: username });
    })

    await this.getTripOverview(this.state.activeUser)
    await this.getTripPaymentsToComplete(this.state.activeUser)
    await this.getTripPayments(this.state.activeUser)
  }

  async updateUser(newActiveUser) {
    await this.getTripOverview(newActiveUser)
    await this.getTripPaymentsToComplete(newActiveUser)
    await this.getTripPayments(newActiveUser)
    this.setState({ activeUser: newActiveUser });
  }

  async rerenderTransactions() {
    await this.getTripOverview(this.state.activeUser)
    await this.getTripPaymentsToComplete(this.state.activeUser)
    await this.getTripPayments(this.state.activeUser)
  }

  getExpenses() {
    let url = 'http://193.191.177.73:8080/karafinREST/getTrip/' + this.props.tripID;

    return fetch(url, {
        method: 'GET',
        header: {
            'Content-Type': 'application/json'
        }
    })
    .then((res) => res.json())
    .then((userTrip) => {
        console.log("refreshing expenses")
        this.setState({participants: userTrip.participants});
        this.setState({expenses: userTrip.expenseList});
        this.setState({baseCurrency: userTrip.baseCurrency});
        let users = [];
        for (participant of this.state.participants) {
          users.push(participant[0]);
        }
        this.setState({ users });
    }).catch(error => console.log("network/rest error"));
  }

  getTripOverview(email) {
    return fetch('http://193.191.177.73:8080/karafinREST/getTripOverview/' + this.props.tripID + '/' + email, {
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((data) => this.setState({ overview: data, isLoading: false }))
      .catch((error) => console.log(error));
  }

  getTripPayments(email) {
    return fetch('http://193.191.177.73:8080/karafinREST/paymentsForPersonInTrip/' + this.props.tripID + '/' + email, {
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((data) => this.setState({ payments: data, isLoadingPayments: false }))
      .catch((error) => console.log(error));
  }

  getTripPaymentsToComplete(email) {
    return fetch('http://193.191.177.73:8080/karafinREST/tripSummaryLoans/' + this.props.tripID + '/' + email, {
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((data) => this.setState({ paymentsToComplete: data, isLoadingPaymentsToComplete: false }))
      .catch((error) => console.log(error));
  }

  completePayment(payment) {
    console.log(payment)
    var url = 'http://193.191.177.73:8080/karafinREST/addPaymentToTrip/' + this.props.tripID + '/' + payment[0][1] + '/' + payment[0][3] + '/' + payment[1]
    return fetch(url, {
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      }
    })
      .then((result) =>  this.rerenderTransactions())
      .catch((error) => console.log(error));
  }

  renderPaymentsToComplete() {
    if (this.state.isLoadingPaymentsToComplete) {
      return (
        <View style={styles.containerIndicator}>
          <ActivityIndicator />
        </View>
      )
    } else {
      if (this.state.paymentsToComplete.length === undefined || this.state.paymentsToComplete.length === 0) {
        return (
          <View>
            <Text style={styles.nopayments}>{I18n.t('nopayments')}</Text>
          </View>
        )
      } else {
        let pays = this.state.paymentsToComplete
        let result = []

        return this.state.paymentsToComplete.map((payment, index) => {
          if (payment[0][1] === this.state.activeUser) {

            return (
              <TouchableOpacity onPress={() => this.completePayment(payment)} style={styles.paymentsContainer} key={index + "container"}>
                <View style={styles.paymentsLabel} key={index + "label"}>
                  <Text>{payment[0][0]} - {payment[0][2]}:</Text>
                </View >
                <View style={styles.paymentsAmount} key={index + "amount"}>
                  <Text style={styles.owes}>-{parseFloat(payment[1]).toFixed(2)} {this.state.baseCurrency}</Text>
                </View>
              </TouchableOpacity>
            )
          } else if (payment[0][3] === this.state.activeUser) {
            return (
              <TouchableOpacity onPress={() => this.completePayment(payment)} style={styles.paymentsContainer} key={index + "container"}>
                <View style={styles.paymentsLabel} key={index + "label"}>
                  <Text>{payment[0][2]} - {payment[0][0]}:</Text>
                </View >
                <View style={styles.paymentsAmount} key={index + "amount"}>
                  <Text style={styles.recieves}>+{parseFloat(payment[1]).toFixed(2)} {this.state.baseCurrency}</Text>
                </View>
              </TouchableOpacity>
            )
          }
        })
      }
    }
  }

  renderPayments() {

    if (this.state.isLoadingPayments) {
      return (
        <View style={styles.containerIndicator}>
          <ActivityIndicator />
        </View>
      )
    } else {
      if (this.state.payments.length === undefined || this.state.payments.length === 0) {
        return (
          <View>
            <Text style={styles.nopayments}>{I18n.t('nopayments')}</Text>
          </View>
        )
      } else {
        let pays = this.state.payments
        let result = []

        return this.state.payments.map((payment, index) => {
          if (payment[0][1] === this.state.activeUser) {

            return (
              <View style={styles.paymentsContainer} key={index + "container"}>
                <View style={styles.paymentsLabel} key={index + "label"}>
                  <Text>{payment[0][0]} - {payment[0][2]}:</Text>
                </View >
                <View style={styles.paymentsAmount} key={index + "amount"}>
                  <Text style={styles.owes}>-{parseFloat(payment[1]).toFixed(2)} {this.state.baseCurrency}</Text>
                </View>
              </View>
            )
          } else if (payment[0][3] === this.state.activeUser) {
            return (
              <View style={styles.paymentsContainer} key={index + "container"}>
                <View style={styles.paymentsLabel} key={index + "label"}>
                  <Text>{payment[0][2]} - {payment[0][0]}:</Text>
                </View >
                <View style={styles.paymentsAmount} key={index + "amount"}>
                  <Text style={styles.recieves}>+{parseFloat(payment[1]).toFixed(2)} {this.state.baseCurrency}</Text>
                </View>
              </View>
            )
          }
        })
      }
    }
  }
  renderUserPicker() {
    let isAdmin = false;
    for (participant of this.state.participants) {
      if (participant[0].email == this.state.username && (participant[1] == "ADMIN" || participant[1] == "GUIDE")) {
        isAdmin = true;
      }
    }
    if (this.state.expenses.length > 0 && isAdmin) {
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
    if (this.state.isLoading) {
      return (
        <View style={styles.containerIndicator}>
          <ActivityIndicator />
        </View>
      )
    } else {
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
                            <Text key={i + "paidAmount"}>{parseFloat(data[i][1]).toFixed(2)} {this.state.baseCurrency}</Text>
                          </View>
                        </View>

                        <View key={i + "consumedFlexView"} style={styles.flexViewContainer}>
                          <View key={i + "consumedLeftFlexView"} style={styles.leftFlexView}>
                            <Text key={i + "consumedText"} style={styles.label}>{I18n.t('amountconsumed')} </Text>
                          </View>
                          <View key={i + "consumedRightFlexView"} style={styles.rightFlexView}>
                            <Text key={i + "consumedAmount"}>{parseFloat(data[i][2]).toFixed(2)} {this.state.baseCurrency}</Text>
                          </View>
                        </View>

                        <View key={i + "balanceFlexView"} style={styles.flexViewContainer}>
                          <View key={i + "balanceLeftFlexView"} style={styles.leftFlexView}>
                            <Text key={i + "balanceText"} style={styles.label}>{I18n.t('balans')} </Text>
                          </View>
                          <View key={i + "balanceRightFlexView"} style={styles.rightFlexView}>
                            <Text key={i + "balanceAmount"}>{parseFloat(data[i][3]).toFixed(2)} {this.state.baseCurrency}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  )
                }
              }
            }
          })}

        </View>
      )
    }

  }

  render() {
    const tableData = this.renderTable();


    if (this.state.isLoading) {
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

          <View style={styles.separator}>
            <Text style={styles.transactions}>{I18n.t('paymentsToDo')}</Text>
            <Text style={styles.subTransactions}>{I18n.t('taptocomplete')}</Text>
          </View>

          <ScrollView>
            <View style={styles.scrollViewMargin}>
              {this.renderPaymentsToComplete()}
            </View>
          </ScrollView>

          <View style={styles.separator}>
            <Text style={styles.transactions}>{I18n.t('payments')}</Text>
          </View>
          <ScrollView>
            {this.renderPayments()}
          </ScrollView>

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
  scrollViewMargin: {
    marginBottom: 20
  },
  owes: {
    color: 'red'
  },
  recieves: {
    color: 'green'
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
  nopayments: {
    textAlign: 'center'
  },
  transactions: {
    textAlign: 'center',
    fontSize: 17
  },
  subTransactions: {
    textAlign: 'center',
    fontSize: 15
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
  paymentsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10
  },
  paymentsLabel: {
    flex: 0.75
  },
  paymentsAmount: {
    flex: 0.25
  },
  nameField: {
    textAlign: 'center',
    fontSize: 17
  },
  label: {
    fontSize: 15,
    marginBottom: 5
  },
  payments: {
    padding: 25
  },
  text: { marginLeft: 5, padding: 5 },
  row: { height: 30 },
  btn: { width: 58, height: 18, backgroundColor: '#ccc', marginLeft: 15 },
  btnText: { textAlign: 'center', color: '#fff' }
});
