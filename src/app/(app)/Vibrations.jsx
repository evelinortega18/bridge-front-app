import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Text, View, StyleSheet, Button, TouchableOpacity } from "react-native";
import { Accelerometer } from "expo-sensors";
import * as Notifications from "expo-notifications";
import { LineChart } from "react-native-chart-kit";
// import * as Device from 'expo-device';
import FFT from "fft-js";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-web";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function Vibrations() {
  const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 0 });
  const [isAccelerometerActive, setIsAccelerometerActive] = useState(false);
  const [frequencyData, setFrequencyData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    let subscription;

    const handleAccelerometerData = (accelerometerData) => {
      setData(accelerometerData);
    };

    if (isAccelerometerActive) {
      subscription = Accelerometer.addListener(handleAccelerometerData);
    }

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isAccelerometerActive]);

  const handleStartStopAccelerometer = () => {
    setIsAccelerometerActive(!isAccelerometerActive);
    sendNotification(!isAccelerometerActive);
  };

  const sendNotification = async (isActive) => {
    const notificationBody = isActive
      ? "Ahora estás capturando datos."
      : "Has detenido la captura de datos.";

    await Notifications.scheduleNotificationAsync({
      content: {
        title: isActive ? "¡Acelerómetro Activado!" : "¡Acelerómetro Detenido!",
        body: notificationBody,
      },
      trigger: null,
    });
  };

  useEffect(() => {
    const getNotificationPermission = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        await Notifications.requestPermissionsAsync();
      }
    };

    getNotificationPermission();
  }, []);

  //   useEffect(() => {
  //     let subscription;

  //     if (isAccelerometerActive) {
  //       subscription = Accelerometer.addListener((accelerometerData) => {
  //         setData(accelerometerData);
  //         // Convertir los datos de aceleración a un array unidimensional
  //         const accelerationValues = [x, y, z].map((value) => value || 0);
  //         const accelerationMagnitude = Math.sqrt(
  //           accelerationValues.reduce((sum, value) => sum + value ** 2, 0)
  //         );
  //         // Aplicar la transformada de Fourier a los datos de aceleración
  //         const fftData = FFT.fft(accelerationValues);
  //         // Calcular las magnitudes de las frecuencias
  //         const magnitudeData = fftData.map((value) =>
  //           Math.sqrt(value[0] ** 2 + value[1] ** 2)
  //         );
  //         setFrequencyData(magnitudeData);
  //       });
  //     }

  //     return () => {
  //       if (subscription) {
  //         subscription.remove();
  //       }
  //     };
  //   }, [isAccelerometerActive]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        A continuacion pulsa el boton naranja para iniciar con la captura de
        datos:
      </Text>

      <View style={styles.chartContainer}>
        <LineChart
          data={{
            labels: ["X", "Y", "Z"],
            datasets: [
              {
                data: [x, y, z],
              },
            ],
          }}
          width={400}
          height={300}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 2, // número de decimales en los valores del eje Y
            justifyContent: "center",
            alignItems: "center",
            color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
          }}
        />
      </View>

      <View style={styles.MeasureView}>
        <Text>x: {x}</Text>
        <Text>y: {y}</Text>
        <Text>z: {z}</Text>
      </View>

      <TouchableOpacity
        onPress={handleStartStopAccelerometer}
        style={
          isAccelerometerActive ? styles.ButtonCapture : styles.ButtonCapture
        }
      >
        <Text style={styles.buttonText}>
          {isAccelerometerActive
            ? "Parar Captura de Datos"
            : "Comenzar Captura de Datos"}
        </Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    display: "flex",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1d1d1d",
    marginBottom: 12,
    textAlign: "justify",
  },
  chartContainer: {
    marginBottom: 0,
  },
  MeasureView: {
    width: 200,
    height: 200,
    borderRadius: 500,
    backgroundColor: "#F4F4F4",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    marginBottom: 12, 
    gap: 30
  },
  btn: {
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#FF8403",
    borderColor: "#FF8403",
  },
  ButtonCapture: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: "#FF8403",
    borderColor: "#FF8403",
  },
  buttonText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600",
    color: "#fff",
  },
});
