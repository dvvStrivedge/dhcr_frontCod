// components/NotificationButton.js

import React, { useState, useEffect } from 'react';
import app from '../../data/utils/firebase';
import { getMessaging, getToken } from '@firebase/messaging';

const NotificationButton = () => {
  const [token, setToken] = useState('');
  const [notificationPermission, setNotificationPermission] =
    useState('default');

  useEffect(() => {
    const messaging = getMessaging(app);

    const requestNotificationPermission = async () => {
      try {
        if (typeof window !== 'undefined') {
          console.log('requestNotificationPermission');

          const permission = await Notification.requestPermission();
          const newToken = await getToken(messaging);
          console.log('newToken', newToken);

          setNotificationPermission(permission);
          setToken(newToken);
        }
      } catch (error) {
        console.error('Notification permission denied:', error);
      }
    };
    requestNotificationPermission();
  }, []);

  // send push message
  const sendNotification = async () => {
    const messaging = getMessaging();
    const payload = {
      notification: {
        title: 'New Order',
        body: 'You have a new order',
        click_action: 'http://localhost:3000/orders',
        icon: 'http://url-to-an-icon/icon.png',
      },
    };

    try {
      await messaging.send(payload);
      console.log('Notification sent successfully');
    } catch (error) {
      console.error('Unable to send notification', error);
    }
  };

  return (
    <div>
      <button>Request Notification Permission</button>
      <p>FCM Token: {token}</p>
      <p>Notification Permission: {notificationPermission}</p>
    </div>
  );
};

export default NotificationButton;
