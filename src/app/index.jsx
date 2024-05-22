import React, { useRef, useState } from 'react';
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
} from 'react-native';
import { useRouter } from "expo-router";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import logo from "../../assets/logo-alcaldia.png";
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store'; // Importar SecureStore

const loginEndpoint = process.env.LOGIN_USER_ACCOUNT_GOOGLE;
const callbackEndpoint = process.env.LOGIN_USER_ACCOUNT_GOOGLE_CALLBACK;

export default function Login() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const router = useRouter();
  const emailRef = useRef("");
  const passwordRef = useRef("");

  const handleLogin = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert('Login', "¡Llena todos los campos!");
    }
  };

  const handleLoginGoogle = async () => {
    try {
      const result = await WebBrowser.openAuthSessionAsync(loginEndpoint, callbackEndpoint);
      if (result.type === 'success') {
        // Obtener el JWT desde result.url (parseando el query string, por ejemplo)
        const jwt = extractJWTFromURL(result.url);
  
        // Almacenar el JWT de manera segura
        await SecureStore.setItemAsync('userToken', jwt);
  
        // Redireccionar al usuario a la pantalla 'Bridges'
        router.replace('Bridges');
      } else {
        console.error('Login de Google cancelado o fallido:', result.type);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
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
              <Text style={styles.inputLabel}>Email</Text>

              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                onChangeText={email => setForm({ ...form, email })}
                placeholder="Ingresa tu Email"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={form.email} />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Password</Text>

              <TextInput
                autoCorrect={false}
                onChangeText={password => setForm({ ...form, password })}
                placeholder="Ingresa tu Contraseña"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                secureTextEntry
                value={form.password} />
            </View>

            <Pressable style={styles.formAction}>
              <TouchableOpacity
                onPress={handleLogin}>
                <Pressable style={styles.btn} onPress={() => router.push('Bridges')}>
                  <Text style={styles.btnText}>Ingresar</Text>
                </Pressable>
              </TouchableOpacity>
            </Pressable>

            <View style={styles.formAction}>
              <TouchableOpacity
                onPress={handleLoginGoogle}>
                <View style={styles.btn}>
                  <Text style={styles.btnText}>Ingresa con Google</Text>
                </View>
              </TouchableOpacity>
            </View>

            <Text style={styles.formLink}>¿Olvidaste tu contraseña?</Text>
          </View>
        </KeyboardAwareScrollView>

        <TouchableOpacity
          onPress={() => {
            router.push('Register')
          }}
          style={styles.registerBtn}>
          <Text style={styles.formFooter}>
            ¿No tienes una cuenta?{' '}
            <Text style={{ color: "#FF8403" }}> Regístrate</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 0.5,
  },
  title: {
    fontSize: 31,
    fontWeight: '700',
    color: '#1D2A32',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
  },
  header: {
    borderRadius: 3
  },
  headerImg: {
    width: 400,
    height: 300,
    alignSelf: 'center',
    borderRadius: 3
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
  formLink: {
    paddingTop: 5,
    fontSize: 14,
    fontWeight: '600',
    color: '#858585',
    textAlign: 'right',
  },
  formFooter: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
  },
  input: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  inputControl: {
    height: 50,
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 16,
    borderRadius: 5,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    borderWidth: 1,
    borderColor: '#C9D3DB',
    borderStyle: 'solid',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#FF8403',
    borderColor: '#FF8403',
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
  registerBtn: {
    width: 400,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#F4F4F4",
    borderRadius: 10,
    marginLeft: 15
  }
});
