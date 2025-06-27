import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
    id: number;
    produkt: string;
    marke: string;
    labels: string[];
    controversy: string[];
    herkunftsland: string;
}

const ProductSchema: Schema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    produkt: {
        type: String,
        required: true
    },
    marke: {
        type: String,
        required: true
    },
    labels: {
        type: [String],
        default: []
    },
    controversy: {
        type: [String],
        default: []
    },
    herkunftsland: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);