import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useMemo, useRef, useState } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import Listings from '@/components/Listings';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import HomeBannerSlider from './HomeSlider';

interface Props {
  listings: any[];
  category: string;
}

// Bottom sheet that wraps our Listings component
const ListingsBottomSheet = ({ listings, category }: Props) => {
  const snapPoints = useMemo(() => ['10%', '100%'], []);
  const bottomSheetRef = useRef<View>(null);
  const [refresh, setRefresh] = useState<number>(0);

  const onShowMap = () => {
    // bottomSheetRef.current?.collapse();
    setRefresh(refresh + 1);
  };

  return (
    // <View
    // ref={bottomSheetRef}
    // index={1}
    // snapPoints={snapPoints}
    // enablePanDownToClose={false}
    // handleIndicatorStyle={{ backgroundColor: Colors.dark }}
    // style={styles.sheetContainer}>
    <View style={styles.contentContainer}>

      <Listings listings={listings} refresh={refresh} category={category} />
       {/* add floating chat button here */}
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    marginTop: 16
  },
  absoluteView: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  btn: {
    backgroundColor: Colors.dark,
    padding: 14,
    height: 50,
    borderRadius: 30,
    flexDirection: 'row',
    marginHorizontal: 'auto',
    alignItems: 'center',
  },
  sheetContainer: {
    // backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
});

export default ListingsBottomSheet;
