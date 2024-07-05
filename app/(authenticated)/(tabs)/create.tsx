import { useRouter } from 'expo-router';

import * as ImagePicker from "expo-image-picker";
import { Buffer } from 'buffer';
import { getApps, initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import React from "react";
import {
  ActivityIndicator,
  Button,
  Image,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  View,
  LogBox,
  Platform,
  TouchableOpacity,
  TextInput,
  Pressable,
} from "react-native";
import FormField from "@/components/FormField";
import * as Clipboard from "expo-clipboard";
import 'react-native-get-random-values';
import { v4 as uuid } from "uuid";
import Toast from "react-native-toast-message";
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { defaultStyles } from "@/constants/Styles";
import { Handle } from "tamagui";
import { ScrollView } from "react-native-gesture-handler";
import PhoneInput, {
  ICountry,
} from 'react-native-international-phone-number';
import axios from "axios";
import { API_URL, AuthContext } from "@/app/context/AuthContext";




export const withRouter = (Component: any) => {
  const Wrapper = (props: any) => {
    const router = useRouter();
    return <Component router={router}  {...props} />
  }
  return Wrapper;
}
const firebaseConfig = {
  apiKey: "AIzaSyD4jNaSNcMRS7W9cHBuTIuSN4eRpgYq8yc",
  authDomain: "shantaye-ed632.firebaseapp.com",
  projectId: "shantaye-ed632",
  storageBucket: "shantaye-ed632.appspot.com",
  messagingSenderId: "1082077623005",
  appId: "1:1082077623005:web:c2d5ab963da0ea79c0e134"
};

// Editing this file with fast refresh will reinitialize the app on every refresh, let's not do that
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

// Firebase sets some timeers for a long period, which will trigger some warnings. Let's turn that off for this example
LogBox.ignoreLogs([`Setting a timer for a long period`]);

class App extends React.Component {
  static contextType = AuthContext;

  state = {
    image: "",
    uploading: false,
    form: {
      title: "",
      description: '',
      price: '',
      weight: "",
      destination: "",
      destinationCountry: null as (ICountry | null),
      destinationPhoneNumber: "",
      origin: "",
      originCountry: null as (ICountry | null),
      originPhoneNumber: "",

    },
    inputs: [{
      key: 0,
      value: {
        name: "",
        quantity: ""
      }
    }],
    errors: [{
      input: null,
      msg: null
    }]
  };

  // componentDidUpdate(prevProps:any, prevState:any) {
  //   // Similar to useEffect dependency array
  //   console.log(prevState.inputs.length + "----------" + this.state.inputs.length)
  //   if (prevState.inputs.length !== this.state.inputs.length) {
  //     // console.log("Inputs Updated: ", this.state.inputs); 
  //   }
  // }

  handlephoneNumber(phoneNumber: string, origin: boolean) {
    if (origin) {
      this.setState(prevState => ({
        form: {
          // @ts-ignore
          ...prevState.form,
          originPhoneNumber: phoneNumber
        }
      }))
    } else {
      this.setState(prevState => ({
        form: {
          // @ts-ignore
          ...prevState.form,
          destinationPhoneNumber: phoneNumber
        }
      }))
    }
  }

  handleSelectedCountry(i: ICountry, origin: boolean) {
    if (origin) {
      this.setState(prevState => ({
        form: {
          // @ts-ignore
          ...prevState.form,
          originCountry: i
        }
      }))
    } else {
      this.setState(prevState => ({
        form: {
          // @ts-ignore
          ...prevState.form,
          destinationCountry: i
        }
      }))
    }
  }

  inputs = this.state.inputs
  addHandler = () => {
    if (this.inputs.length < 10) {

      let addinputs = this.inputs;
      if (this.inputs.length == 0) {
        addinputs.push({ "key": 0, "value": { "name": '', "quantity": '1' } })
      } else {
        addinputs.push({ key: addinputs[addinputs.length - 1].key + 1, value: { "name": '', "quantity": '' } });
      }

      this.setState(prevState => ({
        inputs: {                   // object that we want to update
          // @ts-ignore
          ...prevState,
          inputs: addinputs       // update the value of specific key
        }
      }))

      console.log("inside addHandler: " + this.state.inputs.length)

    }


  };
  deleteHandler = (key: any) => {
    console.log("keyeyeyeyeyey: ", key)
    const index = this.inputs.findIndex(input => input.key == key);
    if (index > -1) { // only splice array when item is found
      const filteredInputs = this.inputs.splice(index, 1); // 2nd parameter means remove one item only
      console.log("Key: " + key, filteredInputs)
      this.setState(prevState => ({
        inputs: {                   // object that we want to update
          // @ts-ignore
          ...prevState,    // keep all other key-value pairs
          inputs: filteredInputs       // update the value of specific key
        }
      }))
    }

  };
  inputHandler = (key: any, text?: string, quantity?: string) => {
    const _inputs = [...this.inputs];
    if (text) {
      _inputs[key].value.name = text;
    }
    if (text === "") {
      _inputs[key].value.name = "";
    }
    if (quantity === "") {
      _inputs[key].value.quantity = "";
    }
    if (quantity) {
      _inputs[key].value.quantity = quantity;
    }
    _inputs[key].key = key;
    this.setState(prevState => ({
      inputs: {                   // object that we want to update
        // @ts-ignore
        ...prevState,    // keep all other key-value pairs
        inputs: _inputs       // update the value of specific key
      }
    }))

    console.log("Input Handler: " + JSON.stringify(this.inputs))

    // this.inputs = _inputs;
  };



  handleSubmit = async () => {

    const imageLocalUri = this.state.image
    try {
      const imageRemoteUri = await this._uploadImagePicked(imageLocalUri)
    } catch {
      console.log("error")
    }
    let items = [] as any
    this.inputs.forEach((input) => items.push({ name: input.value.name, quantity: input.value.quantity }));
    console.log("items::  ", items)
    //@ts-ignore
    const token = this.context.authState!.token
    const activeUser = JSON.parse(Buffer.from(token!.split('.')[1], 'base64').toString())
    const listing = {
      user: activeUser.id,
      title: this.state.form.title,
      description: this.state.form.description,
      weight: this.state.form.weight,
      origin: this.state.form.origin,
      originContact: this.state.form.originPhoneNumber,
      destination: this.state.form.destination,
      destinationContact: this.state.form.destinationPhoneNumber,
      pickupLocation: "Seller's home",
      category: "Food",
      price: this.state.form.price,
      image: this.state.image,
      items: items
    }
    try {
      const { data } = await axios.post(`${API_URL}/listing/addlisting`, listing)

      console.log(JSON.stringify(data))

      //@ts-ignore
      const router = this.props.router
      if (data.success) {

        router.push({
          pathname: '/(modals)/uploadPayment/[id]',
          params: { id: data.data._id, user: data.data.user },
        });
        Toast.show({
          type: 'success',
          text1: "Success",
          text2: "Post created as draft"
        })
      }
    } catch (error) {
      console.log(JSON.stringify(error))
    }

  }
  async componentDidMount() {
    if (Platform.OS !== "web") {
      const {
        status,
      } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Toast.show({
          type: 'error',
          text1: "Error",
          text2: "This app needs camera roll permissions!"
        })
      }
    }
  }







  render() {
    let { image } = this.state
    let { form } = this.state
    // let { inputs } = this.state

    return (
      <LinearGradient colors={["#f3f7f7", "#dee4f7"]}
        style={{ flex: 1, paddingTop: 50 }}>
        <ScrollView keyboardShouldPersistTaps={'handled'} style={{ padding: 16 }}>
          <Text style={{ fontFamily: 'mon-sb', fontSize: 24, color: Colors.dark }}>Create a post</Text>

          <FormField
            title="Title"
            value={form.title}
            placeholder="Give your post a descriptive title..."
            handleChangeText={(e: any) => {
              this.setState(prevState => ({
                form: {                   // object that we want to update
                  // @ts-ignore
                  ...prevState.form,    // keep all other key-value pairs
                  title: e       // update the value of specific key
                }
              }))
            }}
            otherStyles={{ marginTop: 20 }}
          />

          <FormField
            title="Description"
            value={form.description}
            placeholder="Add a clear description of the item/s"
            handleChangeText={(e: any) => {
              this.setState(prevState => ({
                form: {                   // object that we want to update
                  // @ts-ignore
                  ...prevState.form,    // keep all other key-value pairs
                  description: e       // update the value of specific key
                }
              }))
            }}
            otherStyles={{ marginTop: 20 }}
          />

          <Text style={{ color: Colors.dark, fontFamily: 'mon-sb', marginVertical: 16 }}>List of items</Text>

          {this.inputs && this._renderInputs()}

          <TouchableOpacity
            style={[defaultStyles.btn, { backgroundColor: Colors.primaryMuted, flexDirection: 'row', gap: 6, alignItems: "center", marginTop: 8 }]}
            // onPress={}
            disabled={this.state.uploading}
            onPress={this.addHandler}>
            <Ionicons name="add" color={'#fff'} size={20} />
            <Text style={{ fontFamily: 'mon-sb', color: '#fff' }}>
              {this.state.inputs.length > 0 ? (
                'Add more items'
              ) : 'Add items'}

            </Text>
          </TouchableOpacity>

          <View style={{ marginTop: 16, flexDirection: 'column', gap: 2 }}>
            <Text style={{ color: Colors.dark, fontFamily: "mon-sb", marginBottom: 10 }}>
              Upload a picture of the item
            </Text>

            {image && (
              <TouchableOpacity style={{ width: '100%', alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 0, zIndex: 1, height: 50, marginBottom: "auto", backgroundColor: 'rgba(0, 0, 0, 0.2)' }} onPress={() => this.setState({ image: "" })}>
                <Ionicons name="close" size={32} color="#fff" />
              </TouchableOpacity>
            )}

            <View style={{ height: 200, paddingHorizontal: 4, backgroundColor: Colors.lightGray, borderRadius: 10, borderColor: Colors.primary, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              {!!image ? (
                <Image
                  source={{ uri: image }}
                  style={{ width: "100%", height: 200, borderRadius: 10 }}
                  resizeMode='contain'
                />
              ) : (
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <TouchableOpacity onPress={() => this._takePhoto()} style={{ borderStyle: 'dashed', borderWidth: 1, borderRadius: 8, borderColor: Colors.primary, width: 100, height: 100, justifyContent: 'center', alignItems: 'center' }}>
                    <Ionicons
                      name='camera-outline'
                      size={50}
                    // alt="upload"
                    // style={{ width: "50%", alignItems: 'center', height: "50%"}}
                    />
                  </TouchableOpacity>
                  <View style={styles.dividerVertical} />
                  <TouchableOpacity onPress={() => this._pickImage()} style={{ borderStyle: 'dashed', borderWidth: 1, borderRadius: 8, borderColor: Colors.primary, width: 100, height: 100, justifyContent: 'center', alignItems: 'center' }}>
                    <Ionicons
                      name='cloud-upload-outline'
                      size={50}
                    // alt="upload"
                    // style={{ width: "50%", alignItems: 'center', height: "50%"}}
                    />
                  </TouchableOpacity>
                </View>
              )}
              {this._maybeRenderUploadingOverlay()}

            </View>
            {/* {this._maybeRenderImage()} */}
          </View>

          <FormField
            title="Weight"
            value={this.state.form.weight}
            placeholder="The weight of the item"
            handleChangeText={(e: any) => this.setState(prevState => ({
              form: {
                // @ts-ignore
                ...prevState.form,
                weight: e
              }
            }))}
            otherStyles={{ marginVertical: 10 }}
          />

          <FormField
            title="Origin"
            value={this.state.form.origin}
            placeholder="Origin country and city"
            handleChangeText={(e: any) => this.setState(prevState => ({
              form: {
                // @ts-ignore
                ...prevState.form,
                origin: e
              }
            }))}
            otherStyles={{ marginVertical: 10 }}
          />

          <Text style={{ fontFamily: 'mon-sb', marginVertical: 10 }}>Contact number at origin</Text>

          <PhoneInput
            placeholder="Enter phone"
            phoneInputStyles={{
              container: {
                backgroundColor: "#fff",
                borderWidth: 1,
                borderColor: Colors.lightGray
              },
              flagContainer: {
                borderTopLeftRadius: 7,
                borderBottomLeftRadius: 7,
                alignItems: 'center',

              },
              flag: {},
              caret: {
                fontSize: 16,
              },
              divider: {
                width: 0,
                backgroundColor: Colors.dark,
              },
              callingCode: {},
              input: {

                color: Colors.dark,
              },
            }}
            modalStyles={{
              modal: {
                backgroundColor: "#fff",
                borderWidth: 0,
              },
              divider: {
                backgroundColor: 'transparent',
              },
              searchInput: {
                borderWidth: 0,
                borderBottomWidth: 1,
                borderColor: '#222',
                color: Colors.dark,
                paddingHorizontal: 20,
                height: 50,
              },
              countryButton: {
                backgroundColor: Colors.lightGray,
                marginVertical: 4,
                borderWidth: 0,
              },
              noCountryText: {},
              noCountryContainer: {},
              flag: {
                color: '#FFFFFF',
                fontSize: 20,
              },
              callingCode: {
                color: '#222',
              },
              countryName: {
                color: '#222',
              },
            }}
            customCaret={<Ionicons name="chevron-down" size={16} color="#000000" />}
            // defaultValue="+251994697123"
            value={this.state.form.originPhoneNumber}
            defaultCountry="ET"
            onChangePhoneNumber={(e) => {
              this.handlephoneNumber(e, true)
            }}
            selectedCountry={this.state.form.originCountry}
            onChangeSelectedCountry={(i) => {
              this.handleSelectedCountry(i, true)
            }}
          />

          <FormField
            title="Destination"
            value={this.state.form.destination}
            placeholder="Destination country and city"
            handleChangeText={(e: any) => this.setState(prevState => ({
              form: {
                // @ts-ignore
                ...prevState.form,
                destination: e
              }
            }))}
            otherStyles={{ marginVertical: 14 }}
          />

          <Text style={{ fontFamily: 'mon-sb', marginVertical: 10 }}>Contact number at the destination</Text>

          <PhoneInput
            placeholder="Enter phone"
            phoneInputStyles={{
              container: {
                backgroundColor: "#fff",
                borderWidth: 1,
                borderColor: Colors.lightGray
              },
              flagContainer: {
                borderTopLeftRadius: 7,
                borderBottomLeftRadius: 7,
                alignItems: 'center',

              },
              flag: {},
              caret: {
                fontSize: 16,
              },
              divider: {
                width: 0,
                backgroundColor: Colors.dark,
              },
              callingCode: {},
              input: {

                color: Colors.dark,
              },
            }}
            modalStyles={{
              modal: {
                backgroundColor: "#fff",
                borderWidth: 0,
              },
              divider: {
                backgroundColor: 'transparent',
              },
              searchInput: {
                borderWidth: 0,
                borderBottomWidth: 1,
                borderColor: '#222',
                color: Colors.dark,
                paddingHorizontal: 20,
                height: 50,
              },
              countryButton: {
                backgroundColor: Colors.lightGray,
                marginVertical: 4,
                borderWidth: 0,
              },
              noCountryText: {},
              noCountryContainer: {},
              flag: {
                color: '#FFFFFF',
                fontSize: 20,
              },
              callingCode: {
                color: '#222',
              },
              countryName: {
                color: '#222',
              },
            }}
            customCaret={<Ionicons name="chevron-down" size={16} color="#000000" />}
            // defaultValue="+251994697123"
            value={this.state.form.destinationPhoneNumber}
            defaultCountry="ET"
            onChangePhoneNumber={(e) => {
              this.handlephoneNumber(e, false)
            }}
            selectedCountry={this.state.form.destinationCountry}
            onChangeSelectedCountry={(i) => {
              this.handleSelectedCountry(i, false)
            }}
          />

          <FormField
            title="Price"
            value={this.state.form.price}
            placeholder="How much are you willing pay "
            handleChangeText={(e: any) => this.setState(prevState => ({
              form: {
                // @ts-ignore
                ...prevState.form,
                price: e
              }
            }))}
            otherStyles={{ marginVertical: 10 }}
          />

          <View style={{ marginBottom: 40, marginTop: 10 }}>
            <TouchableOpacity
              style={[defaultStyles.btn, { marginVertical: 8, flexDirection: 'row', alignItems: 'center', justifyContent: "center" }]}
              // onPress={}
              disabled={this.state.uploading}
              onPress={this.handleSubmit}
            >
              <Ionicons name="checkmark" color={"#fff"} size={20} />
              <Text style={{ fontFamily: 'mon-sb', color: '#fff', fontSize: 16 }}> Submit & Publish</Text>
            </TouchableOpacity>
          </View>
          {/* <StatusBar barStyle="default" /> */}
        </ScrollView>
      </LinearGradient>
    );
  }

  _maybeRenderUploadingOverlay = () => {
    if (this.state.uploading) {
      return (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: "rgba(255,255,255,0.7)",
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <ActivityIndicator color={Colors.primary} animating size="large" />
          <Text style={{ fontFamily: 'mon-sb' }}>Uploading image</Text>
        </View>
      );
    }
  };

  _maybeRenderImage = () => {
    let { image } = this.state;
    if (!image) {
      return;
    }

    return (
      <View
        style={{
          marginTop: 30,
          width: 250,
          borderRadius: 3,
          elevation: 2,
        }}
      >
        <View
          style={{
            borderTopRightRadius: 3,
            borderTopLeftRadius: 3,
            shadowColor: "rgba(0,0,0,1)",
            shadowOpacity: 0.2,
            shadowOffset: { width: 4, height: 4 },
            shadowRadius: 5,
            overflow: "hidden",
          }}
        >
          <TouchableOpacity onPress={() => this._takePhoto()}>

            <Image
              source={{ uri: image }}
              style={{ width: "100%", height: 200, borderRadius: 10 }}
              resizeMode='contain'
            />
          </TouchableOpacity>

        </View>

      </View>
    );
  };

  _renderInputs = () => {
    // console.log("HERERERERER: ", this.inputs)
    return (this.inputs.map((input, key) => (
      <View key={key} style={{ height: 80, flexDirection: 'row', gap: 4, alignItems: 'center', justifyContent: 'center' }}>
        <FormField
          // key={key}
          title={`Item ${key + 1}`}
          value={input.value.name}
          placeholder={''}
          handleChangeText={(e: any) => {
            this.inputHandler(key, e)
          }}
          otherStyles={{ flexGrow: 1 }}
        />
        <FormField
          // key={key}
          title={"quantity"}
          value={input.value.quantity}
          placeholder={``}
          handleChangeText={(e: any) => {
            this.inputHandler(key, undefined, e)
          }}
          otherStyles={{}}
        />

        <View style={{ paddingTop: 35 }}>
          <TouchableOpacity style={{ borderRadius: 50 }} onPress={() => this.deleteHandler(key)}>
            <Ionicons name='close' size={25} color={Colors.primaryMuted} />
          </TouchableOpacity>
        </View>
      </View>
    )))
  }

  _takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    this._handleImagePicked(pickerResult);
  };

  _pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log({ pickerResult });

    this._handleImagePicked(pickerResult);
  };

  _handleImagePicked = async (pickerResult: any) => {
    try {
      this.setState({ uploading: true });

      if (!pickerResult.cancelled) {
        // console.log("hgfhgfhgfhgfhgf: "+pickerResult.assets[0].uri)
        // const uploadUrl = await uploadImageAsync(pickerResult.assets[0].uri);
        this.setState({ image: pickerResult.assets[0].uri });
      }
    } catch (e) {
      console.log(e);
      Toast.show({
        type: 'info',
        text1: "Canceled",
        text2: "Please pick and image or take a photo"
      })
    } finally {
      this.setState({ uploading: false });
    }
  };

  _uploadImagePicked = async (uri: any) => {
    try {
      this.setState({ uploading: true });

      // console.log("hgfhgfhgfhgfhgf: "+pickerResult.assets[0].uri)
      const uploadUrl = await uploadImageAsync(uri);
      this.setState({ image: uploadUrl });

    } catch (e) {
      console.log(e);
      Toast.show({
        type: 'error',
        text1: "Error",
        text2: "Upload failed"
      })
    } finally {
      this.setState({ uploading: false });
    }
  };

  _deleteImage = async (pickerResult: any) => {
    const storageRef = getStorage(); // Assuming you have initialized Firebase
    const imagePath = "userImages/my-image.jpg";
    try {
      this.setState({ uploading: true });

      if (!pickerResult.cancelled) {
        // console.log("hgfhgfhgfhgfhgf: "+pickerResult.assets[0].uri)
        const uploadUrl = await uploadImageAsync(pickerResult.assets[0].uri);
        this.setState({ image: uploadUrl });
      }
    } catch (e) {
      console.log(e);
      Toast.show({
        type: 'error',
        text1: "Error",
        text2: "Upload failed"
      })
    } finally {
      this.setState({ uploading: false });
    }
  };


}
export default withRouter(App)

