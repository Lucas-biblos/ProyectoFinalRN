import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { auth, db } from '../firebase/config';


export class Login extends Component {


  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
  }


  onSubmit = () => {
    auth.signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((data) => {
        let user = data.user;
        console.log('Usuario aprobado:', user.email);
        this.props.navigation.navigate('HomeMenu', { email: user.email });
      })
      .catch((error) => {
        this.setState({ errorMsg: error.message });
      });
  }




  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Formulario de Login</Text>
       
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


        <TouchableOpacity style={styles.loginButton} onPress={() => this.onSubmit()}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>


        <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
          <Text style={styles.linkText}>Go to Register</Text>
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
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#4d8079',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
  },
  loginButtonText: {
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


export default Login;










