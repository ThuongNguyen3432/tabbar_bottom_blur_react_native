import { PermissionsAndroid, Platform } from 'react-native';

import { PERMISSIONS, type PermissionName, type PermissionStatus } from '../../constants/permissions';

/**
 * Android permission requests, normalised.
 *
 * iOS has no equivalent call — its permissions are requested implicitly by the
 * API that needs them, and only the usage description in Info.plist matters —
 * so iOS reports 'granted' and lets the feature's own prompt happen.
 */
export async function requestPermission(name: PermissionName): Promise<PermissionStatus> {
  if (Platform.OS !== 'android') {
    return 'granted';
  }

  const permission = PERMISSIONS[name];
  if (!permission) {
    return 'unavailable';
  }

  try {
    const result = await PermissionsAndroid.request(
      permission as Parameters<typeof PermissionsAndroid.request>[0],
    );
    switch (result) {
      case PermissionsAndroid.RESULTS.GRANTED:
        return 'granted';
      // "Never ask again" — the app cannot prompt again and must send the user
      // to system settings, so it is reported separately from a plain refusal.
      case PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN:
        return 'blocked';
      default:
        return 'denied';
    }
  } catch {
    return 'unavailable';
  }
}

export async function checkPermission(name: PermissionName): Promise<PermissionStatus> {
  if (Platform.OS !== 'android') {
    return 'granted';
  }
  const permission = PERMISSIONS[name];
  if (!permission) {
    return 'unavailable';
  }
  try {
    const granted = await PermissionsAndroid.check(
      permission as Parameters<typeof PermissionsAndroid.check>[0],
    );
    return granted ? 'granted' : 'denied';
  } catch {
    return 'unavailable';
  }
}
