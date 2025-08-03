import { useEffect, useState } from 'react';
import Layout from '../components/Layout';

type Produkt = {
    _id: string;
    produkt: string;
    marke: string;
    labels: string[];
    controversy: string[];
    herkunftsland: string;
};

export default function SearchPage() {
    const [produkte, setProdukte] = useState<Produkt[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProdukte, setFilteredProdukte] = useState<Produkt[]>([]);
    const [availableLabels, setAvailableLabels] = useState<string[]>([]);
    const [availableControversies, setAvailableControversies] = useState<string[]>([]);
    const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
    const [selectedControversies, setSelectedControversies] = useState<string[]>([]);
    const [co2Limit, setCo2Limit] = useState<number>(2.0);
    const [minRating, setMinRating] = useState<number>(1);

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                setProdukte(data);

                // Extract unique labels and controversies
                const labels = [...new Set(data.flatMap((p: Produkt) => p.labels))];
                const controversies = [...new Set(data.flatMap((p: Produkt) => p.controversy))];

                setAvailableLabels(labels as string[]);
                setAvailableControversies(controversies as string[]);
            });
    }, []);

    useEffect(() => {
        const filtered = produkte.filter(p => {
            // Search term filter
            const matchesSearch = p.produkt.toLowerCase().includes(searchTerm.toLowerCase());

            // Labels filter (if any labels selected, product must have at least one)
            const matchesLabels = selectedLabels.length === 0 ||
                selectedLabels.some(label => p.labels.includes(label));

            // Controversy filter (exclude products with selected controversies)
            const matchesControversy = selectedControversies.length === 0 ||
                !selectedControversies.some(controversy => p.controversy.includes(controversy));

            return matchesSearch && matchesLabels && matchesControversy;
        });

        setFilteredProdukte(filtered);
    }, [searchTerm, selectedLabels, selectedControversies, co2Limit, minRating, produkte]);

    const handleLabelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedLabels(selected);
    };

    const handleControversyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedControversies(selected);
    };

    return (
        <Layout title="Produkte nach Nachhaltigkeit filtern">
            <h1>Produkte nach Nachhaltigkeit filtern</h1>

            <div className="filters">
                <h3>Filter</h3>
                <form onSubmit={e => e.preventDefault()}>
                    <label>
                        Suche:
                        <input
                            type="text"
                            placeholder="Produktname"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </label>
                </form>
                <br />

                <label>CO₂-Grenze:
                    <input
                        type="number"
                        value={co2Limit}
                        step="0.1"
                        onChange={e => setCo2Limit(Number(e.target.value))}
                    /> kg
                </label><br />

                <label>Labels (mehrfach wählbar):</label>
                <select name="labels" multiple onChange={handleLabelChange}>
                    {availableLabels.map(label => (
                        <option key={label} value={label}>{label}</option>
                    ))}
                </select><br />

                <label>Kontroverse Branchen ausschließen:</label>
                <select name="controversy" multiple onChange={handleControversyChange}>
                    {availableControversies.map(item => (
                        <option key={item} value={item}>{item}</option>
                    ))}
                </select><br />

                <label>Mindestbewertung (1–5 Sterne):</label>
                <select value={minRating} onChange={e => setMinRating(Number(e.target.value))}>
                    {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>{'★'.repeat(n).padEnd(5, '☆')}</option>
                    ))}
                </select>
            </div>

            <div className="product-list">
                <h3>Produktliste ({filteredProdukte.length} Ergebnisse)</h3>
                {filteredProdukte.map(p => (
                    <div className="product-item" key={p._id}>
                        <h4>{p.produkt}</h4>
                        <p><strong>Marke:</strong> {p.marke}</p>
                        <p><strong>Herkunft:</strong> {p.herkunftsland}</p>
                        <p>
                            {p.labels.map((label, i) => (
                                <span className="label" key={i}>{label}</span>
                            ))}
                        </p>
                        {p.controversy?.length > 0 && (
                            <p>
                                {p.controversy.map((c, i) => (
                                    <span className="controversy" key={i}>{c}</span>
                                ))}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            <style jsx>{`
                .filters, .product-list {
                    margin-bottom: 2rem;
                }

                .product-item {
                    border: 1px solid #ddd;
                    padding: 15px;
                    border-radius: 6px;
                    margin-bottom: 1rem;
                }

                .label {
                    background: #dff0d8;
                    color: #3c763d;
                    padding: 2px 6px;
                    margin-right: 5px;
                    border-radius: 4px;
                    font-size: 0.9em;
                }

                .controversy {
                    background: #f2dede;
                    color: #a94442;
                    padding: 2px 6px;
                    margin-right: 5px;
                    border-radius: 4px;
                    font-size: 0.9em;
                }
                form {
                    display: flex;
                    gap: 0.5rem;
                    align-items: center;
                }
                button {
                    padding: 4px 12px;
                    border-radius: 4px;
                    border: 1px solid #4caf50;
                    background: #4caf50;
                    color: white;
                    cursor: pointer;
                }
                button:hover {
                    background: #388e3c;
                }
            `}</style>
        </Layout>
    );
}