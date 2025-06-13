import eq from "./eq";

// just for testing

const areNamesEqual = eq("Ted", "John");

console.log(areNamesEqual); // false

interface Person {
  name: string;
  likes: string;
}

const personIsJohn = eq((person: Person) => person.name, "John");

console.log(personIsJohn({ name: "John", likes: "bananas" })); // true

const compare = eq(
  async (a: number, b: number) => a,
  (person: Person) => person.name
);

console.log(await compare({ name: "John", likes: "bananas" }));
