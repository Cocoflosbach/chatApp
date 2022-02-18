import React, { Component } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import {
  Bubble,
  GiftedChat,
  InputToolbar,
  SystemMessage,
} from "react-native-gifted-chat";
import * as firebase from "firebase";
import "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import CustomActions from "./CustomActions";
import MapView from "react-native-maps";

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
      isConnected: true,
      image: null,
      location: null,
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    // create reference to messages collection in constructor
    this.referenceChatMessages = firebase.firestore().collection("messages");
  }

  //get messages from AsynStorage
  async getMessages() {
    let messages = "";
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  //save messages to Asynstorage
  async saveMessages() {
    try {
      await AsyncStorage.setItem(
        "messages",
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  //remove messages from Asynstorage
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem("messages");
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  componentDidMount() {
    let name = this.props.route.params.name;
    //Check if the user is online or offline
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        this.setState({ isConnected: true });
        console.log("online");

        // This listens for updates made to the collection
        this.unsubscribe = this.referenceChatMessages
          .orderBy("createdAt", "desc")
          .onSnapshot(this.onCollectionUpdate);

        // use firebase.auth() to authenticate a user
        this.authUnsubscribe = firebase
          .auth()
          .onAuthStateChanged(async (user) => {
            if (!user) {
              await firebase.auth().signInAnonymously();
            }

            this.setState({
              uid: user.uid,

              user: {
                _id: user.uid,
                name: this.state.user.name,
                avatar: "https://placeimg.com/140/140/any",
              },
              isConnected: true,
            });
          });

        const systemMsg = {
          _id: this.props.route.params.name,
          text: this.props.route.params.name + " has entered the chat",
          createdAt: new Date(),
          system: true,
        };
        this.referenceChatMessages.add(systemMsg);

        this.saveMessages();
      } else {
        this.setState({ isConnected: false });
        console.log("offline");
        this.getMessages();
      }
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
        text: data.text || "",
        createdAt: data.createdAt.toDate(),
        user: data.user,
        image: data.image || null,
        location: data.location || null,
        system: data.system,
      });
    });
    this.setState({
      messages,
    });
    this.saveMessages();
  };

  //add messages to the database
  addMessages() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: message.user,
      avatar: "https://facebook.github.io/react-native/img/header_logo.png",
      /* image: message.image || null, */
      image: "https://facebook.github.io/react-native/img/header_logo.png",
      location: message.location || null,
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
        this.saveMessages();
      }
    );
  }

  // A function to customize the features of the render bubble prop
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#D17A22",
          },
        }}
        textStyle={{
          right: {
            color: "white",
          },
        }}
      />
    );
  }

  // A function to customize the rendering of the input tool bar
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return <InputToolbar {...props} />;
    }
  }

  renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        textStyle={{
          color: "#fff",
        }}
      />
    );
  }

  renderCustomActions(props) {
    return <CustomActions {...props} />;
  }

  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={styles.map}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  render() {
    // name was passed  as prop from startscreen using navigate
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    // background color was passed as prop from startscreen using navigate
    const { bgColor } = this.props.route.params;

    return (
      <View
        style={{
          backgroundColor: bgColor ? bgColor : "#FFFDF7",
          flex: 1,
        }}
      >
        <Text>{this.state.loggedInText}</Text>
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: this.state.uid,
            name: name,
            avatar: this.state.user.avatar,
          }}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
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
  button: {
    flex: 1,
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
  map: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
  },
});
