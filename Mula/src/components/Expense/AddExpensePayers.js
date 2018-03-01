import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Image, Text, TextInput, Button, TouchableOpacity, Picker, AsyncStorage, BackHandler, Alert } from 'react-native';
import DatePicker from 'react-native-datepicker';
import I18n from 'react-native-i18n';
import Prompt from 'react-native-prompt';

export default class AddExpensePayers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            payers: [],
        }
    }

    componentDidMount() {
        console.log(this.props.navigation.state.params.expense);
        this.populatePayersState();

        this.props.navigation.addListener("didFocus", () => BackHandler.addEventListener('hardwareBackPress', this._handleBackButton));
        this.props.navigation.addListener("willBlur", () => BackHandler.removeEventListener('hardwareBackPress', this._handleBackButton));

    }

    _handleBackButton = () => {
        Alert.alert(
            I18n.t('back'),
            I18n.t('backmessage'), [{
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
            }, {
                text: 'OK',
                onPress: () => this.props.navigation.navigate('TripDashboard', { trip: this.props.navigation.state.params.trip })
            },], {
                cancelable: false
            }
        )
        return true;
    }

    populatePayersState() {
        let payers = this.state.payers.slice();
        for (participant of this.props.navigation.state.params.trip.participants) {
            let payer = {
                participant: participant[0],
                amount: 0,
                amountToShow: ""
            }
            payers.push(payer);
        }
        this.setState({ payers });
    }

    checkAmount(text) {
        var newText = '';
        let numbers = '0123456789';
        var containsComma = false;

        for (var i = 0; i < text.length; i++) {
            if (numbers.indexOf(text[i]) > -1) {
                newText = newText + text[i];
            }
            if (text[i] === ',' && containsComma === false) {
                newText = newText + '.';
                containsComma = true;
            }
            if (text[i] === '.' && containsComma === false) {
                newText = newText + '.';
                containsComma = true;
            }
        }
        containsComma = false;
        return newText;
    }

    updatePayerAmount(amount, participant) {
        let payers = this.state.payers.slice();
        for (payer of payers) {
            if (payer.participant === participant) {
                if (amount !== "") {
                    payer.amount = parseFloat(amount);   
                    payer.amountToShow = this.checkAmount(amount)             
                } else {
                    payer.amount = 0;
                    payer.amountToShow = ""
                }
            }
            console.log(payers);
        }
        
        this.setState({ payers });
    }

    renderPayers() {
        return this.state.payers.map((payer, index) => {
            return (
                <View key={index}>
                    <Text style={styles.label}>{payer.participant.firstName} {payer.participant.lastName}</Text>
                    <TextInput
                        placeholder="Amount paid..."
                        value={payer.amountToShow}
                        keyboardType="numeric"
                        style={styles.inputField}
                        placeholderTextColor="#bfbfbf"
                        underlineColorAndroid="transparent"
                        onChangeText={(amount) => this.updatePayerAmount(amount, payer.participant)} />
                </View>
            )
        });
    }

    getExpense() {
        let expense = this.props.navigation.state.params.expense;

        let payerTotal = 0;
        for (payer of this.state.payers) {
            payerTotal += parseFloat(payer.amount);
        }

        if (payerTotal == expense.total) {
            for(let i = this.state.payers.length - 1; i >= 0; i--) {
                if (this.state.payers[i].amount == 0) {
                    this.state.payers.splice(i, 1);
                }
            }

            
            expense.payers = this.state.payers;
            this.props.navigation.navigate('AddExpenseConsumed', { expense, trip: this.props.navigation.state.params.trip });
        } else if (payerTotal > expense.total) {
            alert("Totaal van de bedragen komt niet overeen met het totaal bedrag van de uitgave (te veel)");
            
        } else {
            alert("Totaal van de bedragen komt niet overeen met het totaal bedrag van de uitgave (te weinig)");
            
        }
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <View>
                    <View style={styles.contentView}>
                        <Text style={styles.title}>{I18n.t('payers')}</Text>
                        { this.renderPayers() }

                        <TouchableOpacity style={styles.saveButton} onPress={() => this.getExpense()}>
                            <Text style={styles.saveText}>{I18n.t('whoconsumed')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#d4e8e5',
        padding: 20
    },
    contentView: {
        marginTop: 10
    },
    title: {
        marginLeft: 10,
        marginBottom: 10,
        fontSize: 17
    },
    label: {
        marginLeft: 10,
        fontSize: 17
    },
    inputField: {
        marginLeft: 13,
        fontSize: 15,
        padding: 10,
        marginBottom: 2,
        color: 'black',
        borderBottomWidth: 0,
        borderRadius: 5
    },
    picker: {
        marginLeft: 13
    },
    saveButton: {
        height: 40,
        alignItems: 'center',
        backgroundColor: '#ffd185',
        borderRadius: 5
    },
    saveText: {
        fontSize: 15,
        lineHeight: 28,
        color: '#303030',
        textAlign: 'center'
    }
});
