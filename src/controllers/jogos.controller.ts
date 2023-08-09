import { Request, Response } from "express";
import { Jogo } from "../models/jogo";
import { jogos } from "../database/jogos";
import { io } from "..";

export class JogosController {
  public create(req: Request, res: Response) {
    try {
      const { id_jogador01 } = req.params;

      const novoJogo = new Jogo(id_jogador01);

      jogos.push(novoJogo);

      res.status(200).send({
        ok: true,
        message: "Jogo foi criado com sucesso",
        data: novoJogo.toJson(),
      });
    } catch (err: any) {
      return;
    }
  }
  public list(req: Request, res: Response) {
    try {
      res.status(200).send({ ok: true, data: jogos[jogos.length - 1] });
    } catch (err: any) {
      return;
    }
  }

  public update(req: Request, res: Response) {
    try {
      const { id, id_jogador01, id_jogador02 } = req.params;
      const { index, valor } = req.body;
      const Jogo = jogos.find((jogo) => jogo.id === id);

      if (valor !== "X" && valor !== "" && valor !== "O") {
        return res.status(400).send({ ok: false, message: "valor invalido" });
      }
      if (!id_jogador02) {
        return res
          .status(400)
          .send({ ok: false, message: "Informe o ID do jogador02" });
      }

      if (!Jogo) {
        return res
          .status(404)
          .send({ ok: false, message: "Jogo was not found" });
      }

      if (Jogo.tabuleiro[index] !== "") {
        return res.status(400).send({
          ok: false,
          message: "jogada invalida",
          data: jogos[jogos.length - 1].toJson(),
        });
      }

      Jogo.id_jogador02 = id_jogador02;
      Jogo.tabuleiro.splice(index, 1, valor);

      io.emit("atualizacao", jogos[jogos.length - 1]);

      res.status(200).send({
        ok: true,
        message: "jogada realizada com sucesso",
        data: jogos[jogos.length - 1].toJson(),
      });
    } catch (err: any) {
      return;
    }
  }
}
