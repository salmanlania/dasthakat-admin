import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import './index.css';
import Routes from './Routes.jsx';
import { store } from './store/index.js';
import Theme from './utils/theme.jsx';

createRoot(document.getElementById('root')).render(
  <Theme>
    <Provider store={store}>
      <Routes />
    </Provider>
    <Toaster toastOptions={{ duration: 5000 }} />
  </Theme>
);
