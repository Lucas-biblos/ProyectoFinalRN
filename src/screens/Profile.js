import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { auth, db } from '../firebase/config';
import Icon from 'react-native-vector-icons/FontAwesome';


export class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loading: true,
    };
  }

  componentDidMount() {
    db.collection('posts')
      .where('owner', '==', auth.currentUser.email)
      .onSnapshot(
        (snapshot) => {
          let userPosts = [];
          snapshot.forEach((doc) => {
            userPosts.push({
              id: doc.id,
              data: doc.data(),
            });
          });

          this.setState({
            posts: userPosts,
            loading: false,
          });
        },
        (error) => {
          console.error('Error al obtener los posts del usuario:', error);
        }
      );
  }

  deletePost = (id) => {
    db.collection('posts')
      .doc(id).delete()
      .then(() => {
        console.log('Post eliminado');
      })
      .catch((error) => {
        console.error('Error al eliminar el post:', error);
      });
  };

  logout = () => {
    auth.signOut()
      .then(() => {
        console.log("Usuario cerrado sesión exitosamente");
        this.props.navigation.navigate('Login');
      })
      .catch((error) => {
        console.error("Error al cerrar sesión: ", error);
      });
  };

  Fecha = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000); 
    return date.toLocaleDateString(); 
  };


  render() {

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subTitle}>Tus Posts</Text>

        {this.state.loading ? (
          <Text>Cargando posts...</Text>
        ) : this.state.posts.length === 0 ? (
          <Text>No tienes posts publicados.</Text>
        ) : (
          <FlatList
            data={this.state.posts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.postContainer}>

                <Text style={styles.postOwner}>{item.data.owner}</Text>
                <Text style={styles.postTitle}>{item.data.description}</Text>
                <Text style={styles.postDate}>{item.data.createdAt}</Text>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => this.deletePost(item.id)}>
                  <Icon name="trash" size={20} color="brown" />
                </TouchableOpacity>
                
              </View>
            )}
          />
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={this.logout}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#555',
  },
  logoutButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
  },
  postContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  postDate: {
    fontSize: 14,
    color: '#888',
  },
});

export default Profile;