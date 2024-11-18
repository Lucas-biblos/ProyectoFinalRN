import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { auth, db } from '../firebase/config';
import Icon from 'react-native-vector-icons/FontAwesome';



export class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loading: true,
      userInfo: ''
    };
  }
  componentDidMount() {

    db.collection('users')
    .where('email', '==', auth.currentUser.email)
      .onSnapshot(
        (snapshot) => {
          let userInfo = [];
          snapshot.forEach((doc) => {
            userInfo.push({
              id: doc.id,
              data: doc.data(),
            });
          });

          this.setState({
            userInfo: userInfo[0].data,
            loading: false,
          });
        },
        (error) => {
          console.error('Error', error);
        }
      );


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
          console.error('Error ', error);
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
        console.error('Error al eliminar el post', error);
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
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{this.state.userInfo.UserName}</Text>
        <Text style={styles.bio}>{this.state.userInfo.bio}</Text>
        <Text style={styles.subTitle}>Tus Posts</Text>

        {this.state.loading ? (
          <Text style={styles.loadingText}>Cargando posts...</Text>
        ) : this.state.posts.length === 0 ? (
          <Text style={styles.noPostsText}>No tienes posts publicados.</Text>
        ) : (
          <FlatList
            data={this.state.posts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.postContainer}>
                <Text style={styles.postOwner}>{item.data.owner}</Text>
                <Text style={styles.postDescription}>{item.data.description}</Text>

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
  bio: {
    fontSize: 18,
    color: '#AAB8C2',
    textAlign: 'center',
    marginBottom: 30,
  },
  subTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E1E8ED',
    marginBottom: 10,
  },
  loadingText: {
    color: '#E1E8ED',
    textAlign: 'center',
  },
  noPostsText: {
    color: '#E1E8ED',
    textAlign: 'center',
  },
  postContainer: {
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
  postOwner: {
    fontSize: 16,
    color: '#1DA1F2',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  postDescription: {
    fontSize: 14,
    color: '#E1E8ED',
    lineHeight: 20,
  },
  deleteButton: {
    backgroundColor: 'transparent',
    padding: 5,
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 30,
    alignSelf: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
export default Profile;