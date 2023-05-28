import { Footer, Header /* , notoSerifSC, notoSerifTC, utuntuMono */ } from "@/components";
import { blogConfig } from "@/config";
import "@/styles/globals.css";

interface Props {
    children?: React.ReactNode;
}

const Layout = (props: Props) => {
    const { children } = props;

    return (
        <html
            lang="zh-CN"
            // className={cx(notoSerifTC.variable, notoSerifSC.variable, utuntuMono.variable)}
        >
            <body>
                <Header className="flex-initial" />

                <main className="flex flex-1 flex-col px-8 py-4">{children}</main>

                <Footer className="flex-initial" />
            </body>
        </html>
    );
};

export const metadata = {
    title: {
        default: blogConfig.title,
        template: "%s - " + blogConfig.title,
    },
    description: blogConfig.description,
};

export default Layout;
