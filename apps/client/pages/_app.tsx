import { Layout } from "client/components";

import type { NextPage } from "next";
import type { AppProps } from "next/app";

import "client/styles/globals.css";

const App: NextPage<AppProps> = props => {
    const { Component, pageProps } = props;

    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
};

export default App;
