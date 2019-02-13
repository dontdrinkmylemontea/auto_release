var http = require("http");

http.get("http://localhost:8080", response => {
  response.on("data", data => {
    const buffer = Buffer.from(data);
    console.log(buffer.toString());
  });
  console.log(response.headers);
});
