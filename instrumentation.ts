export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { KubiksSDK } = await import('@kubiks/otel-nextjs');
    const sdk = new KubiksSDK({
      service: 'hugin',
      endpoint: process.env.KUBIKS_ENDPOINT || 'https://api.kubiks.com',
      apiKey: process.env.KUBIKS_API_KEY,
      environment: process.env.NODE_ENV || 'development',
    });
    sdk.start();
  }
} 