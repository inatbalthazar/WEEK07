import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { MessageProvider } from './context/messageContext/MessageProvider.jsx';

createRoot(document.getElementById('root')).render(
  <MessageProvider>
    <App />
  </MessageProvider>
);
