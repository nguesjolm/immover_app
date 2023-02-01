import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import OneSignal from 'react-native-onesignal';
import { useState, useEffect, useRef } from 'react';
import { StyleSheet,Text, View,Platform,StatusBar} from 'react-native';
import * as React from 'react';
import { WebView } from 'react-native-webview';
// import { StatusBar } from 'expo-status-bar';
import { sendtoken } from './app/ApiLaravel';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    
    OneSignal.setAppId("4aa2156e-9ef8-4b24-8759-d2b97e536a0a");

    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      //setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      setNotification(response);
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  if (notification) {
    return (
      <View style={styles.container}>

        <StatusBar
          backgroundColor="#f4390f"
        />

        <View style={styles.topBar}>
					<Text style={{color:'white',fontSize:20,marginLeft:10,marginTop:2,fontWeight:"bold"}}>ImmOver</Text>
				</View>
         
        <WebView style={styles.webview} source={{uri: notification.notification.request.content.body}}/>

      </View>
    );    
    
  }else{
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#f4390f"
        />
      
        <View style={styles.topBar}>
					<Text style={{color:'white',fontSize:20,marginLeft:10,marginTop:2,fontWeight:"bold"}}>ImmOver</Text>
				</View>
        <WebView style={styles.webview}  source={{ uri: 'https://immover.io' }}/>

      </View>
    );
  }

 
}



async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    console.log('Must use physical device for Push Notifications');
  }
  
  let value = sendtoken(token);
  return token;
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#ecf0f1",
		flexDirection: "column",
	},

	topBar: {
		height: '5%',
		width: "100%",
		//justifyContent: "center",
		//alignItems: "center",
		backgroundColor: "#f4390f",
	},
	webview: {
		height: 300,
	},
});