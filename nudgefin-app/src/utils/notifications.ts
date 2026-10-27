import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';

// Configure how notifications behave when the app is foregrounded (open)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Requests native OS permissions for push alerts.
 * Essential for modern mobile operating systems.
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    Alert.alert(
      'Permissions Required',
      'NudgeFin requires notification access to deploy behavioral alerts before your critical spending windows.'
    );
    return false;
  }
  return true;
}

// Map day names to Javascript Date weekday integers (0 = Sunday, 1 = Monday, etc.)
const WEEKDAY_MAP: { [key: string]: number } = {
  Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6
};

/**
 * Schedules a recurring weekly notification based on the backend's predictive analysis.
 */
export async function scheduleBehavioralNudge(
  dayName: string,
  hour: number,
  minute: number,
  message: string
) {
  // Cancel any previously scheduled nudges to avoid duplicate alert stacking
  await Notifications.cancelAllScheduledNotificationsAsync();

  const weekdayTarget = WEEKDAY_MAP[dayName];
  if (weekdayTarget === undefined) return;

  // Schedule the weekly native reminder
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'NudgeFin Intervention 🧠',
      body: message,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: weekdayTarget + 1, // Expo counts Sunday as 1, Monday as 2...
      hour: hour,
      minute: minute,
    },
  });

  console.log(`Nudge successfully scheduled. ID: ${notificationId} for ${dayName} at ${hour}:${minute}`);
  return notificationId;
}
