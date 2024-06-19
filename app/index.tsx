import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { Link } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

const Page = () => {


  const openLink = () => {
    Linking.openURL('https://galaxies.dev');
  };


  return (
    <>
      <View style={styles.container}>
        <Text style={[styles.header, { color: Colors.dark }]}>Welcome</Text>

        <View style={{ marginTop: 80, width: 700, height: '65%', padding: 20 }}>
        </View>



        <Text style={styles.description}>
          Read our{' '}
          <Text style={styles.link} onPress={openLink}>
            Privacy Policy
          </Text>
          . {'By continuing you to use the app, you agree to the '}
          <Text style={styles.link} onPress={openLink}>
            Terms of Service
          </Text>
          .
        </Text>



      </View>
      <View style={styles.buttons}>
        <Link
          href={'/login'}
          style={[defaultStyles.btn, { flex: 1, backgroundColor: Colors.primary }]}
          asChild>
          <TouchableOpacity>
            <Text style={{ color: 'white', fontSize: 22, fontWeight: '500' }}>Log in</Text>
          </TouchableOpacity>
        </Link>
        <Link
          href={'/signup'}
          style={[defaultStyles.btn, { flex: 1, backgroundColor: Colors.lightGray }]}
          asChild>
          <TouchableOpacity>
            <Text style={{ fontSize: 22, fontWeight: '500' }}>Sign up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50
  },
  welcome: {
    width: '100%',
    height: 300,
    borderRadius: 60,
    marginBottom: 80,
  },
  video: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  header: {
    fontSize: 30,
    fontFamily: 'mon-b',
    fontWeight: '800',
    textTransform: 'uppercase',
    color: 'white',
  },
  header_light: {
    fontSize: 28,
    fontWeight: '900',
    textTransform: 'uppercase',
    // color: 'white',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: "10%",
    paddingHorizontal: 20,
    fontFamily: 'mon-sb'
  },
  headline: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  description: {
    fontFamily: 'mon',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 80,
    color: Colors.gray,
  },
  link: {
    color: Colors.primary,
  },
});
export default Page;
