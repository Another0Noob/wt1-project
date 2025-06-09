// components/Header.tsx
import Link from 'next/link';

export default function Header() {
    return (
        <nav style={{ marginBottom: '1rem' }}>
            <Link href="/">Home</Link> |{" "}
            <Link href="/search">Produkte suchen</Link> |{" "}
            <Link href="/review">Produkt bewerten</Link>
        </nav>
    );
}
