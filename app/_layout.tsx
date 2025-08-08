// import React, { useState } from "react";
// import { Slot } from "expo-router";
// import SplashScreen from "./SplashScreen"; // adjust the path if needed

// export default function RootLayout() {
//   const [showSplash, setShowSplash] = useState(true);

//   if (showSplash) {
//     return <SplashScreen onFinish={() => setShowSplash(false)} />;
//   }

//   return <Slot />;
// }

////////////.//////



// app/_layout.tsx
// import { Drawer } from 'expo-router/drawer';

// export default function RootLayout() {
//   return (
//     <Drawer
//       screenOptions={{
//         drawerStyle: { width: 300 },
//         headerShown: false, // We’ll show our own headers in each screen if needed
//         drawerLabelStyle: { fontSize: 18 },
//         swipeEdgeWidth: 40, // Pixels from left to trigger swipe open
//         swipeEnabled: true, // Enable swipe to open drawer
        
//       }}
//     >
//       <Drawer.Screen name="(tabs)" options={{ drawerLabel: "Home" }} />
//       <Drawer.Screen name="about" options={{ drawerLabel: "About" }} />
//       <Drawer.Screen name="privacy" options={{ drawerLabel: "Privacy" }} />
      
//     </Drawer>
//   );
// }





import React, { useState, useEffect } from "react";
import { Drawer } from 'expo-router/drawer';
import SplashScreen from "./SplashScreen"; // adjust path if needed

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <Drawer
      screenOptions={{
        drawerStyle: { width: 300 },
        headerShown: false,
        drawerLabelStyle: { fontSize: 18 },
        swipeEdgeWidth: 40,
        swipeEnabled: true,
      }}
    >
      <Drawer.Screen name="(tabs)" options={{ drawerLabel: "Home" }} />
      <Drawer.Screen name="about" options={{ drawerLabel: "About" }} />
      <Drawer.Screen name="privacy" options={{ drawerLabel: "Privacy" }} />
    </Drawer>
  );
}



