export const loadMidtransScript = () => {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector('script[src*="snap.js"]')) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';

    const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;

    if (!clientKey) {
      reject(new Error('VITE_MIDTRANS_CLIENT_KEY is not defined'));
      return;
    }

    script.setAttribute('data-client-key', clientKey);
    script.async = true;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Midtrans script'));

    document.body.appendChild(script);
  });
};
