
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Keyboard,
  Alert,
  
} from "react-native";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";
import { RectButton } from "react-native-gesture-handler";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";

type Item = {
  id: string;
  text: string;   // product name
  qty: string;    // numeric input as string
};

export default function ListScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const incoming: Item[] = useMemo(() => {
    try {
      if (params.items) {
        const parsed = JSON.parse(params.items as string) as { id: string; text: string; input?: string }[];
        // Normalize to our shape: input -> qty
        return (parsed || []).map((p) => ({
          id: String(p.id ?? Date.now()),
          text: String(p.text ?? "").trim(),
          qty: String(p.input ?? ""),
        }));
      }
      return [];
    } catch {
      return [];
    }
  }, [params.items]);

  const [items, setItems] = useState<Item[]>([]);
  const inputRefs = useRef<Record<string, TextInput | null>>({});
  const nameRefs  = useRef<Record<string, TextInput | null>>({});

  // Merge any incoming items from camera (de-dupe by text)
  useEffect(() => {
    if (incoming.length === 0) return;
    setItems((prev) => {
      const seen = new Set(prev.map((i) => i.text.toLowerCase()));
      const add = incoming.filter((i) => {
        const key = i.text.toLowerCase();
        if (!i.text || seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      return [...prev, ...add];
    });
  }, [incoming]);

  const addManual = () => {
    const id = String(Date.now());
    const newItem: Item = { id, text: "", qty: "" };
    setItems((prev) => [newItem, ...prev]);
    // Focus the new name field after a tick
    setTimeout(() => {
      nameRefs.current[id]?.focus();
    }, 50);
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const onChangeQty = (id: string, val: string) => {
    if (!/^\d*$/.test(val)) return; // numeric only
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: val } : i)));
  };

  const onChangeName = (id: string, val: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, text: val } : i)));
  };

  const copyName = async (text: string) => {
    if (!text.trim()) {
      Alert.alert("Nothing to copy", "This item has no name yet.");
      return;
    }
    await Clipboard.setStringAsync(text.trim());
  };

  const renderRightActions = (id: string) => (
    <RectButton style={styles.deleteBtn} onPress={() => deleteItem(id)}>
      <Ionicons name="trash-outline" size={22} color="#fff" />
      <Text style={styles.deleteTxt}>Delete</Text>
    </RectButton>
  );

  const renderItem = ({ item, index }: { item: Item; index: number }) => (
    <Swipeable
      overshootRight={false}
      renderRightActions={() => renderRightActions(item.id)}
    >
      <View style={styles.rowCard}>
        <Text style={styles.indexTxt}>{index + 1}.</Text>

        {/* Name (editable only when empty or when the user taps) */}
        <TextInput
          ref={(r) => (nameRefs.current[item.id] = r)}
          style={styles.nameBox}
          value={item.text}
          placeholder="Product name"
          placeholderTextColor="#a0a0a0"
          onChangeText={(t) => onChangeName(item.id, t)}
          // Keep it single-line like your design; truncate naturally
          numberOfLines={1}
          returnKeyType="done"
          onSubmitEditing={Keyboard.dismiss}
        />

        {/* Qty box */}
        <TextInput
          ref={(r) => (inputRefs.current[item.id] = r)}
          style={styles.qty}
          value={item.qty}
          placeholder="Qty"
          placeholderTextColor="#cfcfd3"
          keyboardType="number-pad"
          maxLength={4}
          onChangeText={(t) => onChangeQty(item.id, t)}
        />

        {/* Copy button */}
        <TouchableOpacity
          style={styles.copyBtn}
          onPress={() => copyName(item.text)}
          accessibilityLabel="Copy item name"
        >
          <Ionicons name="copy-outline" size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </Swipeable>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.plusWrap} onPress={addManual}>
            <Ionicons name="add" size={20} color="#2b6be6" />
          </TouchableOpacity>
          <Text style={styles.title}>Scanned Items</Text>
          <View style={{ width: 44 }} />
        </View>

        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 28 }}
          ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
          ListEmptyComponent={
            <Text style={styles.empty}>No items yet — scan or tap +</Text>
          }
          keyboardShouldPersistTaps="handled"
        />
      </View>
    </GestureHandlerRootView>
  );
}

// Todo: saperate the style sheet at the end.
// styleSheet
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    marginBottom: 14,
  },
  plusWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eef3ff",
    marginRight: 8,
  },
  title: {
    flex: 1,
    fontSize: 32,
    fontWeight: "800",
    color: "#000000ff",
    letterSpacing: 0.5,
  },

  rowCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d9d9dc",
    borderRadius: 22,
    paddingLeft: 18,
    paddingRight: 12,
    height: 88,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    // shadowRadius: 18,
    shadowOffset: { width: 0, height: 2 },
  },
  indexTxt: { fontSize: 22, fontWeight: "800", color: "#0b0c10", marginRight: 12 },

  nameBox: {
    flex: 1,
    fontSize: 20,
    color: "#0f172a",
    marginRight: 12,
  },

  qty: {
    width: 110,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#f4f5f7",
    textAlign: "center",
    fontSize: 18,
    color: "#111827",
    marginRight: 10,
  },

  copyBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#f1f2f4",
    alignItems: "center",
    justifyContent: "center",
  },

  deleteBtn: {
    width: 100,
    marginVertical: 2,
    // borderRadius: 18,
    backgroundColor: "#ef4444",
    alignItems: "center",
    justifyContent: "center",
    borderTopRightRadius:18,
    borderBottomRightRadius:18
    
  },
  deleteTxt: { color: "#fff", fontWeight: "700", marginTop: 4 },

  empty: {
    textAlign: "center",
    color: "#8b8d93",
    marginTop: 24,
    fontSize: 16,
  },
});
