import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Image, Text, TextInput, Button, TouchableOpacity, Picker, AsyncStorage, BackHandler, Alert, KeyboardAvoidingView } from 'react-native';
import DatePicker from 'react-native-datepicker';
import I18n from 'react-native-i18n';

export default class AddExpensePayers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            payers: [],
            remaining: this.props.navigation.state.params.expense.total
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
            }
            payers.push(payer);
        }
        this.setState({ payers });
    }

    updatePayerAmount(amount, participant) {
        let total = 0;
        let payers = this.state.payers.slice();
        for (payer of payers) {
            if (payer.participant === participant) {
                if (amount !== "") {
                    payer.amount = parseFloat(amount);
                } else {
                    payer.amount = 0;
                }
            }
            total += payer.amount;
            console.log(payers);
        }
        console.log(this.checkAmount(amount))
        this.setState({ remaining: (this.props.navigation.state.params.expense.total - total) });
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
        return parseFloat(newText)
    }

    renderPayers() {
        return this.state.payers.map((payer, index) => {
            return (
                <View style={styles.payer} key={index}>
                    <Text style={styles.label}>{payer.participant.firstName} {payer.participant.lastName}</Text>
                    <TextInput
                        placeholder={I18n.t('amountpaid')}
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
                        <View style={styles.separator}>
                            <Text style={styles.title}>{I18n.t('payers')}</Text>
                        </View>
                        <Text style={styles.remaining}>{I18n.t('remaining')}: {this.state.remaining}</Text>
                        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={-200}>
                            {this.renderPayers()}
                        

                        <TouchableOpacity style={styles.saveButton} onPress={() => this.getExpense()}>
                            <Text style={styles.saveText}>{I18n.t('whoconsumed')}</Text>
                        </TouchableOpacity>
                        </KeyboardAvoidingView>
                    </View>
                </View>
                
            </ScrollView >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#d4e8e5',
        padding: 20
    },
    separator: {
        borderBottomColor: '#bbb',
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginBottom: 5,
        marginTop: 5
    },
    contentView: {
        marginTop: 10
    },
    payer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    remaining: {
        fontSize: 12,
        textAlign: 'right',
        opacity: .5
    },
    title: {
        marginLeft: 10,
        marginBottom: 10,
        fontSize: 17
    },
    label: {
        flex: .6,
        marginLeft: 10,
        fontSize: 14
    },
    inputField: {
        flex: .4,
        marginLeft: 5,
        fontSize: 13,
        padding: 5,
        marginBottom: 2,
        color: 'black',
        borderBottomWidth: 0,
        borderRadius: 5
    },
    picker: {
        marginLeft: 13
    },
    saveButton: {
        marginTop: 10,
        height: 40,
        alignItems: 'center',
        backgroundColor: '#ffd185',
        borderRadius: 5,
        marginBottom: 30
    },
    saveText: {
        fontSize: 15,
        lineHeight: 28,
        color: '#303030',
        textAlign: 'center'
    }
});
