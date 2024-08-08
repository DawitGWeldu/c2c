import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { Ionicons } from '@expo/vector-icons';
import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from './context/AuthContext';
import { useState } from 'react';

const Page = () => {
  const { onCheckApi, onRegister } = useAuth()
  const [loading, setLoading] = useState(false)
  const handleCheckApi = async () => {
    setLoading(true)
    await onCheckApi!()
    setLoading(false)
  }
  return (
    <View style={[StyleSheet.absoluteFill, { flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32 }]}>
      <View style={{ alignItems: 'center', gap: 24 }}>
        <Ionicons size={48} style={{ color: Colors.gray }} name='alert-circle' />
        <View style={{ gap: 6, width: SCREEN_WIDTH, paddingHorizontal: 50 }}>
          <Text style={{ fontFamily: 'mon-sb', fontSize: 17 }}>Could not connect to the server</Text>
          <Text style={{ fontFamily: 'mon', fontSize: 14 }}>Please make sure that wifi or mobile data is turned on, and try again. </Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', padding: 50 }}>
        <TouchableOpacity onPress={handleCheckApi} style={[defaultStyles.btn, {flex: 1, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 10 }]}>
          {loading ?
            <ActivityIndicator size={'small'}  color={"#fff"}/>
            :
            <>
              <Ionicons name='reload' style={{ fontFamily: 'mon', fontSize: 14, color: '#fff' }} s />
              <View style={[defaultStyles.dividerVertical, { backgroundColor: '#fff' }]}></View>
              <Text style={{ fontFamily: 'mon', fontSize: 14, color: '#fff' }}>Try again</Text>
            </>
          }

        </TouchableOpacity>
      </View>

    </View>
  );
};
export default Page;
