
import { StyleSheet, Text, View, TextInput, SafeAreaView, Alert, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { moderateScale } from 'react-native-size-matters';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Header from '../components/Header';

const CreateTask = () => {
    const [text, onChangeText] = useState('');
    const [description, onChangeDescription] = useState('');
    const [imageUri, setImageUri] = useState(null);

    const openCamera = async () => {
        const result = await launchCamera({
            mediaType: 'photo',
            cameraType: 'back',
            quality: 1,
        }, (response) => {
            if (response.didCancel) {
                Alert.alert('User cancelled camera picker');
            } else if (response.errorCode) {
                Alert.alert('Error: ', response.errorMessage);
            } else {
                setImageUri(response.assets[0].uri);
            }
        });
    };

    const openGallery = async () => {
        const result = await launchImageLibrary({
            mediaType: 'photo',
            quality: 1,
        }, (response) => {
            if (response.didCancel) {
                Alert.alert('User cancelled gallery picker');
            } else if (response.errorCode) {
                Alert.alert('Error: ', response.errorMessage);
            } else {
                setImageUri(response.assets[0].uri);
            }
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header title={'Create Task'} />
            <View style={styles.inputContainer}>
                <View style={styles.TaskNameView}>
                    <Text style={styles.TasknameStyle}>Task Name: </Text>
                </View>
                <TextInput
                    style={styles.Nameinput}
                    onChangeText={onChangeText}
                    placeholder="Enter name of task"
                    value={text}
                />

                <View style={styles.TaskNameView}>
                    <Text style={styles.TasknameStyle}>Description: </Text>
                </View>
                <TextInput
                    style={styles.Descriptioninput}
                    onChangeText={onChangeDescription}
                    placeholder="Describe your task"
                    value={description}
                />

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.CameraViewStyle} onPress={openCamera}>
                        <Text style={styles.CameraTextstyle}>Open Camera</Text>
                        <EntypoIcon name="camera" size={40} color={'blue'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.CameraViewStyle} onPress={openGallery}>
                        <Text style={styles.CameraTextstyle}>Open Gallery</Text>
                        <FontAwesomeIcon name="photo" size={30} color={'blue'} />
                    </TouchableOpacity>
                </View>

                {imageUri && (
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: imageUri }} style={styles.image} />
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

export default CreateTask;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: '#f5f5f5',
        padding: moderateScale(10, 0.1),
    },
    inputContainer: {
        flexGrow: 1,
        marginTop: moderateScale(10, 0.1),
    },
    Nameinput: {
        backgroundColor: 'white',
        padding: moderateScale(10, 0.1),
        marginLeft: moderateScale(10, 0.1),
        width: '90%',
        borderRadius: moderateScale(10, 0.1),
    },
    TaskNameView: {
        marginLeft: moderateScale(15, 0.1),
        paddingBottom: moderateScale(6, 0.1),
        paddingTop: moderateScale(70, 0.1),
    },
    TasknameStyle: {
        color: 'black',
        fontSize: moderateScale(15, 0.1),
        paddingTop:moderateScale(40,0.1)
    },
    Descriptioninput: {
        width: '90%',
        height: 80,
        backgroundColor: 'white',
        padding: moderateScale(10, 0.1),
        marginLeft: moderateScale(10, 0.1),
        borderRadius: moderateScale(10, 0.1),
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: moderateScale(20, 0.1),
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: moderateScale(20, 0.1),
    },
    image: {
        width: moderateScale(150, 0.1),
        height: moderateScale(150, 0.1),
        borderRadius: moderateScale(10, 0.1),
    },
    CameraTextstyle: {
        fontSize: moderateScale(13, 0.1),
        color: 'black',
    },
    CameraViewStyle: {
        backgroundColor: '#c3c7c4',
        alignItems: 'center',
        padding: moderateScale(8, 0.1),
        borderRadius: moderateScale(10, 0.1),
        borderColor: 'black',
        borderWidth: moderateScale(1, 0.1),
    },
});


