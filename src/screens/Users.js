import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList } from 'react-native';
import { db } from '../firebase/config';

export class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      filteredUsers: [],
      searchValue: '',
      loading: true,
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    db.collection('users')
      .get()
      .then((querySnapshot) => {
        let users = [];
        querySnapshot.forEach((doc) => {
          users.push({ id: doc.id, data: doc.data() });
        });
        this.setState({
          users: users,
          filteredUsers: users,
          loading: false,
        });
      })
      .catch((error) => {
        console.error('Error', error);
        this.setState({ loading: false });
      });
  }

  handleSearch(value) {
    this.setState({
      searchValue: value,  
      filteredUsers: this.state.users.filter((user) => 
        user.data.UserName.toLowerCase().includes(value.toLowerCase())  
      ),
    });
  }

  handleResetSearch() {
    this.setState({
      searchValue: '',
      filteredUsers: this.state.users,
    });
  }

  render() {
    return (
      <View style={styles.container}>
      <Text style={styles.title}>Buscar</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Buscar..."
          value={this.state.searchValue} 
          onChangeText={(text) => this.handleSearch(text)} 
        />
          <TouchableOpacity onPress={() => this.handleResetSearch()} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>
        {!this.state.loading && this.state.filteredUsers.length === 0 && ( 
          <Text style={styles.noResultsText}>No se encontraron resultados</Text> 
        )}
        {!this.state.loading && (
          <FlatList
            data={this.state.filteredUsers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.userContainer}>
                <Text style={styles.username}>{item.data.UserName}</Text>
                <Text style={styles.bio}>{item.data.bio}</Text>
              </View>
            )}
          />
        )}
        {this.state.loading && <Text style={styles.loadingText}>Cargando usuarios...</Text>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  resetButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  userContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  bio: {
    fontSize: 14,
    color: '#666',
  },
  loadingText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Users;
