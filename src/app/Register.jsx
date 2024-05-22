import React, { useRef, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import logo from "../../assets/logo-alcaldia.png";
import { useRouter } from "expo-router";

export default function Register({ navigation }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    repeatPassword: "",
  });
  const router = useRouter()

  const handleRegister = async () => {
    if (!form.email || !form.password || !form.repeatPassword) {
      Alert.alert("Registro", "Por favor, completa todos los campos.");
      return;
    }

    if (form.password !== form.repeatPassword) {
      Alert.alert("Registro", "Las contraseñas no coinciden.");
      return;
    }

    const url = process.env.CREATE_USER_ACCOUNT;
    const data = {
      username: form.email,
      password: form.password,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log("🚀 ~ handleRegister ~ response:", response)

      if (!response.ok) {
        throw new Error("Error al registrar usuario");
      }

      const responseData = await response.json();
      console.log(responseData); 

      // Redirigir a la siguiente pantalla después del registro exitoso
      router.push("Bridges"); // Ajusta según cómo manejes la navegación

    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      Alert.alert(
        "Registro",
        "Error al registrar usuario. Por favor, inténtalo nuevamente."
      );
    }
  };

  const handleChange = (key, value) => {
    setForm({
      ...form,
      [key]: value,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          <View style={styles.header}>
            <Image
              alt="App Logo"
              resizeMode="contain"
              style={styles.headerImg}
              source={logo}
            />
          </View>

          <View style={styles.form}>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Email:</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                onChangeText={(text) => handleChange("email", text)}
                placeholder="Ingresa tu Email"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={form.email}
              />
            </View>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Password:</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={(text) => handleChange("password", text)}
                placeholder="Ingresa tu Contraseña"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                secureTextEntry={true}
                value={form.password}
              />
            </View>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Repetir Contraseña:</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={(text) => handleChange("repeatPassword", text)}
                placeholder="Repite tu Contraseña"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                secureTextEntry={true}
                value={form.repeatPassword}
              />
            </View>

            <TouchableOpacity onPress={handleRegister}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Registrarme</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.formAction}>
              <TouchableOpacity onPress={() => navigation.push("Login")}>
                <View style={styles.btn}>
                  <Text style={styles.btnText}>Registrate con Google</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderRadius: 3,
  },
  headerImg: {
    width: 400,
    height: 300,
    alignSelf: "center",
    borderRadius: 3,
  },
  form: {
    paddingHorizontal: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  formAction: {
    marginTop: 4,
    marginBottom: 16,
  },
  input: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
  },
  inputControl: {
    height: 50,
    backgroundColor: "#EEEEEE",
    paddingHorizontal: 16,
    borderRadius: 5,
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
    borderWidth: 1,
    borderColor: "#C9D3DB",
    borderStyle: "solid",
  },
  btn: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#FF8403",
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600",
    color: "#fff",
  },
});
