import { getMessaging } from '@firebase/messaging';

const SendNotificationComponent = ({ fcm_token }) => {
  const sendNotification = async () => {
    try {
      const messaging = getMessaging();
      const token = fcm_token; // The token you obtained from the client-side
      const notification = {
        title: 'New Message',
        body: 'You have a new message.',
      };

      const payload = {
        notification,
        token,
      };

      await messaging.send(payload);
      console.log('Push notification sent successfully.');
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  };

  return (
    <div>
      <button onClick={sendNotification}>Send Push Notification</button>
    </div>
  );
};

export default SendNotificationComponent;
