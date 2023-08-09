import { Request, Response } from "express";
import { Jogador } from "../models/jogador";
import { jogadores } from "../database/jogadores";

export class JogadorController {
  public create(req: Request, res: Response) {
    try {
      const { nome } = req.body;
      const jogador = new Jogador(nome);

      jogadores.push(jogador);

      res
        .status(200)
        .send({ ok: true, message: "jogador criado", data: jogador });
    } catch (err: any) {
      return;
    }
  }

  public delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const jogadorIndex = jogadores.findIndex(
        (jogador) => jogador.id_jogador === id
      );

      const jogadorDeletado = jogadores.splice(jogadorIndex, 1);

      res.status(200).send({
        ok: true,
        message: "jogador deletado",
        data: jogadorDeletado[0],
      });
    } catch (err: any) {
      return;
    }
  }
}
