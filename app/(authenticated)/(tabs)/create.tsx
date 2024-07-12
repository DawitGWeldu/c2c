import { Link, useLocalSearchParams, useRouter } from 'expo-router';

import * as ImagePicker from "expo-image-picker";
import { Buffer } from 'buffer';
import { getApps, initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import React from "react";
import * as Location from 'expo-location';
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
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { defaultStyles } from "@/constants/Styles";
import { Handle } from "tamagui";
import { ScrollView } from "react-native-gesture-handler";
import PhoneInput, {
  ICountry,
} from 'react-native-international-phone-number';
import axios from "axios";
import { API_URL, AuthContext } from "@/app/context/AuthContext";
import BottomSheet, { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker } from 'react-native-maps';





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
  bottomSheetModalRef
  mapRef
  placesRef
  constructor(props: any) {
    super(props);
    this.mapRef = React.createRef()
    this.placesRef = React.createRef()
    this.bottomSheetModalRef = React.createRef();
    this.state = {
      image: "",
      uploading: false,
      form: {
        title: "",
        description: '',
        price: '',
        weight: "",
        destination: undefined,
        destinationCountry: null as (ICountry | null),
        destinationPhoneNumber: "",
        origin: undefined,
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
      initialRegion: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      selectedLocation: undefined,
      errors: [{
        input: null,
        msg: null
      }],
      submitting: false
    };
  }
  handleSheetChanges = (index: any) => {
    this.setState({ selectedLocation: null })
    console.log(this.state)

    // this.bottomSheetModalRef.current.present()
  };

  state = {
    image: "",
    uploading: false,
    form: {
      title: "",
      description: '',
      price: '',
      weight: "",
      destination: undefined,
      destinationCountry: null as (ICountry | null),
      destinationPhoneNumber: "",
      origin: undefined,
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
    initialRegion: {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    selectedLocation: undefined,
    errors: [{
      input: null,
      msg: null
    }],
    submitting: false
  };



  handlePickLocation = async (input: string) => {

    this.setState({ submitting: true })
    try {
      if (1 == 1) {
        console.log("INPUT: ", input)
        if (input == 'from') {
          this.setState(prevState => ({
            form: {                   // object that we want to update
              // @ts-ignore
              ...prevState.form,
              origin: this.state.selectedLocation       // update the value of specific key
            }
          }))
        } else if (input == 'to') {
          this.setState(prevState => ({
            form: {                   // object that we want to update
              // @ts-ignore
              ...prevState.form,
              destination: this.state.selectedLocation       // update the value of specific key
            }
          }))
        }
        this.bottomSheetModalRef.current.dismiss()
      }
    } catch (e) {
      console.log("error", e)
    }

    this.setState({ submitting: false })

    // try {
    //   const { data } = await axios.post(`${API_URL}/payment/addpayment`)

    //   // console.log("Payment Saved",JSON.stringify(data))

    //   if (data.success) {

    //     router.replace('/(authenticated)/(tabs)/myposts')
    //     Toast.show({
    //       type: 'success',
    //       text1: "Success",
    //       text2: "Payment info uploaded"
    //     })
    //   }
    //   setSubmitting(false)

    // } catch (error) {
    //   Toast.show({
    //     type: 'error',
    //     text1: "Error",
    //     text2: "Something went wrong"
    //   })
    //   console.log(JSON.stringify(error))
    //   setSubmitting(false)

    // } finally {
    //   setSubmitting(false)
    // }

  }


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


  handleLocationSelect = (details: any) => {
    console.log("DETAILS: ", { lat: details.geometry.location.lat, lng: details.geometry.location.lng, name: details.name })
    // Focus the map on the selected region
    this.mapRef.current.animateToRegion({
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }, 1000);

    this.setState(prevState => ({
      selectedLocation: {                   // object that we want to update
        // @ts-ignore
        ...prevState.selectedLocation,
        lat: details.geometry.location.lat,
        lng: details.geometry.location.lng,
        name: details.name        // update the value of specific key

      }
    }))
  };

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
    } catch(e) {
      console.log("error: ",e)
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
    const getCurrentLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          this.setState({
            initialRegion: {
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }
          })
          return;
        }

        const { coords } = await Location.getCurrentPositionAsync({});
        this.setState({
          initialRegion: {
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }
        })

      } catch (error) {
        console.log('Error getting current location:', error);
        this.setState({
          initialRegion: {
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }
        })

      }
    };

    getCurrentLocation();
    //@ts-ignore
    // if (this.state.selectedLocation) {
    //   console.log("this.state.selectedLocation: ", this.state.selectedLocation)

    //   // const parsed = JSON.parse(this.props.selectedLocation)
    //   //@ts-ignore
    //   // if (this.props.input == 'from') {
    //   // console.log("this.props.selectedLocation: ", this.props.selectedLocation)
    //   // console.log("this.state.form.origin: ", this.state.form.origin)

    //   if (this.props.selectedLocation != this.state.form.origin) {
    //     const updatedForm = { ...this.state.form, destination: parsed };
    //     this.setState({ form: updatedForm });

    //     // console.log("HEREE: ", this.state.form.origin, this.state.form.destination)

    //   }


    //   // } else if (this.props.input == 'to') {
    //   //   if (this.props.selectedLocation != this.state.form.destination) {

    //   //     const updatedForm = { ...this.state.form, destination: parsed };
    //   //     this.setState({ form: updatedForm });
    //   //   }
    //   // }

    // }
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
            otherStyles={{ marginVertical: 16 }}
          />

          <View style={[{ flexDirection: 'column', paddingTop: 10, gap: 10 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <MaterialIcons name='flight-takeoff' size={20} />
              <Text style={{ color: Colors.dark, fontFamily: 'mon-sb' }}>From</Text>
            </View>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => {
              //@ts-ignore
              this.bottomSheetModalRef.current.present({ input: 'from' })
            }}>

              <View style={{ height: 50, paddingHorizontal: 12, backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: Colors.lightGray, flex: 1, flexDirection: 'row', alignItems: 'center' }}>

                {this.state.form.origin ?
                  <Text style={[(this.state.form.origin ? { color: '#000' } : { color: '#aaa' }), { fontFamily: 'mon-sb' }]}>{this.state.form.origin?.name}</Text>
                  :
                  <>
                    <Ionicons name='locate' size={20} style={{ color: '#aaa', marginRight: 8 }} />
                    <Text style={{ color: '#aaa', fontFamily: 'mon-sb' }}>Select location from map</Text>
                  </>
                }

              </View>
            </TouchableOpacity>
          </View>

          <Text style={{ fontFamily: 'mon-sb', marginVertical: 16 }}>Contact number</Text>
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
          <View style={[defaultStyles.separator, { width: '100%', flex: 1, backgroundColor: Colors.primary, marginTop: 16 }]}></View>

          <View style={[{ flexDirection: 'column', paddingTop: 10, gap: 10 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <MaterialIcons name='flight-land' size={20} />
              <Text style={{ color: Colors.dark, fontFamily: 'mon-sb' }}>To</Text>
            </View>
            <TouchableOpacity onPress={() => {
              //@ts-ignore
              this.bottomSheetModalRef.current.present({ input: 'to' })
            }}>

              <View style={{ height: 50, paddingHorizontal: 12, backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: Colors.lightGray, flex: 1, flexDirection: 'row', alignItems: 'center' }}>

                {this.state.form.destination ?
                  <Text style={[(this.state.form.origin ? { color: '#000' } : { color: '#aaa' }), { fontFamily: 'mon-sb' }]}>{this.state.form.destination?.name}</Text>
                  :
                  <>
                    <Ionicons name='locate' size={20} style={{ color: '#aaa', marginRight: 8 }} />
                    <Text style={{ color: '#aaa', fontFamily: 'mon-sb' }}>Select location from map</Text>
                  </>
                }

              </View>
            </TouchableOpacity>
          </View>

          <Text style={{ fontFamily: 'mon-sb', marginVertical: 16 }}>Contact number</Text>

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
            otherStyles={{ marginVertical: 16 }}
          />

          <View style={{ marginBottom: 40, marginTop: 10 }}>
            <TouchableOpacity
              style={[defaultStyles.btn, (this.state.uploading && {backgroundColor: Colors.primaryMuted}) , { marginVertical: 8, flexDirection: 'row', alignItems: 'center', justifyContent: "center" }]}
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
        <View style={styles.container}>

          <BottomSheetModal
            index={0}
            enableDismissOnClose
            enableContentPanningGesture={false}
            enablePanDownToClose
            ref={this.bottomSheetModalRef}
            snapPoints={['60%']}
            onChange={this.handleSheetChanges}
            backdropComponent={({ style }) => (
              <View style={[style, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]} />
            )}
          >
            {(presentData: any) => (
              <BottomSheetView>

                <View style={{ paddingTop: 0 }}>

                  <MapView style={{
                    width: '100%',
                    height: '100%',
                  }}
                    ref={this.mapRef}
                    initialRegion={this.state.initialRegion}

                  >
                    {this.state.selectedLocation && (
                      <Marker
                        coordinate={{
                          latitude: this.state.selectedLocation.lat,
                          longitude: this.state.selectedLocation.lng,
                        }}
                        title={this.state.selectedLocation.name}
                      />
                    )}
                  </MapView>
                  <View style={{ position: 'absolute', top: 30, width: "100%", paddingHorizontal: 16 }}>
                    <GooglePlacesAutocomplete
                      currentLocation
                      enablePoweredByContainer={false}
                      currentLocationLabel="Your current location"
                      keyboardShouldPersistTaps='handled'
                      placeholder='Search for a location...'
                      fetchDetails
                      onPress={(data, details) => {
                        this.handleLocationSelect(details)
                      }}
                      onFail={error =>
                        <View style={{ flex: 1, backgroundColor: '#fff', padding: 10, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
                          <Text>Search failed, try again.</Text>
                        </View>
                      }
                      onNotFound={() =>
                        <View style={{ flex: 1, backgroundColor: '#fff', padding: 10, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
                          <Text>No results were found</Text>
                        </View>
                      }
                      query={{
                        key: 'AIzaSyAwKog5CijtSrF54wB8njIpZccR4YhjxXk',
                        language: 'en',
                      }}
                      listEmptyComponent={
                        <View style={{ flex: 1, backgroundColor: '#fff', padding: 10, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
                          <Text>No results were found</Text>
                        </View>
                      }
                      ref={this.placesRef}

                      styles={{
                        container: {
                          flex: 0,
                        },
                        listView: {
                          backgroundColor: 'white',
                          borderWidth: StyleSheet.hairlineWidth,
                          borderColor: '#ccc',
                          borderRadius: 8,
                          maxHeight: 283,
                        },
                        row: {
                          borderRadius: 8,
                        },
                        textInput: {
                          height: 50,
                          borderRadius: 8,
                          borderWidth: StyleSheet.hairlineWidth,
                          borderBlockColor: '#ccc',
                          fontSize: 16,
                        },
                      }}
                    />

                  </View>

                  {this.state.selectedLocation &&
                    <View style={[defaultStyles.footer, { height: 130 }]}>
                      <View
                        style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly', gap: 16 }}>
                        {/*@ts-ignore */}
                        {this.state.selectedLocation && <Text style={{ fontFamily: 'mon-sb', color: '#000' }}>{this.state.selectedLocation.name}</Text>}

                        <TouchableOpacity
                          style={[this.state.selectedLocation == null || this.state.submitting ? [defaultStyles.btn, { backgroundColor: Colors.primaryMuted }] : defaultStyles.btn, { paddingRight: 20, paddingLeft: 50 }]}
                          disabled={this.state.selectedLocation == null || this.state.submitting}
                          onPress={() => this.handlePickLocation(presentData?.data.input)}>
                          <Ionicons
                            name="locate"
                            size={24}
                            style={defaultStyles.btnIcon}
                            color={'#fff'}
                          />
                          <Text style={defaultStyles.btnText}>Select Location</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  }
                </View>

              </BottomSheetView>

            )}

          </BottomSheetModal>
        </View>
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
    height: 1,
    backgroundColor: Colors.lightGray,
    marginVertical: 8
  },
  dividerVertical: {
    width: 1,
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
    borderBottomWidth: 1,
    borderColor: Colors.gray,
  },

  description: {
    fontSize: 16,
    marginTop: 10,
    fontFamily: 'mon',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});
