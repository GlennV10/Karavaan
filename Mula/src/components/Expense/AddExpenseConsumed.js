import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Image, Text, TextInput, Button, TouchableOpacity, Picker, AsyncStorage, BackHandler, Alert, CheckBox } from 'react-native';
import DatePicker from 'react-native-datepicker';
import I18n from 'react-native-i18n';
import Prompt from 'react-native-prompt';

export default class AddExpensePayers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            consumers: [],
            shared: 0
        }
    }

    componentDidMount() {
        console.log(this.props.navigation.state.params.expense);
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
        for (participant of this.props.navigation.state.params.trip.participants) {
            let consumer = {
                participant: participant[0],
                amount: 0, //this.props.navigation.state.params.expense.total / this.props.navigation.state.params.trip.participants.length
            }
            consumers.push(consumer);
        }
        this.setState({ consumers });
    }

    updateConsumerAmount(amount, participant) {
        let consumers = this.state.consumers.slice();
        for (consumer of consumers) {
            if (consumer.participant === participant) {
                if (amount !== "") {
                    consumer.amount = parseFloat(amount);
                } else {
                    consumer.amount = 0;
                }
            }
            console.log(consumers);
        }
        this.setState({ consumers });
    }

    renderConsumers() {
        return this.state.consumers.map((consumer, index) => {
            return (
                <View key={index}>
                    <Text style={styles.label}>{consumer.participant.firstName} {consumer.participant.lastName}</Text>
                    <TextInput
                        placeholder="Amount consumed"
                        keyboardType="numeric"
                        style={styles.inputField}
                        placeholderTextColor="#bfbfbf"
                        underlineColorAndroid="transparent"
                        onChangeText={(amount) => this.updateConsumerAmount(amount, consumer.participant)} />
                </View>
            )
        });
    }

    formatPayersAPI(expense) {
        let formatPayers = {};
        for(payer of expense.payers) {
            let key = payer.participant.email;
            formatPayers[key] = payer.amount;
        }
        expense.payers = formatPayers;
    }

    formatConsumersAPI(expense) {
        let formatConsumers = {};
        for(consumer of expense.consumers) {
            let key = consumer.participant.email;
            formatConsumers[key] = consumer.amount;
        }
        expense.consumers = formatConsumers;
    }

    addExpense() {
        let expense = this.props.navigation.state.params.expense;

        let consumerTotal = 0;
        for (consumer of this.state.consumers) {
            consumerTotal += parseFloat(consumer.amount);
        }

        if ((consumerTotal + this.state.shared) == expense.total) {
            for(let i = this.state.consumers.length - 1; i >= 0; i--) {
                if (this.state.consumers[i].amount == 0) {
                    this.state.consumers.splice(i, 1);
                } else {
                    this.state.consumers[i].amount += (this.state.shared / this.state.consumers.length);
                }
            }
            for(let i = expense.payers.length - 1; i >= 0; i--) {
                if (expense.payers[i].amount == 0) {
                    expense.payers.splice(i, 1);
                }
            }
            expense.consumers = this.state.consumers;

            this.formatPayersAPI(expense);
            this.formatConsumersAPI(expense);
            console.log(expense);
            //==========================================================================================
            //=========================AANVULLEN MET POST REQUEST NAAR API==============================
            //==========================================================================================
            return fetch('http://193.191.177.73:8080/karafinREST/addExpense/' + this.props.navigation.state.params.trip.id, {
                method: 'POST',
                header: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(expense)
            })
            .then((res) => {
                console.log(res._bodyText);
                this.props.navigation.navigate('TripDashboard', { trip: this.props.navigation.state.params.trip });
            });
        } else if (consumerTotal > expense.total) {
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
                        <View style={styles.consumersView}>
                            <Text style={styles.title}>{I18n.t('consumers')}</Text>
                            {this.renderConsumers()}
                        </View>

                        <View style={styles.separator}>
                            <Text style={styles.label}>{I18n.t('sharedcost')}</Text>
                            <TextInput
                                placeholder="Amount shared..."
                                style={styles.inputField}
                                keyboardType='numeric'
                                placeholderTextColor="#bfbfbf"
                                underlineColorAndroid="transparent"
                                onChangeText={(shared) => this.setState({ shared: parseFloat(shared) })} />
                        </View >

                        <TouchableOpacity style={styles.saveButton} onPress={() => this.addExpense()}>
                            <Text style={styles.saveText}>{I18n.t('addexpense')}</Text>
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
    },
    separator: {
        borderTopColor: '#bbb',
        borderTopWidth: StyleSheet.hairlineWidth,
        marginBottom: 5,
        marginTop: 5
    }
});
