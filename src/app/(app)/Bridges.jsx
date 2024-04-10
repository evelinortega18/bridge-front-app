import { router } from 'expo-router';
import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';

const items = [
  {
    img: "https://cdnwordpresstest-f0ekdgevcngegudb.z01.azurefd.net/es/wp-content/uploads/2022/03/20211202-Puente-Cuatro-Sur-1-1.jpg",
    title: 'Puente:',
    subTitle: "Puente Gilberto Echeverri Mejía",
    location: "Ubicacion:",
    address: "Cl. 4 Sur, El Poblado, Medellín, Antioquia",
  },
  {
    img: 'https://cloudfront-us-east-1.images.arcpublishing.com/infobae/DCBFFVQN2NFXVFKQSRAAJQGMKU.jpg',
    title: 'Puente:',
    subTitle: "Puente Gilberto Echeverri Mejía",
    location: "Ubicacion:",
    address: "Cl 44 #28, La Floresta, Medellín",
  },
  {
    img: 'https://colombia.argos.co/wp-content/uploads/2020/11/Puente_de_La_Madre_Laura_2017321_151716.jpeg',
    title: 'Puente:',
    subTitle: "Puente De la Madre Laura",
    location: "Ubicacion:",
    address: "# a 91-484,, Av. Del Río #91176",
  },
  {
    img: 'https://i.pinimg.com/736x/f5/f4/15/f5f415a7767ca798426f246a629c4f78.jpg',
    title: 'Puente:',
    subTitle: "La Calle 10",
    location: "Ubicacion:",
    address: "Esquina con Carrera 52, Cl 10, Guayabal",
  },
];

export default function Example() {
  return (
    <SafeAreaView style={{ backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Por favor, elige el puente que te gustaría evaluar de sus vibraciones:</Text>

        {items.map(({ img, title, subTitle, location, address }, index) => {
          return (
            <View
              key={index}
              style={[styles.card]}>
              <TouchableOpacity
                onPress={() => {router.push('Vibrations')}}>
                <Image
                  alt=""
                  resizeMode="cover"
                  source={{uri: img}}
                  style={styles.cardImg} 
                />

                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>{title}</Text>
                  <Text style={styles.cardSubTitle}>{subTitle}</Text>

                  <View style={styles.cardRow}>
                    <View style={styles.cardRowItem}>
                      <Text style={styles.cardRowItemText}>
                        {location} 
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.cardPrice}>
                    {address}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 12,
    textAlign: "justify",
    marginBottom: 15
  },
  /** Card */
  card: {
    borderBottomWidth: 1,
    borderColor: '#e3e3e3',
    marginBottom: 16,
    backgroundColor: "#F2F2F2",
    borderRadius: 12,
  },
  cardImg: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginRight: 16,
  },
  cardBody: {
    paddingVertical: 16,
    flexDirection: 'column',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 23,
    lineHeight: 28,
    fontWeight: '700',
    color: '#004884',
    marginBottom: 8,
  },
  cardSubTitle: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
  },
  cardRow: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardRowItem: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  cardRowItemText: {
    fontSize: 23,
    fontWeight: '700',
    color: '#004884',
    marginLeft: 4,
    marginBottom: 8,
  },
  cardPrice: {
    fontSize: 17,
    fontWeight: '500',
    color: '#173153',
    marginBottom: 8,
  },
});