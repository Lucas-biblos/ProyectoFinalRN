import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { auth, db } from '../firebase/config';
import firebase from 'firebase/app';
import Icon from 'react-native-vector-icons/FontAwesome';

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  likePost = () => {
    const { id } = this.props;
    db.collection('posts')
      .doc(id)
      .update({
        likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email),
      })
      .catch((error) => console.log('Error al likear', error));
  };

  unlikePost = () => {
    const { id } = this.props;
    db.collection('posts')
      .doc(id)
      .update({
        likes: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.email),
      })
      .catch((error) => console.log('Error al deslikear', error));
  };

  render() {
    const { data } = this.props;
    return (
      <View style={styles.postContainer}>
        <Text style={styles.owner}>{data.owner}</Text>
        <Text style={styles.description}>{data.description}</Text>
        <View style={styles.likesContainer}>
          <TouchableOpacity onPress={data.likes.includes(auth.currentUser.email) ? this.unlikePost : this.likePost}>
            <Icon name="thumbs-up" size={24} color={data.likes.includes(auth.currentUser.email) ? 'gold' : '#AAB8C2'}
            style={styles.likeIcon}/>
          </TouchableOpacity>
          <Text style={styles.likes}>{data.likes.length}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  likes: {
    fontSize: 14,
    color: '#AAB8C2',
    marginLeft: 5,
  },
  likeIcon: {
    marginRight: 5,
  },
});

export default Post;
