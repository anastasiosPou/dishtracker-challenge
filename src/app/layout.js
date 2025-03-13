'use client';
import { Provider } from 'react-redux';

import {store} from '../store';
import { GatewayProvider } from '../GatewayProvider';
import './global.scss';

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{}}>
      <body>
        <Provider store={store}>
          <GatewayProvider>
            {children}
          </GatewayProvider>
        </Provider>
      </body>
    </html>
  );
}
