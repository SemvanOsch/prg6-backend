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
    res.status(204).send();
});

pokemonRouter.post('/pokemon', async (req, res) => {
    const name = req.body.name;
    const type = req.body.type;
    const dexEntree = req.body.dexEntree;
    const dexNum = req.body.dexNum;

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
});

pokemonRouter.delete('/pokemon/:id', async (req, res) => {
    const pokemonDelete = await Pokemon.findByIdAndDelete(req.params.id);
    res.status(204).json({pokemonDelete});
});

pokemonRouter.options('/pokemon/:id', async (req, res) => {
    res.setHeader("Allow", 'GET,PUT,PATCH,DELETE,OPTIONS');
    res.status(204).send();
});

pokemonRouter.post('/pokemon', async (req, res) => {
    await Pokemon.deleteMany({});
    for (let i = 0; i < 5; i++){
        let pokemon = new Pokemon({
            name: faker.lorem.slug(),
            type: faker.lorem.slug(),
            dexEntree: faker.lorem.slug(),
            dexNum: faker.number.int(100),
        })

        await pokemon.save()
    }
    res.status(201).json({
        message: 'notes send'
    })
});
export default pokemonRouter;