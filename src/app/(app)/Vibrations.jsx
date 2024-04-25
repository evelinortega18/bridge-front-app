import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
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
  const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 0 });
  const [isAccelerometerActive, setIsAccelerometerActive] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [ecgData, setEcgData] = useState([]);
  console.log("🚀 ~ Vibrations ~ ecgData:", ecgData);
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
    }
  };

  const handleAccelerometerChange = (acceleration) => {
    setData({
      x: acceleration.x.toFixed(5),
      y: acceleration.y.toFixed(5),
      z: acceleration.z.toFixed(5),
    });

    handleIFFT(acceleration);
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

  const handleIFFT = (acceleration) => {
    const datosFrecuencia = [acceleration.x, acceleration.y, acceleration.z];
    const datosTiempo = math.ifft(datosFrecuencia);
    const datosTiempoReal = datosTiempo.map((complejo) => complejo.re);
    setEcgData(datosTiempoReal);
  };

  const calcularAmplitudMaximaMinima = () => {
    if (ecgData.length === 0) {
      return { maxima: 0, minima: 0 };
    }

    const maxima = Math.max(...ecgData);
    const minima = Math.min(...ecgData);
    return { maxima, minima };
  };

  const identificarPatronesRepetitivos = () => {
    if (ecgData.length === 0) {
      return;
    }

    const threshold = 0.1; // Umbral para considerar un pico
    const peaks = [];

    for (let i = 1; i < ecgData.length - 1; i++) {
      if (
        ecgData[i] > ecgData[i - 1] &&
        ecgData[i] > ecgData[i + 1] &&
        ecgData[i] > threshold
      ) {
        peaks.push({ index: i, value: ecgData[i] });
      }
    }
    setPeaks(peaks);
    console.log("Picos detectados:", peaks);
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
      <View style={styles.container}>
        <Text style={styles.title}>
          A continuación, pulsa el botón naranja para iniciar o detener la
          captura de datos:
        </Text>

        {showPeaks && (
          <View style={styles.picks}>
            <Text style={styles.titlePicks}>Picos altos:</Text>
            <View style={styles.picksShow}>
              <Text style={styles.picksResult}>
                {" "}
                {peaks
                  .map(
                    (peak, index) =>
                      `Índice: ${peak.index}, Valor: ${peak.value}`
                  )
                  .join(", ")}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.MeasureView}>
          <Text>x: {x}</Text>
          <Text>y: {y}</Text>
          <Text>z: {z}</Text>
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
