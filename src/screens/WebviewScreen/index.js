import React, {useEffect, useState, useRef} from 'react';
import {Text, View, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import {WebView} from 'react-native-webview';
const WebviewScreen = ({navigation, route}) => {
  const webView = useRef();
  const cookieRef = useRef({value: ''});
  const weburl = 'http://192.168.1.30/webview.php';
  //const weburl = 'https://socialattache.com/'

  // handle message from webpage
  const onBridgeMessage = event => {
    const {data} = event.nativeEvent;
    const jsonData = JSON.parse(data);
    console.log(jsonData);
    if (jsonData.type == 'message') {
      Alert.alert('PocWeb', jsonData.value);
    } else if (jsonData.type == 'cookie') {
      cookieRef.current.value = jsonData.value;
      Alert.alert('Cookie from the webview', jsonData.value);
    }
  };

  // get cookie
  const getCookie = () => {
    const javascriptCodeToSend = `
      window.ReactNativeWebView.postMessage(JSON.stringify({type: 'cookie', value: document.cookie}));
      true;
    `;
    webView.current.injectJavaScript(javascriptCodeToSend);
  };
  // button handler to show cookie
  const onPressedShowCookie = () => {
    getCookie();
  };

  const requestAjaxCallWithCookie = async cookie => {
    const response = await fetch('http://192.168.1.30/login.php', {
      headers: {
        cookie: cookie,
      },
    });
    const jsonData = await response.json();
    console.log(jsonData);
    Alert.alert('Ajax response', JSON.stringify(jsonData));
  };
  // button handler to ajax call
  const onPressedAjaxCall = () => {
    const cookie = cookieRef.current.value;
    if (cookie == '') {
      Alert.alert('Please get the cookie first');
    } else {
      // ajax call
      requestAjaxCallWithCookie(cookie);
    }
  };
  // button handler to send message to webpage
  const onPressedSend = () => {
    const data = {type: 'message', value: 'This is message from mobile app.'};
    sendMessage(data);
  };

  const sendMessage = data => {
    const message = JSON.stringify(data);
    // you can add any javascript code to inject in the webpage.
    const javascriptCodeToSend = `
      window.postMessage(${message}, "*");
      true;
    `;
    webView.current.injectJavaScript(javascriptCodeToSend);
  };
  return (
    <View style={styles.container}>
      <WebView
        ref={webView}
        onLoad={() => getCookie()}
        source={{
          uri: weburl,
          // headers: {
          //   Cookie: 'user=john; password=123456',
          // },
        }}
        onMessage={onBridgeMessage}
        javaScriptEnabled={true}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onPressedShowCookie}>
          <Text style={styles.textView}>Show cookie</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onPressedAjaxCall}>
          <Text style={styles.textView}>Ajax call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onPressedSend}>
          <Text style={styles.textView}>Send to webpage</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textView: {
    color: 'white',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    justifyContent: 'space-between',
    bottom: 16,
    left: 16,
    right: 16,
  },
  button: {
    width: 100,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#006efe',
  },
});

export default WebviewScreen;
