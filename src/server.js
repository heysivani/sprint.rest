const pokeData = require("./data");
const express = require("express");

const setupServer = () => {
  /**
   * Create, set up and return your express server, split things into separate files if it becomes too long!
   */
  const app = express();

  app.get("/api/pokemon/", (req, res) => {
    const pokedex = pokeData.pokemon;
    const limit = req.query.limit || 151;
    const result = pokedex.slice(0, Number(limit));
    res.send(result);
  });

  app.post("/api/pokemon/", (req, res) => {
    const newPoke = req;
    pokeData.pokemon.push(newPoke);
    res.sendStatus(201);
  });

  app.get("/api/pokemon/:idOrName", (req, res) => {
    const idOrName = req.params.idOrName;

    if (isNaN(Number(idOrName))) {
      let targetPoke;
      for (const poke of pokeData.pokemon) {
        if (poke.name === String(idOrName)) {
          targetPoke = poke;
          res.send(targetPoke);
        }
      }
    } else if (!isNaN(Number(idOrName))) {
      let targetPoke;
      for (const poke of pokeData.pokemon) {
        if (Number(poke.id) === Number(idOrName)) {
          targetPoke = poke;
          res.send(targetPoke);
        }
      }
    }
  });

  app.patch("/api/pokemon/:idOrName", (req, res) => {
    const query = req.query;
    const idOrName = req.params.idOrName;
    let targetPoke = null;

    if (isNaN(Number(idOrName))) {
      // is a name
      targetPoke = pokeData.pokemon.filter((poke) => {
        return poke.name === String(idOrName);
      });
    } else if (!isNaN(Number(idOrName))) {
      // is an id number
      targetPoke = pokeData.pokemon.filter((poke) => {
        return Number(poke.id) === Number(idOrName);
      });
    }

    const indx = pokeData.pokemon.indexOf(targetPoke[0]);
    for (const change in query) {
      pokeData.pokemon[indx][change] = query[change];
    }

    res.sendStatus(200);
  });

  app.delete("/api/pokemon/:idOrName", (req, res) => {
    const idOrName = req.params.idOrName;
    let targetPoke = null;

    if (isNaN(Number(idOrName))) {
      // is a name
      targetPoke = pokeData.pokemon.filter((poke) => {
        return poke.name === String(idOrName);
      });
    } else if (!isNaN(Number(idOrName))) {
      // is an id number
      targetPoke = pokeData.pokemon.filter((poke) => {
        return Number(poke.id) === Number(idOrName);
      });
    }

    const indx = pokeData.pokemon.indexOf(targetPoke[0]);
    pokeData.pokemon.splice(indx, 1);
    res.sendStatus(200);
  });

  app.get("/api/pokemon/:idOrName/evolutions", (req, res) => {
    const idOrName = req.params.idOrName;
    let targetPoke = null;
    let pokeEvos = [];

    if (isNaN(Number(idOrName))) {
      // is a name
      targetPoke = pokeData.pokemon.filter((poke) => {
        return poke.name === String(idOrName);
      });
      if (targetPoke[0].evolutions) {
        pokeEvos = targetPoke[0].evolutions;
      }
    } else if (!isNaN(Number(idOrName))) {
      // is an id number
      targetPoke = pokeData.pokemon.filter((poke) => {
        return Number(poke.id) === Number(idOrName);
      });
      if (targetPoke[0].evolutions) {
        pokeEvos = targetPoke[0].evolutions;
      }
    }

    res.send(pokeEvos);
  });

  app.get("/api/pokemon/:idOrName/evolutions/previous", (req, res) => {
    const idOrName = req.params.idOrName;
    let targetPoke = null;
    let pokeEvos = [];

    if (isNaN(Number(idOrName))) {
      // is a name
      targetPoke = pokeData.pokemon.filter((poke) => {
        return poke.name === String(idOrName);
      });
      if (targetPoke[0]["Previous evolution(s)"]) {
        pokeEvos = targetPoke[0]["Previous evolution(s)"];
      }
    } else if (!isNaN(Number(idOrName))) {
      // is an id number
      targetPoke = pokeData.pokemon.filter((poke) => {
        return Number(poke.id) === Number(idOrName);
      });
      if (targetPoke[0]["Previous evolution(s)"]) {
        pokeEvos = targetPoke[0]["Previous evolution(s)"];
      }
    }
    res.send(pokeEvos);
  });

  app.get("/api/types", (req, res) => {
    let limit;
    if (req.query.limit) {
      limit = req.query.limit;
    }

    let returnTypes = null;

    returnTypes = pokeData.types.slice(0, limit);
    res.send(returnTypes);
  });

  app.post("/api/types", (req, res) => {});

  return app;
};

module.exports = { setupServer };
