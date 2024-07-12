import { useFonts } from 'expo-font';
import { Link, SplashScreen, Stack, useRootNavigationState, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import ModalHeaderText from '@/components/ModalHeaderText';
import { TouchableOpacity, SafeAreaView, useColorScheme, Text, View, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider, useAuth } from './context/AuthContext';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { Buffer } from 'buffer';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

//@ts-ignore
navigator.geolocation = require('@react-native-community/geolocation');
const TOKEN_KEY = 'Secret'

// Cache the Clerk JWT
const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export {
  ErrorBoundary,
} from 'expo-router';

SplashScreen.preventAutoHideAsync();


const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: Colors.green, borderRadius: 10 }}
      contentContainerStyle={{ paddingHorizontal: 15, borderRadius: 10 }}
      text1Style={{
        fontSize: 17,
        fontFamily: 'mon-sb'
      }}
      text2Style={{
        fontSize: 15,
        fontFamily: 'mon',
        fontWeight: '500'
      }}
    />
  ),

  info: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#4287f5', borderRadius: 10 }}
      contentContainerStyle={{ paddingHorizontal: 15, borderRadius: 10 }}
      text1Style={{
        fontSize: 17,
        fontFamily: 'mon-sb'
      }}
      text2Style={{
        fontSize: 15,
        fontFamily: 'mon',
        fontWeight: '500'
      }}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: Colors.red, borderRadius: 10 }}
      contentContainerStyle={{ paddingHorizontal: 15, borderRadius: 10 }}
      text1Style={{
        fontSize: 17,
        fontFamily: 'mon-sb'
      }}
      text2Style={{
        fontSize: 15,
        fontFamily: 'mon',
        fontWeight: '500'
      }}
    />
  ),


};


export default function RootLayout() {
  return (
    <>

      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <BottomSheetModalProvider>
            <RootLayoutNav />
            <Toast
              config={toastConfig} />
          </BottomSheetModalProvider>
        </AuthProvider>
      </GestureHandlerRootView >

    </>

  );
}

function RootLayoutNav() {
  const router = useRouter();
  const segments = useSegments();
  const { authState, onLogout } = useAuth()
  const rootNavigationState = useRootNavigationState()
  const phoneVerified = authState?.phone_verified


  const [loaded, error] = useFonts({
    'TwemojiMozilla': require('../assets/fonts/Montserrat-Regular.ttf'),
    mon: require('../assets/fonts/Montserrat-Regular.ttf'),
    'mon-sb': require('../assets/fonts/Montserrat-SemiBold.ttf'),
    'mon-b': require('../assets/fonts/Montserrat-Bold.ttf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);


  // useEffect(() => {
  //   const loadToken = async () => {
  //     const token = await SecureStore.getItemAsync(TOKEN_KEY)
  //     // if (token && !authState?.phone_verified) {
  //     //   const decodedToken = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
  //     //   router.push({
  //     //     pathname: '/verify/[phone]',
  //     //     params: { phone: decodedToken.phone_number, signin: 'true' },
  //     //   });
  //     // }
  //   }
  //   loadToken()
  // }, [authState?.phone_verified])


  useEffect(() => {
    if (!loaded) {

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>

    }
  }, [loaded]);


  useEffect(() => {
    const inAuthGroup = segments[0] === '(authenticated)';

    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY)

      if (token) {
        const decodedToken = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())

        if (Date.now() > (decodedToken.exp * 1000)) {

          setTimeout(() => {
            Toast.show({
              type: 'info',
              text1: "Session expired",
              text2: "Please, login again"
            });
          }, 2000);
          await SecureStore.deleteItemAsync(TOKEN_KEY)
          router.replace('/login');
        } else {
          if (authState?.authenticated && !inAuthGroup) {
            if (authState.phone_verified) {
              router.replace('/(authenticated)/(tabs)');
            }
            else {
              router.push({
                pathname: '/verify/[phone]',
                params: { phone: "+251994697123", signin: 'true' },
              });
            }
          } else if (!authState?.authenticated) {
            router.replace('/');
          }
        }
      } else {
        router.replace('/');
      }


    }
    loadToken()



  }, [authState?.authenticated, authState?.phone_verified]);





  return (

    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="signup"
        options={{
          title: '',
          headerBackTitle: '',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.background },
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <Ionicons name="arrow-back" size={34} color={Colors.dark} />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="login"
        options={{
          title: '',
          headerBackTitle: '',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.background },
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <Ionicons name="arrow-back" size={34} color={Colors.dark} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <Link href={'/help'} asChild>
              <TouchableOpacity>
                <Ionicons name="help-circle-outline" size={34} color={Colors.dark} />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />

      <Stack.Screen name="help" options={{ title: 'Help', presentation: 'modal' }} />
      <Stack.Screen name="(modals)/CountrySelect" options={{ title: 'Select Country', presentation: 'modal' }} />

      <Stack.Screen
        name="verify/[phone]"
        options={{
          title: '',
          headerBackTitle: '',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.background },
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <Ionicons name="arrow-back" size={34} color={Colors.dark} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="(authenticated)/(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(authenticated)/listing/[slug]" options={{ headerTitle: '' }} />
      <Stack.Screen
        name="(authenticated)/(modals)/booking"
        options={{
          presentation: 'transparentModal',
          animation: 'fade',
          headerTransparent: true,
          headerBackVisible: false,
          headerTitle: (props) => <ModalHeaderText />,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                backgroundColor: '#fff',
                borderColor: Colors.gray,
                borderRadius: 20,
                borderWidth: 1,
                padding: 4,
              }}>
              <Ionicons name="close-outline" size={22} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="(authenticated)/(modals)/uploadPayment/[id]"
        options={{
          presentation: 'fullScreenModal',
          animation: 'fade',
          headerTransparent: true,
          headerBackVisible: false,
          headerTitle: (props) => <Text style={{ paddingHorizontal: 24, fontFamily: 'mon-sb' }}>Verify payment</Text>,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                backgroundColor: '#fff',
                borderColor: Colors.gray,
                borderRadius: 20,
                borderWidth: 1,
                padding: 4,
              }}>
              <Ionicons name="close-outline" size={22} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
