import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Image, Text, TextInput, Button, TouchableOpacity, Picker, AsyncStorage, BackHandler, Alert, Switch } from 'react-native';
import DatePicker from 'react-native-datepicker';
import I18n from 'react-native-i18n';
import Prompt from 'react-native-prompt';

export default class AddExpenseConsumed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            consumers: [],
            remaining: this.props.navigation.state.params.expense.total
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
                checked: true,
                participant: participant[0],
                amount: 0, //this.props.navigation.state.params.expense.total / this.props.navigation.state.params.trip.participants.length
            }
            consumers.push(consumer);
        }
        this.setState({ consumers });
    }

    updateConsumerAmount(amount, participant) {
        let total = 0;
        let consumers = this.state.consumers.slice();
        for(consumer of consumers) {
            if (consumer.participant === participant) {
                if (amount !== "") {
                    consumer.amount = parseFloat(amount);
                } else {
                    consumer.amount = 0;
                }
            }
            total += consumer.amount;
        }
        console.log(this.checkAmount(amount))
        this.setState({ remaining: (this.props.navigation.state.params.expense.total - total) });
        this.setState({ consumers });
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

    updateConsumerChecked(checked, participant) {
        let consumers = this.state.consumers.slice();
        for(consumer of consumers) {
            if (consumer.participant === participant) {
                consumer.checked = checked;
            }
        }
        this.setState({ consumers });
    }

    renderConsumers() {
        return this.state.consumers.map((consumer, index) => {
            return (
                <View style={styles.consumer} key={index}>
                    <View style={styles.checker}>
                        <Switch
                            value={consumer.checked}
                            onValueChange={(checked) => this.updateConsumerChecked(checked, consumer.participant)}
                          />
                    </View>
                    <Text style={styles.labelConsumers}>{consumer.participant.firstName} {consumer.participant.lastName}</Text>
                    <TextInput
                        editable={consumer.checked}
                        placeholder="Amount..."
                        keyboardType="numeric"
                        style={styles.inputFieldConsumers}
                        placeholderTextColor="#bfbfbf"
                        underlineColorAndroid="transparent"
                        onChangeText={(amount) => this.updateConsumerAmount(amount, consumer.participant)} />
                </View>
            )
        });
    }

    getExpense() {
        let expense = this.props.navigation.state.params.expense;

        let consumerTotal = 0;
        for (consumer of this.state.consumers) {
            consumerTotal += parseFloat(consumer.amount);
        }

        if (!(consumerTotal > expense.total)) {
            expense.consumers = this.state.consumers;
            this.props.navigation.navigate('AddExpenseShared', { expense, trip: this.props.navigation.state.params.trip });
        } else {
            alert("Totaal van de bedragen komt niet overeen met het totaal bedrag van de uitgave (te veel)");
        }
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <View>
                    <View style={styles.contentView}>
                        <View style={styles.separator}>
                            <Text style={styles.title}>{I18n.t('consumers')}</Text>
                        </View>
                        <Text style={styles.remaining}>{I18n.t('remaining')}: { this.state.remaining }</Text>
                        {this.renderConsumers()}

                        <TouchableOpacity style={styles.saveButton} onPress={() => this.getExpense()}>
                            <Text style={styles.saveText}>{I18n.t('shared')}</Text>
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
    separator: {
        borderBottomColor: '#bbb',
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginBottom: 5,
        marginTop: 5
    },
    contentView: {
        marginTop: 10
    },
    title: {
        marginLeft: 10,
        marginBottom: 10,
        fontSize: 17
    },
    remaining: {
        fontSize: 12,
        textAlign: 'right',
        opacity: .5
    },
    consumer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    shared: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    checker: {
        flex: .15
    },
    labelConsumers: {
        flex: .6,
        marginLeft: 10,
        fontSize: 14
    },
    inputFieldConsumers: {
        flex: .25,
        marginLeft: 5,
        fontSize: 13,
        padding: 5,
        marginBottom: 2,
        color: 'black',
        borderBottomWidth: 0,
        borderRadius: 5
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
        borderRadius: 5
    },
    saveText: {
        fontSize: 15,
        lineHeight: 28,
        color: '#303030',
        textAlign: 'center'
    }
});
