import Head from 'next/head';
import type { AppProps } from 'next/app';
import { ToastContainer, cssTransition } from 'react-toastify';
import 'animate.css/animate.min.css';
import 'react-toastify/dist/ReactToastify.css';

import '../styles/globals.scss';

const bounce = cssTransition({
  enter: 'animate__animated animate__bounceIn',
  exit: 'animate__animated animate__bounceOut'
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Next Template</title>
      </Head>
      <Component {...pageProps} />
      <ToastContainer transition={bounce} theme='colored' position='bottom-right' hideProgressBar autoClose={3000} />
    </>
  );
}

export default MyApp;
