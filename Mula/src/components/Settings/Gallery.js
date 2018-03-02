import React, { Component } from 'react';
import { AsyncStorage, StyleSheet, View, Image, Text, TextInput, Button, TouchableOpacity, BackHandler, Picker, Alert, ScrollView } from 'react-native';
import { StackNavigator } from 'react-navigation';
import I18n from 'react-native-i18n';
import CameraRollPicker from 'react-native-camera-roll-picker';

export default class Galery extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            imgUri: ""
        }
    }

    componentWillMount() {
        this.setState({imgUri: require('../../images/placeholder_user.png')});
    }

    componentDidMount() {
        this.props.navigation.addListener("didFocus", () => BackHandler.addEventListener('hardwareBackPress', this._handleBackButton));
        this.props.navigation.addListener("willBlur", () => BackHandler.removeEventListener('hardwareBackPress', this._handleBackButton));
    }

    _handleBackButton = () => {
        this.props.navigation.navigate('Settings');
        return true;
    }

    getSelectedImages(image) {
        if(image[0]) {
            let url = image[0].uri;
            this.setState({imgUri: require(url)});
        }
    }

    savePicture() {
        AsyncStorage.setItem('profilePic', JSON.stringify(this.state.imgUri))
            .then(res => console.log('profilePic stored in AsyncStorage'))
            .catch(error => console.log('profilePic storing expenses'));
        this.props.navigation.navigate('Settings', {imgUri: this.state.imgUri});
    }

    render() {
        return (
            <View style={styles.container}>
                <CameraRollPicker 
                callback={this.getSelectedImages}
                assetType="Photos"
                groupTypes="All"
                maximum={1} />
                <TouchableOpacity style={styles.saveButton} onPress={() => this.savePicture()}>
                    <Text style={styles.saveText}>{I18n.t('savepic')}</Text>
                </TouchableOpacity>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        alignSelf: 'stretch',
    },
    saveButton: {
        height: 60,
        alignItems: 'center',
        backgroundColor: '#ffd185',
        borderRadius: 5,
    },
    saveText: {
        fontSize: 15,
        lineHeight: 32,
        color: '#303030',
        textAlign: 'center'
    },
});
