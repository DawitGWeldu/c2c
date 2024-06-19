import { View, Text, Image } from "react-native";
// import { useFonts, Raleway_700Bold } from "@expo-google-fonts/raleway";
// import { Nunito_400Regular, Nunito_700Bold } from "@expo-google-fonts/nunito";
import { styles } from "@/styles/home/banner.style";
import Swiper from "react-native-swiper";
// import { bannerData } from "@/constants/constans";
type BannerDataTypes = {
  bannerImageUrl: any;
};


const bannerData: BannerDataTypes[] = [
  {
    bannerImageUrl: require("../assets/banner/1.jpg"),
  },
  {
    bannerImageUrl: require("../assets/banner/2.webp"),
  },
  {
    bannerImageUrl: require("../assets/banner/3.webp"),
  },
  {
    bannerImageUrl: require("../assets/banner/4.webp"),
  },
];


export default function HomeBannerSlider() {

  return (
    <View style={styles.container}>
      <Swiper
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
        autoplay={true}
        autoplayTimeout={5}
        removeClippedSubviews={false}
      >
        {bannerData.map((item: BannerDataTypes, index: number) => (
          <View key={index} style={styles.slide}>
          <Image
            key={ index}
            source={item.bannerImageUrl}
            style={styles.sliderImage}
          />
          </View>
        ))}
      </Swiper>
    </View>
  );
}