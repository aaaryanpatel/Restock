import { useEffect } from "react";
import { Stack, useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Wait until after the first render to navigate!
    setTimeout(() => {
      router.replace("/camera");
    }, 0);
  }, []);

  return null;
}
