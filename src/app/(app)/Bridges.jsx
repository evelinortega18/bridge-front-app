import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Button,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Camera } from "expo-camera";
import { useRouter } from "expo-router";

const items = [
  {
    img: "https://cdnwordpresstest-f0ekdgevcngegudb.z01.azurefd.net/es/wp-content/uploads/2022/03/20211202-Puente-Cuatro-Sur-1-1.jpg",
    title: "Puente:",
    subTitle: "Puente Gilberto Echeverri Mejía",
    location: "Ubicación:",
    address: "Cl. 4 Sur, El Poblado, Medellín, Antioquia",
  },
  {
    img: "https://cloudfront-us-east-1.images.arcpublishing.com/infobae/DCBFFVQN2NFXVFKQSRAAJQGMKU.jpg",
    title: "Puente:",
    subTitle: "Puente Gilberto Echeverri Mejía",
    location: "Ubicación:",
    address: "Cl 44 #28, La Floresta, Medellín",
  },
  {
    img: "https://colombia.argos.co/wp-content/uploads/2020/11/Puente_de_La_Madre_Laura_2017321_151716.jpeg",
    title: "Puente:",
    subTitle: "Puente De la Madre Laura",
    location: "Ubicación:",
    address: "# a 91-484,, Av. Del Río #91176",
  },
  {
    img: "https://i.pinimg.com/736x/f5/f4/15/f5f415a7767ca798426f246a629c4f78.jpg",
    title: "Puente:",
    subTitle: "La Calle 10",
    location: "Ubicación:",
    address: "Esquina con Carrera 52, Cl 10, Guayabal",
  },
];

export default function Example() {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [puenteName, setPuenteName] = useState("");
  const [puenteLocation, setPuenteLocation] = useState("");
  const [coordinates, setCoordinates] = useState("");
  const router = useRouter();

  const handleSearch = (text) => {
    setSearchTerm(text);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setPuenteName("");
    setPuenteLocation("");
    setCoordinates("");
  };

  const filteredItems = items.filter((item) =>
    item.subTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>
          Por favor, elige el puente que te gustaría evaluar de sus vibraciones:
        </Text>

        <TextInput
          style={styles.searchBar}
          onChangeText={handleSearch}
          value={searchTerm}
          placeholder="Buscar puente..."
        />

        <TouchableOpacity style={styles.addButton} onPress={openModal}>
          <Text style={styles.addButtonText}>Crear nuevo puente</Text>
        </TouchableOpacity>

        <KeyboardAwareScrollView>
          {filteredItems.map(
            ({ img, title, subTitle, location, address }, index) => {
              return (
                <View key={index} style={styles.card}>
                  <Image
                    alt=""
                    resizeMode="cover"
                    source={{ uri: img }}
                    style={styles.cardImg}
                  />
                  <View style={styles.cardBody}>
                    <Text style={styles.cardTitle}>{title}</Text>
                    <Text style={styles.cardSubTitle}>{subTitle}</Text>
                    <View style={styles.cardRow}>
                      <View style={styles.cardRowItem}>
                        <Text style={styles.cardRowItemText}>{location}</Text>
                      </View>
                    </View>
                    <Text style={styles.cardPrice}>{address}</Text>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => {
                        router.push("Vibrations");
                      }}
                    >
                      <Text style={styles.buttonText}>Evaluar Puente</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }
          )}
        </KeyboardAwareScrollView>
      </ScrollView>

      {/* Modal para agregar nuevo puente */}
      <KeyboardAwareScrollView>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Crear Nuevo Puente</Text>
              <TextInput
                style={styles.input}
                placeholder="Nombre del puente"
                value={puenteName}
                onChangeText={(text) => setPuenteName(text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Ubicación"
                value={puenteLocation}
                onChangeText={(text) => setPuenteLocation(text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Coordenadas"
                value={coordinates}
                onChangeText={(text) => setCoordinates(text)}
              />
              <Button title="Tomar Foto" onPress={() => {}} />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#FF8403" }]}
                  onPress={() => {}}
                >
                  <Text style={styles.buttonText}>Guardar Puente</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#ccc" }]}
                  onPress={closeModal}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1d1d1d",
    marginBottom: 12,
    textAlign: "justify",
  },
  searchBar: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  addButton: {
    backgroundColor: "#004884",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#FF8403",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  /** Card */
  card: {
    borderWidth: 1,
    borderColor: "#e3e3e3",
    marginBottom: 24,
    backgroundColor: "#F2F2F2",
    borderRadius: 12,
    overflow: "hidden",
  },
  cardImg: {
    width: "100%",
    height: 200,
  },
  cardBody: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 23,
    lineHeight: 28,
    fontWeight: "700",
    color: "#004884",
    marginBottom: 8,
  },
  cardSubTitle: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "500",
    color: "#000000",
    marginBottom: 8,
  },
  cardRow: {
    flexDirection: "column",
    marginBottom: 8,
  },
  cardRowItem: {
    flexDirection: "column",
    paddingHorizontal: 6,
  },
  cardRowItemText: {
    fontSize: 23,
    fontWeight: "700",
    color: "#004884",
    marginLeft: 4,
    marginBottom: 8,
  },
  cardPrice: {
    fontSize: 17,
    fontWeight: "500",
    color: "#173153",
    marginBottom: 16,
  },
});
