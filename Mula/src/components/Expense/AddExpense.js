import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, TextInput, Button, TouchableOpacity, Picker } from 'react-native';
import I18n from 'react-native-i18n';
import Prompt from 'react-native-prompt';
import { StackNavigator } from 'react-navigation';

export default class AddExpense extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            amount: "",
            category: I18n.t('categoryplaceholder'),
            currency: I18n.t('currencyplaceholder')
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

    SaveExpense() {

        //===========================
        //ADD EXPENSE TO DB CODE HERE
        //===========================

        this.props.navigation.navigate('TripDashboard', { trip: this.props.navigation.state.params.trip });

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.contentView}>
                    <Text style={styles.label}>{I18n.t('name')}</Text>
                    <TextInput
                        placeholder={I18n.t('nameplaceholder')}
                        style={styles.inputField}
                        underlineColorAndroid="#ffd185"
                        placeholderTextColor="#818181"
                        onChangeText={(text) => this.setState({ name: text })} />

                    <Text style={styles.label}>{I18n.t('amount')}</Text>
                    <TextInput
                        placeholder={I18n.t('amountplaceholder')}
                        style={styles.inputField}
                        keyboardType='numeric'
                        underlineColorAndroid="#ffd185"
                        placeholderTextColor="#818181"
                        onChangeText={(text) => this.checkAmount(text)}
                        value={this.state.amount} />

                    <Text style={styles.label}>{I18n.t('categoryexpense')} {this.state.category}</Text>
                    <Picker style={styles.picker} selectedValue={this.state.category} onValueChange={(itemValue, itemIndex) => this.setCategory(itemValue)}>
                        <Picker.Item label={I18n.t('choosecategory')} value={I18n.t('categoryplaceholder')}/>
                        {this.renderPickerCategories()}
                        <Picker.Item label={I18n.t('addcategory')} value="add" />
                    </Picker>

                    <Text style={styles.label}>{I18n.t('currency')} {this.state.currency}</Text>
                    <Picker style={styles.picker} selectedValue={this.state.currency} onValueChange={(currency) => this.setState({ currency })}>
                        <Picker.Item label={I18n.t('choosecurrency')} value={I18n.t('currencyplaceholder')} />
                        {this.renderPickerCurrencies()}
                    </Picker>

                    <TouchableOpacity style={styles.saveButton} onPress={() => this.SaveExpense()}>
                        <Text style={styles.saveText}>{I18n.t('savebutton')}</Text>
                    </TouchableOpacity>



                    <Prompt
                        title="Add categeory"
                        placeholder="New Category"
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
