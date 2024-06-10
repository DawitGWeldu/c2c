import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { Link } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Page = () => {

  return (
    <View style={styles.container}>
      <View style={{ marginTop: 80, padding: 20 }}>
        <Text style={[styles.header, {color: Colors.dark}]}>WELCOME!</Text>
        <Text style={[styles.header_light, {color: Colors.gray}]}> Log in or create an account to continue.</Text>
      </View>

      <View style={styles.buttons}>
        <Link
          href={'/login'}
          style={[defaultStyles.btn, { flex: 1, backgroundColor: Colors.dark }]}
          asChild>
          <TouchableOpacity>
            <Text style={{ color: 'white', fontSize: 22, fontWeight: '500' }}>Log in</Text>
          </TouchableOpacity>
        </Link>
        <Link
          href={'/signup'}
          style={[defaultStyles.btn, { flex: 1, backgroundColor: '#fff' }]}
          asChild>
          <TouchableOpacity>
            <Text style={{ fontSize: 22, fontWeight: '500' }}>Sign up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  video: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  header: {
    fontSize: 36,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: 'white',
  },
  header_light: {
    fontSize: 28,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: 'white',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 60,
    paddingHorizontal: 20,
  },
});
export default Page;
