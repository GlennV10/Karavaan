import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, TextInput, Button, TouchableOpacity, ScrollView } from 'react-native';
import I18n from 'react-native-i18n';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

export default class TripTotal extends Component {
  constructor(props) {
    super(props);
    this.state = {
        overview: {}
    }
  }

  componentWillMount() {
      this.getTripOverview();
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

  renderTable() {
      let table = [
        ['Payer', 'Paid', 'Consumed', 'Pay/receive']
      ];
      for(payerKey of Object.keys(this.state.overview)) {
          let payerData = [];
          payerData.push(payerKey);
          for(amount of this.state.overview[payerKey]) {
              payerData.push(amount.toString());
          }
          table.push(payerData);
      }
      return table;
  }

  render() {
    const tableData = this.renderTable();

    return (
      <View style={styles.container}>
        <Table>
          <Rows data={tableData} style={styles.row} textStyle={styles.text} />
        </Table>
      </View>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d4e8e5',
  },
  text: { marginLeft: 5, padding: 5 },
  row: { height: 30 },
  btn: { width: 58, height: 18, backgroundColor: '#ccc', marginLeft: 15 },
  btnText: { textAlign: 'center', color: '#fff' }
});
