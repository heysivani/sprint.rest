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

  app.post("/api/types", (req, res) => {
    pokeData.types.push(req.query.type);
    res.sendStatus(201);
  });

  app.delete("/api/types/:name", (req, res) => {
    const index = pokeData.types.indexOf(req.params.name);
    pokeData.types.splice(index, 1);
    res.sendStatus(200);
  });

  app.get("/api/types/:type/pokemon", (req, res) => {
    const type = req.params.type;
    const result = [];

    for (const poke of pokeData.pokemon) {
      const match = {};
      if (poke.types && poke.types.includes(type)) {
        match.id = poke.id;
        match.name = poke.name;
        result.push(match);
      }
    }

    res.send(result);
  });

  app.get("/api/attacks", (req, res) => {
    const limit = req.query.limit || 123;
    const allAttacks = pokeData.attacks.fast.concat(pokeData.attacks.special);
    const result = allAttacks.slice(0, limit);
    res.send(result);
  });

  app.get("/api/attacks/fast", (req, res) => {
    const limit = req.query.limit || 123;
    const fastAttacks = pokeData.attacks.fast;
    const result = fastAttacks.slice(0, limit);
    res.send(result);
  });

  app.get("/api/attacks/special", (req, res) => {
    const limit = req.query.limit || 123;
    const specialAttacks = pokeData.attacks.special;
    const result = specialAttacks.slice(0, limit);
    res.send(result);
  });

  app.get("/api/attacks/:name", (req, res) => {
    const name = req.params.name;
    const allAttacks = pokeData.attacks.fast.concat(pokeData.attacks.special);

    for (const attack of allAttacks) {
      if (attack.name && String(attack.name) === String(name)) {
        res.send(attack);
      }
    }
  });

  app.get("/api/attacks/:name/pokemon", (req, res) => {
    const name = req.params.name;
    const result = [];

    for (const poke of pokeData.pokemon) {
      if (poke && poke.attacks) {
        for (const attack of poke.attacks.fast) {
          if (attack.name === name) {
            const match = {};
            match.id = poke.id;
            match.name = poke.name;
            result.push(match);
          }
        }
        for (const attack of poke.attacks.special) {
          if (attack.name === name) {
            const match = {};
            match.id = poke.id;
            match.name = poke.name;
            result.push(match);
          }
        }
      }
    }

    res.send(result);
  });

  app.post("/api/attacks/fast", (req, res) => {
    const newAttack = req.query.attack;
    pokeData.attacks.fast.push(newAttack);
    res.sendStatus(201);
  });

  app.post("/api/attacks/special", (req, res) => {
    const newAttack = req.query.attack;
    pokeData.attacks.special.push(newAttack);
    res.sendStatus(201);
  });

  app.patch("/api/attacks/:name", (req, res) => {
    const query = req.query;
    const name = req.params.name;
    let targetIndex;

    if (pokeData.attacks.fast) {
      for (const fastAttack of pokeData.attacks.fast) {
        if (fastAttack.name === name) {
          targetIndex = pokeData.attacks.fast.indexOf(fastAttack);
          for (const change in query) {
            pokeData.attacks.fast[targetIndex][change] = query[change];
          }
        }
      }
    }

    if (pokeData.attacks.special) {
      for (const specialAttack of pokeData.attacks.special) {
        if (specialAttack.name === name) {
          targetIndex = pokeData.attacks.special.indexOf(specialAttack);
          for (const change in query) {
            pokeData.attacks.special[targetIndex][change] = query[change];
          }
        }
      }
    }

    res.sendStatus(200);
  });

  app.delete("/api/attacks/:name", (req, res) => {
    const name = req.params.name;
    let targetIndex;

    if (pokeData.attacks.fast) {
      for (const fastAttack of pokeData.attacks.fast) {
        if (fastAttack.name === name) {
          targetIndex = pokeData.attacks.fast.indexOf(fastAttack);
          pokeData.attacks.fast.splice(targetIndex, 1);
        }
      }
    }

    if (pokeData.attacks.special) {
      for (const specialAttack of pokeData.attacks.special) {
        if (specialAttack.name === name) {
          targetIndex = pokeData.attacks.special.indexOf(specialAttack);
          pokeData.attacks.special.splice(targetIndex, 1);
        }
      }
    }

    res.sendStatus(200);
  });

  return app;
};

module.exports = { setupServer };
