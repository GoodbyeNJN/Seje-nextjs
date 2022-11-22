import { Footer } from "./footer";
import { Header } from "./header";

export const Layout: React.FC<React.PropsWithChildren> = props => {
    const { children } = props;

    return (
        <>
            <Header className="flex-initial" />
            <main className="flex flex-1 flex-col px-8 py-4">{children}</main>
            <Footer className="flex-initial" />
        </>
    );
};
