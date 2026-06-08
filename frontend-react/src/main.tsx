import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { AppRouter } from './routes/index.tsx';
import ReactQueryProvider from './providers/ReactQueryProvider.tsx';
import { Toaster } from 'sonner';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactQueryProvider>
      <AppRouter />
      <Toaster richColors position='bottom-right' />
    </ReactQueryProvider>
  </StrictMode>,
);
