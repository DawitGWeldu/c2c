import { View, Text, StyleSheet, ListRenderItem, TouchableOpacity, Image, Dimensions } from 'react-native';
import { defaultStyles } from '@/constants/Styles';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { useEffect, useRef, useState } from 'react';
import { BottomSheetFlatList, BottomSheetFlatListMethods } from '@gorhom/bottom-sheet';
import Colors from '@/constants/Colors';
import { API_URL } from '@/app/context/AuthContext';

interface Props {
  listings: any[];
  refresh: number;
  category: string;
}
const Listings = ({ listings: items, refresh, category }: Props) => {
  const router = useRouter()

  const listRef = useRef<BottomSheetFlatListMethods>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Update the view to scroll the list back top
  useEffect(() => {
    if (refresh) {
      scrollListTop();
    }
  }, [refresh]);

  const scrollListTop = () => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  // Use for "updating" the views data after category changed
  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 200);
  }, [category]);

  // Render one listing row for the FlatList
  const renderRow: ListRenderItem<any> = ({ item }) => (
    <TouchableOpacity onPress={() => {
      router.push({
        pathname: '/listing/[slug]',
        params: { listing: item },
      });
    }}>
      <TouchableOpacity>
        <Animated.View style={styles.listing} entering={FadeInRight} exiting={FadeOutLeft}>
          <Animated.Image source={{ uri: `${API_URL}/listingimages/${item.image}` }} style={styles.image} />
          <TouchableOpacity style={{ position: 'absolute', right: 30, top: 30 }}>
            <Ionicons name="heart-outline" size={24} color="#000" />
          </TouchableOpacity>

          <View style={{ flex: 1, padding: 8, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 6 }}>
            <Text numberOfLines={1} ellipsizeMode='tail' style={{ width: 220, fontSize: 16, fontFamily: 'mon-sb' }}>{item.name}</Text>
            <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
              <Text style={{ fontFamily: 'mon' }}>{item.calendar_updated}</Text>
            </View>
          </View>


          <View style={{ flexDirection: 'row', padding: 6, position: 'absolute', left: 15, bottom: 122, backgroundColor: 'rgba(20, 20, 20, 0.3)' }}>
            <View style={{ flex: 1, flexDirection: 'row', gap: 4, alignItems: 'center' }}>
              <MaterialIcons name="scale" style={{ color: '#fff' }} size={16} />

              <Text style={{ fontFamily: 'mon', color: '#fff' }}>{item.weight} kg</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 4 }}>
              <Ionicons name="airplane" style={{ color: '#fff' }} size={16} />
              <Text style={{ fontFamily: 'mon', color: '#fff' }}>{item.destination}</Text>
            </View>
          </View>

          <View style={styles.hostView}>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Image source={{ uri: item.host_picture_url }} style={styles.host} />

              <View style={{ flexDirection: 'column' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={{ fontFamily: 'mon-sb', fontSize: 16 }}>{item.user.name}</Text>
                  <Ionicons name='checkmark-circle' size={16} style={{ color: '#0096FF' }} />
                </View>
                <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center', justifyContent: 'space-between' }}>
                  <Ionicons name='star' />
                  <Text style={styles.ratings}>
                    {item.matchCount} ·
                  </Text>
                  <Text>{item.number_of_reviews} reviews</Text>
                </View>
              </View>
            </View>


          </View>

        </Animated.View>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={defaultStyles.container}>
      <BottomSheetFlatList
        renderItem={renderRow}
        data={loading ? [] : items}
        ref={listRef}
      // ListHeaderComponent={<Text style={styles.info}>{items.length} Items</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listing: {
    padding: 16,
    marginVertical: 16,
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
    width: 50,
    height: 50,
    borderRadius: 50,
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


