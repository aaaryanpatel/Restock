import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs>
      {/* Hide the index tab from the tab bar */}
      <Tabs.Screen
        name="index"
        options={{
          href: null, // This hides it
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          title: "List",
          tabBarIcon: ({ color, size }) => (
            <Feather name="list" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
