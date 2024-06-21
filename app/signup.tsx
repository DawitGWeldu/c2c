import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
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




const Page = () => {
  const [form, setForm] = useState<any>({
    name: "",
    phoneNumber: "",
    password: "",
    idPhoto: null
  });


  const openPicker = async (selectType: any) => {
    const result = await DocumentPicker.getDocumentAsync({
      type:
        selectType === "image"
          ? ["image/png", "image/jpg"]
          : ["video/mp4", "video/gif"],
    });

    if (!result.canceled) {
      if (selectType === "image") {
        setForm({
          ...form,
          idPhoto: result.assets[0],
        });
      }
    } else {
      setTimeout(() => {
        Toast.show({
          type: 'info',
          text1: "Document picked",
          text2: JSON.stringify(result, null, 2)
        });
      }, 100);
    }
  };


  const keyboardVerticalOffset = Platform.OS === 'ios' ? 80 : 0;
  const router = useRouter();

  const { onRegister } = useAuth()

  const [selectedCountry, setSelectedCountry] = useState<
    undefined | ICountry
  >(undefined);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  function handlephoneNumber(phoneNumber: string) {
    setPhoneNumber(phoneNumber);
  }

  function handlePassword(password: string) {
    setPassword(password);
  }

  function handleSelectedCountry(country: ICountry) {
    setSelectedCountry(country);
  }

  const handleRegister = async () => {
    setIsLoading(true);

    try {
      setIsLoading(true);

      const phoneNumberWithSpaces = `${selectedCountry?.callingCode + phoneNumber}`
      const trimmedPhoneNumber = phoneNumberWithSpaces.replace(/\s/g, "");
      // console.log("here: " + trimmedPhoneNumber + " " + password + " ---- " + JSON.stringify(result))

      const result = await onRegister!("Dave", trimmedPhoneNumber, password)


      setIsLoading(false);
      setPhoneNumber("");
      setPassword("");

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
      setPhoneNumber("");
      setPassword("");
    }
  };


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}>
      <View style={[defaultStyles.container, { padding: 20, paddingHorizontal: 20 }]}>
        <Text style={defaultStyles.header}>Create an account</Text>
        <Text style={defaultStyles.descriptionText}>
          After filling out the form and you will recieve a confirmation code to verify your phone number
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
            onChangeText={(e: any) => setForm({ ...form, name: e })}
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

          {/* <View style={{ width: '100%', flexDirection: 'column', gap: 8 }}>
            <Text style={{ color: Colors.dark, fontFamily: "mon" }}>
              Upload your ID
            </Text>

            <TouchableOpacity onPress={() => openPicker("image")}>
              {form.idPhoto ? (
                <Image
                  source={{ uri: form.idPhoto.uri }}
                  style={{ width: '100%', height: 64, borderRadius: 8 }}
                  resizeMode={'cover'}
                />
              ) : (
                <View style={{ height: 150, width: '100%', paddingHorizontal: 4, backgroundColor: Colors.lightGray, borderRadius: 10, borderColor: Colors.primary, justifyContent: 'center', alignItems: 'center' }}>
                  <View style={{ borderStyle: 'dashed', borderWidth: 1, borderRadius: 8, borderColor: Colors.primary, width: 100, height: 100, justifyContent: 'center', alignItems: 'center' }}>
                    <Ionicons
                      name='cloud-upload-outline'
                      color={Colors.gray}

                      size={50}
                    // alt="upload"
                    // style={{ width: "50%", alignItems: 'center', height: "50%"}}
                    />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View> */}

        </View>


        <TouchableOpacity
          disabled={isLoading || phoneNumber == ""}
          style={[
            defaultStyles.btn,
            (phoneNumber !== '' ? styles.enabled : styles.disabled),
            { marginVertical: 10 },
          ]}
          onPress={handleRegister}>
          {isLoading ? (<ActivityIndicator size={24} color={'#fff'} />) : (<Text style={defaultStyles.buttonText}>Sign up</Text>)}
        </TouchableOpacity>

        <View style={{ flex: 1 }} />
      </View>
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
});
export default Page;
