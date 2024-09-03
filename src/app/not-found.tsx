import type { Metadata } from "next";

const NotFound: React.FC = () => {
    return (
        <div className="my-auto flex justify-center text-xl">
            <p className="px-5 py-2">404</p>

            <p className="border-l px-5 py-2">这里什么都没有</p>
        </div>
    );
};

export const metadata: Metadata = {
    title: "404",
};

export default NotFound;
