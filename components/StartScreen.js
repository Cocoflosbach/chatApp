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
    black: "#090C08",
    plum: "#474056",
    grey: "#8A95A5",
    olive: "#B9C6AE",
  };

  // this finction is called when a color is chosen
  changeBackgroundColor = (newColor) => {
    this.setState({
      bgColor: newColor,
    });
  };

  render() {
    const { black, plum, grey, olive } = this.colors;
    return (
      <ImageBackground
        source={BackgroundImage}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.container}>
          <View style={styles.titleBox}>
            <Text style={styles.titleText}>ChatMeApp</Text>
          </View>

          <View style={styles.inputBox}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(name) => this.setState({ name })}
              value={this.state.name}
              placeholder="Type your name here ..."
            />

            <View style={styles.chooseColorSection}>
              <Text style={styles.colorBoxText}>Choose background color</Text>
              <View style={styles.colorBox}>
                <TouchableOpacity
                  style={styles.color1}
                  onPress={() => this.changeBackgroundColor(black)}
                ></TouchableOpacity>
                <TouchableOpacity
                  style={styles.color2}
                  onPress={() => this.changeBackgroundColor(plum)}
                ></TouchableOpacity>
                <TouchableOpacity
                  style={styles.color3}
                  onPress={() => this.changeBackgroundColor(grey)}
                ></TouchableOpacity>
                <TouchableOpacity
                  style={styles.color4}
                  onPress={() => this.changeBackgroundColor(olive)}
                ></TouchableOpacity>
              </View>
            </View>

            <Pressable
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
        </View>
      </ImageBackground>
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
  },
  titleBox: {
    flex: 10,
    justifyContent: "center",
  },
  titleText: {
    fontSize: 45,
    fontWeight: "600",
    color: "#FFFFFF",
    justifyContent: "center",
  },
  inputBox: {
    height: 400,
    width: 400,
    flexDirection: "column",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    opacity: 10,
    marginBottom: 100,
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
    backgroundColor: "#090C08",
    height: 50,
    width: 50,
    borderRadius: 25,
    marginRight: 8,
  },
  color2: {
    backgroundColor: "#474056",
    height: 50,
    width: 50,
    borderRadius: 25,
    marginRight: 8,
  },
  color3: {
    backgroundColor: "#8A95A5",
    height: 50,
    width: 50,
    borderRadius: 25,
    marginRight: 8,
  },
  color4: {
    backgroundColor: "#B9C6AE",
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
