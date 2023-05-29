const NotFound = () => {
    return (
        <>
            {/* FIXME: Workaround for issue: https://github.com/vercel/next.js/issues/45620 */}
            <head>
                <title>404</title>
            </head>

            <div className="my-auto flex justify-center text-xl">
                <p className="px-4 py-2">404</p>

                <p className="border-l px-4 py-2">这里什么都没有</p>
            </div>
        </>
    );
};

export const metadata = {
    title: "404",
};

export default NotFound;
