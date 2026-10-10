import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import api from './api';

const VAPID_PUBLIC_KEY = 'BMVNTidF-zG0RkvgiXqgfQjlq6O6lgwVtislDNEGHEANZ3NKU7YXIq6C5Du1eP8I1kBNRfj7ocwdY4Y80kdpMJU';

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

const registerWebPush = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Web Push not supported in this browser');
        return;
    }

    try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            console.warn('Web Push permission denied');
            return;
        }

        const registration = await navigator.serviceWorker.register('/sw.js');
        await navigator.serviceWorker.ready;

        let subscription = await registration.pushManager.getSubscription();
        if (!subscription) {
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
            });
        }

        await api.post('/notifications/register-device', {
            token: JSON.stringify(subscription),
            platform: 'web'
        });
        console.log('Web Push successfully registered with backend.');
    } catch (e) {
        console.error('Error registering Web Push:', e);
    }
};

export const registerPushNotifications = async () => {
    if (!Capacitor.isNativePlatform()) {
        console.log('Running on web, initializing Web Push...');
        return registerWebPush();
    }

    try {
        let permStatus = await PushNotifications.checkPermissions();
        if (permStatus.receive === 'prompt') {
            permStatus = await PushNotifications.requestPermissions();
        }

        if (permStatus.receive !== 'granted') {
            console.warn('User denied push notification permissions.');
            return;
        }

        await PushNotifications.register();

        PushNotifications.addListener('registration', async (token) => {
            console.log('Push registration success, token: ' + token.value);
            try {
                await api.post('/notifications/register-device', {
                    token: token.value,
                    platform: Capacitor.getPlatform()
                });
            } catch (e) {
                console.error('Failed to register push token:', e);
            }
        });

        PushNotifications.addListener('registrationError', (error: any) => {
            console.error('Error on push registration: ' + JSON.stringify(error));
        });

        PushNotifications.addListener('pushNotificationReceived', (notification) => {
            console.log('Push received in foreground:', notification);
        });

        PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
            console.log('Push action performed:', notification);
        });

    } catch (e) {
        console.error('Push Notifications setup error:', e);
    }
};
