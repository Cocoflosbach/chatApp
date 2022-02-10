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
        {
          _id: this.props.route.params.name,
          text: this.props.route.params.name + " has entered the chat",
          createdAt: new Date(),
          system: true,
        },
      ],
    });
  }

  // Feed messages sent into the chat screen
  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
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
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
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

{
  /* <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: bgColor,
        }}
      >
        <Text style={styles.text}>Welcome to the chat room!</Text>
      </View>
    );
  }
} */
}
