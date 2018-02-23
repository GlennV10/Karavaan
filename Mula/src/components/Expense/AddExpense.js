import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, TextInput, Button, TouchableOpacity, Picker, AsyncStorage } from 'react-native';
import DatePicker from 'react-native-datepicker';
import I18n from 'react-native-i18n';
import Prompt from 'react-native-prompt';

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
            language: I18n.t('langtest')
        }
    }

    componentDidMount() {
        console.log(this.props.navigation.state.params.trip);
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

    setSplitNl(item) {
        if (item == "Betaal door rekening") {
            this.setState({ wayofsplit: 'Betaal door rekening' });
        } else if (item == "Betaal eigen deel") {
            this.setState({ wayofsplit: 'Betaal eigen deel' });
        } else if (item == "Gelijk verdeeld") {
            this.setState({ wayofsplit: 'Gelijk verdeeld' });
        }
    }

    setSplitEn(item) {
        if (item == "Pay by bill") {
            this.setState({ wayofsplit: 'Pay by bill' });
        } else if (item == "Pay own share") {
            this.setState({ wayofsplit: 'Pay own share' });
        } else if (item == "Split equally") {
            this.setState({ wayofsplit: 'Split equally' });
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

    saveExpense() {
        let expense = {
          name: this.state.name,
          date: this.state.selectedDate,
          wayofsplit: this.state.wayofsplit,
          paidBy: '...', //MultiSelect in UI? Can be multiple people
          users: [{name:"",amount:0}], //Users stored in this.props.navigation.state.params.trip.users, amounts based on wayofsplit
          category: this.state.category,
          currency: this.state.currency,
          amount: parseInt(this.state.amount),
          tripID: this.props.navigation.state.params.trip.id
        }

        /* ==============================
          Add new expense to AsyncStorage
        ============================== */

        AsyncStorage.getItem('expenses')
              .then(req => JSON.parse(req))
              .then((expenses) => {
                  expenses.push(expense);
                  AsyncStorage.setItem('expenses', JSON.stringify(expenses))
                        .then(res => console.log('Expenses stored in AsyncStorage'))
                        .catch(error => console.log('Error storing expenses'));
              })
              .catch(error => console.log('Error loading expenses'));

        // AsyncStorage.getItem('expenses', (err, expenses) => {
        //     if (expenses !== null) {
        //       console.log('Data Found', expenses);
        //       let expenses = JSON.parse(expenses);
        //       console.log(expenses);
        //       // AsyncStorage.setItem('savedIds', JSON.stringify(newIds));
        //     } else {
        //       console.log('Data Not Found');
        //       // AsyncStorage.setItem('savedIds', JSON.stringify(id));
        //     }
        // });

        //===========================
        //ADD EXPENSE TO DB CODE HERE
        //===========================

        this.props.navigation.navigate('TripDashboard', { trip: this.props.navigation.state.params.trip});

    }

    renderSplitPicker = () => {
        console.log("chosen: " + this.state.wayofsplit)
        if (this.state.language == 'en') {
            return (
                <Picker style={styles.picker} selectedValue={this.state.wayofsplit} onValueChange={(itemValue) => this.setSplitEn(itemValue)}>
                    <Picker.Item label='--- Choose option ---' value='Choose option' />
                    <Picker.Item value='Pay by bill' label='Pay by bill' />
                    <Picker.Item value='Pay own share' label='Pay own share' />
                    <Picker.Item value='Split equally' label='Split equally' />
                </Picker>
            );
        }
        else if (this.state.language == 'nl') {
            return (
                <Picker style={styles.picker} selectedValue={this.state.wayofsplit} onValueChange={(itemValue) => this.setSplitNl(itemValue)}>
                    <Picker.Item label='--- Kies een optie ---' value='Kies optie' />
                    <Picker.Item value='Betaal door rekening' label='Betaal door rekening' />
                    <Picker.Item value='Betaal eigen deel' label='Betaal eigen deel' />
                    <Picker.Item value='Gelijk verdeeld' label='Gelijk verdeeld' />
                </Picker>
            );
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


                    <Text style={styles.label}>Date</Text>
                    <DatePicker
                        mode='date'
                        format='DD/MM/YYYY'
                        // minDate= {yearbefore}
                        // maxDate={yearafter}
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

                    <Text style={styles.label}>{I18n.t('split')} {this.state.wayofsplit}</Text>
                    {/* <Picker style={styles.picker} selectedValue={this.state.wayofsplit} onValueChange={(itemValue) => this.setSplit({ itemValue })}> */}

                        {this.renderSplitPicker()}
                    {/* </Picker> */}

                    <TouchableOpacity style={styles.saveButton} onPress={() => this.saveExpense()}>
                        <Text style={styles.saveText}>{I18n.t('savebutton')}</Text>
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
        borderRadius: 5
    },
    saveText: {
        fontSize: 15,
        lineHeight: 28,
        color: '#303030',
        textAlign: 'center'
    }
});
