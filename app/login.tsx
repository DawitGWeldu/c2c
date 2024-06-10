import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { isClerkAPIResponseError, useSignIn } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import axios from 'axios';

const baseUrl = 'http://localhost:5000';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';

import PhoneInput, {
  ICountry,
} from 'react-native-international-phone-number';
import { useAuth } from './context/AuthContext';


const Page = () => {
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 80 : 0
  const router = useRouter()
  const { onLogin } = useAuth()

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

  const onSignIn = async () => {
    setIsLoading(true);

    try {
      const result = await onLogin!(phoneNumber, password)
      console.log(result)
      // if (result.status === 200) {
      //   setIsLoading(false);
      //   setPhoneNumber("");
      //   setPassword("");
      // }
    } catch (error) {
      alert("An error has occurred");
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}>
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={defaultStyles.header}>Welcome</Text>
        <Text style={defaultStyles.descriptionText}>
          Enter your phone number to login to your account
        </Text>
        {/* <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => {
              toggleBottomSheet();
            }} style={[styles.input, { width: 60, flexDirection: 'row', alignItems: 'center', gap: 4 }]}>
              <Ionicons name='flag' size={25} />
              <Ionicons name='chevron-down' />
            </TouchableOpacity>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <TextInput
                style={{
                  backgroundColor: Colors.lightGray,
                  padding: 10,
                  paddingRight: 0,
                  borderRightColor: Colors.gray,
                  borderTopLeftRadius: 10,
                  borderBottomLeftRadius: 10,
                  fontSize: 16,
                  width: 50,
                  color: Colors.gray
                }}
                value={countryCode}
                editable={false}
              />
              <TextInput
                style={{
                  backgroundColor: Colors.lightGray,
                  padding: 14,
                  flex: 1,
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                  fontSize: 16,
                }}
                placeholder="Mobile number"
                placeholderTextColor={Colors.gray}
                keyboardType="numeric"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>
          </View> */}

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
          disabled={isLoading}
          style={[
            defaultStyles.btn,
            phoneNumber !== '' ? styles.enabled : styles.disabled,
            { marginBottom: 20 },
          ]}
          onPress={() => onSignIn()}>
          {isLoading ? (<ActivityIndicator />) : (<Text style={defaultStyles.buttonText}>Continue</Text>)}

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


        <TouchableOpacity
          onPress={() => {
            router.navigate('/signup')
          }}
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
          <Ionicons name="lock-open" size={22} color={'#000'} />
          <Text style={[defaultStyles.buttonText, { color: '#000' }]}>Don't have an account? Register</Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>

  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
