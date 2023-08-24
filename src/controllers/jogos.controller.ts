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
      const { index } = req.body;
      const Jogo = jogos.find((jogo) => jogo.id === id);

      if (!Jogo) {
        return res
          .status(404)
          .send({ ok: false, message: "Jogo was not found" });
      }

      if (Jogo.vitoria.length > 0) {
        return res.status(403).send({
          ok: false,
          message: "Já temos um vencedor",
          data: Jogo.toJson(),
        });
      }

      if (
        Jogo.id_jogador01 !== id_jogador01 &&
        Jogo.id_jogador02 !== id_jogador02
      ) {
        return res.status(404).send({
          ok: false,
          message: "Jogada Invalida, jogadores não reconhecidos",
        });
      }

      if (Jogo.tabuleiro[index] !== "") {
        return res.status(400).send({
          ok: false,
          message:
            "jogada invalida, não pode mudar valores de casas preenchidas",
          data: Jogo.toJson(),
        });
      }

      if (!Jogo.id_jogador02) {
        return res.status(400).send({
          ok: false,
          message: "jogada invalida, o jogador02 não conectou ainda",
          data: Jogo.toJson(),
        });
      }

      if (id_jogador01.length > 11 && Jogo.valor === "X") {
        return res.status(400).send({
          ok: false,
          message: "jogada invalida, aguarde a jogada do outro jogador",
          data: Jogo.toJson(),
        });
      }

      if (id_jogador02.length > 11 && Jogo.valor === "O") {
        return res.status(400).send({
          ok: false,
          message: "jogada invalida, aguarde a jogada do outro jogador",
          data: Jogo.toJson(),
        });
      }

      if (id_jogador01.length > 11) {
        Jogo.valor = "X";
      }
      if (id_jogador02.length > 11) {
        Jogo.valor = "O";
      }

      Jogo.tabuleiro.splice(index, 1, Jogo.valor);

      if (
        Jogo.tabuleiro[0] === Jogo.tabuleiro[1] &&
        Jogo.tabuleiro[1] === Jogo.tabuleiro[2] &&
        Jogo.tabuleiro[2] !== ""
      ) {
        Jogo.vitoria.push(0, 1, 2);
      }

      if (
        Jogo.tabuleiro[3] === Jogo.tabuleiro[4] &&
        Jogo.tabuleiro[4] === Jogo.tabuleiro[5] &&
        Jogo.tabuleiro[5] !== ""
      ) {
        Jogo.vitoria.push(3, 4, 5);
      }
      if (
        Jogo.tabuleiro[6] === Jogo.tabuleiro[7] &&
        Jogo.tabuleiro[7] === Jogo.tabuleiro[8] &&
        Jogo.tabuleiro[8] !== ""
      ) {
        Jogo.vitoria.push(6, 7, 8);
      }

      if (
        Jogo.tabuleiro[0] === Jogo.tabuleiro[3] &&
        Jogo.tabuleiro[3] === Jogo.tabuleiro[6] &&
        Jogo.tabuleiro[6] !== ""
      ) {
        Jogo.vitoria.push(0, 3, 6);
      }

      if (
        Jogo.tabuleiro[1] === Jogo.tabuleiro[4] &&
        Jogo.tabuleiro[4] === Jogo.tabuleiro[7] &&
        Jogo.tabuleiro[7] !== ""
      ) {
        Jogo.vitoria.push(1, 4, 7);
      }

      if (
        Jogo.tabuleiro[2] === Jogo.tabuleiro[5] &&
        Jogo.tabuleiro[5] === Jogo.tabuleiro[8] &&
        Jogo.tabuleiro[8] !== ""
      ) {
        Jogo.vitoria.push(2, 5, 8);
      }

      if (
        Jogo.tabuleiro[0] === Jogo.tabuleiro[4] &&
        Jogo.tabuleiro[4] === Jogo.tabuleiro[8] &&
        Jogo.tabuleiro[8] !== ""
      ) {
        Jogo.vitoria.push(0, 4, 8);
      }

      if (
        Jogo.tabuleiro[2] === Jogo.tabuleiro[4] &&
        Jogo.tabuleiro[4] === Jogo.tabuleiro[6] &&
        Jogo.tabuleiro[6] !== ""
      ) {
        Jogo.vitoria.push(2, 4, 6);
      }

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

  public async reiniciarJogo(req: Request, res: Response) {
    try {
      const { id, id_jogador01, id_jogador02 } = req.params;

      const jogo = jogos.find((jogo) => jogo.id === id);

      if (!jogo) {
        return res
          .status(404)
          .send({ ok: false, message: "Jogo was not found" });
      }

      jogo.tabuleiro.splice(0, 9, "", "", "", "", "", "", "", "", "");
      jogo.vitoria.splice(0);

      io.emit("atualizacao", jogo.toJson());

      res.status(200).send({
        ok: true,
        message: "jogo reiniciado com sucesso",
        data: jogo.toJson(),
      });
    } catch (err: any) {
      return;
    }
  }
}
