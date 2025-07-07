// app/page.tsx or pages/index.tsx
import { useEffect, useState } from 'react';
import Header from '../components/Header';

type Produkt = {
    _id: string;
    produkt: string;
    marke: string;
    labels: string[];
    controversy: string[];
    herkunftsland: string;
};

export default function Home() {
    const [produkte, setProdukte] = useState<Produkt[]>([]);

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => setProdukte(data));
    }, []);

    const latestProdukte = produkte.slice(0, 5);

    return (
        <>
            <Header />
            <div className="home-container">
                <h1>Willkommen zum Nachhaltigen Produktkatalog</h1>
                <div className="feature-cards">
                    <div className="card">
                        <h2>Produkte durchsuchen</h2>
                        <p>Durchsuchen Sie unsere Produktliste nach nachhaltigen Artikeln</p>
                        <p>Verfügbare Produkte: {produkte.length}</p>
                        <a href="search" className="button">Zur Suche</a>
                    </div>
                    <div className="card">
                        <h2>Neueste Produkte</h2>
                        <ul className="latest-products">
                            {latestProdukte.map((p, index) => (
                                <li key={p._id || index}>
                                    <strong>{p.produkt}</strong> von {p.marke}
                                    {p.labels?.map((label: string, i: number) => (
                                        <span className="label" key={i}>{label}</span>
                                    ))}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="card">
                        <h2>Produkt bewerten</h2>
                        <p>Teilen Sie Ihre Erfahrungen mit nachhaltigen Produkten</p>
                        <a href="/review" className="button">Bewertung abgeben</a>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .home-container {
                    padding: 2rem;
                }
                .feature-cards {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                    margin-top: 2rem;
                }
                .card {
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 1.5rem;
                    background: #fff;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    background: #4CAF50;
                    color: white;
                    text-decoration: none;
                    border-radius: 4px;
                    margin-top: 1rem;
                }
                .button:hover {
                    background: #45a049;
                }
                .latest-products {
                    list-style: none;
                    padding: 0;
                }
                .latest-products li {
                    margin-bottom: 1rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 1px solid #eee;
                }
                .label {
                    display: inline-block;
                    background: #dff0d8;
                    color: #3c763d;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 0.8em;
                    margin: 0 4px;
                }
            `}</style>
        </>
    );
}
