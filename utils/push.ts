import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import api from './api';

export const registerPushNotifications = async () => {
    // Push notifications are only available on native devices (iOS/Android)
    if (!Capacitor.isNativePlatform()) {
        console.log('Push notifications not available on web/desktop.');
        return;
    }

    try {
        // Request permissions
        let permStatus = await PushNotifications.checkPermissions();
        
        if (permStatus.receive === 'prompt') {
            permStatus = await PushNotifications.requestPermissions();
        }

        if (permStatus.receive !== 'granted') {
            console.warn('User denied push notification permissions.');
            return;
        }

        // Register with Apple / Google to receive push via APNS/FCM
        await PushNotifications.register();

        // Listen for successful registration
        PushNotifications.addListener('registration', async (token) => {
            console.log('Push registration success, token: ' + token.value);
            // Send token to our backend
            try {
                await api.post('/api/notifications/register-device', {
                    token: token.value,
                    platform: Capacitor.getPlatform()
                });
                console.log('Push token successfully registered with backend.');
            } catch (e) {
                console.error('Failed to register push token with backend:', e);
            }
        });

        // Listen for errors
        PushNotifications.addListener('registrationError', (error: any) => {
            console.error('Error on push registration: ' + JSON.stringify(error));
        });

        // Listen for incoming notifications when app is in foreground
        PushNotifications.addListener('pushNotificationReceived', (notification) => {
            console.log('Push received in foreground: ' + JSON.stringify(notification));
            // Opcional: mostrar un Toast o recargar notificaciones In-App si se desea
        });

        // Listen for action when user taps on a notification
        PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
            console.log('Push action performed: ' + JSON.stringify(notification));
        });

    } catch (e) {
        console.error('Push Notifications setup error:', e);
    }
};
