import React, { Component } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import Home from '../screens/Home'
import Profile from '../screens/Profile'
import { FontAwesome } from '@expo/vector-icons';
import Users from '../screens/Users'
import { NewPost } from '../screens/NewPost'
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { auth, db } from '../firebase/config'

const Tab = createBottomTabNavigator();

export class HomeMenu extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (!user) {
                this.props.navigation.navigate("Login")
            }
        })
    }
    render() {
        return (
            <Tab.Navigator screenOptions={{ tabBarShowLabel: false }}>
                <Tab.Screen name="Home" component={Home}
                    options={{ tabBarIcon: () => <FontAwesome name="home" size={24} color="blue" /> }} />
                <Tab.Screen name="Users" component={Users}
                    options={{ tabBarIcon: () => <FontAwesome name="users" size={24} color="blue" /> }} />
                <Tab.Screen name="NewPost" component={NewPost}
                    options={{ tabBarIcon: () => <AntDesign name="pluscircleo" size={24} color="blue" /> }} />
                <Tab.Screen name="Profile" component={Profile}
                    options={{ tabBarIcon: () => <FontAwesome name="user" size={24} color="blue" /> }} />
            </Tab.Navigator>
        )
    }
}

export default HomeMenu
