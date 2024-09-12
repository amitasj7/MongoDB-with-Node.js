const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");

// fake data generate krne ke liey chance
const Chance = require("chance");
const chance = new Chance();

const Chat = require("./models/chat");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/whattsapp");
}

main()
  .then(() => {
    console.log("Database Connection Successful");
  })
  .catch((e) => {
    console.log("Database Connection Failed : ", e);
  });

// insert data into database
function createRandomUser() {
  return {
    from: faker.internet.userName(),
    to: faker.internet.userName(),
    message: chance.sentence(),
    created_at: new Date(),
  };
}

let data = [];
for (let i = 1; i <= 100; i++) {
  data.push(createRandomUser());
}

console.log(data);

Chat.insertMany(data)
  .then(() => {
    console.log("Data inserted Succesfully");
  })
  .catch((e) => {
    console.log("Data insertion failed : ", e);
  });
