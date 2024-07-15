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
        tabBarInactiveTintColor: Colors.gray,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontFamily: 'mon-sb',
        },
        tabBarStyle: {
          backgroundColor: 'linear-gradient(90deg, rgba(243,247,247,1) 0%, rgba(222,228,247,1) 100%)',
          height: 55,
          paddingVertical: 4
        }
      }}
      >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ size, color }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="myposts"
        options={{
          headerShown: false,
          tabBarLabel: 'My posts',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="bookmark-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          headerShown: false,
          tabBarLabel: 'Create',
          tabBarIconStyle: {borderRadius: 50, width: 42, fontWeight: 'bold'},
          tabBarIcon: ({ size, color }) => <Ionicons name="add-circle" size={35} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          headerShown: false,
          tabBarLabel: 'Inbox',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="chatbox-ellipses-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'profile',
          headerShown: false,
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default Layout;
