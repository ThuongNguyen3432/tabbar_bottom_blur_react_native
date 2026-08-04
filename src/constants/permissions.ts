import { Platform } from 'react-native';

/**
 * Permissions the app asks for, named once per platform.
 *
 * Android names the string constant; iOS gates on an Info.plist usage
 * description instead, so the iOS side carries the plist key to check against.
 */
export const PERMISSIONS = {
  camera: Platform.select({
    android: 'android.permission.CAMERA',
    ios: 'NSCameraUsageDescription',
    default: '',
  }),
  photoLibrary: Platform.select({
    android: 'android.permission.READ_MEDIA_IMAGES',
    ios: 'NSPhotoLibraryUsageDescription',
    default: '',
  }),
  notifications: Platform.select({
    android: 'android.permission.POST_NOTIFICATIONS',
    ios: 'NSUserNotificationsUsageDescription',
    default: '',
  }),
} as const;

export type PermissionName = keyof typeof PERMISSIONS;

/** Outcome of a permission request, normalised across platforms. */
export type PermissionStatus = 'granted' | 'denied' | 'blocked' | 'unavailable';
