import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, Share, ActivityIndicator } from 'react-native';
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

const { width } = Dimensions.get('window');
const IMG_HEIGHT = 300;

const DetailsPage = () => {
  const { listing } = useLocalSearchParams<any>();
  // const [listing, setListing] = useState('')
  const [loading, setLoading] = useState(true)
  const { authState } = useAuth()


  // useEffect(() => {
  //   const loadListing = async () => {
  //     try {
  //       setLoading(true)
  //       const token = authState!.token
  //       const activeUser = JSON.parse(Buffer.from(token!.split('.')[1], 'base64').toString())
  //       const { data } = await axios.post(`${API_URL}/listing/${slug}`, {
  //         activeUser: activeUser
  //       })
  //       setListing(data)
  //     } catch (error: any) {

  //       Toast.show({
  //         type: 'error',
  //         text1: 'Error',
  //         text2: error.respponse.msg || 'Couldn\'t fetch listing'
  //       })
  //     }

  //   }

  //   loadListing()
  // }, [])



  const navigation = useNavigation();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  const shareListing = async () => {
    try {
      await Share.share({
        title: listing.name,
        url: listing.listing_url,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerTransparent: true,

      headerBackground: () => (
        <Animated.View style={[headerAnimatedStyle, styles.header]}></Animated.View>
      ),
      headerRight: () => (
        <View style={styles.bar}>
          <TouchableOpacity style={styles.roundButton} onPress={shareListing}>
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

  const scrollOffset = useScrollViewOffset(scrollRef);

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT, IMG_HEIGHT],
            [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-IMG_HEIGHT, 0, IMG_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 1.5], [0, 1]),
    };
  }, []);

  return (
    (loading? <View style={styles.container}>
      <Animated.ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        ref={scrollRef}
        scrollEventThrottle={16}>
        <Animated.Image
          source={{ uri: `${API_URL + "/listingimages/" + listing.image}` }}
          style={[styles.image, imageAnimatedStyle]}
          resizeMode="cover"
        />

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{listing.title}</Text>
          <Text style={{ fontFamily: 'mon-sb', fontSize: 15 }}>
            <Ionicons name='airplane' />
            From {listing.origin} To {listing.destination}
          </Text>
          <Text style={styles.rooms}>
            Fragile · Non-Perishable
          </Text>

          {/* <ListingPickUpLocation latitude={listing.latitude} longitude={listing.longitude}/> */}



          {/* <View style={styles.divider} /> */}
          <View style={styles.hostView}>
            {/* <Image source={{ uri: listing.user.image }} style={styles.host} /> */}

            {/* <View>
              <Text style={{ fontFamily: 'mon-sb', fontSize: 16, color: Colors.muted }}>{listing.host_name}</Text>
              <Text style={{ color: Colors.muted }}>Joined {listing.host_since}</Text>
              <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                <Ionicons name="star" size={16} />
                <Ionicons name="star" size={16} />
                <Ionicons name="star" size={16} />
                <Ionicons name="star" size={16} />
                <Ionicons name="star-half-outline" size={16} />
                <View style={styles.dividerVertical} />
                <Text style={styles.ratings}>
                  {listing.review_scores_rating / 20} · {listing.number_of_reviews} reviews
                </Text>
              </View>
            </View> */}
          </View>

          <Text style={{ fontFamily: 'mon-sb', fontSize: 15, paddingVertical: 6 }}>Description</Text>
          <Text numberOfLines={5} style={styles.description}>{listing.description}</Text>

          <View style={styles.divider} />
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, gap: 4 }}>
            <MaterialIcons name='location-searching' size={18} />
            <Text style={{ fontFamily: 'mon-sb', fontSize: 18 }}>Pickup Location</Text>

          </View>
          <View style={{ width: Dimensions.get('window').width - 48, height: 250 }}>
            <MapView
              // scrollEnabled={false}
              rotateEnabled={false}
              animationEnabled={false}
              style={StyleSheet.absoluteFillObject}
              initialRegion={{ latitude: parseFloat(listing.latitude), longitude: parseFloat(listing.longitude), latitudeDelta: 0.1, longitudeDelta: 0.1 }}>
              <Marker
                coordinate={{
                  latitude: parseFloat(listing.latitude),
                  longitude: parseFloat(listing.longitude),
                }}
              />
            </MapView>
          </View>
        </View>
      </Animated.ScrollView>

      <Animated.View style={defaultStyles.footer} entering={SlideInDown.delay(200)}>
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={styles.footerText && { flexDirection: 'column', alignItems: 'flex-start' }}>
            <Text style={styles.footerPrice}>{listing.price} kg</Text>
            <Text style={{ fontFamily: 'mon', fontSize: 10 }}>Remaining Bagage Allowance </Text>
          </View>

          <TouchableOpacity style={[defaultStyles.btn, { paddingRight: 20, paddingLeft: 20 }]}>
            <Text style={defaultStyles.btnText}>Interested <Ionicons name='hand-left' size={14} /></Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View> : <View><ActivityIndicator size={'large'} color={Colors.primary}></ActivityIndicator></View>)
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    height: IMG_HEIGHT,
    width: width,
  },
  infoContainer: {
    padding: 24,
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    fontFamily: 'mon-sb',
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
    backgroundColor: Colors.gray,
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
    gap: 12,
    padding: 10,
    borderRadius: 6,
    marginBottom: 6,
    backgroundColor: 'rgba(22, 22, 22, 0.1)'
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
    backgroundColor: 'white',
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
    backgroundColor: '#fff',
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
