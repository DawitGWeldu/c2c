import { View, Text, ActivityIndicator } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useLayoutEffect, useState } from 'react';
import ListingsBottomSheet from '@/components/ListingsBottomSheet';
import { Stack, useLocalSearchParams } from 'expo-router';
import ExploreHeader from '@/components/ExploreHeader';
import axios from 'axios'
import { API_URL } from '@/app/context/AuthContext';
import Toast from 'react-native-toast-message';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { defaultStyles } from '@/constants/Styles';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import HomeBannerSlider from '@/components/HomeSlider';
import FlightsBottomSheet from '@/components/FlightsBottomSheet';

const Page = () => {
  const [items, setItems]: any = useState();
  const [flights, setFlights]: any = useState();
  const [loading, setLoading] = useState(false)
  const { selectedLocation } = useLocalSearchParams();


  useEffect(() => {
    if (selectedLocation) {
      // Do something with the selected location
      //@ts-ignore
      console.log("Selected location, Explore:", JSON.parse(selectedLocation));
    }
  }, [selectedLocation]);
  // useLayoutEffect(() => {
  //   const showLoader = () => {
  //     if(loading) {

  //     }
  //   }
  // }, [])

  useEffect(() => {
    const getListings = async () => {
      setLoading(true)

      try {
        const { data } = await axios.get(`${API_URL}/listing/getAllListings`)
        // console.log(data.data[0].user)
        setItems(data.data)
        setLoading(false)
      } catch {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Couldn\'t fetch posts'
        })
        setLoading(false)
      }
    }
    const getFlights = async () => {
      setLoading(true)

      try {
        const { data } = await axios.get(`${API_URL}/flight/getAllFlights`)
        // console.log(data.data[0].user)
        setFlights(data.data)
        setLoading(false)
      } catch {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Couldn\'t fetch flights'
        })
        setLoading(false)
      }
    }
    getListings()
    getFlights()
    return
  }, [])

  // const getoItems = useMemo(() => listingsDataGeo, []);
  const [category, setCategory] = useState<string>('All');

  const handleRefresh = async (category?: any) => {
    try {
      if(category=="Flights"){
        const { data } = await axios.get(`${API_URL}/flight/getAllFlights`)
        console.log("Flights: Index: ",data.data)
        setFlights(data.data)
      }else{
        const { data } = await axios.get(`${API_URL}/listing/getAllListings`)
        console.log("Listings: Index: ",data)
        setItems(data.data)
      }
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Couldn\'t fetch posts'
      })
    }
  }

  // Use for "updating" the views data after category changed
  useEffect(() => {
    setLoading(true);
    handleRefresh(category)
    setLoading(false);
  }, [category]);

  const onDataChanged = (category: string) => {
    setCategory(category);
  };

  return (
    <LinearGradient
      colors={["#f3f7f7", "#dee4f7"]}
      style={{ flex: 1, paddingTop: 50 }}
    >
      <View style={{ flex: 1, marginTop: 80 }}>
        {/* Define pour custom header */}
        <Stack.Screen
          options={{
            header: () => <ExploreHeader onCategoryChanged={onDataChanged} />,
          }}
        />
        {
          loading ?
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size={'large'} color={Colors.primary} /></View>
            :
            <>
              {(category == "All" || category == "Posts") &&

                <>

                  {!items ?
                    <View style={{ flex: 1, height: 500, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', gap: 30 }}>
                      <Text style={{ fontFamily: 'mon-sb' }}>Error</Text>
                      <Text style={{ fontFamily: "mon" }}>Couldn't fetch posts</Text>
                      <TouchableOpacity onPress={handleRefresh} style={{ backgroundColor: Colors.lightGray, padding: 8, borderRadius: 50, width: 50, height: 50, alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons size={32} name='reload-outline' />
                      </TouchableOpacity>
                    </View>
                    :
                    <>
                      {items.length > 0 ?

                          <ListingsBottomSheet listings={items} category={category} />

                        :
                        <View style={{ flex: 1, height: 500, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
                          <Text style={{ fontFamily: 'mon-sb' }}>Nothing to show</Text>
                          {/* <Text style={{ fontFamily: "mon" }}></Text> */}
                          <TouchableOpacity onPress={handleRefresh} style={{ backgroundColor: Colors.lightGray, padding: 8, borderRadius: 50, width: 50, height: 50, alignItems: 'center', justifyContent: 'center' }}>
                            <Ionicons size={32} name='reload' />
                          </TouchableOpacity>
                        </View>}
                    </>

                  }

                </>

              }

              {(category == "Flights") &&

                <>

                  {!flights ?
                    <View style={{ flex: 1, height: 500, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', gap: 30 }}>
                      <Text style={{ fontFamily: 'mon-sb' }}>Error</Text>
                      <Text style={{ fontFamily: "mon" }}>Couldn't fetch posts</Text>
                      <TouchableOpacity onPress={handleRefresh} style={{ backgroundColor: Colors.lightGray, padding: 8, borderRadius: 50, width: 50, height: 50, alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons size={32} name='reload-outline' />
                      </TouchableOpacity>
                    </View>
                    :
                    <>
                      {items.length > 0 ?
                    
                          <FlightsBottomSheet flights={flights} category={category} />
                    
                        :
                        <View style={{ flex: 1, height: 500, alignItems: 'center', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
                          <Text style={{ fontFamily: 'mon-sb' }}>Nothing to show</Text>
                          {/* <Text style={{ fontFamily: "mon" }}></Text> */}
                          <TouchableOpacity onPress={handleRefresh} style={{ backgroundColor: Colors.lightGray, padding: 8, borderRadius: 50, width: 50, height: 50, alignItems: 'center', justifyContent: 'center' }}>
                            <Ionicons size={32} name='reload' />
                          </TouchableOpacity>
                        </View>}
                    </>

                  }

                </>

              }

            </>
        }


      </View>
    </LinearGradient>
  );
};

export default Page;
