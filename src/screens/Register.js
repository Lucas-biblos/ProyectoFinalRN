import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { auth, db } from '../firebase/config'

export class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      UserName: '',
      registered: false,
      errorMsg: '',
      bio: '',
    };
  }

  componentDidMount(){
    auth.onAuthStateChanged((user)=>{
        if (user){
            this.props.navigation.navigate("HomeMenu")
        }
    })
}
  handleSubmit(email, pass, bio, UserName) {
    console.log('UserName:', this.state.UserName);
    console.log('Email:', this.state.email);
    console.log('Password:', this.state.password);

    auth.createUserWithEmailAndPassword(email, pass)
      .then(response => {
        if (response) {
          db.collection('users').add({
            email: email,
            bio: bio,
            UserName: UserName,
            createdAt:Date.now(),
          })
            .then(() => {
              this.setState({ registered: true, errorMsg: '' });
              this.props.navigation.navigate('Login');
            })
            .catch(e => console.log(e.message));
        }
      })
      .catch(error => this.setState({ errorMsg: error.message }));
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Formulario de Registro</Text>

        <TextInput
          style={styles.input}
          keyboardType='default'
          placeholder='UserName'
          placeholderTextColor="#a0c4b6"
          onChangeText={text => this.setState({ UserName: text })}
          value={this.state.UserName}
        />

        <TextInput
          style={styles.input}
          keyboardType='default'
          placeholder='Bio'
          placeholderTextColor="#a0c4b6"
          multiline={true}
          numberOfLines={4}
          onChangeText={text => this.setState({ bio: text })}
          value={this.state.bio}
        />

        <TextInput
          style={styles.input}
          keyboardType='email-address'
          placeholder='Email'
          placeholderTextColor="#a0c4b6"
          onChangeText={text => this.setState({ email: text })}
          value={this.state.email}
        />

        <TextInput
          style={styles.input}
          keyboardType='default'
          placeholder='Password'
          placeholderTextColor="#a0c4b6"
          secureTextEntry={true}
          onChangeText={text => this.setState({ password: text })}
          value={this.state.password}
        />

        <TouchableOpacity style={styles.registerButton} onPress={() => this.handleSubmit(this.state.email, this.state.password, this.state.bio, this.state.UserName)}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>

        {this.state.errorMsg ? <Text style={styles.errorText}>{this.state.errorMsg}</Text> : null}

        <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
          <Text style={styles.linkText}>Go to Login</Text>
        </TouchableOpacity>
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
  registerButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#4d8079',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
  },
  registerButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    fontSize: 16,
    color: '#0a4d4f',
    marginTop: 15,
    textDecorationLine: 'underline',
  },
});

export default Register;
