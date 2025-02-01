import {Router} from "express";
import { faker } from '@faker-js/faker';
import Pokemon from "../models/Pokemon.js";

const pokemonRouter = new Router();

pokemonRouter.get('/pokemon', async (req, res) => {
    try{
        const pokemon = await Pokemon.find({})
        res.json({
            "items": pokemon,
            "_links": {
                "self": {
                    "href": `${process.env.LOCALURL}`
                },
                "collection": {
                    "href": `${process.env.LOCALURL}`
                }
            }
        })
    } catch (e) {
        res.status(500).json({
            error: e.message
        })
    }
});

pokemonRouter.options('/pokemon', async (req, res) => {
    res.setHeader("Allow", 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.status(204).send();
});

pokemonRouter.post('/pokemon', async (req, res) => {
        const name = req.body.name;
        const type = req.body.type;
        const dexEntree = req.body.dexEntree;
        const dexNum = req.body.dexNum;
        const METHOD = req.body.METHOD;

        if (METHOD === 'SEED'){
            await Pokemon.deleteMany({})
            for (let i = 0; i < 5; i++){
                let pokemon = new Pokemon({
                    name: 'Bulbasaur',
                    type: 'Grass/Poison',
                    dexEntree: 'It can go for days without eating a single morsel. In the bulb on its back, it stores energy.',
                    dexNum: '1',
                })
                await pokemon.save()
            }
            res.status(201).json({
                message: 'SEED succesfull'
            })
        } else {
            if (name && name.trim() !== "" && type && type.trim() !== "" && dexEntree && dexEntree.trim() !== "" && dexNum && dexNum.trim() !== "") {
                const pokemon = new Pokemon({
                    name: name,
                    type: type,
                    dexEntree: dexEntree,
                    dexNum: dexNum,
                });
                await pokemon.save();
                res.status(201).json({pokemon});
            } else {
                res.status(400).send()
            }
        }
});

pokemonRouter.get('/pokemon/:id', async (req, res) => {
    try{
        const pokemon = await Pokemon.findById(req.params.id)
        if(pokemon !== null){
            res.json(pokemon)
        } else {
            res.status(404).json('Pokemon does not exist')
        }
    } catch (e) {
        res.status(404).json({
            error: e.message
        })
    }
});

pokemonRouter.put('/pokemon/:id', async (req, res) => {
    try {
        const name = req.body.name
        const type = req.body.type
        const dexEntree = req.body.dexEntree
        const dexNum = req.body.dexNum

        const pokemonUpdate = await Pokemon.findById(req.params.id);
        if (name && name.trim() !== "" && type && type.trim() !== "" && dexEntree && dexEntree.trim() !== "" && dexNum && dexNum.trim() !== "") {
            pokemonUpdate.name = name;
            pokemonUpdate.type = type;
            pokemonUpdate.dexEntree = dexEntree;
            pokemonUpdate.dexNum = dexNum;

            const updatedPokemon = await pokemonUpdate.save()

            res.json({updatedPokemon});
        } else {
            res.status(400).send()
        }
    } catch (e){
        res.status(500).json('server error');
    }
});

pokemonRouter.patch('/pokemon/:id', async (req, res) => {
    try {
        const name = req.body.name
        const type = req.body.type
        const dexEntree = req.body.dexEntree
        const dexNum = req.body.dexNum

        const pokemonUpdate = await Pokemon.findById(req.params.id);
        if (!pokemonUpdate) {
            return res.status(404).json({ error: 'Pokémon not found' });
        }

        if (name && name.trim() !== "") {
            pokemonUpdate.name = name;
        }
        if (type && type.trim() !== "") {
            pokemonUpdate.type = type;
        }
        if (dexEntree && dexEntree.trim() !== "") {
            pokemonUpdate.dexEntree = dexEntree;
        }
        if (dexNum && dexNum.trim() !== "") {
            pokemonUpdate.dexNum = dexNum;
        }

        const updatedPokemon = await pokemonUpdate.save();

        res.json({ updatedPokemon });
    } catch (e) {
        res.status(500).json('server error');
    }
});

pokemonRouter.delete('/pokemon/:id', async (req, res) => {
    const pokemonDelete = await Pokemon.findByIdAndDelete(req.params.id);
    res.status(204).json({pokemonDelete});
});

pokemonRouter.options('/pokemon/:id', async (req, res) => {
    res.setHeader("Allow", 'GET,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,PATCH,OPTIONS,DELETE');
    res.status(204).send();
});
export default pokemonRouter;