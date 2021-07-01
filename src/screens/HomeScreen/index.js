import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const HomeScreen = ({ navigation, route }) => {

    const onPressedWebView = () => {
        navigation.navigate('Webview');
    }

    const onPressedSA = () => {
      navigation.navigate('SocialAttache');
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity        
                style={styles.buttonContainer}
                onPress={onPressedSA}>
                <Text
                    style={styles.textView}>
                    Goto SA
                </Text>
            </TouchableOpacity>
            <TouchableOpacity        
                style={styles.buttonContainer}
                onPress={onPressedWebView}>
                <Text
                    style={styles.textView}>
                    Goto WebView
                </Text>
            </TouchableOpacity>
      </View>
    );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textView: {
      color: 'white'
  },
  buttonContainer: {
      width: 200,
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      marginVertical: 8,
      backgroundColor: '#006efe'
  }
});

export default HomeScreen;