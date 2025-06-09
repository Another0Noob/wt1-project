import produkte from '../data/produkt.json';
import Layout from '../components/Layout';

const availableLabels = ['Fairtrade', 'EU Bio', 'Klimaneutral', 'recycling-Material'];
const availableControversies = ['Ölindustrie', 'Waffenherstellung', 'Fast Fashion', 'Keine'];

export default function SearchPage() {
    return (
        <Layout title="Produkte nach Nachhaltigkeit filtern">
            <h1>Produkte nach Nachhaltigkeit filtern</h1>

            <div className="filters">
                <h3>Filter</h3>

                <label>Suche: <input type="text" placeholder="Produktname" /></label><br />

                <label>CO₂-Grenze: <input type="number" defaultValue="2.0" step="0.1" /> kg</label><br />

                <label>Labels (mehrfach wählbar):</label>
                <select name="labels" multiple>
                    {availableLabels.map(label => (
                        <option key={label} value={label}>{label}</option>
                    ))}
                </select><br />

                <label>Kontroverse Branchen ausschließen:</label>
                <select name="controversy" multiple>
                    {availableControversies.map(item => (
                        <option key={item} value={item}>{item}</option>
                    ))}
                </select><br />

                <label>Bewertung (1–5 Sterne):</label>
                <select id="rating" name="rating" required>
                    {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>{'★'.repeat(n).padEnd(5, '☆')}</option>
                    ))}
                </select>
            </div>

            <div className="product-list">
                <h3>Produktliste</h3>
                {produkte.map(p => (
                    <div className="product-item" key={p.id}>
                        <h4>{p.produkt}</h4>
                        <p><strong>Marke:</strong> {p.marke}</p>
                        <p><strong>Herkunft:</strong> {p.herkunftsland}</p>
                        <p>
                            {p.labels.map(label => (
                                <span className="label" key={label}>{label}</span>
                            ))}
                        </p>
                        {p.controversy?.length > 0 && (
                            <p>
                                {p.controversy.map(c => (
                                    <span className="controversy" key={c}>{c}</span>
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
      `}</style>
        </Layout>
    );
}
