import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import React from 'react';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { moderateScale } from 'react-native-size-matters';

const Header = ({ navigation, backButton, heading }) => {
  return (
    <SafeAreaView style={styles.header}>
      {backButton ? (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FeatherIcon name="arrow-left" size={moderateScale(20, 0.1)} color={'white'} />
        </TouchableOpacity>
      ) : (
        <View style={styles.backButtonPlaceholder} />
      )}

      {heading ? (
        <Text style={styles.heading}>{heading}</Text>
      ) : (
        <View style={styles.backButtonPlaceholder} />
      )}

      <View style={styles.backButtonPlaceholder} />
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
    marginTop:moderateScale(30,0.1),
    paddingHorizontal: moderateScale(8, 0.1),
    justifyContent: 'space-between',
  },
  backButton: {
    backgroundColor: '#2e074a',
    height: moderateScale(30, 0.1),
    width: moderateScale(30, 0.1),
    borderRadius: moderateScale(20, 0.1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: moderateScale(19, 0.1),
    fontFamily: 'Poppins-Bold',
    color: '#2e074a',
    fontWeight:'bold',
    flex: 1, // Take up available space
    textAlign: 'center', // Center the heading text
  },
  backButtonPlaceholder: {
    height: moderateScale(30, 0.1),
    width: moderateScale(30, 0.1),
  },
});
