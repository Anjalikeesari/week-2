import { Tabs } from "expo-router";
import { Camera, Clock, BookOpen, User } from "lucide-react-native";
import { useTheme } from "@/utils/theme";

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.tabBar.background,
          borderTopWidth: 1,
          borderTopColor: theme.colors.tabBar.border,
          paddingBottom: 10,
          paddingTop: 10,
          height: 80,
        },
        tabBarActiveTintColor: theme.colors.tabBar.active,
        tabBarInactiveTintColor: theme.colors.tabBar.inactive,
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: "Roboto_400Regular",
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="camera"
        options={{
          title: "Classify",
          tabBarIcon: ({ color, size }) => <Camera color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, size }) => <Clock color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="education"
        options={{
          title: "Learn",
          tabBarIcon: ({ color, size }) => <BookOpen color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User color={color} size={20} />,
        }}
      />
    </Tabs>
  );
}
