import Colors from '@/constants/Colors';
import { useOAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { View, StyleSheet, TextInput, Text, TouchableOpacity } from 'react-native';

import { defaultStyles } from '@/constants/Styles';
import { ScrollView } from 'react-native-gesture-handler';
import { useRef, useState } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

const Countries = [
  { flag: 'ET', code: '+251', name: 'Ethiopia' },
  { flag: 'US', code: '+1', name: 'United States' },
  { flag: 'UK', code: '+12', name: 'United Kingdom' },
]

const CountrySelectModal = () => {

  const [selectedCountry, setSelectedCountry] = useState(0);
  const bottomSheetRef = useRef<BottomSheet>(null);

  return (
    <BottomSheet snapPoints={['60%', '100%']} ref={bottomSheetRef}
      index={1}
      enablePanDownToClose={true}
      handleIndicatorStyle={{ backgroundColor: Colors.dark }} style={styles.container}>
      <TextInput
        autoCapitalize="none"
        placeholder="Email"
        style={[defaultStyles.inputField, { marginBottom: 30 }]}
      />

      <TouchableOpacity style={defaultStyles.btn}>
        <Text style={defaultStyles.btnText}>Continue</Text>
      </TouchableOpacity>

      <View style={styles.seperatorView}>
        <View
          style={{
            flex: 1,
            borderBottomColor: 'black',
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
        <Text style={styles.seperator}>or</Text>
        <View
          style={{
            flex: 1,
            borderBottomColor: 'black',
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
      </View>

      <ScrollView style={{ gap: 20 }}>
        {Countries.map((item, index) => (
          <TouchableOpacity onPress={() => setSelectedCountry(index)} key={index}>
            <Text style={{ fontFamily: 'mon', paddingTop: 6 }}>{item.flag + " " + item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </BottomSheet>
  );
};

export default CountrySelectModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 26,
  },

  seperatorView: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginVertical: 30,
  },
  seperator: {
    fontFamily: 'mon-sb',
    color: Colors.gray,
    fontSize: 16,
  },
  btnOutline: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.gray,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  btnOutlineText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'mon-sb',
  },
});
