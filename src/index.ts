import cors from "cors";
import express from "express";
import http from "http"; // Importe o módulo http diretamente
import { Server } from "socket.io"; // Importe o módulo Server do socket.io
import * as dotenv from "dotenv";
import { JogosController } from "./controllers/jogos.controller";

dotenv.config();

const app = express();

const server = http.createServer(app); // Crie o servidor http

app.use(cors());
app.use(express.json());

export const io = new Server(server, {
  cors: {
    origin: "*",
  },
}); // Crie uma instância de Server do socket.io

io.on("connection", (socket) => {
  console.log("A client connected");

  // Gerenciamento de mensagens
  socket.on("chatMessage", (message) => {
    io.emit("chatMessage", message); // Envia a mensagem para todos os clientes
  });
});

// server.listen(process.env.PT_SOCKET || 3001);

app.get("/jogo/:id", new JogosController().listById);

// app.post("/jogador", new JogadorController().create);
// app.delete("/jogador/:id", new JogadorController().delete);
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
