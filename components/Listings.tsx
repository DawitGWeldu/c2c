import { View, Text, StyleSheet, ListRenderItem, TouchableOpacity, Image, Dimensions, FlatList, ScrollView } from 'react-native';
import { defaultStyles } from '@/constants/Styles';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { useEffect, useRef, useState } from 'react';
import { BottomSheetFlatList, BottomSheetFlatListMethods } from '@gorhom/bottom-sheet';
import Colors from '@/constants/Colors';
import { API_URL } from '@/app/context/AuthContext';
import HomeBannerSlider from './HomeSlider';

interface Props {
  listings: any[];
  refresh: number;
  category: string;
}
const Listings = ({ listings: items, refresh, category }: Props) => {
  const router = useRouter()

  // const listRef = useRef<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

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

    setTimeout(() => {
      setLoading(false);
    }, 200);
  }, [category]);

  // Render one listing row for the FlatList
  // const renderRow: ListRenderItem<any> = ({ item }) => (

  // );

  return (


    <ScrollView>
      <View style={{ marginHorizontal: 26 }}>
        <HomeBannerSlider />


      </View>
      <View style={{}}>
        <View style={{ flexDirection: 'row', marginTop: 24, alignItems: 'flex-end', justifyContent: 'space-between', paddingHorizontal: 32 }}>
          <Text style={{ fontFamily: 'mon-sb', fontSize: 16 }}> Popular posts</Text>
          <TouchableOpacity>
            <Ionicons name='filter' style={{ fontWeight: 'bold', fontSize: 20 }} />
          </TouchableOpacity>
        </View>
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={1}
            onPress={() => {
              router.push({
                pathname: `/listing/[slug]`,
                params: { slug: item.slug },
              });
            }}>
            <Animated.View style={styles.listing} entering={FadeInRight} exiting={FadeOutLeft}>
              <Animated.Image source={{ uri: `${API_URL}/listingimages/${item.image}` }} style={styles.image} />
              <TouchableOpacity style={{ position: 'absolute', right: 30, top: 30 }}>
                <Ionicons name="heart-outline" size={24} color="#000" />
              </TouchableOpacity>
              <View style={{ flex: 1, padding: 12, gap: 6, flexDirection: 'column', backgroundColor: '#fff', justifyContent: 'space-between', paddingHorizontal: 6, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                <Text numberOfLines={1} ellipsizeMode='tail' style={{ width: 300, fontSize: 16, fontFamily: 'mon-sb' }}>{item.title}</Text>
                <View style={{ flexDirection: 'row', gap: 4, paddingHorizontal: 8, alignItems: 'center' }}>
                  <Text numberOfLines={2} style={{ fontFamily: 'mon', color: "#777" }}>{item.description} </Text>
                </View>
                <View style={{ flexDirection: 'row', padding: 6, alignItems: 'center' }}>
                  <View style={{ flex: 1, flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                    <Image source={{ uri: `${API_URL}/userphotos/${item.user.id_photo}` }} style={styles.host} />
                    <Text style={{ fontFamily: 'mon' }}>{item.user.name}</Text>
                    <Ionicons name='checkmark-circle' color={Colors.primary}/>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                    <MaterialIcons name="scale" style={{ color: '#000' }} size={16} />
                    <Text style={{ fontFamily: 'mon', color: '#000' }}>{item.weight} kg</Text>
                  </View>
                </View>
              </View>

            </Animated.View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  listing: {
    padding: 16,
    marginTop: 16,
  },
  image: {
    width: '100%',
    height: 300,
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
    width: 40,
    height: 40,
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


