import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, TextInput, Button, TouchableOpacity, ScrollView } from 'react-native';
import I18n from 'react-native-i18n';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

export default class TripTotal extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {

  }

  getAllExpensesByTrip() {

  }

  renderExpenses() {

  }

  render() {
    const tableData = [
      ['Payer', 'Payed', 'Consumed'],
      ['Glenn', 'b', 'c'],
      ['Annelore', '2', '3'],
      ['Deni', 'b', 'c'],
      ['Jens', '4', '5']
    ];

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