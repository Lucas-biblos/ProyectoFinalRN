import React, { Component } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { db } from '../firebase/config';
import Post from '../components/Post';
export class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    db.collection('posts')
      .orderBy('createdAt', 'desc')
      .onSnapshot((docs) => {
        let posts = [];
        docs.forEach((doc) => {
          posts.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        this.setState({ posts, loading: false });
      });
  }

  render() {
    const { posts, loading } = this.state;

    return (
      <View style={styles.container}>
        {loading ? (
          <Text style={styles.loadingText}>Cargando posts...</Text>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(post) => post.id}
            renderItem={({ item }) => <Post data={item.data} id={item.id} />}
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
  loadingText: {
    textAlign: 'center',
    color: '#E1E8ED',
    marginTop: 20,
    fontSize: 16,
  },
});

export default Home;
