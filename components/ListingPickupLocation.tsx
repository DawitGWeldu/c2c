import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import React, { memo, useEffect, useRef } from 'react';
import { defaultStyles } from '@/constants/Styles';
import { Marker } from 'react-native-maps';
import MapView from 'react-native-map-clustering';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

interface Props {
  longitude: any
  latitude: any
}

const ListingPickUpLocation = ({ latitude, longitude }: Props) => {
  const PICKUP_LOCATION = {
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };
  const mapRef = useRef<any>(null);

  // When the component mounts, locate the user
  useEffect(() => {
    onLocatePickup();
  }, []);

  // Focus the map on the user's location
  const onLocatePickup = async () => {
    mapRef.current.animateToRegion(PICKUP_LOCATION);
  };


  return (
    <View style={defaultStyles.container}>
      <MapView
        ref={mapRef}
        animationEnabled={false}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{ latitude: PICKUP_LOCATION.latitude, longitude: PICKUP_LOCATION.longitude, latitudeDelta: 0.1, longitudeDelta: 0.1 }}>
        <Marker
          coordinate={{
            latitude: PICKUP_LOCATION.latitude,
            longitude: PICKUP_LOCATION.longitude,
          }}
        />
      </MapView>
      <TouchableOpacity style={styles.locateBtn} onPress={onLocatePickup}>
        <Ionicons name="navigate" size={24} color={Colors.dark} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    width: Dimensions.get('window').width,
    height: 300
  },
  marker: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    elevation: 5,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10,
    },
  },
  markerText: {
    fontSize: 14,
    fontFamily: 'mon-sb',
  },
  locateBtn: {
    position: 'absolute',
    top: 70,
    right: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10,
    },
  },
});

export default ListingPickUpLocation;
