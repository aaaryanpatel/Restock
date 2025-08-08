// import * as ImagePicker from "expo-image-picker";
// import { useRouter } from "expo-router";
// import React, { useEffect, useState } from "react";
// import { ActivityIndicator, Alert, Button, Image, StyleSheet, Text, View } from "react-native";

// // Replace with your Google Vision API key!
// const GOOGLE_CLOUD_VISION_API_KEY = "e";

// export default function CameraScreen() {
//   const [items, setItems] = useState<{ id: string; text: string; input: string }[]>([]);
//   const [image, setImage] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const router = useRouter();

//   useEffect(() => {
//     (async () => {
//       const { status } = await ImagePicker.requestCameraPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission needed', 'Camera access is required!');
//       }
//     })();
//   }, []);

//   const pickImage = async () => {
//     try {
//       // *** Lower quality for much faster upload ***
//       let result = await ImagePicker.launchCameraAsync({
//         allowsEditing: true,
//         aspect:[16,9],
        
//         base64: true,
//         quality: 0.2, // reduce size for speed (try 0.1 for even faster!)
//       });

//       if (!result.canceled && result.assets && result.assets.length > 0) {
//         setLoading(true); // Show spinner ASAP!
//         const photo = result.assets[0];
//         setImage(photo.uri);

//         try {
//           const body = {
//             requests: [
//               {
//                 image: { content: photo.base64 },
//                 features: [{ type: "TEXT_DETECTION" }],
//               },
//             ],
//           };

//           const res = await fetch(
//             `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_VISION_API_KEY}`,
//             {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify(body),
//             }
//           );
//           const data = await res.json();

//           let parsedText = "";
//           if (
//             data.responses &&
//             data.responses[0] &&
//             data.responses[0].fullTextAnnotation &&
//             data.responses[0].fullTextAnnotation.text
//           ) {
//             parsedText = data.responses[0].fullTextAnnotation.text;
//           } else if (
//             data.responses &&
//             data.responses[0] &&
//             data.responses[0].textAnnotations &&
//             data.responses[0].textAnnotations[0] &&
//             data.responses[0].textAnnotations[0].description
//           ) {
//             parsedText = data.responses[0].textAnnotations[0].description;
//           }

//           if (parsedText) {
//             setItems((prev) => [
//               ...prev,
//               { id: Date.now().toString(), text: parsedText.trim(), input: "" },
//             ]);
//           } else {
//             Alert.alert("No text found!");
//           }
//         } catch (err) {
//           Alert.alert("OCR Error", "Failed to recognize text.");
//           console.log("OCR error:", err);
//         }
//         setLoading(false);
//       }
//     } catch (err) {
//       Alert.alert('Error', 'Failed to launch camera');
//       console.log('Camera error:', err);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Restock OCR Scanner</Text>
//       <Button title="Take Photo of Tag" onPress={pickImage} />
//       {loading && <ActivityIndicator size="large" color="#1e90ff" style={{ marginTop: 20 }} />}
//       {image && !loading && <Image source={{ uri: image }} style={styles.image} />}
//       <Button
//         title="Show List"
//         onPress={() =>
//           router.push({
//             pathname: "/list",
//             params: { items: JSON.stringify(items) }
//           })
//         }
//         disabled={items.length === 0}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, paddingTop: 40, backgroundColor: "#fff" },
//   title: { fontSize: 24, fontWeight: "bold", alignSelf: "center", margin: 10 },
//   image: { width: 200, height: 200, alignSelf: "center", marginVertical: 10, borderRadius: 8 },
// });

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet, SafeAreaView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

const GOOGLE_CLOUD_VISION_API_KEY = "Key"; // API-Key

export default function CameraScreen() {
  const [items, setItems] = useState<{ id: string; text: string; input: string }[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Camera permission is required.");
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 9],
        base64: true,
        quality: 0.2,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setLoading(true);
        const photo = result.assets[0];
        setImage(photo.uri);

        // OCR request
        const body = {
          requests: [
            {
              image: { content: photo.base64 },
              features: [{ type: "TEXT_DETECTION" }],
            },
          ],
        };

        const res = await fetch(
          `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_VISION_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );
        const data = await res.json();
        let parsedText = "";
        if (
          data.responses &&
          data.responses[0] &&
          data.responses[0].fullTextAnnotation &&
          data.responses[0].fullTextAnnotation.text
        ) {
          parsedText = data.responses[0].fullTextAnnotation.text;
        } else if (
          data.responses &&
          data.responses[0] &&
          data.responses[0].textAnnotations &&
          data.responses[0].textAnnotations[0] &&
          data.responses[0].textAnnotations[0].description
        ) {
          parsedText = data.responses[0].textAnnotations[0].description;
        }
        if (parsedText) {
          setItems((prev) => [
            ...prev,
            { id: Date.now().toString(), text: parsedText.trim(), input: "" },
          ]);
        } else {
          alert("No text found!");
        }
        setLoading(false);
      }
    } catch (err) {
      alert("Failed to launch camera.");
      setLoading(false);
    }
  };

  return (
    
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Feather name="box" size={30} color="#111" />
        <Text style={styles.headerTitle}>Restock</Text>
      </View>

      {/* SEARCH / CAMERA CARD */}
      <View style={styles.card}>
        <Text style={styles.title}>Scan a Product Tag</Text>
        <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
          <Feather name="camera" size={28} color="#2563eb" />
          <Text style={styles.cameraButtonText}>Take Photo</Text>
        </TouchableOpacity>
        {loading && <ActivityIndicator size="large" color="#2563eb" style={{ marginVertical: 18 }} />}
        {image && !loading && (
          <Image source={{ uri: image }} style={styles.previewImg} resizeMode="cover" />
        )}
      </View>

      {/* ACTIONS */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.listButton,
            { backgroundColor: items.length ? "#2563eb" : "#e5e7eb" },
          ]}
          disabled={items.length === 0}
          onPress={() => router.push({ pathname: "/list", params: { items: JSON.stringify(items) } })}
        >
          <Feather name="list" size={22} color="#fff" />
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 17, marginLeft: 6 }}>Show List</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 24,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111",
    marginLeft: 9,
    letterSpacing: 1.3,
  },
  card: {
    marginHorizontal: 18,
    marginTop: 25,
    backgroundColor: "#FEFEFE",
    borderRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.09,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    padding: 22,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    color: "#111",
    fontWeight: "bold",
    marginBottom: 20,
  },
  cameraButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: "#2563eb",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 22,
    marginBottom: 16,
    marginTop: 10,
  },
  cameraButtonText: {
    fontSize: 17,
    color: "#2563eb",
    fontWeight: "500",
    marginLeft: 7,
  },
  previewImg: {
    width: 210,
    height: 120,
    borderRadius: 12,
    marginTop: 7,
    marginBottom: 10,
  },
  actions: {
    marginTop: 32,
    alignItems: "center",
  },
  listButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "#2563eb",
    paddingVertical: 13,
    paddingHorizontal: 36,
    marginBottom: 20,
  },
});



