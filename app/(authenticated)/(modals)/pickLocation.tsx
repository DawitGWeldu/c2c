import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, SafeAreaView } from 'react-native';
import { v4 as uuid } from "uuid";
import { getApps, initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { useRef, useState } from 'react';
import Animated, { FadeIn, FadeOut, SlideInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
// @ts-ignore
import DatePicker from 'react-native-modern-datepicker';
import { YStack } from 'tamagui'
import Toast from 'react-native-toast-message';
import { Double } from 'react-native/Libraries/Types/CodegenTypes';
import axios from 'axios';
import { API_URL } from '@/app/context/AuthContext';
import { GooglePlacesAutocomplete, GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete';
import MapView from 'react-native-maps';


const Page = () => {

  const handleSubmit = async () => {

    setSubmitting(true)
    try {
      console.log("Location picked")
    } catch {
      console.log("error")
    }
    setSubmitting(false)

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






  // const [paymentMethods, setPaymentMethods] = useState(paymentMethodss);

  const [submitting, setSubmitting] = useState(false);
  const [location, setLocation] = useState("");
  const placesRef = useRef<GooglePlacesAutocompleteRef | any>();
  return (
    <SafeAreaView>
      <View style={{ paddingTop: 0 }}>

        <MapView style={{
          width: '100%',
          height: '100%',
        }} />
        <View style={{ position: 'absolute', top: 100, width: "100%", paddingHorizontal: 16 }}>
          <GooglePlacesAutocomplete
            currentLocation={true}
            enablePoweredByContainer={false}

            currentLocationLabel="Your location" // add a simple label
            placeholder='Search'
            fetchDetails
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true
              console.log(details?.geometry);
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
            ref={placesRef}

          />

        </View>


        <View style={defaultStyles.footer}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

            <TouchableOpacity
              style={[location == '' || submitting ? [defaultStyles.btn, { backgroundColor: Colors.primaryMuted }] : defaultStyles.btn, { paddingRight: 20, paddingLeft: 50 }]}
              disabled={location == '' || submitting}
              onPress={handleSubmit}>
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    paddingTop: 80
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    margin: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    gap: 20,
  },
  cardHeader: {
    fontFamily: 'mon-b',
    fontSize: 24,
    padding: 20,
  },
  cardBody: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cardPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },

  searchSection: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ABABAB',
    borderRadius: 8,
    marginBottom: 16,
  },
  searchIcon: {
    padding: 10,
  },
  inputField: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  placesContainer: {
    flexDirection: 'row',
    gap: 25,
  },
  place: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  placeSelected: {
    borderColor: Colors.gray,
    borderWidth: 2,
    borderRadius: 10,
    width: 100,
    height: 100,
  },
  previewText: {
    fontFamily: 'mon-sb',
    fontSize: 14,
    color: Colors.gray,
  },
  previewdData: {
    fontFamily: 'mon-sb',
    fontSize: 14,
    color: Colors.dark,
  },

  guestItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  dividerVertical: {
    width: StyleSheet.hairlineWidth,
    height: 10,
    backgroundColor: Colors.gray,
    marginHorizontal: 6,
  },
  itemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.gray,
  },
});

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
export default Page;
