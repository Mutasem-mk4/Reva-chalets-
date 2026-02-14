
import React, { useState, useRef, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView, ActivityIndicator, BackHandler, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

const WEB_URL = 'https://riva-jo.me';

export default function App() {
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);

  // Handle Android Hardware Back Button
  useEffect(() => {
    const onBackPress = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true; // Prevent default behavior (exit app)
      }
      return false; // Default behavior
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, [canGoBack]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#1B3B36" />
      <WebView
        ref={webViewRef}
        source={{ uri: WEB_URL }}
        style={styles.webview}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1B3B36" />
          </View>
        )}
        onNavigationStateChange={(navState) => {
          setCanGoBack(navState.canGoBack);
        }}
        // Inject some CSS to hide potential web-only elements if needed
        injectedJavaScript={`
            // Example: Hide a specific web-only footer if needed
            // document.querySelector('.web-footer').style.display = 'none';
            true;
        `}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B3B36', // Match brand color for safe area
    paddingTop: Platform.OS === 'android' ? 30 : 0, // Quick fix for status bar overlap
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF9F6',
  },
});
