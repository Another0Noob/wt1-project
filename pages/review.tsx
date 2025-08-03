import { useEffect, useState } from 'react';
import Layout from '../components/Layout';

type Produkt = {
    _id: string;
    produkt: string;
    marke: string;
    // add other fields if needed
};

export default function ReviewPage() {
    const [produkte, setProdukte] = useState<Produkt[]>([]);

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => setProdukte(data));
    }, []);

    return (
        <Layout title="Produkt bewerten">
            <h1>Produkt bewerten</h1>

            <div className="review-form">
                <form action="/submit-review" method="post">
                    <label htmlFor="product-name">Produktname:</label>
                    <select id="product-name" name="product-name" required>
                        {produkte.map((produkt) => (
                            <option key={produkt._id} value={produkt._id}>
                                {produkt.produkt} ({produkt.marke})
                            </option>
                        ))}
                    </select>

                    <label htmlFor="rating">Bewertung (1–5 Sterne):</label>
                    <select id="rating" name="rating" required>
                        {[1, 2, 3, 4, 5].map((n) => (
                            <option key={n} value={n}>{'★'.repeat(n).padEnd(5, '☆')}</option>
                        ))}
                    </select>

                    <label htmlFor="review-text">Rezension:</label>
                    <textarea
                        id="review-text"
                        name="review-text"
                        rows={5}
                        placeholder="Ihre Rezension hier eingeben..."
                        required
                    ></textarea>
                    <label htmlFor="co2">CO₂-Wert (kg):</label>
                    <input type="number" id="co2" name="co2" step="0.1" placeholder="z.B. 1.5" required />

                    <button type="submit">Bewertung hinzufügen</button>
                </form>
            </div>

            <style jsx>{`
        .review-form {
          padding: 2rem 0;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        button {
          background: #4caf50;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        button:hover {
          background: #45a049;
        }
      `}</style>
        </Layout>
    );
}
