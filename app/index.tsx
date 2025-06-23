import { useEffect } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  useEffect(() => {
    const redirecionar = async () => {
      const nivelString = await AsyncStorage.getItem("nivelAtual");
      const nivel = /*nivelString ? Number(nivelString) :*/ 1;
      router.replace(`/exercicio/${nivel}`);
    };
    redirecionar();
  }, []);

  return null;
}
