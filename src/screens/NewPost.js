import React, { Component } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { db, auth } from '../firebase/config';

export class NewPost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            description: '',
            errorMsg: '',
            likes: []
        };
    }

    handleSubmit = () => {
        if (this.state.description === '') {
            this.setState({ errorMsg: 'La descripción no puede estar vacía.' });
            return;
        }
        db.collection('posts').add({
            owner: auth.currentUser.email,
            description: this.state.description,
            createdAt: Date.now(),
            likes: []
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
                    placeholderTextColor="#A6E1FA"
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
        backgroundColor: '#1C1F2D',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#A6E1FA',
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#445E93',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 20,
        backgroundColor: '#2D3A5A',
        fontSize: 16,
        color: '#A6E1FA',
    },
    submitButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#4A90E2',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    submitButtonText: {
        color: '#F5F7FA',
        fontSize: 18,
        fontWeight: '600',
    },
    errorText: {
        color: '#F25F5C',
        fontSize: 16,
        marginTop: 15,
    },
});
