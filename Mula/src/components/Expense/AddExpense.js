import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, TextInput, Button, TouchableOpacity, Picker } from 'react-native';
import I18n from 'react-native-i18n';
import Prompt from 'react-native-prompt';

export default class AddExpense extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            ammount: "",
            category: 'Choose category',
            currency: ""
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

    setCategory(item) {
        if (item == "add") {
            console.log('testAddCategory')
            this.addItemToCategory();
        } else {
            this.setState({ category: item });
        }
    }

    addItemToCategory() {
        console.log('testAddCategory2')
        this.setState({ promptVisible: true });
    }

    checkAmmount(text) {
        let newText = '';
        let numbers = '0123456789';

        for (var i = 0; i < text.length; i++) {
            if (numbers.indexOf(text[i]) > -1) {
                newText = newText + text[i];
            } 
            if (text[i] === ',') {
                newText = newText + ',';
            }
            if (text[i] === '.') {
                newText = newText + ',';
            }
        }

        this.setState({ ammount: newText })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.contentView}>
                    <Text style={styles.label}>Naam</Text>
                    <TextInput
                        placeholder='kies naam'
                        style={styles.inputField}
                        underlineColorAndroid="transparent"
                        placeholderTextColor="#818181"
                        onChangeText={(text) => this.setState({ name: text })} />

                    <Text style={styles.label}>Bedrag</Text>
                    <TextInput
                        placeholder='Bedrag van uitgave'
                        style={styles.inputField}
                        keyboardType='numeric'
                        underlineColorAndroid="transparent"
                        placeholderTextColor="#818181"
                        onChangeText={(text) => this.checkAmmount(text)}
                        value={this.state.ammount} />

                    <Text style={styles.label}>Categorie: {this.state.category}</Text>
                    <Picker style={styles.picker} selectedValue={this.state.category} onValueChange={(itemValue, itemIndex) => this.setCategory(itemValue)}>
                        <Picker.Item label="Restaurant" value="Restaurant" />
                        <Picker.Item label="Taxi" value="Taxi" />
                        <Picker.Item label="Add Category" value="add" />
                    </Picker>

                    <Text style={styles.label}>Currency {this.state.currency}</Text>
                    <Picker style={styles.picker} selectedValue={this.state.currency} onValueChange={(currency) => this.setState({ currency })}>
                        {this.renderPickerCurrencies()}
                    </Picker>



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
        marginLeft: 5
    },
    contentView: {
        marginTop: 10
    },
    label: {
        marginLeft: 10,
        fontSize: 15
    },
    inputField: {
        marginLeft: 13,
        fontSize: 15,
        padding: 10,
        marginBottom: 2,
        color: 'black',
        borderRadius: 5
    },
    picker: {
        marginLeft: 13
    }
});
