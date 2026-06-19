import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { AppRouter } from './routes/index.tsx';
import ReactQueryProvider from './providers/ReactQueryProvider.tsx';
import { Toaster } from 'sonner';
import { loadMidtransScript } from './lib/midtrans.ts';

loadMidtransScript()
  .then(() => {
    console.log('✅ Midtrans ready');
  })
  .catch((error) => {
    console.error('❌ Midtrans load failed:', error);
  });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactQueryProvider>
      <AppRouter />
      <Toaster richColors position='bottom-right' />
    </ReactQueryProvider>
  </StrictMode>,
);
