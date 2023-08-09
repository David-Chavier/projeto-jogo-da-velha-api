import { v4 as createUuid } from "uuid";

export class Jogador {
  private _id_jogador: string;

  constructor(private nome: string) {
    this._id_jogador = createUuid();
  }

  public get id_jogador() {
    return this._id_jogador;
  }
}
