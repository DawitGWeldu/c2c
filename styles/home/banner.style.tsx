import Colors from "@/constants/Colors";
import { StyleSheet } from "react-native";
import { responsiveWidth } from "react-native-responsive-dimensions";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const styles = StyleSheet.create({
  sliderImage: {
    height: hp("30%"),
    borderRadius: 15,
    overflow: "hidden",
  },
  container: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.lightGray,
    height: hp("30%"),
    borderRadius: 15, 
    overflow: "hidden",
  },

  slide: { 
    flex: 1,
  },


  dot: {
    backgroundColor: Colors.lightGray,
    elevation: 2,
    marginBottom: -10,
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 3,
  },

  activeDot: {
    backgroundColor: Colors.primary,
    elevation: 2,
    width: 10,
    marginBottom: -10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 3,
  },

});
