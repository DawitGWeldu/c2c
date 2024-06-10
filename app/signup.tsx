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
const Page = () => {
  const [countryCode, setCountryCode] = useState('+251');
  const [countryFlag, setCountryFlag] = useState('ET');
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 80 : 0;
  const router = useRouter();

  const [selectedCountry, setSelectedCountry] = useState(0);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const { signUp } = useSignUp();



  const toggleBottomSheet = () => {
    if (bottomSheetOpen) {
      bottomSheetRef.current?.close();
      setBottomSheetOpen(false)

    } else {
      bottomSheetRef.current?.expand();
      setBottomSheetOpen(true)

    }
    console.log(bottomSheetOpen)

  }



  const onSignup = async () => {
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;

    try {
      await signUp!.create({
        phoneNumber: fullPhoneNumber,
      });
      signUp!.preparePhoneNumberVerification();

      router.push({ pathname: '/verify/[phone]', params: { phone: fullPhoneNumber } });
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  const Countries = [
    { flag: 'ET', code: '+251', name: 'Ethiopia' },
    { flag: 'US', code: '+1', name: 'United States' },
    { flag: 'UK', code: '+12', name: 'United Kingdom' },
  ]
  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={keyboardVerticalOffset}>
        <View style={[defaultStyles.container, { padding: 20 }]}>
          <Text style={defaultStyles.header}>Create an account</Text>
          <Text style={defaultStyles.descriptionText}>
            Enter your phone number. We will send you a confirmation code there
          </Text>
          <View style={styles.inputContainer}>
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
          </View>




          

          <TouchableOpacity
            style={[
              defaultStyles.btn,
              phoneNumber !== '' ? styles.enabled : styles.disabled,
              { marginBottom: 20 },
            ]}
            onPress={onSignup}>
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
      <BottomSheet
        index={-1}
        onClose={() => { setBottomSheetOpen(false) }}
        snapPoints={['60%']}
        ref={bottomSheetRef}
        enablePanDownToClose={true}
        handleIndicatorStyle={{ backgroundColor: Colors.dark }}
        style={styles.container}
      >
        <Text style={{ fontFamily: 'mon-sb', fontSize: 24 }}>Select your country</Text>

        <ScrollView style={{ gap: 20 }}>
          {Countries.map((item, index) => (
            <TouchableOpacity onPress={() => setSelectedCountry(index)} key={index}>
              <Text style={{ fontFamily: 'mon', paddingTop: 6 }}>{item.flag + " " + item.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </BottomSheet>
    </>
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
