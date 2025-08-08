import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, Image, StyleSheet, Text, View } from "react-native";

// Replace with your Google Vision API key!
const GOOGLE_CLOUD_VISION_API_KEY = "e";

export default function CameraScreen() {
  const [items, setItems] = useState<{ id: string; text: string; input: string }[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera access is required!');
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      // *** Lower quality for much faster upload ***
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect:[16,9],
        
        base64: true,
        quality: 0.2, // reduce size for speed (try 0.1 for even faster!)
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setLoading(true); // Show spinner ASAP!
        const photo = result.assets[0];
        setImage(photo.uri);

        try {
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
            Alert.alert("No text found!");
          }
        } catch (err) {
          Alert.alert("OCR Error", "Failed to recognize text.");
          console.log("OCR error:", err);
        }
        setLoading(false);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to launch camera');
      console.log('Camera error:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restock OCR Scanner</Text>
      <Button title="Take Photo of Tag" onPress={pickImage} />
      {loading && <ActivityIndicator size="large" color="#1e90ff" style={{ marginTop: 20 }} />}
      {image && !loading && <Image source={{ uri: image }} style={styles.image} />}
      <Button
        title="Show List"
        onPress={() =>
          router.push({
            pathname: "/list",
            params: { items: JSON.stringify(items) }
          })
        }
        disabled={items.length === 0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", alignSelf: "center", margin: 10 },
  image: { width: 200, height: 200, alignSelf: "center", marginVertical: 10, borderRadius: 8 },
});
