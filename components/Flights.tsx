import { View, Text, StyleSheet, ListRenderItem, TouchableOpacity, Image, Dimensions, FlatList, ScrollView, RefreshControl } from 'react-native';
import { defaultStyles } from '@/constants/Styles';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { useEffect, useRef, useState } from 'react';
import { BottomSheetFlatList, BottomSheetFlatListMethods } from '@gorhom/bottom-sheet';
import Colors from '@/constants/Colors';
import { API_URL } from '@/app/context/AuthContext';
import HomeBannerSlider from './HomeSlider';
import axios from 'axios';
import Toast from 'react-native-toast-message';

interface Props {
  flights: any[];
  refresh: number;
  category: string;
}
const Listings = ({ flights: items, refresh, category }: Props) => {
  const router = useRouter()

  // const listRef = useRef<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [flightss, setFlightss] = useState([] as any)
  const [refreshing, setRefreshing] = useState(true);

  const handleRefresh = async () => {
    setRefreshing(true)
    setLoading(true)
    try {
      const { data } = await axios.get(`${API_URL}/flight/getAllFlights`)
      // console.log(data)
      setFlightss(data.data)
      setRefreshing(false)
      setLoading(false)
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Couldn\'t fetch flights'
      })
      setRefreshing(false)
      setLoading(false)

    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Update the view to scroll the list back top
  // useEffect(() => {
  //   if (refresh) {
  //     scrollListTop();
  //   }
  // }, [refresh]);

  // const scrollListTop = () => {
  //   // listRef.current?.scrollToOffset({ offset: 0, animated: true });
  // };

  // Use for "updating" the views data after category changed
  useEffect(() => {
    setLoading(true);
    handleRefresh()
    setLoading(false);
  }, [category]);

  // Render one listing row for the FlatList
  // const renderRow: ListRenderItem<any> = ({ item }) => (

  // );

  return (


    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >

      <View style={{}}>
        <View style={{ flexDirection: 'row', marginBottom: 8, marginTop: 16, alignItems: 'flex-end', justifyContent: 'space-between', paddingHorizontal: 32 }}>
          <Text style={{ fontFamily: 'mon-sb', fontSize: 16 }}>Recent flights</Text>
          <TouchableOpacity>
            <Ionicons name='filter' style={{ fontWeight: 'bold', fontSize: 20 }} />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', padding: 8, flexWrap: 'wrap' }}>
          {flightss.map((item: any, index: any) => (
            <TouchableOpacity
              style={{ width: '50%' }}
              key={index}
              activeOpacity={1}
              onPress={() => {
                router.push({
                  pathname: `/flight/[slug]`,
                  params: { slug: item.slug },
                });
              }}>
              <Animated.View style={styles.listing} entering={FadeInRight} exiting={FadeOutLeft}>
                <Animated.Image source={{ uri: "https://media.istockphoto.com/id/1414160809/vector/airplane-icon-plane-flight-pictogram-transport-symbol-travel.jpg?s=612x612&w=0&k=20&c=BtgJVW1RQ9a4i8sTMm-Uk-HAFI2sNbDFQVvHbPKbQA4=" }} resizeMode={'contain'} style={[styles.image, { backgroundColor: '#fff' }]} />
                <TouchableOpacity style={{ position: 'absolute', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 25, padding: 4, alignItems: 'center', right: 20, top: 20 }}>
                  <Ionicons name="heart-outline" size={24} color="#000" />
                </TouchableOpacity>
                <View style={{ flex: 1, padding: 8, flexDirection: 'column', backgroundColor: '#fff', justifyContent: 'space-between', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                  <View style={{ height: 70 }}>
                    <Text numberOfLines={1} style={{ paddingHorizontal: 8, fontSize: 16, fontFamily: 'mon-sb' }}><MaterialIcons name='flight-takeoff'/> {item.origin}</Text>
                    <Text numberOfLines={1} style={{ paddingHorizontal: 8, fontFamily: 'mon-sb' }}><MaterialIcons name='flight-land'/> {item.destination} </Text>
                    <Text numberOfLines={1} style={{ paddingHorizontal: 8, fontFamily: 'mon' }}><MaterialIcons name='date-range'/> {new Date(item.departureDate).toLocaleDateString('en-us', { month:"short", day:"numeric", year: 'numeric'})} </Text>
                  </View>
                  <View style={defaultStyles.separator}></View>
                  <View style={{ flexDirection: 'row', padding: 6, alignItems: 'center' }}>
                    <View style={{ flex: 1, flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                      <Image source={{ uri: `${API_URL}/userphotos/${item.user.id_photo}` }} style={styles.host} />
                      <Text style={{ fontFamily: 'mon' }}>{item.user.name}</Text>
                      {/* <Ionicons name='checkmark-circle' color={Colors.primary} /> */}
                    </View>
                    {/* <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                      <MaterialIcons name="scale" style={{ color: '#000' }} size={16} />
                      <Text style={{ fontFamily: 'mon', color: '#000' }}>{item.weight} kg</Text>
                    </View> */}
                  </View>
                </View>

              </Animated.View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  listing: {
    padding: 8,
    marginTop: 0,
    height: 310,
  },
  image: {
    width: '100%',
    height: 170,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  info: {
    textAlign: 'center',
    fontFamily: 'mon-sb',
    fontSize: 16,
    marginTop: 4,
  },
  host: {
    width: 30,
    height: 30,
    borderRadius: 25,
    backgroundColor: Colors.gray,
  },
  hostView: {
    backgroundColor: 'rgba(20, 20, 20, 0.05)',
    padding: 8,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  dividerVertical: {
    width: StyleSheet.hairlineWidth,
    height: 10,
    backgroundColor: Colors.gray,
    marginHorizontal: 16,
  },
  ratings: {
    fontSize: 16,
    fontFamily: 'mon-sb',
  }
});

export default Listings;


