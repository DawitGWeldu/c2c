import { View, Text } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import ListingsBottomSheet from '@/components/ListingsBottomSheet';
import listingsData from '@/assets/data/airbnb-listings.json';
import ListingsMap from '@/components/ListingsMap';
import listingsDataGeo from '@/assets/data/airbnb-listings.geo.json';
import { Stack } from 'expo-router';
import ExploreHeader from '@/components/ExploreHeader';
import axios from 'axios'
import { API_URL } from '@/app/context/AuthContext';
import Toast from 'react-native-toast-message';

const Page = () => {
  const [items, setItems] = useState(null);

  useEffect(() => {
    const getListings = async () => {
      try{
        const {data} = await axios.get(`${API_URL}/listing/getAllListings`)
        console.log(data)
        setItems(data.data) 
      }catch{
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Couldn\'t fetch posts' 
        })
      }
    }
    getListings()
  }, [])
  
  // const getoItems = useMemo(() => listingsDataGeo, []);
  const [category, setCategory] = useState<string>('Home');

  const onDataChanged = (category: string) => {
    setCategory(category);
  };

  return (
    <View style={{ flex: 1, marginTop: 80 }}>
      {/* Define pour custom header */}
      <Stack.Screen
        options={{
          header: () => <ExploreHeader onCategoryChanged={onDataChanged} />,
        }}
      />
      {/* <ListingsMap listings={getoItems} /> */}
      {items != null ? <ListingsBottomSheet listings={items} category={category} /> : <><View><Text>No Listings</Text></View></>}
      
    </View>
  );
};

export default Page;
