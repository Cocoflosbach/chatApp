import React, { Component } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import { initializeApp } from "firebase/app";
import * as firebase from "firebase";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC-HCJXQRRhSnHO49ztWU3EgIhTiHsL3rk",
  authDomain: "chatapp-8b9d0.firebaseapp.com",
  projectId: "chatapp-8b9d0",
  storageBucket: "chatapp-8b9d0.appspot.com",
  messagingSenderId: "484893773919",
  appId: "1:484893773919:web:f67cc79ea0a9768b144bea",
};

export default class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      uid: "0",
      loggedInText: "",
      user: {
        _id: "",
        name: "",
        avatar: "",
      },
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    // create reference to messages collection in constructor
    this.referenceChatMessages = firebase.firestore().collection("messages");
  }

  componentDidMount() {
    this.referenceChatMessages = firebase.firestore().collection("messages");
    if (
      this.referenceChatMessages !== undefined &&
      this.referenceChatMessages !== null
    ) {
      this.unsubscribe = this.referenceChatMessages.onSnapshot(
        this.onCollectionUpdate
      );
    } else {
      alert("Something is wrong!");
    }

    // use firebase.auth() to authenticate a user
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }

      this.setState({
        uid: user.uid,
        messages: [
          [this.state.messages],
          {
            _id: this.props.route.params.name,
            text: this.props.route.params.name + " has entered the chat",
            createdAt: new Date(),
            system: true,
          },
        ],
        user: {
          _id: user.uid,
          name: this.state.user.name,
          avatar: "https://placeimg.com/140/140/any",
        },
      });
      // This listens for updates made to the collection
      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });
  }

  componentWillUnmount() {
    //stop listening to authentication and collection changes
    this.unsubscribe();
    this.authUnsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
      });
    });
    this.setState({
      messages,
    });
  };

  //add messages to the database
  addMessages() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: this.state.user,
    });
  }

  // Feed messages sent into the chat screen
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessages();
      }
    );
  }

  // A function to customize the faetures of the render bubble prop
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#A211E2",
          },
        }}
      />
    );
  }

  render() {
    // name was passed  as prop from startscreen using navigate
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    // background color was passed as prop from startscreen using navigate
    const { bgColor } = this.props.route.params;

    return (
      <View style={styles.container}>
        <Text>{this.state.loggedInText}</Text>
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: this.state.user._id,
            name: this.state.name,
            avatar: this.state.user.avatar,
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 30,
    fontWeight: "300",
    color: "white",
  },
});
