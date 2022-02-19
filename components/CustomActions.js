import PropTypes from "prop-types";
import React, { Component } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { Audio } from "expo-av";
import * as Location from "expo-location";
import firebase from "firebase";
import "firebase/firestore";

export default class CustomActions extends Component {
  // A Function to launch enable users pick an image from their library
  pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    try {
      if (status === "granted") {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        }).catch((error) => console.log(error));

        if (!result.cancelled) {
          const imageUrl = await this.uploadImage(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // A Function to launch enable users take a photo with their device camera
  takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    try {
      if (status === "granted") {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        }).catch((error) => console.log(error));
        if (!result.cancelled) {
          const imageUrl = await this.uploadImage(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  /* // A Function to enable users record audio with their device
  recordAudio = async () => {
    const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);

    if (status === "granted") {
      const recording = new Audio.Recording();
      try {
        await recording.prepareToRecordAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        await recording.startAsync();
        // You are now recording!
        setTimeout(async () => {
          try {
            await recording.stopAndUnloadAsync();
          } catch (e) {
            console.log(error);
          }
        });
      } catch (error) {
        // An error occured!
      }
    }
  }; */

  // A Function to get the location of the user by using GPS
  getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const result = await Location.getCurrentPositionAsync({}).catch(
          (error) => console.log(error)
        );

        if (result) {
          this.props.onSend({
            location: {
              longitude: result.coords.longitude,
              latitude: result.coords.latitude,
            },
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Playing an audio file on your device
  /*  const soundObject = new Audio.Sound();
  try {
    await soundObject.loadAsync(require('./assets/sounds/hello.nps'));
    await soundObject.playAsync();
    // Sound is playing!
  } catch (error) {
    // An error occured!
  }
*/

  uploadImage = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const imageNameBefore = uri.split("/");
    const imageName = imageNameBefore[imageNameBefore.length - 1];

    const firebaseStorage = firebase
      .storage()
      .ref()
      .child(`images/${imageName}`);

    const snapshot = await firebaseStorage.put(blob);

    blob.close();

    return await snapshot.ref.getDownloadURL();
  };

  onActionPress = () => {
    const options = [
      "Choose From Library",
      "Take Picture",
      "Send Location",
      "Cancel",
    ];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            console.log("user wants to pick an image");
            return this.pickImage();
          case 1:
            console.log("user wants to take a photo");
            return this.takePhoto();
          case 2:
            console.log("user wants to get their location");
            return this.getLocation();
        }
      }
    );
  };

  render() {
    return (
      <TouchableOpacity
        accessible={true}
        accessibilityLabel="More options"
        accessibilityHint="Lets you choose tosend an image or your geolocation"
        style={[styles.container]}
        onPress={this.onActionPress}
      >
        <View styles={[styles.wrapper]}>
          <Text style={[styles.iconText]}>+</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: "#b2b2b2",
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: "#b2b2b2",
    fontWeight: "bold",
    fontSize: 16,
    backgroundColor: "transparent",
    textAlign: "center",
  },
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};
