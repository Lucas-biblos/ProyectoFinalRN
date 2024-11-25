import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { db, auth } from '../firebase/config';
import firebase from 'firebase/app';




export class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loading: true,
    };
  }




  componentDidMount() {
    this.setState({
      loading: true,
    });
    db.collection('posts').orderBy('createdAt', 'desc').onSnapshot((docs) => {
      let posts = [];
      docs.forEach((doc) => {
        posts.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      this.setState({
        posts: posts,
        loading: false,
      });
    });
  }


  likePost = (postId) => {
    db.collection('posts').doc(postId).update({
      likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email),
    })
      .catch((error) => console.log('Error al likear', error));
  };


  unlikePost = (postId) => {
    db.collection('posts').doc(postId).update({
      likes: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.email),
    })
      .catch((error) => console.log('Error al deslikear', error));
  };






  render() {
    return (
      <View style={styles.container}>
        {!this.state.loading && (
          <FlatList
            data={this.state.posts}
            keyExtractor={(post) => post.id}
            renderItem={({ item }) => (
              <View style={styles.postContainer}>
                <Text style={styles.owner}>{item.data.owner}</Text>
                <Text style={styles.description}>{item.data.description}</Text>
                <Text style={styles.description}>Likes {item.data.likes.length}</Text>
                <TouchableOpacity
                  onPress={() =>
                    item.data.likes.includes(auth.currentUser.email) ? this.unlikePost(item.id): this.likePost(item.id)}>
                  <Text style={styles.likeButtonText}>
                    {item.data.likes.includes(auth.currentUser.email) ? 'Unlike' : 'Like'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
    );
  }
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15202B',
    padding: 10,
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
  },
  owner: {
    fontSize: 16,
    color: '#1DA1F2',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#E1E8ED',
    lineHeight: 20,
  },
});




export default Home;
