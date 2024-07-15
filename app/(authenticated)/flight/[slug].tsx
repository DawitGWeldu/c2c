import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { Buffer } from 'buffer';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, Share, ActivityIndicator, ScrollView } from 'react-native';
import listingsData from '@/assets/data/airbnb-listings.json';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import Animated, {
  SlideInDown,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';
import { defaultStyles } from '@/constants/Styles';
import MapView from 'react-native-map-clustering';
import { Marker } from 'react-native-maps';
import { API_URL, useAuth } from '@/app/context/AuthContext';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const IMG_HEIGHT = 300;

const DetailsPage = () => {
  const { slug } = useLocalSearchParams<{ slug: string, item: string }>();

  const [flight, setFlight] = useState<any>(undefined)
  const [user, setUser] = useState<any>(undefined)
  const [joinedDate, setJoinedDate] = useState<any>(undefined)
  const [loading, setLoading] = useState(true)
  const { authState } = useAuth()
  const router = useRouter()


  // const handleRefresh = async () => {
  //   try {
  //     // setLoading(true)
  //     const token = authState!.token
  //     const activeUser = JSON.parse(Buffer.from(token!.split('.')[1], 'base64').toString())

  //     const { data } = await axios.post(`${API_URL}/listing/${slug}`, {
  //       activeUser: activeUser
  //     })

  //     setListing(data.data)

  //     setLoading(false)
  //   } catch (error: any) {

  //     Toast.show({
  //       type: 'error',
  //       text1: 'Error',
  //       text2: error.respponse.msg || 'Couldn\'t fetch listing'
  //     })
  //     setLoading(false)

  //   }
  // }
  useEffect(() => {
    const loadFlight = async () => {
      try {
        setLoading(true)
        const token = authState!.token
        const activeUser = JSON.parse(Buffer.from(token!.split('.')[1], 'base64').toString())
        setUser(activeUser.id)

        // console.log("hererere: " + JSON.stringify(activeUser))

        const { data } = await axios.post(`${API_URL}/flight/${slug}`, {
          activeUser: activeUser
        })
        console.log("jhgjhgjhgjhg: " + JSON.stringify(data.data))

        setFlight(data.data)
        const joinedDatee = new Date(data.data.user.createdAt)
        setJoinedDate(joinedDatee.toLocaleDateString())

        setLoading(false)
      } catch (error: any) {

        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.respponse.msg || 'Couldn\'t fetch flight'
        })
        setLoading(false)

      }

    }

    loadFlight()
  }, [])

  // useEffect(() => {
  //   console.log("hererere: " + JSON.stringify(listing))
  // }, [listing])



  const navigation = useNavigation();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  const shareListing = async () => {
    try {
      await Share.share({
        title: flight.slug,
        url: flight.slug,
      });
    } catch (err) {
      console.log();
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerTransparent: true,

      headerBackground: () => (
        <Animated.View style={[styles.header]}></Animated.View>
      ),
      headerRight: () => (
        <View style={styles.bar}>
          <TouchableOpacity style={styles.roundButton}>
            <Ionicons name="share-outline" size={22} color={'#000'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.roundButton}>
            <Ionicons name="heart-outline" size={22} color={'#000'} />
          </TouchableOpacity>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity style={styles.roundButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={'#000'} />
        </TouchableOpacity>
      ),
    });
  }, []);




  return (

    (!flight ?
      <LinearGradient colors={["#f3f7f7", "#dee4f7"]}
        style={{ flex: 1, paddingTop: 50 }}><View style={{ alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size={'large'} color={Colors.primary}></ActivityIndicator></View></LinearGradient>
      :
      <LinearGradient colors={["#fff", "#f3f7f7"]}
        style={{ flex: 1 }}>
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 100 }}
            // ref={scrollRef}
            scrollEventThrottle={16}>
            <Image
              source={{ uri: "https://media.istockphoto.com/id/1414160809/vector/airplane-icon-plane-flight-pictogram-transport-symbol-travel.jpg?s=612x612&w=0&k=20&c=BtgJVW1RQ9a4i8sTMm-Uk-HAFI2sNbDFQVvHbPKbQA4=" }}
              style={[styles.image]}
              resizeMode="cover"
            />
            {user == flight.user._id &&
              <View style={[flight.paymentStatus == "verified" ? { backgroundColor: Colors.green } : { backgroundColor: "#e3c334" }, { paddingHorizontal: 10, paddingVertical: 4, flexDirection: 'row', justifyContent: 'space-between' }]}>
                <Text style={{ marginTop: 12, fontFamily: 'mon-sb', }}>Payment status</Text>
                <Text style={{ marginTop: 12, fontFamily: 'mon-sb', }}>pending</Text>
              </View>
            }





            <View style={styles.infoContainer}>


              {/* <Text style={styles.name}>{flight.title}</Text>
              <Text style={{ marginTop: 12, fontFamily: 'mon-sb', fontSize: 18 }}>Description</Text>
              <Text style={styles.description}>{listing.description}</Text> */}
              {/* <View style={styles.divider} /> */}

              {!user == flight.user._id && <View style={styles.hostView}>
                <Image source={{ uri: `${API_URL}/userphotos/${flight.user.id_photo}` }} style={styles.host} />

                <View>
                  <Text style={{ fontFamily: 'mon-sb', fontSize: 16, color: Colors.muted }}>{flight.user.name}</Text>

                  <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                    <Ionicons name="star" size={16} />
                    <Ionicons name="star" size={16} />
                    <Ionicons name="star" size={16} />
                    <Ionicons name="star" size={16} />
                    <Ionicons name="star-half-outline" size={16} />
                    <View style={styles.dividerVertical} />
                    <Text style={{ color: Colors.muted }}>Joined {joinedDate}</Text>

                  </View>
                </View>
              </View>

              }



              <Text style={{ marginVertical: 8, fontFamily: 'mon-sb', fontSize: 18 }}>Flight details</Text>
              <View style={styles.divider} />

              <Text style={{ fontFamily: 'mon', fontSize: 17 }}>

                <MaterialIcons name='flight-takeoff' size={20} color={Colors.green} />
                {" "}
                From {flight.origin}
              </Text>
              <Text style={{ fontFamily: 'mon', fontSize: 17 }}>
                <MaterialIcons name='flight-land' size={20} color={Colors.primary} />
                {" "}
                To {flight.destination}
              </Text>
              <Text style={{ fontFamily: 'mon', fontSize: 17, marginTop: 10 }}>
                <MaterialIcons name='scale' color={Colors.dark} />
                {" "}
                Max Weight allowed:  {flight.maxWeight} kg
              </Text>

              {/* <Text style={{ fontFamily: 'mon', fontSize: 17, marginTop: 10 }}>
                <MaterialIcons name='scale' color={Colors.dark} />
                {" "}
                Price:  ETB{listing.price}
              </Text> */}
              {/* {listing.items.length > 0 && (
                <View style={{ marginVertical: 10, padding: 10, borderRadius: 10, backgroundColor: Colors.extraLightGray }}>

                  <Text style={{ fontFamily: 'mon-sb', fontSize: 17, marginTop: 10 }}>
                    List of Items
                  </Text>

                  {listing.items.map((item: any, key: any) => (
                    <Text key={key} style={{ fontFamily: 'mon', fontSize: 17, marginTop: 10 }}>
                      {" "}
                      {item.name} {" "}
                      Quantity:  {item.quantity}
                    </Text>
                  ))}
                </View>
              )} */}
              {/* <Text style={styles.rooms}>
              Fragile · Non-Perishable
            </Text> */}

              {/* <ListingPickUpLocation latitude={listing.latitude} longitude={listing.longitude}/> */}





              {/* <Text style={{ fontFamily: 'mon-sb', fontSize: 15, paddingVertical: 6 }}>Description</Text>
          <Text numberOfLines={5} style={styles.description}>{listing.description}</Text> */}
              {/* 
              <View style={styles.divider} />
              <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, gap: 4 }}>
                <MaterialIcons name='location-searching' size={18} />
                <Text style={{ fontFamily: 'mon-sb', fontSize: 18 }}>Pick up Location</Text>

              </View>
              <View style={{ width: Dimensions.get('window').width - 48, height: 250 }}>
                <MapView
                  // scrollEnabled={false}
                  rotateEnabled={false}
                  animationEnabled={false}
                  style={StyleSheet.absoluteFillObject}
                  initialRegion={{ latitude: listing.origin.lat, longitude: listing.origin.lng, latitudeDelta: 0.1, longitudeDelta: 0.1 }}>
                  <Marker
                    coordinate={{
                      latitude: parseFloat(listing.origin.lat),
                      longitude: parseFloat(listing.origin.lng),
                    }}
                  />
                </MapView>
              </View>*/}
            </View>
          </ScrollView>

          <View style={defaultStyles.footer} >
            <View
              style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              {/* <View style={styles.footerText && { flexDirection: 'column', alignItems: 'flex-start' }}>
                <Text style={styles.footerPrice}>{listing.price} kg</Text>
                <Text style={{ fontFamily: 'mon', fontSize: 10 }}>Remaining Bagage Allowance </Text>
              </View> */}

              {user == flight.user._id ?
                <TouchableOpacity style={[defaultStyles.btn, { paddingHorizontal: 20, flexDirection: 'row', alignItems: "center", justifyContent: 'space-between', gap: 4, backgroundColor: Colors.primary }]}>
                  <Ionicons name='pencil' size={14} color={'#fff'} />

                  <Text style={defaultStyles.btnText}>Edit Flight </Text>
                </TouchableOpacity> :
                <TouchableOpacity style={[defaultStyles.btn, { paddingHorizontal: 20, flexDirection: 'row', alignItems: "center", justifyContent: 'space-between', gap: 4 }]}>

                  <Text style={defaultStyles.btnText}> Contact </Text>
                </TouchableOpacity>}

            </View>
          </View>
        </View>
      </LinearGradient>
    )

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    height: IMG_HEIGHT,
    width: width,
  },
  infoContainer: {
    padding: 24,
  },
  name: {
    fontSize: 20,
    // fontWeight: 'bold',
    fontFamily: 'mon-b',
  },
  location: {
    fontSize: 18,
    marginTop: 10,
    fontFamily: 'mon-sb',
  },
  rooms: {
    fontSize: 16,
    color: Colors.gray,
    marginVertical: 8,
    fontFamily: 'mon',
  },
  ratings: {
    fontSize: 16,
    fontFamily: 'mon-sb',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.lightGray,
    marginVertical: 8
  },
  dividerVertical: {
    width: StyleSheet.hairlineWidth,
    height: 10,
    backgroundColor: Colors.gray,
    marginHorizontal: 6,
  },
  host: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: Colors.gray,
  },
  hostView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    padding: 8,
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: Colors.lightGray
  },
  footerText: {
    height: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerPrice: {
    fontSize: 18,
    fontFamily: 'mon-sb',
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    color: Colors.primary,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  header: {
    // backgroundColor: '#fff',
    height: 100,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.gray,
  },

  description: {
    fontSize: 16,
    marginTop: 10,
    fontFamily: 'mon',
  },
});

export default DetailsPage;
