import { getApiUrl } from "../src/index.js";

const data = await getApiUrl(
    "https://jsonplaceholder.typicode.com",
    "/posts/1"
);

console.log(data);