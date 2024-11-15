import React, { Component } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { db, auth } from '../firebase/config';


export class NewPost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            description: '',
            errorMsg: '',
        };
    }

    handleSubmit = () => {

        if (this.state.description === '') {
            this.setState({ errorMsg: 'La descripción no puede estar vacía.' });
            return;
        }

        db.collection('posts').add({
            owner: auth.currentUser.email ,
            description: this.state.description,
            createdAt: Date.now(),
        })
            .then(() => {
                this.setState({ description: '', errorMsg: '' });
                this.props.navigation.navigate('Profile');
            })
            .catch(e => this.setState({ errorMsg: e.message }));
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Nuevo Post</Text>


                <TextInput
                    style={styles.input}
                    placeholder='Descripción'
                    placeholderTextColor="#a0c4b6"
                    multiline={true}
                    numberOfLines={4}
                    onChangeText={text => this.setState({ description: text })}
                    value={this.state.description}
                />


                <TouchableOpacity style={styles.submitButton} onPress={this.handleSubmit}>
                    <Text style={styles.submitButtonText}>Subir Post</Text>
                </TouchableOpacity>


                {this.state.errorMsg ? <Text style={styles.errorText}>{this.state.errorMsg}</Text> : null}
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e6f2ef',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#0a4d4f',
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#4d8079',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 20,
        backgroundColor: '#e0f4f1',
        fontSize: 16,
        color: '#0a4d4f',
    },
    submitButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#4d8079',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 10,
    },
    submitButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        marginTop: 15,
    },
});



