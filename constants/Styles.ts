import Colors from '@/constants/Colors';
import { StyleSheet } from 'react-native';
import { responsiveWidth } from "react-native-responsive-dimensions";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";


export const defaultStyles = StyleSheet.create({
  container: {
    // marginTop: 12,
    height: hp("35"),
    paddingHorizontal: 16,
  },
  inputField: {
    height: 44,
    borderWidth: 1,
    borderColor: '#ABABAB',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  btn: {
    backgroundColor: Colors.primary,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'mon-b',
  },
  btnIcon: {
    position: 'absolute',
    left: 16,
  },
  footer: {
    position: 'absolute',
    height: 100,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    // paddingVertical: 10,
    padding: 20,
    // borderTopColor: Colors.gray,
    // borderTopWidth: StyleSheet.hairlineWidth,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.lightGray,
    marginLeft: 50,
  },
  header: {
    fontSize: 30,
    fontWeight: '700',
  },
  pillButton: {
    padding: 10,
    height: 60,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  descriptionText: {
    fontFamily: 'mon',
    fontSize: 15,
    marginVertical: 10,
    color: Colors.gray,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  pillButtonSmall: {
    paddingHorizontal: 20,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextSmall: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 20,
    marginBottom: 10,
  },
  block: {
    marginHorizontal: 20,
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 16,
    gap: 20,
  },
  

  slide: { flex: 1, borderRadius: 10},

  background: {
    width: "100%",
    height: hp("27"),
    backgroundColor: '#222',
    resizeMode: "stretch",
    zIndex: 1,
  },

  dot: {
    backgroundColor: Colors.lightGray,
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 3,
  },

  activeDot: {
    backgroundColor: Colors.primary,
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 3,
  },

  backgroundView: {
    position: "absolute",
    zIndex: 5,
    paddingHorizontal: 18,
    paddingVertical: 30,
    flexDirection: "row",
    alignItems: "center",
  },

  backgroundViewContainer: {
    width: responsiveWidth(45),
    height: responsiveWidth(30),
    marginTop: -50,
  },

  backgroundViewText: {
    color: "white",
    fontSize: hp("2.7%"),
  },

  backgroundViewOffer: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    marginTop: 5,
  },

  backgroundViewImage: {
    width: wp("38%"),
    height: hp("22%"),
    top: -15,
  },

  backgroundViewButtonContainer: {
    borderWidth: 1.1,
    borderColor: "rgba(255, 255, 255, 0.5)",
    width: 109,
    height: 32,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },

  backgroundViewButtonText: {
    color: "#FFFF",
  }
});



