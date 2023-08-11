import cors from "cors";
import express from "express";
import * as dotenv from "dotenv";
import { JogadorController } from "./controllers/jogador.controller";
import { JogosController } from "./controllers/jogos.controller";

dotenv.config();

const app = express();

app.use(express.json());

const http = require("http").Server(app);
export const io = require("socket.io")(http);
app.use(cors());

app.get("/jogo/:id", new JogosController().listById);

// app.post("/jogador", new JogadorController().create);
app.delete("/jogador/:id", new JogadorController().delete);
app.get("/jogador/:id_jogador02/jogo/:id", new JogosController().list);
app.post("/jogador/:id_jogador01/jogo", new JogosController().create);
app.put(
  "/jogador/:id_jogador01/jogo/:id/:id_jogador02",
  new JogosController().update
);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`app is running ${PORT}`);
});
