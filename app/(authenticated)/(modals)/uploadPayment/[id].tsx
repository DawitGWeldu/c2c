import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { v4 as uuid } from "uuid";
import { getApps, initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { useState } from 'react';
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


const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const paymentMethodss = [
  {
    name: 'Commercial Bank of Ethiopia',
    image: "https://play-lh.googleusercontent.com/kKGUk63iUIMXF-SL4AklHhZnQesw3-jZT2MR6NuX-xS54ncaZJ-8tlJETZdQYyZ5-g",
    account: "1000123456789"
  },
  {
    name: 'Bank of Abyssinia',
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7VOhUTHi6nFLUMa1yR8wV2-t46ZE4SHEmiQ&s",
    account: "111234567"
  }
];

const Page = () => {
  const _maybeRenderUploadingOverlay = () => {
    if (uploading || submitting) {
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



  const _takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    _handleImagePicked(pickerResult);
  };

  const _pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log({ pickerResult });

    _handleImagePicked(pickerResult);
  };

  const _handleImagePicked = async (pickerResult: any) => {
    try {
      setUploading(true);

      if (!pickerResult.cancelled) {
        // console.log("hgfhgfhgfhgfhgf: "+pickerResult.assets[0].uri)
        // const uploadUrl = await uploadImageAsync(pickerResult.assets[0].uri);
        setImage(pickerResult.assets[0].uri);
      }
    } catch (e) {
      console.log(e);
      Toast.show({
        type: 'info',
        text1: "Canceled",
        text2: "Please pick and image or take a photo"
      })
    } finally {
      setUploading(false);
    }
  };

  const _uploadImagePicked = async (uri: any) => {
    try {
      setUploading(true);

      const uploadUrl = await uploadImageAsync(uri);
      setImage(uploadUrl);


    } catch (e) {
      console.log(e);
      Toast.show({
        type: 'error',
        text1: "Error",
        text2: "Upload failed"
      })
    } finally {
      setUploading(false);
    }
  };




  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await _uploadImagePicked(image)
      //@ts-ignore
      let tab
      let payment = {
        user: user,
        listing: id,
        image: image,
        amount: "250",
        status: "pending",
        type: ""
      }
      if (type == "Flight") {
        payment.type = "Flight"
        tab = "1"
      } else if(type == "Task") {
        payment.type = "Task"
        tab = "2"
      } else {
        payment.type = "Listing"
        tab = "0"
      }
      const { data } = await axios.post(`${API_URL}/payment/addpayment`, payment)

      // console.log("Payment Saved",JSON.stringify(data))

      if (data.success) {

        router.replace({ pathname: '/(authenticated)/(tabs)/myposts', params: { tab: tab } })
        Toast.show({
          type: 'success',
          text1: "Success",
          text2: "Payment info uploaded"
        })
      }
      setSubmitting(false)

    } catch (error) {
      Toast.show({
        type: 'error',
        text1: "Error",
        text2: "Something went wrong"
      })
      console.log(JSON.stringify(error))
      setSubmitting(false)

    } finally {
      setSubmitting(false)
    }

  }






  // const [paymentMethods, setPaymentMethods] = useState(paymentMethodss);
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { id, user, type } = useLocalSearchParams<{ id: string, user: string, type: string }>()

  return (
    <View style={styles.container} >
      <ScrollView showsVerticalScrollIndicator style={{ flex: 1 }}>
        <View style={{ justifyContent: 'center', alignItems: "center" }}>

          <Text style={styles.cardHeader}>Post saved as draft</Text>
          <Text style={{ fontFamily: 'mon', fontSize: 16 }}>Complete the full payment of <Text style={{ fontWeight: 'bold' }}>100 ETB</Text> using one of the following payment methotds and upload the picture / screenshot to verify your post.</Text>
        </View>

        <View style={styles.cardBody}>
          {paymentMethodss.map((item, index) => (
            <View
              key={index}
              style={[
                styles.guestItem, { justifyContent: 'flex-start', gap: 16 }]}>
              <Image
                source={{ uri: item.image }}
                style={{ width: '16%', height: 80, borderRadius: 8 }}
                resizeMode={'contain'}
              />
              <View>
                <Text style={{ fontFamily: 'mon-sb', fontSize: 14 }}>{item.name}</Text>
                <Text style={{ fontFamily: 'mon', fontSize: 14, color: Colors.gray }}>
                  {item.account}
                </Text>
              </View>


            </View>
          ))}
        </View>

        <View style={{ marginTop: 16, marginBottom: 100, flexDirection: 'column', gap: 2 }}>
          <Text style={{ color: Colors.dark, fontFamily: "mon-sb", marginBottom: 10 }}>
            Upload a picture / screenshot of successful payment
          </Text>



          <View style={{ height: 200, backgroundColor: Colors.lightGray, borderRadius: 10, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {!!image ? (
              <Image
                source={{ uri: image }}
                style={{ width: "100%", height: 200, borderRadius: 10 }}
                resizeMode='contain'
              />
            ) : (
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => _takePhoto()} style={{ borderStyle: 'dashed', borderWidth: 1, borderRadius: 8, borderColor: Colors.primary, width: 100, height: 100, justifyContent: 'center', alignItems: 'center' }}>
                  <Ionicons
                    name='camera-outline'
                    size={50}
                  // alt="upload"
                  // style={{ width: "50%", alignItems: 'center', height: "50%"}}
                  />
                </TouchableOpacity>
                <View style={styles.dividerVertical} />
                <TouchableOpacity onPress={() => _pickImage()} style={{ borderStyle: 'dashed', borderWidth: 1, borderRadius: 8, borderColor: Colors.primary, width: 100, height: 100, justifyContent: 'center', alignItems: 'center' }}>
                  <Ionicons
                    name='cloud-upload-outline'
                    size={50}
                  // alt="upload"
                  // style={{ width: "50%", alignItems: 'center', height: "50%"}}
                  />
                </TouchableOpacity>
              </View>
            )}
            {_maybeRenderUploadingOverlay()}
            {image && (
              <TouchableOpacity style={{ width: '100%', alignItems: 'center', borderBottomLeftRadius: 10, borderBottomRightRadius: 10, justifyContent: 'center', position: 'absolute', left: -175, bottom: 0, zIndex: 1, height: 50, backgroundColor: 'rgba(0, 0, 0, 0.2)' }} onPress={() => setImage("")}>
                <Ionicons name="close" size={32} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
          {/* {this._maybeRenderImage()} */}
        </View>



      </ScrollView>
      {/* Footer */}
      <View style={defaultStyles.footer}>
        <View
          style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>


          <TouchableOpacity
            style={[image == '' || submitting ? [defaultStyles.btn, { backgroundColor: Colors.primaryMuted }] : defaultStyles.btn, { paddingRight: 20, paddingLeft: 50 }]}
            disabled={image == '' || submitting}
            onPress={handleSubmit}>
            <Ionicons
              name="cloud-upload"
              size={24}
              style={defaultStyles.btnIcon}
              color={'#fff'}
            />
            <Text style={defaultStyles.btnText}>Upload</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
