import React, { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator, Image, Modal, Text, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from "expo-router";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { DB } from "../../utils/DBConnect";
import { useUser } from "../../hooks/UserContext";
import { UserTypes } from "../../constants/UserTypes";

export default function NearbyClassView() {
    const navigation = useNavigation();
    const user = useUser();
    const [region, setRegion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [markers, setMarkers] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [markerDetails, setMarkerDetails] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    const getCurrentLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.log('Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        setRegion({
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        });
        setLoading(false);
    };

    useEffect(() => {
        getCurrentLocation();
        if (user.user.userType === UserTypes.InstituteManager) {
            setIsAdmin(true);
        }
    }, []);

    useEffect(() => {
        getDocs(collection(DB, "classes"))
            .then((querySnapshot) => {
                const docsArray = [];
                querySnapshot.forEach((doc) => {
                    docsArray.push({ ...doc.data(), id: doc.id });
                });
                setMarkers(docsArray);
                console.log(docsArray);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [navigation]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }
    const handleMarkerClick = (marker) => {
        setMarkerDetails(marker);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };
    const handleUpdate = () => {
        setModalVisible(false);
        console.log(markerDetails);
        navigation.navigate('AddClass', { classDetails: markerDetails });
    };

    const handleDelete = async () => {
        try {
            const classDocRef = doc(DB, "classes", markerDetails.id);
            await deleteDoc(classDocRef); 
            console.log("Document deleted successfully!");
            setModalVisible(false);
            setMarkers((prevMarkers) => prevMarkers.filter(marker => marker.id !== markerDetails.id));
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={region}
                showsUserLocation={true}
            >
                {markers.map((marker, index) => (
                    <Marker
                        key={index}
                        coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                        title={marker.subject}
                        description={marker.teacher}
                        onPress={() => { handleMarkerClick(marker) }}
                    >
                        <Image
                            source={require('./../../assets/images/mapmark.png')}
                            style={{ width: 40, height: 40 }}
                            resizeMode="contain"
                        />
                    </Marker>

                ))}
            </MapView>
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={handleCloseModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <ScrollView contentContainerStyle={styles.modalContent}>
                            <Text style={styles.modalTitle}>Class Details</Text>

                            {markerDetails && (
                                <>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.label}>Class Date:</Text>
                                        <Text style={styles.value}>{markerDetails.classDate}</Text>
                                    </View>

                                    <View style={styles.detailRow}>
                                        <Text style={styles.label}>Start Time:</Text>
                                        <Text style={styles.value}>
                                            {new Date(markerDetails.startTime.seconds * 1000).toLocaleTimeString()}
                                        </Text>
                                    </View>

                                    <View style={styles.detailRow}>
                                        <Text style={styles.label}>End Time:</Text>
                                        <Text style={styles.value}>
                                            {new Date(markerDetails.endTime.seconds * 1000).toLocaleTimeString()}
                                        </Text>
                                    </View>

                                    <View style={styles.detailRow}>
                                        <Text style={styles.label}>Stream:</Text>
                                        <Text style={styles.value}>{markerDetails.stream}</Text>
                                    </View>

                                    <View style={styles.detailRow}>
                                        <Text style={styles.label}>Subject:</Text>
                                        <Text style={styles.value}>{markerDetails.subject}</Text>
                                    </View>

                                    <View style={styles.detailRow}>
                                        <Text style={styles.label}>Teacher:</Text>
                                        <Text style={styles.value}>{markerDetails.teacher}</Text>
                                    </View>
                                </>
                            )}

                        </ScrollView>
                        {isAdmin && (
                            <Button
                                mode="contained"
                                onPress={handleUpdate}
                                style={styles.closeButton}
                                contentStyle={{ paddingVertical: 10 }}
                            >
                                Update
                            </Button>
                        )}
                        {isAdmin && (
                            <Button
                                mode="contained"
                                onPress={handleDelete}
                                style={styles.closeButton}
                                contentStyle={{ paddingVertical: 10 }}
                            >
                                Delete
                            </Button>
                        )}

                        <Button
                            mode="contained"
                            onPress={handleCloseModal}
                            style={styles.closeButton}
                            contentStyle={{ paddingVertical: 10 }}
                        >
                            Close
                        </Button>
                    </View>
                </View>
            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCard: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5, // For Android shadow
    },
    modalContent: {
        paddingBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    label: {
        fontWeight: '600',
        color: '#555',
    },
    value: {
        color: '#333',
        fontWeight: '400',
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#007BFF',
        borderRadius: 10,
    },
});
