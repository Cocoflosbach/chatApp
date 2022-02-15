import React, { Component } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  ImageBackground,
  Pressable,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import BackgroundImage from "../assets/BackgroundImage.png";

const image = require("../assets/BackgroundImage.png");

export default class StartScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      bgColor: "",
    };
  }

  // Chat background color options to choose from
  colors = {
    peach: "#F7D4BC",
    indigo: "#360568",
    green: "#283845",
    pink: "#CFA5B4",
  };

  // this finction is called when a color is chosen
  changeBackgroundColor = (newColor) => {
    this.setState({
      bgColor: newColor,
    });
  };

  render() {
    const { peach, indigo, green, pink } = this.colors;
    return (
      <View style={styles.container}>
        <ImageBackground
          source={BackgroundImage}
          resizeMode="cover"
          style={styles.image}
        >
          <View style={styles.titleBox}>
            <Text style={styles.titleText}>ChatMeApp</Text>
          </View>

          <View style={styles.inputBox}>
            <TextInput
              accessible={true}
              accessibilityLabel="type your name here"
              accessibilityHint="This should be the name you would like to use in chat session"
              style={styles.inputStyle}
              onChangeText={(name) => this.setState({ name })}
              value={this.state.name}
              placeholder="Type your name here ..."
            />

            <View style={styles.chooseColorSection}>
              <Text style={styles.colorBoxText}>Choose background color</Text>
              <View style={styles.colorBox}>
                <TouchableOpacity
                  accessible={true}
                  accessibilityLabel="peach"
                  accessibilityHint="choose peach background"
                  style={styles.color1}
                  onPress={() => this.changeBackgroundColor(peach)}
                ></TouchableOpacity>
                <TouchableOpacity
                  accessible={true}
                  accessibilityLabel="indigo"
                  accessibilityHint="choose indigo background"
                  style={styles.color2}
                  onPress={() => this.changeBackgroundColor(indigo)}
                ></TouchableOpacity>
                <TouchableOpacity
                  accessible={true}
                  accessibilityLabel="green"
                  accessibilityHint="choose green background"
                  style={styles.color3}
                  onPress={() => this.changeBackgroundColor(green)}
                ></TouchableOpacity>
                <TouchableOpacity
                  accessible={true}
                  accessibilityLabel="pink"
                  accessibilityHint="choose pink background"
                  style={styles.color4}
                  onPress={() => this.changeBackgroundColor(pink)}
                ></TouchableOpacity>
              </View>
            </View>

            <Pressable
              accessible={true}
              accessibilityLabel="start"
              accessibilityHint="Go to chat room"
              style={styles.button}
              onPress={() =>
                this.props.navigation.navigate("ChatScreen", {
                  name: this.state.name,
                  bgColor: this.state.bgColor,
                })
              }
            >
              <Text style={styles.pressableText}>Go to Chat room</Text>
            </Pressable>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputStyle: {
    height: 40,
    width: 300,
    borderColor: "black",
    borderWidth: 2,
    marginBottom: 10,
  },
  button: {
    marginTop: 25,
    backgroundColor: "orange",
    borderRadius: 5,
    padding: 8,
  },
  image: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
  },
  titleBox: {
    flex: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    fontSize: 45,
    fontWeight: "600",
    color: "#FFFFFF",
    justifyContent: "center",
  },
  inputBox: {
    flex: 10,
    flexShrink: 0,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    opacity: 10,
    marginBottom: 200,
    opacity: 0.8,
  },
  pressableText: {
    fontWeight: "500",
    color: "white",
  },
  chooseColorSection: {
    marginTop: 8,
    alignItems: "center",
  },
  colorBox: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 6,
  },

  color1: {
    backgroundColor: "#F7D4BC",
    height: 50,
    width: 50,
    borderRadius: 25,
    marginRight: 8,
  },
  color2: {
    backgroundColor: "#360568",
    height: 50,
    width: 50,
    borderRadius: 25,
    marginRight: 8,
  },
  color3: {
    backgroundColor: "#283845",
    height: 50,
    width: 50,
    borderRadius: 25,
    marginRight: 8,
  },
  color4: {
    backgroundColor: "#CFA5B4",
    height: 50,
    width: 50,
    borderRadius: 25,
    marginRight: 8,
  },
  colorBoxText: {
    alignSelf: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#757083",
    opacity: 50,
  },
});
