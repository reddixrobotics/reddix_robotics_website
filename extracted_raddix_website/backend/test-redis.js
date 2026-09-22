const { createClient } = require("redis");
const client = createClient({ url: "redis://localhost:6379" });
client.on("error", (err) => console.log("Redis Client Error", err));
client.connect().then(() => {
  console.log("Redis Connected!");
  client.disconnect();
}).catch(e => console.error(e));
