import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { Link, useLocalSearchParams } from 'expo-router';
import { Fragment, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { useAuth } from '../context/AuthContext';
import Toast from 'react-native-toast-message';
const CELL_COUNT = 6;

const Page = () => {
  const { phone, signin } = useLocalSearchParams<{ phone: string; signin: string }>();
  const [code, setCode] = useState('');
  const { onVerifySignin } = useAuth();

  const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  });

  useEffect(() => {
    if (code.length === 6) {
      if (signin === 'true') {
        verifyCode();
      } else {
        verifyCode();
      }
    }
  }, [code]);

  console.log(code)

  const verifyCode = async () => {
    try {
      await onVerifySignin!(code);
    } catch (err) {
      console.log("error", JSON.stringify(err, null, 2));
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong',
        visibilityTime: 1500
      });
    }
  };

  // const verifySignIn = async () => {
  //   try {
  //     await signIn!.attemptFirstFactor({
  //       strategy: 'phone_code',
  //       code,
  //     });
  //     await setActive!({ session: signIn!.createdSessionId });
  //   } catch (err) {
  //     console.log('error', JSON.stringify(err, null, 2));
  //     if (isClerkAPIResponseError(err)) {
  //       Alert.alert('Error', err.errors[0].message);
  //     }
  //   }
  // };

  return (
    <View style={[defaultStyles.container, { padding: 20, alignItems: 'center' }]}>
      <Text style={defaultStyles.header}>Verify your phone</Text>
      <View style={{ flexDirection: 'row' }}>
        <Text style={defaultStyles.descriptionText}>
          Verification code has been sent to <Text style={{ color: Colors.muted }}>
            {phone}
          </Text>
        </Text>
      </View>

      <CodeField
        ref={ref}
        {...props}
        value={code}
        onChangeText={setCode}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => (
          <Fragment key={index}>
            <View
              // Make sure that you pass onLayout={getCellOnLayoutHandler(index)} prop to root component of "Cell"
              onLayout={getCellOnLayoutHandler(index)}
              key={index}
              style={[styles.cellRoot, isFocused && styles.focusCell]}>
              <Text style={styles.cellText}>{symbol || (isFocused ? <Cursor /> : null)}</Text>
            </View>
            {index === 2 ? <View key={`separator-${index}`} style={styles.separator} /> : null}
          </Fragment>
        )}
      />
      <View style={{ gap: 10, alignItems: 'center' }}>
        <Text style={{ fontFamily: 'mon-sb' }}>Didn't recieve a code?</Text>
        <TouchableOpacity style={[defaultStyles.btn, { backgroundColor: Colors.primary, padding: 10 }]}>
          <Text style={{ fontFamily: 'mon-sb', color: '#fff' }}>Resend</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  codeFieldRoot: {
    marginVertical: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
    gap: 12,
  },
  cellRoot: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
  },
  cellText: {
    color: '#000',
    fontSize: 24,
    textAlign: 'center',
  },
  focusCell: {
    paddingBottom: 8,
  },
  separator: {
    height: 2,
    width: 10,
    backgroundColor: Colors.gray,
    alignSelf: 'center',
  },
});
export default Page;
