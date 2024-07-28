declare module 'react-native-config' {
  export interface NativeConfig {
    HOSTNAME?: string;
    BASE_API_URL?: string;
    GO_REST_ACCESS_TOKEN?: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
