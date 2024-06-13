import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TextInput,
} from 'react-native';

import PhoneInput, {
  ICountry,
} from 'react-native-international-phone-number';
import { useAuth } from './context/AuthContext';
import Toast from 'react-native-toast-message';

const Page = () => {
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 80 : 0
  const router = useRouter()
  const { onLogin, onRegister } = useAuth()

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

  const handleLogin = async () => {
    setIsLoading(true);

    const phoneNumberWithSpaces = `${selectedCountry?.callingCode + phoneNumber}`
    const trimmedPhoneNumber = phoneNumberWithSpaces.replace(/\s/g, "");
    const result = await onLogin!(trimmedPhoneNumber, password)

    // console.log(JSON.stringify(result))
    setIsLoading(false);
    setPhoneNumber("");
    setPassword("");

    if (result.success === "true") {
      if (JSON.parse(Buffer.from(result.token.split('.')[1], 'base64').toString()).phone_number_veified == false) {
        router.push({
          pathname: '/verify/[phone]',
          params: { phone: trimmedPhoneNumber, signin: 'true' },
        });
      }
    } else if(result.error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: "Something went wrong, please try again",
        visibilityTime: 1500
      });
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
          Enter your phone number and password to login to your account
        </Text>

        <View style={{ width: '100%', flexDirection: 'column', alignItems: 'flex-start', gap: 15, marginVertical: 30 }}>
          <Text style={{ fontFamily: 'mon' }}>Phone number</Text>

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
            value={phoneNumber}
            defaultCountry="ET"
            onChangePhoneNumber={handlephoneNumber}
            selectedCountry={selectedCountry}
            onChangeSelectedCountry={handleSelectedCountry}
          />
          <Text style={{ fontFamily: 'mon' }}>Password</Text>
          <TextInput style={{
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: Colors.lightGray,
            color: Colors.dark,
            width: '100%',
            height: 50,
            paddingLeft: 16,
            borderRadius: 8
          }}
            value={password}
            contextMenuHidden={true}
            secureTextEntry={true}
            placeholderTextColor={'#aaa'}
            placeholder='Password'
            onChangeText={handlePassword}
          />

        </View>

        <TouchableOpacity
          disabled={isLoading}
          style={[
            defaultStyles.btn,
            phoneNumber !== '' ? styles.enabled : styles.disabled,
            { marginBottom: 20 },
          ]}
          onPress={handleLogin}>
          {isLoading ? (<ActivityIndicator size={24} color={'#fff'} />) : (<Text style={defaultStyles.buttonText}>Continue</Text>)}

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
            },
          ]}>
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
