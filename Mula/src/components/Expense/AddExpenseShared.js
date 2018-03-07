import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Image, Text, TextInput, Button, TouchableOpacity, Picker, AsyncStorage, BackHandler, Alert, Switch } from 'react-native';
import DatePicker from 'react-native-datepicker';
import I18n from 'react-native-i18n';
import Prompt from 'react-native-prompt';

export default class AddExpenseShared extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sharing: [],
            consumers: [],
            remaining: 0,
            consumedCount: 0,
            consumedTotal: 0,
            sharedByAll: 0,
            sharedBySome: 0
        }
    }

    componentWillMount() {
        let count = 0;
        let total = 0;
        let consumers = this.props.navigation.state.params.expense.consumers.slice();
        for(let i = consumers.length - 1; i >= 0; i--) {
            if (!(consumers[i].checked)) {
                consumers.splice(i, 1);
            } else {
                total += consumers[i].amount;
                count++;
            }
        }
        this.setState({ consumers });
        this.setState({ consumedCount: count })
        this.setState({ consumedTotal: total });
        this.setState({ remaining: (this.props.navigation.state.params.expense.total - total) })
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
        let sharing = this.state.sharing.slice();
        for(participant of this.state.consumers) {
            let share = {
                checked: true,
                participant: participant.participant
            }
            sharing.push(share);
        }
        this.setState({ sharing });
    }

    updateConsumerChecked(checked, participant) {
        let sharing = this.state.sharing.slice();
        for(share of sharing) {
            if (share.participant === participant) {
                share.checked = checked;
            }
        }
        this.setState({ sharing });
    }

    updateSharedByAll(shared) {
        if (shared !== "") {
            this.setState({ sharedByAll: parseFloat(shared) })
        } else {
            shared = 0;
            this.setState({ sharedByAll: 0 })
        }
        this.setState({ remaining: ((this.props.navigation.state.params.expense.total - this.state.consumedTotal) - parseFloat(shared) - parseFloat(this.state.sharedBySome)) })
    }

    updateSharedBySome(shared) {
        if (shared !== "") {
            this.setState({ sharedBySome: parseFloat(shared) })
        } else {
            shared = 0;
            this.setState({ sharedBySome: 0 })
        }
        this.setState({ remaining: ((this.props.navigation.state.params.expense.total - this.state.consumedTotal) - parseFloat(shared) - parseFloat(this.state.sharedByAll)) })
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

    shareSomeConsumers() {
        let sharedCount = 0;
        for(share of this.state.sharing) { if(share.checked){ sharedCount++ } }

        for(consumer of this.props.navigation.state.params.expense.consumers) {
            for(share of this.state.sharing) {
                if(consumer.participant === share.participant
                    && share.checked) {
                        consumer.amount += this.state.sharedBySome / sharedCount;
                }
            }
        }
    }

    shareAllConsumers() {
        for(consumer of this.props.navigation.state.params.expense.consumers) {
            if(consumer.checked) {
                consumer.amount += this.state.sharedByAll / this.state.consumedCount;
            }
        }
    }

    addExpense() {
        if (this.state.remaining === 0) {
            this.shareAllConsumers();
            this.shareSomeConsumers();

            for(let i = this.props.navigation.state.params.expense.consumers.length - 1; i >= 0; i--) {
                if(!(this.props.navigation.state.params.expense.consumers[i].checked)) {
                    this.props.navigation.state.params.expense.consumers.splice(i, 1);
                }
            }

            for(let i = this.props.navigation.state.params.expense.payers.length - 1; i >= 0; i--) {
                if (this.props.navigation.state.params.expense.payers[i].amount == 0) {
                    this.props.navigation.state.params.expense.payers.splice(i, 1);
                }
            }

            this.formatPayersAPI(this.props.navigation.state.params.expense);
            this.formatConsumersAPI(this.props.navigation.state.params.expense);
            console.log(this.props.navigation.state.params.expense);

            //==========================================================================================
            //=========================AANVULLEN MET POST REQUEST NAAR API==============================
            //==========================================================================================
            return fetch('http://193.191.177.73:8080/karafinREST/addExpense/' + this.props.navigation.state.params.trip.id, {
                method: 'POST',
                header: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.props.navigation.state.params.expense)
            })
            .then((res) => {
                this.props.navigation.navigate('TripDashboard', { trip: this.props.navigation.state.params.trip });
            })
            .catch(error => console.log("network/rest error"));
        } else if (this.state.remaining > this.props.navigation.state.params.expense.total) {
            alert("Totaal van de bedragen komt niet overeen met het totaal bedrag van de uitgave (te veel)");
        } else {
            alert("Totaal van de bedragen komt niet overeen met het totaal bedrag van de uitgave (te weinig)");
        }
    }

    renderConsumers() {
        return this.state.sharing.map((consumer, index) => {
            return (
                <View style={styles.consumer} key={index}>
                    <View style={styles.checker}>
                        <Switch
                            value={consumer.checked}
                            onValueChange={(checked) => this.updateConsumerChecked(checked, consumer.participant)}
                          />
                    </View>
                    <Text style={styles.labelConsumers}>{consumer.participant.firstName} {consumer.participant.lastName}</Text>
                </View>
            )
        });
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <View>
                    <View style={styles.contentView}>
                        <View style={styles.separator}>
                            <Text style={styles.title}>{I18n.t('shared')}</Text>
                        </View>
                        <Text style={styles.remaining}>{I18n.t('remaining')}: { this.state.remaining }</Text>
                        <View style={styles.shared}>
                            <Text style={styles.label}>{I18n.t('sharedbysome')}</Text>
                            <TextInput
                                placeholder={I18n.t('amountsharedplaceholder')}
                                style={styles.inputField}
                                keyboardType='numeric'
                                placeholderTextColor="#bfbfbf"
                                underlineColorAndroid="transparent"
                                onChangeText={(shared) => this.updateSharedBySome(shared) /*this.setState({ sharedBySome: parseFloat(shared) })*/} />
                        </View>
                        {this.renderConsumers()}

                        <View style={styles.separator}></View>

                        <View style={styles.shared}>
                            <Text style={styles.label}>{I18n.t('sharedbyall')}</Text>
                            <TextInput
                                placeholder={I18n.t('amountsharedplaceholder')}
                                style={styles.inputField}
                                keyboardType='numeric'
                                placeholderTextColor="#bfbfbf"
                                underlineColorAndroid="transparent"
                                onChangeText={(shared) => this.updateSharedByAll(shared)} />
                        </View>

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
        flex: .85,
        marginLeft: 10,
        fontSize: 14
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
