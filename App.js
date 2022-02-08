import React, { Component } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import StartScreen from "./components/StartScreen";
import ChatScreen from "./components/ChatScreen";

//import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

//create the navigator
const Stack = createStackNavigator();
// const Tab = createBottomTabNavigator();

export default class App extends Component {
  render() {
    return (
      // Replace Stack with Tab for tab navigation view
      <NavigationContainer>
        <Stack.Navigator initialRouteName="StartScreen">
          <Stack.Screen name="StartScreen" component={StartScreen} />

          <Stack.Screen name="ChatScreen" component={ChatScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
