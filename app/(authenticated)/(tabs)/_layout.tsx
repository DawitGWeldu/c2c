import { Tabs } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

const Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarShowLabel: false,
        tabBarLabelStyle: {
          fontFamily: 'mon-sb',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ size, color }) => <MaterialIcons name="home" size={32} color={color} />,
        }}
      />
      <Tabs.Screen
        name="whishlists"
        options={{
          tabBarLabel: 'My Listings',
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="luggage" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          headerShown: false,
          tabBarLabel: 'Create',
          tabBarIconStyle: {borderRadius: 25, width: 70, fontWeight: 'bold', backgroundColor: Colors.primary},
          tabBarIcon: ({ size, color }) => <Ionicons name="add" size={size} color={'#fff'} />,
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          headerShown: false,
          tabBarLabel: 'Inbox',
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="message-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'Tasks',
          headerShown: false,
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="task" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default Layout;
