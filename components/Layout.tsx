import Head from 'next/head';
import Header from './Header';

interface LayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function Layout({ children, title = 'Meine Seite' }: LayoutProps) {
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <Header />
            <main>{children}</main>
        </>
    );
}
