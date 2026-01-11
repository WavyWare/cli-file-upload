import express from "express";
import logger from "./middleware/logger";

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(logger)
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/ping', (_req, res) => {
    res.status(200).send({msg: 'pong'});
})

app.listen(port, () => {
    console.log("Listening on port " + port);
})