import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.shongyi.taskman',
  appName: 'TaskMan',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
