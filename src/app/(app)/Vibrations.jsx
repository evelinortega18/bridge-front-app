import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { Accelerometer } from "expo-sensors";
import * as Notifications from "expo-notifications";
import { SafeAreaView } from "react-native-safe-area-context";
import * as math from "mathjs";
import { LineChart } from 'react-native-chart-kit';

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
  const [firstPeak, setFirstPeak] = useState(0);

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
    console.log("about to fuck up")
    const dataX = math.ifft(x);
    const dataY = math.ifft(y);
    const dataZ = math.ifft(z);
    const realX = dataX.map((complex) => complex.re);
    const realY = dataY.map((complex) => complex.re);
    const realZ = dataZ.map((complex) => complex.re);
    setEcgData({ x: realX, y: realY, z: realZ });
    console.log("fft x:", realX);
    console.log("fft y:", realY);
    console.log("fft z:", realZ);
    identificarPatronesRepetitivos();
    // Reset the accelerometerData for the next capture
    setAccelerometerData({ x: [], y: [], z: [] });
  };

  useEffect(() => {
    if (isAccelerometerActive === false && showPeaks === true) {
      // Perform FFT when capture stops and showPeaks is true
      performFFT();
    }
  }, [isAccelerometerActive, showPeaks]);

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

    }

    const { x, y, z } = Object.values(ecgData);
    console.log("ecgData:", ecgData);
    const maxFrecX = Math.max(x);
    const maxFrecY = Math.max(y);
    const maxFrecZ = Math.max(z);
    console.log("Valores máximos de frecuencias (mayor máximo, no primer máximo)");
    console.log("maxFrecX:", maxFrecX);
    console.log("maxFrecY:", maxFrecY);
    console.log("maxFrecZ:", maxFrecZ);
    setPeaks(results); // Update state with peak data for all axes
    console.log("Picos detectados x:", results.x);
    console.log("Picos detectados y:", results.y);
    console.log("Picos detectados z:", results.z);
    console.log("Valores de primer máximo de frecuencias");
    // FIXME Revisar unidades de picos resultantes de ifft
    console.log("Picos detectados x:", results.x?.[0]?.value ? `${results.x[0].value} Hz` : "");
    console.log("Picos detectados y:", results.y?.[0]?.value ? `${results.y[0].value} Hz` : "");
    console.log("Picos detectados z:", results.z?.[0]?.value ? `${results.z[0].value} Hz` : "");
    setFirstPeak({
      x: results?.x?.[0]?.value || "-",
      y: results?.y?.[0]?.value || "-",
      z: results?.z?.[0]?.value || "-",
    });
    return results; // Return the results object containing peaks for x, y, and z
  };

  useEffect(() => {
    const { maxima, minima } = calcularAmplitudMaximaMinima();
  }, [ecgData]);
  /*
  useEffect(() => {
    if (!isAccelerometerActive) {
      identificarPatronesRepetitivos();
    }
  }, [isAccelerometerActive]);
  */

  useEffect(() => {
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  const chartData = showPeaks ? {
    labels: ecgData.x,
    datasets: [
      {
        data: ecgData.x,
        strokeWidth: 2,
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Red color for xreal
        label: 'X-axis',
      },
      {
        data: ecgData.y,
        strokeWidth: 2,
        color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`, // Green color for yreal
        label: 'Y-axis',
      },
      {
        data: ecgData.z,
        strokeWidth: 2,
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // Blue color for zreal
        label: 'Z-axis',
      },
    ],
  } : {};


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
                        .map((peak) => `Índice: ${peak.index}, Valor: ${peak.value}, Freq: ${firstPeak[axis]} Hz`)
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
