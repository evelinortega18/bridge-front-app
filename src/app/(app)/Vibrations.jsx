import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Accelerometer } from "expo-sensors";
import * as Notifications from "expo-notifications";
import { SafeAreaView } from "react-native-safe-area-context";
import * as math from "mathjs";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function Vibrations() {
  const [accelerometerData, setAccelerometerData] = useState({ x: [], y: [], z: [] });
  const [isAccelerometerActive, setIsAccelerometerActive] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [ecgData, setEcgData] = useState([]);

  const [peaks, setPeaks] = useState([]);
  const [showPeaks, setShowPeaks] = useState(false); // Utilizamos un solo estado para controlar la visibilidad de los picos


  const handleStartStopAccelerometer = async () => {
    setIsAccelerometerActive(!isAccelerometerActive);

    if (!isAccelerometerActive) {
      const newSubscription = Accelerometer.addListener(
        handleAccelerometerChange
      );
      setSubscription(newSubscription);
      await sendNotification(true);
    } else {
      subscription.remove();
      setSubscription(null);
      await sendNotification(false);
      setShowPeaks(true); // Activar la visibilidad de la sección de picos cuando se detiene la captura
      performFFT(); // Call the new function to perform FFT on the accumulated data
    }
  };

  const handleAccelerometerChange = (acceleration) => {
    setAccelerometerData((prevData) => ({
      x: [...prevData.x, acceleration.x.toFixed(5)],
      y: [...prevData.y, acceleration.y.toFixed(5)],
      z: [...prevData.z, acceleration.z.toFixed(5)],
    }));
    console.log("🚀 ~ Vibrations ~ acceleration:", acceleration);
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

  const performFFT = () => {
    const { x, y, z } = accelerometerData;
    const dataX = math.fft(x);
    const dataY = math.fft(y);
    const dataZ = math.fft(z);
    const realX = dataX.map((complex) => complex.re);
    const realY = dataY.map((complex) => complex.re);
    const realZ = dataZ.map((complex) => complex.re);
    // Update ecgData with FFT results
    setEcgData({ x: realX, y: realY, z: realZ });
    console.log("fft x:", realX);
    console.log("fft y:", realY);
    console.log("fft z:", realZ);
    identificarPatronesRepetitivos();
    // Reset the accelerometerData for the next capture
    setAccelerometerData({ x: [], y: [], z: [] });
  };


  const calcularAmplitudMaximaMinima = () => {
    if (ecgData.length === 0) {
      return { maxima: 0, minima: 0 };
    }
    const { x, y, z } = ecgData;
    if (x.length === 0) {
      return { maxima: 0, minima: 0 };
    }

    const maximaX = Math.max(...x);
    const minimaX = Math.min(...x);
    const maximaY = Math.max(...y);
    const minimaY = Math.min(...y);
    const maximaZ = Math.max(...z);
    const minimaZ = Math.min(...z);

    return { maxima: Math.max(maximaX, maximaY, maximaZ), minima: Math.min(minimaX, minimaY, minimaZ) };
  };

  const identificarPatronesRepetitivos = () => {
    const results = { x: [], y: [], z: [] }; // Object to store peak results for each axis
    const threshold = 0.1; // Umbral para considerar un pico (threshold for considering a peak)
    //console.log("acceleration data:", accelerometerData);

    for (const axis of ['x', 'y', 'z']) {
      const data = accelerometerData[axis]; // Get data for the current axis
      const peaks = [];
      console.log("data", data);
      for (let i = 1; i < data.length - 1; i++) {
        if (
          data[i] > data[i - 1] &&
          data[i] > data[i + 1] &&
          data[i] > threshold
        ) {
          peaks.push({ index: i, value: data[i] });
        }
      }
      results[axis] = peaks; // Store peaks for the current axis


      /*
      */

    }

    var { x, y, z } = ecgData;
    console.log("ecgData:", ecgData);
    maxFrecX = Math.max(x);
    maxFrecY = Math.max(y);
    maxFrecZ = Math.max(z);
    console.log("Valores máximos de frecuencias (mayor máximo, no primer máximo)");
    console.log("maxFrecX:", maxFrecX);
    console.log("maxFrecY:", maxFrecY);
    console.log("maxFrecZ:", maxFrecZ);
    setPeaks(results); // Update state with peak data for all axes
    console.log("Picos detectados x:", results.x);
    console.log("Picos detectados y:", results.y);
    console.log("Picos detectados z:", results.z);
    return results; // Return the results object containing peaks for x, y, and z
  };

  useEffect(() => {
    const { maxima, minima } = calcularAmplitudMaximaMinima();
  }, [ecgData]);

  useEffect(() => {
    if (!isAccelerometerActive) {
      identificarPatronesRepetitivos();
    }
  }, [isAccelerometerActive]);

  useEffect(() => {
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: "#ffff" }}>
      <ScrollView>

        <View style={styles.container}>
          <Text style={styles.title}>
            A continuación, pulsa el botón naranja para iniciar o detener la
            captura de datos:
          </Text>

          {showPeaks && (
            <View style={styles.picks}>
              <Text style={styles.titlePicks}>Picos altos:</Text>
              {Object.keys(peaks).map((axis) => ( // Loop through axis names (x, y, z)
                <View key={axis} style={styles.picksShow}>
                  <Text style={styles.picksResult}>
                    Eje {axis}: {peaks[axis].length > 0 // Check if there are peaks for this axis
                      ? peaks[axis]
                        .map((peak) => `Índice: ${peak.index}, Valor: ${peak.value}`)
                        .join(", ")
                      : "Sin picos detectados"}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.MeasureView}>
            <Text>x: {accelerometerData.x.length > 0 ? accelerometerData.x[accelerometerData.x.length - 1] : '---'}</Text>
            <Text>y: {accelerometerData.y.length > 0 ? accelerometerData.y[accelerometerData.y.length - 1] : '---'}</Text>
            <Text>z: {accelerometerData.z.length > 0 ? accelerometerData.z[accelerometerData.z.length - 1] : '---'}</Text>
          </View>
          <TouchableOpacity
            onPress={handleStartStopAccelerometer}
            style={isAccelerometerActive ? styles.buttonStop : styles.buttonStart}
          >
            <Text style={styles.buttonText}>
              {isAccelerometerActive
                ? "Parar Captura de Datos"
                : "Comenzar Captura de Datos"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1d1d1d",
    marginBottom: 12,
    textAlign: "justify",
  },
  graph: {
    height: 350,
    width: 300,
  },
  MeasureView: {
    width: 200,
    height: 200,
    borderRadius: 500,
    backgroundColor: "#F4F4F4",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 200,
  },
  buttonStart: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: "#FF8403",
    borderColor: "#FF8403",
    marginTop: 15,
  },
  buttonStop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: "#FF8403",
    borderColor: "#FF8403",
    marginTop: 15,
  },
  buttonText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600",
    color: "#fff",
  },
  picks: {
    marginTop: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  titlePicks: {
    fontSize: 30,
    color: "#1d1d1d",
    fontWeight: "500",
    marginBottom: 20,
  },
  picksShow: {
    width: 380,
    height: 50,
    backgroundColor: "#004884",
    justifyContent: "center",
    borderRadius: 15
  },
  picksResult: {
    fontSize: 19,
    color: "white",
  },
});
