import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Image, Text, TextInput, Button, TouchableOpacity, Picker, AsyncStorage, BackHandler, Alert } from 'react-native';
import DatePicker from 'react-native-datepicker';
import I18n from 'react-native-i18n';
import Prompt from 'react-native-prompt';

export default class AddExpensePayers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            consumers: [],
        }
    }

    componentDidMount() {
        console.log(this.props.navigation.state.params.expense);;
        this.populateConsumersState();

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

    populateConsumersState() {
        let consumers = this.state.consumers.slice();

        var counter = 0;
        for (user of this.props.navigation.state.params.trip.users) {
            counter = counter + 1;
        }

        for (user of this.props.navigation.state.params.trip.users) {
            let consumer = {
                user: user,
                amount: this.props.navigation.state.params.expense.amount / counter + ""
            }
            consumers.push(consumer);
        }
        this.setState({ consumers });
    }

    updateConsumerAmount(amount, user) {
        let consumers = this.state.consumers.slice();
        for (consumer of consumers) {
            if (consumer.user === user) {
                consumer.amount = amount;
            }
        }

        this.setState({ consumers });
    }

    renderConsumers() {
        console.log(this.state.consumers);
        return this.state.consumers.map((consumer, index) => {
            return (
                <View key={index}>
                    <Text style={styles.label}>{consumer.user}</Text>
                    <TextInput
                        placeholder="Amount consumed"
                        keyboardType="numeric"
                        style={styles.inputField}
                        underlineColorAndroid="#ffd185"
                        placeholderTextColor="#bfbfbf"
                        onChangeText={(amount) => this.updateConsumerAmount(amount, consumer.user)}
                        value={consumer.amount} />
                </View>
            )
        });
    }

    getExpense() {
        let expense = this.props.navigation.state.params.expense;
        expense.consumers = this.state.consumers;

        var total = expense.amount;
        var consumertotal = 0;
        for (consumer of this.state.consumers) {
            if (consumer.amount == "") {
                consumertotal = consumertotal + 0;
            } else {
                consumertotal = consumertotal + parseInt(consumer.amount);
            }
        }

        if (total == consumertotal) {
            this.props.navigation.navigate('AddExpenseShared', { expense, trip: this.props.navigation.state.params.trip });
        } else {
            alert("Som van de bedragen komt niet overeen met het totaal bedrag van de uitgave");
        }

    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <View>
                    <View style={styles.contentView}>
                        <Text style={styles.title}>{I18n.t('consumers')}</Text>
                        {this.renderConsumers()}

                        <TouchableOpacity style={styles.saveButton} onPress={() => this.getExpense()}>
                            <Text style={styles.saveText}>{I18n.t('sharedexpense')}</Text>
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
