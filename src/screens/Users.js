import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList } from 'react-native';
import { db } from '../firebase/config';
import { FontAwesome } from '@expo/vector-icons';

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
        user.data.UserName.toLowerCase().includes(value.toLowerCase()) || user.data.email.toLowerCase().includes(value.toLowerCase())
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
        <Text style={styles.title}>Encuentra otros usuarios</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Buscar..."
            value={this.state.searchValue}
            onChangeText={(text) => this.handleSearch(text)}/>

          <TouchableOpacity onPress={() => this.handleResetSearch()} style={styles.resetButton}>
            <FontAwesome name="refresh" size={20} color="white" />
          </TouchableOpacity>
        </View>
        {!this.state.loading && this.state.filteredUsers.length === 0 && <Text style={styles.noResultsText}>No se encontraron resultados</Text>}
        {!this.state.loading && (
          <FlatList
            data={this.state.filteredUsers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.userContainer}>
                <Text style={styles.username}>{item.data.UserName}</Text>
                <Text style={styles.bio}>{item.data.email}</Text>
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
    backgroundColor: '#15202B',
    padding: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E1E8ED',
    textAlign: 'center',
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#192734',
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#E1E8ED',
    borderWidth: 0,
    borderRadius: 25,
    paddingHorizontal: 10,
  },
  resetButton: {
    backgroundColor: '#1DA1F2',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 25,
    marginLeft: 10,
  },
  userContainer: {
    backgroundColor: '#192734',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1DA1F2',
    marginBottom: 5,
  },
  bio: {
    fontSize: 14,
    color: '#AAB8C2',
    marginBottom: 5,
  },
  loadingText: {
    color: '#E1E8ED',
    textAlign: 'center',
  },
  noResultsText: {
    color: '#E1E8ED',
    textAlign: 'center',
  },
});
export default Users;
