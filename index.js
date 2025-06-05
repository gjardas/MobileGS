import { registerRootComponent } from 'expo';
import App from './App';

// registerRootComponent chama AppRegistry.registerComponent('main', () => App);
// Também garante que, seja carregando o app no Expo Go ou em um build nativo,
// o ambiente seja configurado apropriadamente.
registerRootComponent(App);
