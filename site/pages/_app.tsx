import React from 'react';
import App from 'next/app';
import { Router } from 'next/router';
import Head from 'next/head';
import NProgress from 'nprogress';
import { NextComponentType } from 'next';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Header from '../components/Layout/Header';

import '../styles/index.scss';

type PageComponent = NextComponentType & {
  url: string | ((router: Router) => string) | void;
  title?: string | (() => string);
};

const BASE_URL = process.env.NEXT_STATIC_BASE_URL;

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
    const { Component, router, pageProps } = this.props;
    const { url, title } = Component;
    let ogUrl;
    switch (typeof url) {
      case 'function':
        ogUrl = url(router);
        break;
      case 'string':
        ogUrl = url;
        break;
      default:
    }
    if (!ogUrl) {
      ogUrl = router.asPath;
    }
    return (
      <div className="site">
        <Head>
          <meta
            key="meta-description"
            name="description"
            content="Tack För Kaffet (ofta förkortat TFK) är en prisad svensk humorpodcast skapad av Mathie Martinez, Johan Svärd och Jimmy Woolke, tre värmlänningar som numera bor i Stockholm och Göteborg. Ämnen i programmet är nöjen, livsbetraktelser och dagsaktuella nyheter."
          />
          <meta
            key="meta-abstract"
            name="abstract"
            content="SVERIGES ROLIGASTE PODCAST 2014. SEN GICK DET UTFÖR."
          />
          <meta
            key="meta-keywords"
            name="keywords"
            content="Tack För Kaffet, Podcast, Svensk Podcast, Humor, Humor Podcast, Mathie Martinez, Johan Svärd, Jimmy Woolke"
          />
          <meta
            key="meta-og-image"
            name="og:image"
            content={`${BASE_URL || ''}/img/intro-section-image.png`}
          />
          <meta key="meta-og-type" name="og:type" content="article" />
          {ogUrl != null && (
            <meta
              key="meta-og-url"
              name="og:url"
              content={`${BASE_URL || ''}${ogUrl}`}
            />
          )}
          {ogUrl != null && (
            <link rel="canonical" href={`${BASE_URL || ''}${ogUrl}`} />
          )}
        </Head>
        <Header />
        <Container>
          <Row>
            <Col>1 of 1</Col>
          </Row>
          <Component {...pageProps} generateTitle={title} />
        </Container>
      </div>
    );
  }
}

export default MyApp;
