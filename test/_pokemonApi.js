const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
const pokeData = require("../src/data");
chai.use(chaiHttp);
const { setupServer } = require("../src/server");
chai.should();

/*
 * This sprint you will have to create all tests yourself, TDD style.
 * For this you will want to get familiar with chai-http https://www.chaijs.com/plugins/chai-http/
 * The same kind of structure that you encountered in lecture.express will be provided here.
 */
const server = setupServer();
describe("Pokemon API Server", () => {
  let request;
  beforeEach(() => {
    request = chai.request(server);
  });
  it("should return an array of 151 pokemon", async () => {
    const result = await request.get("/api/pokemon");
    result.should.be.json;
    expect(result.body.length).to.equal(151);
  });

  it("should return an array of specified length", async () => {
    const result = await request.get("/api/pokemon/").query({ limit: 5 });
    result.should.be.json;
    expect(result.body.length).to.equal(5);
  });

  it("should add a pokemon", async () => {
    const expected = {
      id: "152",
      name: "Michael-mon",
    };

    const response = await request.post("/api/pokemon/").send(expected);
    response.should.have.status(201);
    expect(pokeData.pokemon.length).to.equal(152);
  });

  it("should return a pokemon with a given name", async () => {
    const response = await request.get("/api/pokemon/Bulbasaur");
    expect(response.body.name).to.equal("Bulbasaur");
  });

  it("should return a pokemon with a given ID", async () => {
    const response = await request.get("/api/pokemon/1");
    expect(response.body.id).to.equal("001");
  });

  it("should send a status 200 and modify pokemon if patch is sucessful", async () => {
    const response = await request
      .patch("/api/pokemon/1")
      .query({ name: "Michael" });
    response.should.have.status(200);
    expect(pokeData.pokemon[0].name).to.equal("Michael");
  });
  it("should delete a pokemon and send 200 if successful", async () => {
    const response = await request.delete("/api/pokemon/1");
    response.should.have.status(200);
    expect(pokeData.pokemon[0].name).to.equal("Ivysaur");
  });

  it("should return evolutions if they exist", async () => {
    const response = await request.get("/api/pokemon/2/evolutions");
    const expectedEvos = pokeData.pokemon[0].evolutions;
    expect(response.body).to.deep.equal(expectedEvos);
  });

  it("should return empty array if no evolutions", async () => {
    const response = await request.get("/api/pokemon/122/evolutions");
    const expectedEvos = [];
    expect(response.body).to.deep.equal(expectedEvos);
  });

  it("should return previous evolutions if they exist", async () => {
    const response = await request.get("/api/pokemon/2/evolutions/previous");
    const expectedEvos = pokeData.pokemon[0]["Previous evolution(s)"];
    expect(response.body).to.deep.equal(expectedEvos);
  });

  it("should return empty array if no previous evolutions", async () => {
    const response = await request.get("/api/pokemon/122/evolutions");
    const expectedEvos = [];
    expect(response.body).to.deep.equal(expectedEvos);
  });

  it("should return list of available types based on limit", async () => {
    const response = await request.get("/api/types").query({ limit: 3 });
    const expected = pokeData.types.slice(0, 3);
    expect(response.body).to.deep.equal(expected);
  });

  it("should add a type and send 200 if successful", async () => {
    const expected = "Cool";
    const response = await request.post("/api/types").query({ type: "Cool" });
    const length = pokeData.types.length;
    const actual = pokeData.types[length - 1];
    response.should.have.status(201);
    expect(pokeData.types.length).to.equal(18);
    expect(actual).to.equal(expected);
  });

  it("should delete a type and send 200 if successful", async () => {
    const response = await request.delete("/api/types/Cool");
    response.should.have.status(200);
    expect(pokeData.types.includes("Cool")).to.be.false;
  });

  it("should return all pokemon of given type only", async () => {
    const type = "Normal";
    const response = await request.get("/api/types/Normal/pokemon");
    const expected = [];

    for (const poke of pokeData.pokemon) {
      const match = {};
      if (poke.types && poke.types.includes(type)) {
        match.id = poke.id;
        match.name = poke.name;
        expected.push(match);
      }
    }

    expect(response.body).to.deep.equal(expected);
    expect(response.body.length).to.equal(22);
  });

  it("should return list of attacks based on limit", async () => {
    const response = await request.get("/api/attacks").query({ limit: 3 });
    const allAttacks = pokeData.attacks.fast.concat(pokeData.attacks.special);
    expect(response.body.length).to.equal(3);
    expect(response.body).to.deep.equal(allAttacks.slice(0, 3));
  });

  it("should return list of fast attacks based on limit", async () => {
    const response = await request.get("/api/attacks/fast").query({ limit: 3 });
    const fastAttacks = pokeData.attacks.fast;
    expect(response.body.length).to.equal(3);
    expect(response.body).to.deep.equal(fastAttacks.slice(0, 3));
  });

  it("should return list of special attacks based on limit", async () => {
    const response = await request
      .get("/api/attacks/special")
      .query({ limit: 3 });
    const specialAttacks = pokeData.attacks.special;
    expect(response.body.length).to.equal(3);
    expect(response.body).to.deep.equal(specialAttacks.slice(0, 3));
  });

  it("should return a specific attack by name", async () => {
    const response = await request.get("/api/attacks/Acid");
    const allAttacks = pokeData.attacks.fast.concat(pokeData.attacks.special);
    expect(response.body).to.deep.equal(allAttacks[16]);
  });

  it("should return all pokemon with an attack", async () => {
    const response = await request.get("/api/attacks/Lick/pokemon");
    const expected = [
      { id: "092", name: "Gastly" },
      { id: "093", name: "Haunter" },
      { id: "108", name: "Lickitung" },
      { id: "143", name: "Snorlax" },
    ];

    expect(response.body.length).to.equal(4);
    expect(response.body).to.deep.equal(expected);
  });

  it("should add a fast attack", async () => {
    const attack = {
      name: "Shiv",
      type: "Ouch",
      damage: 777,
    };
    const response = await request.post("/api/attacks/fast").query({ attack });
    response.should.have.status(201);
    expect(pokeData.attacks.fast[40].name).to.deep.equal(attack.name);
  });

  it("should add a special attack", async () => {
    const attack = {
      name: "SpecialShiv",
      type: "Ouchie",
      damage: 777,
    };
    const response = await request
      .post("/api/attacks/special")
      .query({ attack });
    response.should.have.status(201);
    expect(pokeData.attacks.special[83].name).to.deep.equal(attack.name);
  });
});
