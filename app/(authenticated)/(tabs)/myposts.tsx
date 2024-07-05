import { View, Text, StyleSheet, ListRenderItem, TouchableOpacity, Image, Dimensions, FlatList, ScrollView, RefreshControl, TextInput } from 'react-native';
import * as Haptics from 'expo-haptics';
import { defaultStyles } from '@/constants/Styles';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { BottomSheetFlatList, BottomSheetFlatListMethods } from '@gorhom/bottom-sheet';
import Colors from '@/constants/Colors';
import { API_URL, useAuth } from '@/app/context/AuthContext';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Buffer } from 'buffer';
import { useNavigation, usePathname } from 'expo-router';


interface Props {
  onCategoryChanged: (category: string) => void;
}
const categories = [
  {
    name: 'All',
  },
  {
    name: 'Listings',
  },
  {
    name: 'Flights',
  },
  {
    name: 'Tasks',
  }
];

const Page = ({ onCategoryChanged }: Props) => {
  const router = useRouter()

  // const listRef = useRef<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState(null as any);
  const { authState } = useAuth();
  const [listingss, setListingss] = useState([] as any)
  const [refreshing, setRefreshing] = useState(true);

  const scrollRef = useRef<ScrollView>(null);
  const itemsRef = useRef<Array<TouchableOpacity | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);



  useLayoutEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/user/profile`)
        console.log("User: ", data)
        setUser(data.data)
        setRefreshing(false)
        setLoading(false)
      } catch {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Couldn\'t fetch posts'
        })
        setRefreshing(false)
        setLoading(false)

      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    }
    getUser().then(() => handleRefresh())
  }, [authState])
  const navigation = useNavigation();
  const focused = navigation.isFocused();

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     handleRefresh()
  //     console.log('authstate updated');
  //   });

  //   return unsubscribe;
  // }, [authState]);

  const handleRefresh = async () => {
    setRefreshing(true)
    setLoading(true)
    await axios.get(`${API_URL}/listing/getalllistings`)
      .then((res) => {
        const unfiltered = res.data.data
        console.log("Then, Unfiltered", JSON.stringify(unfiltered))

        const filteredListings = unfiltered.filter((listing: any) => listing.user._id == user._id);
        console.log("Then, filtered: ", JSON.stringify(filteredListings))
        if (filteredListings.length === 0) {
          Toast.show({
            type: 'info',
            text1: 'No posts',
            text2: 'You don\'t have any posts yet'
          });
          setListingss(null);
        } else {
          setListingss(filteredListings)
        }
      })
      .catch((e) => {
        console.log("ERROR: ",e)
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Couldn\'t fetch postas'
        })
      })
      .finally(() => {
        setRefreshing(false)
        setLoading(false)
      })


  }


  // useEffect(() => {
  //   setLoading(true);
  //   handleRefresh()
  //   setLoading(false);
  // }, []);


  const selectCategory = (index: number) => {
    const selected = itemsRef.current[index];
    setActiveIndex(index);
    selected?.measure((x) => {
      scrollRef.current?.scrollTo({ x: x - 16, y: 0, animated: true });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCategoryChanged(categories[index].name);
  };



  return (
    <SafeAreaView>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={{ marginHorizontal: 26 }}>


        </View>
        <View style={{}}>
          {user &&
            <View style={{ flex: 1, padding: 10, paddingTop: 24, flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>

              {/* <Image source={{ uri: `${API_URL}/userphotos/${user.id_photo}` }} style={{
              width: 40,
              height: 40,
              borderRadius: 25,
              backgroundColor: Colors.gray,
            }} /> */}
              <Text style={{ fontFamily: 'mon-sb', fontSize: 24, marginBottom: 24 }}>Welcome, {user.name}</Text>

              {/* <Text style={{ fontFamily: 'mon' }}>Here, you will find all your posts</Text> */}
              {/* <Ionicons name='checkmark-circle' color={Colors.primary} /> */}
            </View>}

          {listingss.length === 0 ?
            <View style={{ flexDirection: 'column', marginTop: 10, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
              <Text style={{ fontFamily: 'mon-sb', fontSize: 16 }}> You don't have any posts yet.</Text>
              <TouchableOpacity onPress={handleRefresh} style={{ backgroundColor: Colors.lightGray, padding: 8, borderRadius: 50, width: 50, height: 50, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons size={32} name='reload-outline' />
              </TouchableOpacity>
            </View>
            :

            <><View style={styles.searchBtn}>
              <Ionicons name="search" size={24} />
              <TextInput style={{ flex: 1 }} placeholder='Search'>
                {/* <Text style={{ fontFamily: 'mon-sb' }}></Text> */}
                {/* <Text style={{ color: Colors.gray, fontFamily: 'mon' }}>Anywhere · Any time</Text> */}
              </TextInput>
            </View>
              <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'flex-end', justifyContent: 'space-between', paddingHorizontal: 32 }}>
                <Text style={{ fontFamily: 'mon-sb', fontSize: 16 }}> My posts</Text>
                <TouchableOpacity>
                  <Ionicons name='filter' style={{ fontWeight: 'bold', fontSize: 20 }} />
                </TouchableOpacity>
              </View>
            </>



          }

          {listingss.map((item: any, index: any) => (
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
                <Animated.Image source={{ uri: item.image }} style={[styles.image, { backgroundColor: '#fff' }]} />
                <TouchableOpacity style={{ position: 'absolute', backgroundColor: '#fff', borderRadius: 25, padding: 4, alignItems: 'center', right: 30, top: 30 }}>
                  <Ionicons name="heart-outline" size={24} color="#000" />
                </TouchableOpacity>
                <View style={{ flex: 1, padding: 12, gap: 6, flexDirection: 'column', backgroundColor: '#fff', justifyContent: 'space-between', paddingHorizontal: 6, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                  <Text numberOfLines={1} ellipsizeMode='tail' style={{ width: 300, fontSize: 16, fontFamily: 'mon-sb' }}>{item.title}</Text>
                  <View style={{ flexDirection: 'row', gap: 4, paddingHorizontal: 8, alignItems: 'center' }}>
                    <Text numberOfLines={2} style={{ fontFamily: 'mon', color: "#777" }}>{item.description} </Text>
                  </View>
                  <View style={{ flexDirection: 'row', padding: 6, alignItems: 'center' }}>
                    <View style={{ flex: 1, flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                      {/* <Image source={{ uri: `${API_URL}/userphotos/${item.user.id_photo}` }} style={styles.host} /> */}
                      <Text style={{ fontFamily: 'mon' }}>Payment Status</Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                      {item.paymentVerified ? (<><Text>verified</Text><Ionicons name='checkmark-circle' color={Colors.primary} /></>) : (<><Text style={{ fontFamily: "mon-sb", color: "#e3c334" }}>pending</Text></>)}
                    </View>
                  </View>
                </View>

              </Animated.View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Page;
const styles = StyleSheet.create({
  listing: {
    padding: 16,
    marginTop: 0,
  },
  image: {
    width: '100%',
    height: 250,
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
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    // marginBottom: 8,
  }, categoryText: {
    fontSize: 14,
    fontFamily: 'mon-sb',
    color: Colors.gray,
  },
  categoryTextActive: {
    fontSize: 14,
    fontFamily: 'mon-sb',
    color: '#fff',
  },
  categoriesBtn: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  categoriesBtnActive: {
    backgroundColor: Colors.primary,
    padding: 5,
    borderRadius: 15,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBtn: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    gap: 10,
    padding: 10,
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#c2c2c2',
    borderRadius: 60,

  },
});