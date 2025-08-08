// import React, { useState, useEffect } from "react";
// import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from "react-native";
// import { useLocalSearchParams } from "expo-router";
// import * as Clipboard from "expo-clipboard";
// import { Ionicons } from '@expo/vector-icons';

// type ItemType = {
//   id: string;
//   text: string;
//   input: string;
// };

// export default function ListScreen() {
//   const params = useLocalSearchParams();
//   const initialItems: ItemType[] = params.items
//     ? (() => {
//         try {
//           return JSON.parse(params.items as string);
//         } catch (e) {
//           return [];
//         }
//       })()
//     : [];
//   const [items, setItems] = useState<ItemType[]>(initialItems);
//   const [copiedId, setCopiedId] = useState<string | null>(null);

//   useEffect(() => {
//     setItems(initialItems);
//   }, [params.items]);

//   const handleInputChange = (id: string, value: string) => {
//     if (!/^\d*$/.test(value)) return;
//     setItems((prev) =>
//       prev.map((item) =>
//         item.id === id ? { ...item, input: value } : item
//       )
//     );
//   };

//   const handleCopy = async (id: string, text: string) => {
//     await Clipboard.setStringAsync(text);
//     setCopiedId(id);
//     setTimeout(() => setCopiedId(null), 1200);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Scanned Items</Text>
//       <FlatList
//         data={items}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item, index }) => (
//           <View style={styles.row}>
//             <TextInput
//               style={styles.textBox}
//               value={`${index + 1}. ${item.text}`}
//               editable={false}
//               selectTextOnFocus={false}
//               pointerEvents="none"
//             />
//             <TextInput
//               style={styles.input}
//               value={item.input}
//               placeholder="Qty"
//               keyboardType="numeric"
//               maxLength={4}
//               onChangeText={(text) => handleInputChange(item.id, text)}
//             />
//             <TouchableOpacity style={styles.copyButton} onPress={() => handleCopy(item.id, item.text)}>
//               {copiedId === item.id ? (
//                 <Ionicons name="checkmark-circle" size={22} color="#2563eb" />
//               ) : (
//                 <Ionicons name="copy-outline" size={22} color="#888" />
//               )}
//             </TouchableOpacity>
//           </View>
//         )}
//         ListEmptyComponent={
//           <Text style={{ textAlign: "center", marginTop: 40, color: "#666" }}>
//             No scanned items yet.
//           </Text>
//         }
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, paddingTop: 40, backgroundColor: "#fff" },
//   title: { fontSize: 22, fontWeight: "bold", alignSelf: "center", margin: 10 },
//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 18,
//     marginVertical: 8,
//   },
//   textBox: {
//     flex: 3,
//     backgroundColor: "#f1f5f9",
//     borderColor: "#e5e7eb",
//     borderWidth: 1,
//     borderRadius: 8,
//     color: "#6b7280",
//     fontSize: 16,
//     paddingVertical: 7,
//     paddingHorizontal: 10,
//     marginRight: 6,
//   },
//   input: {
//     flex: 1,
//     borderColor: "#ddd",
//     borderWidth: 1,
//     borderRadius: 8,
//     padding: 6,
//     marginRight: 6,
//     fontSize: 16,
//     textAlign: "center",
//     width: 60,
//     backgroundColor: "#fff",
//   },
//   copyButton: {
//     backgroundColor: "#f3f4f6",
//     borderRadius: 8,
//     padding: 8,
//     marginLeft: 2,
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });


///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
///////////////////////////////////

import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { Feather } from "@expo/vector-icons";

type ItemType = {
  id: string;
  text: string;
  input: string;
};

export default function ListScreen() {
  const params = useLocalSearchParams();
  const initialItems: ItemType[] = params.items
    ? (() => {
        try {
          return JSON.parse(params.items as string);
        } catch (e) {
          return [];
        }
      })()
    : [];
  const [items, setItems] = useState<ItemType[]>(initialItems);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setItems(initialItems);
  }, [params.items]);

  const handleInputChange = (id: string, value: string) => {
    if (!/^\d*$/.test(value)) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, input: value } : item
      )
    );
  };

  const handleCopy = async (id: string, text: string) => {
    await Clipboard.setStringAsync(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1200);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.header}>
        <Feather name="list" size={28} color="#2563eb" />
        <Text style={styles.headerTitle}>Scanned Items</Text>
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 50 }}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <Text style={styles.index}>{index + 1}.</Text>
            <TextInput
              style={styles.textBox}
              value={item.text}
              editable={false}
              selectTextOnFocus={false}
              pointerEvents="none"
            />
            <TextInput
              style={styles.input}
              value={item.input}
              placeholder="Qty"
              keyboardType="numeric"
              maxLength={4}
              onChangeText={(text) => handleInputChange(item.id, text)}
            />
            <TouchableOpacity style={styles.copyButton} onPress={() => handleCopy(item.id, item.text)}>
              {copiedId === item.id ? (
                <Feather name="check-circle" size={22} color="#2563eb" />
              ) : (
                <Feather name="copy" size={22} color="#888" />
              )}
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 60, color: "#666" }}>
            No scanned items yet.
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 24,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111",
    marginLeft: 8,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 17,
    marginVertical: 7,
    backgroundColor: "lightgrey",
    borderRadius: 16,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  index: {
    fontWeight: "700",
    fontSize: 16,
    color: "#050505fb",
    marginRight: 5,
  },
  textBox: {
    flex: 3,
    backgroundColor: "transparent",
    color: "#222",
    fontSize: 16,
    paddingVertical: 6,
    paddingHorizontal: 7,
    marginRight: 8,
    borderWidth: 0,
  },
  input: {
    flex: 1,
    borderColor: "#e5e7eb",
    borderWidth: 1,
    borderRadius: 8,
    padding: 7,
    marginRight: 8,
    fontSize: 15,
    textAlign: "center",
    backgroundColor: "#fff",
  },
  copyButton: {
    backgroundColor: "#f3f4f6",
    borderRadius: 9,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
