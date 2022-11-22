import Head from "next/head";
import { getTitle } from "share/utils";

import type { NextPage } from "next";

const NotFound: NextPage = () => {
    return (
        <>
            <Head>
                <title>{getTitle("404")}</title>
            </Head>

            <div className="my-auto flex justify-center text-xl">
                <p className="px-4 py-2">404</p>

                <p className="border-l px-4 py-2">这里什么都没有</p>
            </div>
        </>
    );
};

export default NotFound;
