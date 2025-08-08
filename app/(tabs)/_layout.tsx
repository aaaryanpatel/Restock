// import { Tabs } from "expo-router";
// import { Feather } from "@expo/vector-icons";

// export default function TabLayout() {
//   return (
//     <Tabs>
//       {/* Hide the index tab from the tab bar */}
//       <Tabs.Screen
//         name="index"
//         options={{
//           href: null, // This hides it
//         }}
//       />
//       <Tabs.Screen
//         name="camera"
//         options={{
//           headerShown:false,
//           title: "Home",
//           tabBarIcon: ({ color, size }) => (
//             <Feather name="home" color={color} size={size} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="list"
//         options={{
//           title: "List",
//           headerShown:false,
//           tabBarIcon: ({ color, size }) => (
//             <Feather name="list" color={color} size={size} />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }


// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";

export default function TabLayout() {
  return (


    
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2563eb",
        tabBarLabelStyle: { fontSize: 14 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href:null,
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: "Home",
          headerShown:false,
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          title: "List",
          headerShown:false,

          tabBarIcon: ({ color, size }) => (
            <Feather name="list" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}



