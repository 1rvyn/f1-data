const express = require("express");
const app = express();

app.get("/", (req, res) => {
  const { spawn } = require("child_process");
  const pyProg = spawn("plot_gen", ["./python/fastf1/plot_gen.py"]);

  pyProg.stdout.on("data", function (data) {
    console.log(data.toString());
    res.write(data);
    res.end("end");
  });
});

app.listen(8080, () => console.log("Application listening on port 8080!"));
