import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { v4 as uuid } from "uuid";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';

import PhoneInput, {
  ICountry,
} from 'react-native-international-phone-number';
import { useAuth } from './context/AuthContext';
import { Buffer } from 'buffer';
import * as DocumentPicker from "expo-document-picker";
import Toast from 'react-native-toast-message';

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { ScrollView } from 'react-native-gesture-handler';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


const imgDir = FileSystem.documentDirectory + 'images/';

const ensureDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(imgDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true });
  }
};


const Page = () => {


  const keyboardVerticalOffset = Platform.OS === 'ios' ? 80 : 0;
  const router = useRouter();

  const { onRegister } = useAuth()

  const [selectedCountry, setSelectedCountry] = useState<
    undefined | ICountry
  >(undefined);
  const [form, setForm] = useState<any>({
    name: "",
    phoneNumber: "",
    password: "",
    idPhoto: null
  });
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);





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
          <View style={{ flexDirection: 'column', gap: 16 }}>
            <ActivityIndicator color={Colors.primary} animating size="large" />
            <Text style={{ fontFamily: 'mon-sb' }}>Creating your account</Text>
            {/* <TouchableOpacity style={[defaultStyles.btn, { backgroundColor: Colors.lightGray }]}><Text style={{ fontFamily: 'mon-sb' }}>Cancel</Text></TouchableOpacity> */}
          </View>

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




  function handlephoneNumber(phoneNumber: string) {
    setPhoneNumber(phoneNumber);
  }

  function handlePassword(password: string) {
    setPassword(password);
  }
  function handleName(name: string) {
    setName(name);
  }

  function handleSelectedCountry(country: ICountry) {
    setSelectedCountry(country);
  }

  const clearForm = () => {
    setPhoneNumber("");
    setPassword("");
    setName("");
  }
  const handleRegister = async () => {
    try {
      await _uploadImagePicked(image)
      setSubmitting(true)
      const phoneNumberWithSpaces = `${selectedCountry?.callingCode + phoneNumber}`
      const trimmedPhoneNumber = phoneNumberWithSpaces.replace(/\s/g, "");
      // console.log("here: " + trimmedPhoneNumber + " " + password + " ---- " + JSON.stringify(result))

      const result = await onRegister!(name, trimmedPhoneNumber, password, image)


      setSubmitting(false)
      clearForm()

      if (JSON.parse(Buffer.from(result.token.split('.')[1], 'base64').toString()).phone_number_veified == false) {
        router.replace({
          pathname: '/verify/[phone]',
          params: { phone: trimmedPhoneNumber, signin: 'true' },
        });
      }

    } catch (e) {
      console.log("Signup error: " + e)
      // alert("An error has occurred");
      setIsLoading(false);
      clearForm()
    }
  };


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}>

      <ScrollView style={{ flex: 1, padding: 10, paddingHorizontal: 20 }}>
        {/* <View style={[defaultStyles.container, { padding: 20, paddingHorizontal: 20 }]}> */}
        <Text style={defaultStyles.header}>Create an account</Text>
        <Text style={defaultStyles.descriptionText}>
          After filling out the form you will recieve a confirmation code to verify your phone number
        </Text>



        <View style={{ width: '100%', flexDirection: 'column', gap: 8, marginTop: 10 }}>
          <Text style={{ color: Colors.dark, fontFamily: "mon" }}>
            Name
          </Text>
          <TextInput
            placeholderTextColor={Colors.lightGray}
            style={{
              backgroundColor: "#fff",
              borderWidth: 1,
              borderColor: Colors.lightGray,
              color: Colors.dark,
              width: '100%',
              padding: 8,
              paddingLeft: 16,
              borderRadius: 8,
            }}
            value={form.name}
            placeholder='Enter you name'
            onChangeText={handleName}
          />
          <Text style={{ color: Colors.dark, fontFamily: "mon" }}>
            Phone number
          </Text>
          <PhoneInput
            placeholder="Enter phone"
            phoneInputStyles={{
              container: {
                backgroundColor: "#fff",
                borderWidth: 1,
                borderColor: Colors.lightGray,
              },
              flagContainer: {
                borderTopLeftRadius: 7,
                borderBottomLeftRadius: 7,
                backgroundColor: Colors.lightGray,
                justifyContent: 'center',
              },
              flag: {},
              caret: {
                color: '#F3F3F3',
                fontSize: 16,
              },
              divider: {
                width: 1,
                backgroundColor: Colors.dark,
              },
              callingCode: {
                fontSize: 16,
                color: Colors.dark,
              },
              input: {
                color: Colors.dark,
              },
            }}
            modalStyles={{
              modal: {
                backgroundColor: Colors.lightGray,
                borderWidth: 1,
              },
              divider: {
                backgroundColor: 'transparent',
              },
              searchInput: {
                borderWidth: 0,
                borderBottomWidth: 2,
                borderColor: '#222',
                color: Colors.dark,
                backgroundColor: Colors.lightGray,
                paddingHorizontal: 12,
                height: 46,
              },
              countryButton: {
                backgroundColor: Colors.gray,
                marginVertical: 4,
              },
              noCountryText: {},
              noCountryContainer: {},
              flag: {
                color: '#FFFFFF',
                fontSize: 20,
              },
              callingCode: {
                color: '#F3F3F3',
              },
              countryName: {
                color: '#F3F3F3',
              },
            }}
            customCaret={<Ionicons name="chevron-down" size={16} color="#000000" />}
            // defaultValue="+251994697123"
            value={phoneNumber}
            defaultCountry="ET"
            onChangePhoneNumber={handlephoneNumber}
            selectedCountry={selectedCountry}
            onChangeSelectedCountry={handleSelectedCountry}
          />
          <Text style={{ color: Colors.dark, fontFamily: "mon" }}>
            Password
          </Text>
          <TextInput style={{
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: Colors.lightGray,
            color: Colors.dark,
            width: '100%',
            padding: 8,
            paddingLeft: 16,
            borderRadius: 8,
          }}
            secureTextEntry={true}
            value={password}
            placeholder='Enter your password'
            placeholderTextColor={Colors.lightGray}
            onChangeText={handlePassword}
          />

          <View style={{ flexDirection: 'column', gap: 2 }}>
            <Text style={{ color: Colors.dark, fontFamily: "mon", marginBottom: 10 }}>
              Upload a picture of your National ID or Passport
            </Text>

            <View style={{ height: 200, backgroundColor: Colors.lightGray, borderRadius: 10, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              {image ? (
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
              {image && (
                <TouchableOpacity style={{ width: '100%', alignItems: 'center', borderBottomLeftRadius: 10, borderBottomRightRadius: 10, justifyContent: 'center', position: 'absolute', left: 0, bottom: 0, zIndex: 1, height: 50, backgroundColor: 'rgba(0, 0, 0, 0.2)' }} onPress={() => setImage("")}>
                  <Ionicons name="close" size={32} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
            {/* {this._maybeRenderImage()} */}
          </View>

        </View>


        <TouchableOpacity
          disabled={isLoading || phoneNumber == ""}
          style={[
            defaultStyles.btn,
            (phoneNumber !== '' ? styles.enabled : styles.disabled),
            { marginTop: 16, marginBottom: 30, },
          ]}
          onPress={handleRegister}>
          {isLoading ? (<ActivityIndicator size={24} color={'#fff'} />) : (<Text style={defaultStyles.buttonText}>Sign up</Text>)}
        </TouchableOpacity>

        <View style={{ flex: 1 }} />
        {/* </View> */}
      </ScrollView>
      {_maybeRenderUploadingOverlay()}

    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 26,
  },
  inputContainer: {
    marginVertical: 40,
    flexDirection: 'row',
  },
  input: {
    backgroundColor: Colors.lightGray,
    padding: 10,
    borderRadius: 10,
    fontSize: 16,
    marginRight: 10,
  },
  enabled: {
    backgroundColor: Colors.primary,
  },
  disabled: {
    backgroundColor: Colors.primaryMuted,
  },
  dividerVertical: {
    width: StyleSheet.hairlineWidth,
    height: 20,
    backgroundColor: Colors.gray,
    marginHorizontal: 6,
  },
});
export default Page;
