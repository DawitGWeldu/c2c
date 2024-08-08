import { View, Text, StyleSheet, ListRenderItem, TouchableOpacity, Image, Dimensions, FlatList, ScrollView, RefreshControl, TextInput, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';
import { defaultStyles } from '@/constants/Styles';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { BottomSheetFlatList, BottomSheetFlatListMethods } from '@gorhom/bottom-sheet';
import Colors from '@/constants/Colors';
import { API_URL, useAuth } from '@/app/context/AuthContext';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Buffer } from 'buffer';
import { useNavigation, usePathname } from 'expo-router';


const categories = [

  {
    name: 'Posts',
  },
  {
    name: 'Flights',
  },
  {
    name: 'Tasks',
  }
];

const Page = () => {
  const router = useRouter()
  const { tab } = useLocalSearchParams<{ tab: string }>()

  // const listRef = useRef<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState(null as any);
  const { authState } = useAuth();
  const [listingss, setListingss] = useState([] as any)
  const [flightss, setFlightss] = useState([] as any)
  const [taskss, settaskss] = useState([] as any)
  const [refreshing, setRefreshing] = useState(false);

  const scrollRef = useRef<ScrollView>(null);
  const itemsRef = useRef<Array<TouchableOpacity | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);











  // Use for "updating" the views data after category changed
  useEffect(() => {
    setLoading(true);
    handleRefresh()
    setLoading(false);
  }, [activeIndex]);



  useMemo(() => {
    const token = authState?.token
    if (token) {
      const decodedToken = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
      setUser(decodedToken)
    }
  }, [])

  useEffect(() => {
    const x = async () => {
      if (tab) {
        const tabIndex = parseInt(tab)
        selectCategory(tabIndex)
      }
    }
    x()

  }, [])



  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      if (activeIndex == 0) {

        const { data } = await axios.get(`${API_URL}/listing/getalluserlistings/?user=${user.id}`)

        if (!data) {
          Toast.show({
            type: 'info',
            text1: 'No posts',
            text2: 'You don\'t have any posts yet'
          });
          setListingss(null);
        } else {
          setListingss(data.data)
        }

      } else {

        const { data } = await axios.get(`${API_URL}/flight/getalluserflights/?user=${user.id}`)
        console.log("DATA: ", data)

        if (!data) {
          Toast.show({
            type: 'info',
            text1: 'No flights',
            text2: 'You don\'t have any flight posts yet'
          });
          setFlightss(null);
        } else {
          setFlightss(data.data)
        }



      }
      setRefreshing(false)

    } catch (error) {
      console.log("MY POSTS: ", error)
      setRefreshing(false)

    }




  }


  // useEffect(() => {
  //   setLoading(true);
  //   handleRefresh()
  //   setLoading(false);
  // }, []);


  const selectCategory = (index: number) => {
    console.log("Hello")
    const selected = itemsRef.current[index];
    setActiveIndex(index);
    selected?.measure((x) => {
      scrollRef.current?.scrollTo({ x: x - 16, y: 0, animated: true });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // onCategoryChanged(categories[index].name);
  };



  return (
    <SafeAreaView>

      <ScrollView
        style={{ width: '100%', height: '100%' }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >

        {/* <View style={{ backgroundColor: 'linear-gradient(90deg, rgba(243,247,247,1) 0%, rgba(222,228,247,1) 100%)', borderBottomLeftRadius: 25, borderBottomRightRadius: 25 }}> */}
        <View style={{ backgroundColor: "#fff", borderBottomLeftRadius: 25, borderBottomRightRadius: 25 }}>
          {user &&
            <View style={{ flex: 1, padding: 10, paddingTop: 24, flexDirection: 'column', gap: 4, alignItems: 'center' }}>

              {/* <Image source={{ uri: `${API_URL}/userphotos/${user.id_photo}` }} style={{
                        width: 40,
                        height: 40,
                        borderRadius: 25,
                        backgroundColor: Colors.gray,
                      }} /> */}
              <Text style={{ fontFamily: 'mon-sb', fontSize: 24, marginBottom: 24 }}>Welcome, {user.name}</Text>
              <Text style={{ fontFamily: 'mon', paddingHorizontal: "15%", fontSize: 18, marginBottom: 24 }}>Here, you can find and manage all your posts.</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 15 }}>
                <View style={{ alignItems: 'center', justifyContent: 'space-evenly', borderRadius: 10, width: '20%', height: 60, backgroundColor: Colors.lightGray }}>
                  {flightss.length >= 0 ? <Text style={{ fontFamily: 'mon-sb', fontSize: 18 }}>{listingss.length}</Text> : <Text style={{ fontFamily: 'mon-sb', fontSize: 18 }}>0</Text>}
                  <Text style={{ fontFamily: 'mon', fontSize: 16 }}>Posts</Text>
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'space-evenly', borderRadius: 10, width: '20%', height: 60, backgroundColor: Colors.lightGray }}>
                  {flightss.length >= 0 ? <Text style={{ fontFamily: 'mon-sb', fontSize: 18 }}>{flightss.length}</Text> : <Text style={{ fontFamily: 'mon-sb', fontSize: 18 }}>0</Text>}
                  <Text style={{ fontFamily: 'mon', fontSize: 16 }}>Flights</Text>
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'space-evenly', borderRadius: 10, width: '20%', height: 60, backgroundColor: Colors.lightGray }}>
                  {listingss.length > 0 && <Text style={{ fontFamily: 'mon-sb', fontSize: 18 }}>0</Text>}
                  <Text style={{ fontFamily: 'mon', fontSize: 16 }}>Tasks</Text>
                </View>
              </View>



              {/* <Text style={{ fontFamily: 'mon' }}>Here, you will find all your posts</Text> */}
              {/* <Ionicons name='checkmark-circle' color={Colors.primary} /> */}
            </View>}
          <ScrollView
            horizontal
            ref={scrollRef}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: 'center',
              gap: 0,
              paddingHorizontal: 16,
            }}
          >
            {categories.map((item, index) => (
              <TouchableOpacity
                ref={(el) => (itemsRef.current[index] = el)}
                key={index}
                style={activeIndex === index ? styles.categoriesBtnActive : styles.categoriesBtn}
                onPress={() => selectCategory(index)}>
                {/* <MaterialIcons
                    name={item.icon as any}
                    size={24}
                    color={activeIndex === index ? '#000' : Colors.gray}
                  /> */}
                <Text style={activeIndex === index ? styles.categoryTextActive : styles.categoryText}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {listingss && activeIndex == 0 && !loading &&
          <View >


            {listingss.length === 0 ?
              <View style={{ flexDirection: 'column', marginTop: 30, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 16 }}>
              <Text style={{ fontFamily: 'mon', fontSize: 16 }}> You haven't posted anything yet</Text>
              <TouchableOpacity onPress={handleRefresh} style={{flex: 1, flexDirection: 'row', gap: 8, backgroundColor: Colors.primary, padding: 8, paddingHorizontal: 16, borderRadius: 50, height: 50, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons size={24} color={"#fff"} name='add' />
                <Text style={{color: "#fff", fontFamily: 'mon'}}>Create post</Text>
              </TouchableOpacity>
            </View>
              :

              <>
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
                <Animated.View style={[styles.listing, { flexDirection: 'row' }]} entering={FadeInRight} exiting={FadeOutLeft}>
                  <Animated.Image source={{ uri: item.image }} style={{ width: '40%', height: 120, borderBottomLeftRadius: 10, borderTopLeftRadius: 10, backgroundColor: '#fff' }} />

                  <View style={{ flex: 1, padding: 12, flexDirection: 'column', backgroundColor: '#fff', justifyContent: 'space-between', paddingHorizontal: 6, borderBottomRightRadius: 10 }}>
                    <Text numberOfLines={1} style={{ width: 200, fontSize: 16, fontFamily: 'mon-sb' }}>{item.title}</Text>
                    <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                      <Text numberOfLines={2} style={{ fontFamily: 'mon', color: "#777" }}>{item.description} </Text>
                    </View>
                    <View style={[defaultStyles.separator, { margin: 4 }]}></View>
                    <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                      <Text style={{ fontFamily: 'mon' }}>Payment</Text>

                      <View style={{ backgroundColor: '#FFE000', borderRadius: 25, padding: 2, width: 100, alignItems: 'center', flexDirection: 'row' }}>
                        <View style={{ gap: 4, alignItems: 'center' }}>
                          {item.paymentStatus == "verified" ? (<><Text>verified</Text><Ionicons name='checkmark-circle' color={Colors.primary} /></>) : (<View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}><Ionicons name='hourglass' size={16} /><Text style={{ fontFamily: "mon" }}>pending</Text></View>)}
                        </View>
                      </View>
                    </View>
                  </View>
                  {/* <TouchableOpacity style={{ position: 'absolute', backgroundColor: '#222', borderRadius: 25, padding: 4, alignItems: 'center', right: 0, top: 30 }}>
                    <Ionicons name="heart-outline" size={24} color="#000" />
                  </TouchableOpacity> */}
                </Animated.View>
              </TouchableOpacity>
            ))}
          </View>
        }







        {/* Flights */}
        {flightss && activeIndex == 1 && !loading &&
          <View >

            {flightss.length === 0 ?

              <View style={{ flexDirection: 'column', marginTop: 30, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 16 }}>
                <Text style={{ fontFamily: 'mon', fontSize: 16 }}> You haven't posted any flights yet</Text>
                <TouchableOpacity onPress={handleRefresh} style={{flex: 1, flexDirection: 'row', gap: 8, backgroundColor: Colors.primary, padding: 8, paddingHorizontal: 16, borderRadius: 50, height: 50, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons size={24} color={"#fff"} name='add' />
                  <Text style={{color: "#fff", fontFamily: 'mon'}}>Create flight post</Text>
                </TouchableOpacity>
              </View>

              :

              <>
                <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'flex-end', justifyContent: 'space-between', paddingHorizontal: 32 }}>
                  <Text style={{ fontFamily: 'mon-sb', fontSize: 16 }}> My flights</Text>
                  <TouchableOpacity>
                    <Ionicons name='filter' style={{ fontWeight: 'bold', fontSize: 20 }} />
                  </TouchableOpacity>
                </View>
              </>



            }

            {flightss.map((item: any, index: any) => (
              <TouchableOpacity
                key={index}
                activeOpacity={1}
                onPress={() => {
                  router.push({
                    pathname: `/flight/[slug]`,
                    params: { slug: item.slug },
                  });
                }}>
                <Animated.View style={[styles.listing, { flexDirection: 'row' }]} entering={FadeInRight} exiting={FadeOutLeft}>
                  <Animated.Image source={{ uri: "https://media.istockphoto.com/id/1414160809/vector/airplane-icon-plane-flight-pictogram-transport-symbol-travel.jpg?s=612x612&w=0&k=20&c=BtgJVW1RQ9a4i8sTMm-Uk-HAFI2sNbDFQVvHbPKbQA4=" }} style={{ width: '40%', height: 120, borderBottomLeftRadius: 10, borderTopLeftRadius: 10, backgroundColor: '#fff' }} />

                  <View style={{ flex: 1, padding: 12, flexDirection: 'column', backgroundColor: '#fff', justifyContent: 'space-between', paddingHorizontal: 6, borderBottomRightRadius: 10 }}>
                  <View style={{  }}>
                    <Text numberOfLines={1} style={{ paddingHorizontal: 8, fontSize: 16, fontFamily: 'mon-sb' }}><MaterialIcons name='flight-takeoff'/> {item.origin}</Text>
                    <Text numberOfLines={1} style={{ paddingHorizontal: 8, fontFamily: 'mon-sb' }}><MaterialIcons name='flight-land'/> {item.destination} </Text>
                    {/* <Text numberOfLines={1} style={{ paddingHorizontal: 8, fontFamily: 'mon' }}><MaterialIcons name='date-range'/> {new Date(item.departureDate).toLocaleDateString('en-us', { month:"short", day:"numeric", year: 'numeric'})} </Text> */}
                  </View>
                    <View style={[defaultStyles.separator, { margin: 4 }]}></View>
                    <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                      <Text style={{ fontFamily: 'mon' }}>Payment</Text>

                      <View style={{ backgroundColor: '#FFE000', borderRadius: 25, padding: 2, width: 100, alignItems: 'center', flexDirection: 'row' }}>
                        <View style={{ gap: 4, alignItems: 'center' }}>
                          {item.paymentStatus == 'verified' ? (<><Text>verified</Text><Ionicons name='checkmark-circle' color={Colors.primary} /></>) : (<View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}><Ionicons name='hourglass' size={16} /><Text style={{ fontFamily: "mon" }}>pending</Text></View>)}
                        </View>
                      </View>
                    </View>
                  </View>
                  {/* <TouchableOpacity style={{ position: 'absolute', backgroundColor: '#222', borderRadius: 25, padding: 4, alignItems: 'center', right: 0, top: 30 }}>
                    <Ionicons name="heart-outline" size={24} color="#000" />
                  </TouchableOpacity> */}
                </Animated.View>
              </TouchableOpacity>
            ))}
          </View>
        }






        {/* Tasks */}
        {taskss && activeIndex == 2 && !loading &&
          <View >

            {taskss.length === 0 ?

              <View style={{ flexDirection: 'column', marginTop: 30, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 16 }}>
                <Text style={{ fontFamily: 'mon', fontSize: 16 }}> You haven't posted any tasks</Text>
                <TouchableOpacity onPress={handleRefresh} style={{flex: 1, flexDirection: 'row', gap: 8, backgroundColor: Colors.primary, padding: 8, paddingHorizontal: 16, borderRadius: 50, height: 50, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons size={24} color={"#fff"} name='add' />
                  <Text style={{color: "#fff", fontFamily: 'mon'}}>Create task post</Text>
                </TouchableOpacity>
              </View>

              :

              <>
                <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'flex-end', justifyContent: 'space-between', paddingHorizontal: 32 }}>
                  <Text style={{ fontFamily: 'mon-sb', fontSize: 16 }}> My Tasks</Text>
                  <TouchableOpacity>
                    <Ionicons name='filter' style={{ fontWeight: 'bold', fontSize: 20 }} />
                  </TouchableOpacity>
                </View>
              </>



            }

            {taskss.map((item: any, index: any) => (
              <TouchableOpacity
                key={index}
                activeOpacity={1}
                onPress={() => {
                  router.push({
                    pathname: `/listing/[slug]`,
                    params: { slug: item.slug },
                  });
                }}>
                <Animated.View style={[styles.listing, { flexDirection: 'row' }]} entering={FadeInRight} exiting={FadeOutLeft}>
                  <Animated.Image source={{ uri: item.image }} style={{ width: '40%', height: 120, borderBottomLeftRadius: 10, borderTopLeftRadius: 10, backgroundColor: '#fff' }} />

                  <View style={{ flex: 1, padding: 12, flexDirection: 'column', backgroundColor: '#fff', justifyContent: 'space-between', paddingHorizontal: 6, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                    <Text numberOfLines={1} style={{ width: 200, fontSize: 16, fontFamily: 'mon-sb' }}>{item.title}</Text>
                    <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                      <Text numberOfLines={2} style={{ fontFamily: 'mon', color: "#777" }}>{item.description} </Text>
                    </View>
                    <View style={[defaultStyles.separator, { margin: 4 }]}></View>
                    <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                      <Text style={{ fontFamily: 'mon' }}>Payment</Text>

                      <View style={{ backgroundColor: '#FFE000', borderRadius: 25, padding: 2, width: 100, alignItems: 'center', flexDirection: 'row' }}>
                        <View style={{ gap: 4, alignItems: 'center' }}>
                          {item.paymentVerified ? (<><Text>verified</Text><Ionicons name='checkmark-circle' color={Colors.primary} /></>) : (<View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}><Ionicons name='hourglass' size={16} /><Text style={{ fontFamily: "mon" }}>pending</Text></View>)}
                        </View>
                      </View>
                    </View>
                  </View>
                  {/* <TouchableOpacity style={{ position: 'absolute', backgroundColor: '#222', borderRadius: 25, padding: 4, alignItems: 'center', right: 0, top: 30 }}>
                    <Ionicons name="heart-outline" size={24} color="#000" />
                  </TouchableOpacity> */}
                </Animated.View>
              </TouchableOpacity>
            ))}
          </View>

          
        }

        {loading && 
          <View style={{ height: '100%', width: '100%', flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <ActivityIndicator color={Colors.primary} size={'large'} />
            <Text>Gettinggg your posts</Text>
          </View>
        }







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
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'mon-sb',
    color: Colors.gray,
  },
  categoryTextActive: {
    fontSize: 14,
    fontFamily: 'mon-sb',
    color: '#000',
  },
  categoriesBtn: {
    flex: 1,
    // backgroundColor: Colors.lightGray,
    // borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  categoriesBtnActive: {
    // backgroundColor: Colors.primary,
    borderBottomColor: Colors.primary,
    borderBottomWidth: 4,
    padding: 5,
    // borderRadius: 15,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBtn: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    gap: 10,
    padding: 10,
    marginHorizontal: 16,
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#c2c2c2',
    borderRadius: 60,

  },
});