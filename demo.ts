import eq from "./eq";

// just for testing

const areNamesEqual = eq("Ted", "George");

console.log(areNamesEqual); // false

interface Person {
  name: string;
  likes: string;
}

const personIsGeorge = eq((person: Person) => person.name, "George");

console.log(personIsGeorge({ name: "George", likes: "bananas" })); // true

const compare = eq(
  async (a: number, b: number) => a,
  (person: Person) => person.name
);

console.log(await compare({ name: "George", likes: "bananas" }));
