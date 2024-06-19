import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { useRef, useState } from 'react';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { useAuth } from '@/app/context/AuthContext';

const categories = [
  {
    name: 'All',
  },
  {
    name: 'Listings',
  },
  {
    name: 'Flights',
  },
  {
    name: 'Tasks',
  }
];

interface Props {
  onCategoryChanged: (category: string) => void;
}

const ExploreHeader = ({ onCategoryChanged }: Props) => {
  const scrollRef = useRef<ScrollView>(null);
  const itemsRef = useRef<Array<TouchableOpacity | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const {onLogout} = useAuth()
  const selectCategory = (index: number) => {
    const selected = itemsRef.current[index];
    setActiveIndex(index);
    selected?.measure((x) => {
      scrollRef.current?.scrollTo({ x: x - 16, y: 0, animated: true });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCategoryChanged(categories[index].name);
  };

   const handleLogout = () => {
    onLogout!()
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <View style={styles.actionRow}>
          <Link href={'/(modals)/booking'} asChild>
            <TouchableOpacity>
              <View style={styles.searchBtn}>
                <Ionicons name="search" size={24} />
                <View>
                  <Text style={{ fontFamily: 'mon-sb' }}>Search</Text>
                  {/* <Text style={{ color: Colors.gray, fontFamily: 'mon' }}>Anywhere · Any time</Text> */}
                </View>
              </View>
            </TouchableOpacity>
          </Link>
          <Pressable onPress={handleLogout} style={styles.filterBtn}>
            <Ionicons name="person" size={24} />
          </Pressable>
        </View>

        <ScrollView
          horizontal
          ref={scrollRef}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: 'center',
            gap: 20,
            paddingHorizontal: 16,
          }}
          >
          {categories.map((item, index) => (
              <TouchableOpacity
                ref={(el) => (itemsRef.current[index] = el)}
                key={index}
                style={activeIndex === index ? styles.categoriesBtnActive : styles.categoriesBtn}
                onPress={() => selectCategory(index)}>
                {/* <MaterialIcons
                  name={item.icon as any}
                  size={24}
                  color={activeIndex === index ? '#000' : Colors.gray}
                /> */}
                <Text style={activeIndex === index ? styles.categoryTextActive : styles.categoryText}>
                  {item.name}
                </Text>
              </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#000',
    height: 120,
    gap: 8,
    paddingTop: 16,
  
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    // marginBottom: 8,
  },

  searchBtn: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    gap: 10,
    padding: 10,
    alignItems: 'center',
    minWidth: 280,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#c2c2c2',
    borderRadius: 60,
    
  },
  filterBtn: {
    padding: 10,
    backgroundColor: Colors.lightGray,
    borderRadius: 24,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'mon-sb',
    color: Colors.gray,
  },
  categoryTextActive: {
    fontSize: 14,
    fontFamily: 'mon-sb',
    color: '#fff',
  },
  categoriesBtn: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  categoriesBtnActive: {
    backgroundColor: Colors.primary,
    padding: 5,
    borderRadius: 15,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ExploreHeader;
