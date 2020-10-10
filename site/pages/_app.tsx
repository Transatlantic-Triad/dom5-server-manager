import React from 'react';
import App from 'next/app';
import { Router } from 'next/router';
// import Head from 'next/head';
import NProgress from 'nprogress';
import { NextComponentType } from 'next';

import Container from 'react-bootstrap/Container';

import Header from '../components/Layout/Header';

import '../styles/index.scss';

type PageComponent = NextComponentType & {
  url: string | ((router: Router) => string) | void;
  title?: string | (() => string);
};

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

type State = { reload: null | (() => void) };

class MyApp extends App<
  {
    Component: PageComponent;
  },
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  State
> {
  state: State = {
    reload: null,
  };

  render(): JSX.Element {
    const { Component, pageProps } = this.props;
    return (
      <div className="site">
        {/* <Head> [ TODO ] </Head> */}
        <Header />
        <Container>
          <Component {...pageProps} />
        </Container>
      </div>
    );
  }
}

export default MyApp;
