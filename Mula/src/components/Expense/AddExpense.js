import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Image, Text, TextInput, Button, TouchableOpacity, Picker, AsyncStorage, BackHandler, Alert } from 'react-native';
import DatePicker from 'react-native-datepicker';
import I18n from 'react-native-i18n';
import Prompt from 'react-native-prompt';
import CheckBox from 'react-native-checkbox';

export default class AddExpense extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            amount: "",
            selectedDate: "",
            category: I18n.t('categoryplaceholder'),
            currency: I18n.t('currencyplaceholder'),
            wayofsplit: I18n.t('splitplaceholder'),
            language: I18n.t('langtest'),
            check: false,
            groupAmount: ""
        }
    }

    componentDidMount() {
        console.log(this.props.navigation.state.params.trip);

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

    renderPickerCurrencies() {
        return this.props.navigation.state.params.trip.currencies.map((currency, index) => {
            return (
                <Picker.Item value={currency} label={currency} key={index} />
            )
        });
    }

    renderPickerCategories() {
        return this.props.navigation.state.params.trip.categories.map((category, index) => {
            return (
                <Picker.Item value={category} label={category} key={index} />
            )
        });
    }

    setCategory(item) {
        if (item == "add") {
            this.setState({ promptVisible: true });
        } else {
            this.setState({ category: item });
        }
    }

    checkAmount(text) {
        var newText = '';
        let numbers = '0123456789';

        for (var i = 0; i < text.length; i++) {
            if (numbers.indexOf(text[i]) > -1) {
                newText = newText + text[i];
            }
            if (text[i] === ',') {
                newText = newText + '.';
            }
            if (text[i] === '.') {
                newText = newText + '.';
            }
        }

        this.setState({ amount: newText });
    }

    getExpense() {
        let expense = {
            name: this.state.name,
            amount: parseInt(this.state.amount),
            date: this.state.selectedDate,
            category: this.state.category,
            currency: this.state.currency,
            payers: [],
            consumers: [],
            tripID: this.props.navigation.state.params.trip.id
        }

        /* ==============================
          Add new expense to AsyncStorage
        ============================== */

        // AsyncStorage.getItem('expenses')
        //       .then(req => JSON.parse(req))
        //       .then((expenses) => {
        //           expenses.push(expense);
        //           AsyncStorage.setItem('expenses', JSON.stringify(expenses))
        //                 .then(res => console.log('Expenses stored in AsyncStorage'))
        //                 .catch(error => console.log('Error storing expenses'));
        //       })
        //       .catch(error => console.log('Error loading expenses'));

        //===========================
        //ADD EXPENSE TO DB CODE HERE
        //===========================

        this.props.navigation.navigate('AddExpensePayers', { expense, trip: this.props.navigation.state.params.trip });

    }

    showAddGroupCostField() {
        if (this.state.check == false) {
            this.setState({ check: !this.state.check });
            this.addGroupCostField();
        }

        if (this.state.check == true) {
            this.setState({ check: !this.state.check });
            this.addGroupCostField();
        }
    }

    addGroupCostField() {
        if (this.state.check == true) {
            return (
                <View>
                    <Text style={styles.label}>{I18n.t('groupexpense')}</Text>
                    <TextInput
                        placeholder={I18n.t('amountplaceholder')}
                        style={styles.inputField}
                        keyboardType='numeric'
                        underlineColorAndroid="#ffd185"
                        placeholderTextColor="#bfbfbf"
                        onChangeText={(text) => this.checkAmount(text)}
                        value={this.state.groupAmount}>
                    </TextInput>
                </View>
            )
        }
    }


    render() {
        const { trip } = this.props.navigation.state.params;

        return (
            <View style={styles.container}>
                <View style={styles.contentView}>
                    <Text style={styles.label}>{I18n.t('name')}</Text>
                    <TextInput
                        placeholder={I18n.t('nameplaceholder')}
                        style={styles.inputField}
                        underlineColorAndroid="#ffd185"
                        placeholderTextColor="#bfbfbf"
                        onChangeText={(text) => this.setState({ name: text })} />

                    <Text style={styles.label}>{I18n.t('amount')}</Text>
                    <TextInput
                        placeholder={I18n.t('amountplaceholder')}
                        style={styles.inputField}
                        keyboardType='numeric'
                        underlineColorAndroid="#ffd185"
                        placeholderTextColor="#bfbfbf"
                        onChangeText={(text) => this.checkAmount(text)}
                        value={this.state.amount} />

                    <Text style={styles.label}>{I18n.t('date')}</Text>
                    <DatePicker
                        mode='date'
                        format='DD/MM/YYYY'
                        // minDate= {this.props.navigation.state.params.trip.startDate}
                        // maxDate={this.props.navigation.state.params.trip.endDate}
                        date={this.state.selectedDate}
                        showIcon={true}
                        placeholder={I18n.t('dateplaceholder')}
                        hideText={false}
                        date={this.state.selectedDate}
                        style={{ width: 200 }}
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 13,
                                marginLeft: 13
                            },
                            dateInput: {
                                marginLeft: 13,
                                padding: 10,
                                borderWidth: 0
                            },
                            placeholderText: {
                                color: "#818181"
                            },
                            dateText: {
                                marginLeft: 10
                            }
                        }}
                        onDateChange={(date) => this.setState({ selectedDate: date })}
                    />

                    <Text style={styles.label}>{I18n.t('categoryexpense')} {this.state.category}</Text>
                    <Picker style={styles.picker} selectedValue={this.state.category} onValueChange={(itemValue, itemIndex) => this.setCategory(itemValue)}>
                        <Picker.Item label={I18n.t('choosecategory')} value={I18n.t('categoryplaceholder')} />
                        {this.renderPickerCategories()}
                        <Picker.Item label={I18n.t('addcategory')} value="add" />
                    </Picker>

                    <Text style={styles.label}>{I18n.t('currency')} {this.state.currency}</Text>
                    <Picker style={styles.picker} selectedValue={this.state.currency} onValueChange={(currency) => this.setState({ currency })}>
                        <Picker.Item label={I18n.t('choosecurrency')} value={I18n.t('currencyplaceholder')} />
                        {this.renderPickerCurrencies()}
                    </Picker>

                    <View style={styles.checker}>
                        <CheckBox
                            label={I18n.t('addgroupexpense')}
                            checked={this.state.check}
                            onChange={() => this.showAddGroupCostField()}
                        />
                    </View>

                    {this.addGroupCostField()}

                    <TouchableOpacity style={styles.saveButton} onPress={() => this.getExpense()}>
                        <Text style={styles.saveText}>{I18n.t('whopaid')}</Text>
                    </TouchableOpacity>

                    <Prompt
                        title={I18n.t('addcategory')}
                        placeholder={I18n.t('newcategory')}
                        visible={this.state.promptVisible}
                        onCancel={() => this.setState({
                            promptVisible: false,
                            message: "You cancelled"
                        })}
                        onSubmit={(value) => this.setState({
                            promptVisible: false,
                            message: `You added "${value}"`,
                            category: value
                        })} />
                </View>
            </View>

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
        borderRadius: 5,
        marginTop: 10
    },
    saveText: {
        fontSize: 15,
        lineHeight: 28,
        color: '#303030',
        textAlign: 'center'
    },
    checker: {
        marginLeft: 10
    }
});
