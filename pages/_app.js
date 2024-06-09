import "@/styles/globals.css";
import { AuthProvider } from '@/utils/auth_context'

export default function App({ Component, pageProps }) {

  return (
    <>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
};
