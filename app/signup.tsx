import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { useSignUp } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import { Link, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import PhoneInput, {
  ICountry,
} from 'react-native-international-phone-number';
import { useAuth } from './context/AuthContext';
import axios from 'axios'


const Page = () => {
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

  function handleSelectedCountry(country: ICountry) {
    setSelectedCountry(country);
  }

  const handleRegister = async () => {
    setIsLoading(true);

    try {
      const phoneNumberWithSpaces = `${selectedCountry?.callingCode + phoneNumber}`
      const trimmedPhoneNumber = phoneNumberWithSpaces.replace(/\s/g, "");
      const result = await onRegister!('Dave', trimmedPhoneNumber, password)
      

      console.log("here: " + trimmedPhoneNumber + " " + password + " ---- " + JSON.stringify(result))
      setIsLoading(false);

      if (result.status === 200) {
        setPhoneNumber("");
        setPassword("");
      }
    } catch (e) {
      console.log(e)
      // alert("An error has occurred");
      setIsLoading(false);
    }
  };


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}>
      <View style={[defaultStyles.container, { padding: 20 }]}>
        <Text style={defaultStyles.header}>Create an account</Text>
        <Text style={defaultStyles.descriptionText}>
          Enter your phone number. We will send you a confirmation code there
        </Text>




        <View style={{ width: '100%', flexDirection: 'column', alignItems: 'center', gap: 8, marginVertical: 30 }}>
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
            placeholder='password'
            onChangeText={setPassword}
          />

        </View>


        <TouchableOpacity
          style={[
            defaultStyles.btn,
            phoneNumber !== '' ? styles.enabled : styles.disabled,
            { marginBottom: 20 },
          ]}
          onPress={handleRegister}>
          <Text style={defaultStyles.buttonText}>Sign up</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <View
            style={{ flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: Colors.gray }}
          />
          <Text style={{ color: Colors.gray, fontSize: 20 }}>or</Text>
          <View
            style={{ flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: Colors.gray }}
          />
        </View>


        <Link
          href={'/login'} replace asChild
          style={[
            defaultStyles.pillButton,
            {
              flexDirection: 'row',
              alignItems: 'center',
              gap: 16,
              marginTop: 20,
              backgroundColor: '#fff',
            },
          ]}>
          <TouchableOpacity>
            <Text style={[defaultStyles.buttonText, { color: '#000' }]}>Already have an account? Login</Text>
          </TouchableOpacity>
        </Link>


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
