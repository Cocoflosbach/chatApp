import React, { Component } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";

export default class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: "Hello developer",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any",
          },
        },
      ],
    });
  }

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  render() {
    // name was passed  as prop from startscreen using navigate
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    // background color was passed as prop from startscreen using navigate
    const { bgColor } = this.props.route.params;

    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={(messages) => this.onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 30,
    fontWeight: "300",
    color: "white",
  },
});
