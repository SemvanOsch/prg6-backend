import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const pokemonSchema = new mongoose.Schema({
    name: {type: String},
    type: {type: String},
    dexEntree: {type: String},
    dexNum: {type: String},
}, {
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: (doc, ret) => {

            ret._links = {
                self: {
                    href: `${process.env.LOCALURL}/${ret._id}`
                },
                collection: {
                    href: `${process.env.LOCALURL}`
                }
            }

            delete ret._id
        }
    }
});

pokemonSchema.plugin(mongoosePaginate);

const Pokemon = mongoose.model('Pokemon', pokemonSchema);

export default Pokemon;