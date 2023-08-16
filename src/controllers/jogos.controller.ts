import { Request, Response } from "express";
import { Jogo } from "../models/jogo";
import { jogos } from "../database/jogos";
import { io } from "../index";

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

  public listById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const Jogo = jogos.find((jogo) => jogo.id === id);

      if (!Jogo) {
        return res
          .status(404)
          .send({ ok: false, message: "Jogo was not found" });
      }

      res
        .status(200)
        .send({ ok: true, data: jogos.find((jogo) => jogo.id === id) });
    } catch (err: any) {
      return;
    }
  }

  public list(req: Request, res: Response) {
    try {
      const { id, id_jogador02 } = req.params;
      const jogo = jogos.find((jogo) => jogo.id === id);

      if (!id_jogador02) {
        return res
          .status(400)
          .send({ ok: false, message: "Informe o ID do jogador02" });
      }

      if (!jogo) {
        return res
          .status(404)
          .send({ ok: false, message: "Jogo was not found" });
      }

      jogo.id_jogador02 = id_jogador02;

      res.status(200).send({ ok: true, data: jogo.toJson() });
    } catch (err: any) {
      return;
    }
  }

  public update(req: Request, res: Response) {
    try {
      const { id, id_jogador01, id_jogador02 } = req.params;
      const { index, valor } = req.body;
      const Jogo = jogos.find((jogo) => jogo.id === id);

      if (!Jogo) {
        return res
          .status(404)
          .send({ ok: false, message: "Jogo was not found" });
      }

      if (
        Jogo.id_jogador01 !== id_jogador01 &&
        Jogo.id_jogador02 !== id_jogador02
      ) {
        return res.status(404).send({ ok: false, message: "Jogada Invalida" });
      }

      if (Jogo.tabuleiro[index] !== "") {
        return res.status(400).send({
          ok: false,
          message: "jogada invalida",
          data: Jogo.toJson(),
        });
      }

      if (!Jogo.id_jogador02) {
        return res.status(400).send({
          ok: false,
          message: "jogada invalida",
          data: Jogo.toJson(),
        });
      }

      if (id_jogador01.length > 11 && Jogo.valor === "X") {
        return res.status(400).send({
          ok: false,
          message: "jogada invalida",
          data: Jogo.toJson(),
        });
      }

      if (id_jogador02.length > 11 && Jogo.valor === "O") {
        return res.status(400).send({
          ok: false,
          message: "jogada invalida",
          data: Jogo.toJson(),
        });
      }

      let valorVariavel = "";

      if (id_jogador01.length > 11) {
        Jogo.valor = "X";
        valorVariavel = "X";
      }
      if (id_jogador02.length > 11) {
        Jogo.valor = "O";
        valorVariavel = "O";
      }

      Jogo.tabuleiro.splice(index, 1, valorVariavel);

      io.emit("atualizacao", Jogo.toJson());

      res.status(200).send({
        ok: true,
        message: "jogada realizada com sucesso",
        data: Jogo.toJson(),
      });
    } catch (err: any) {
      return;
    }
  }
}