async function uploadImageAsync(uri: string) {
  // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  console.log("URI: " + uri)
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
  }) as any;

  const fileRef = ref(getStorage(), uuid());
  const result = await uploadBytes(fileRef, blob);
  // console.log(JSON.stringify(result))
  // We're done with the blob, close and release it
  blob.close();
  const downloadurl = await getDownloadURL(fileRef);
  // console.log(JSON.stringify(downloadurl))

  return downloadurl

}



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  infoContainer: {
    padding: 24,
  },
  name: {
    fontSize: 20,
    // fontWeight: 'bold',
    fontFamily: 'mon-b',
  },
  location: {
    fontSize: 18,
    marginTop: 10,
    fontFamily: 'mon-sb',
  },
  rooms: {
    fontSize: 16,
    color: Colors.gray,
    marginVertical: 8,
    fontFamily: 'mon',
  },
  ratings: {
    fontSize: 16,
    fontFamily: 'mon-sb',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.lightGray,
    marginVertical: 8
  },
  dividerVertical: {
    width: StyleSheet.hairlineWidth,
    height: 10,
    backgroundColor: Colors.gray,
    marginHorizontal: 6,
  },
  host: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: Colors.gray,
  },
  hostView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    padding: 8,
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: Colors.lightGray
  },
  footerText: {
    height: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerPrice: {
    fontSize: 18,
    fontFamily: 'mon-sb',
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    color: Colors.primary,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  header: {
    // backgroundColor: '#fff',
    height: 100,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.gray,
  },

  description: {
    fontSize: 16,
    marginTop: 10,
    fontFamily: 'mon',
  },
});
