import { v4 as createUuid } from "uuid";

export class Jogo {
  private _id: string;
  private _valor: string;
  private _tabuleiro: string[];
  private _id_jogador02: string;

  constructor(private _id_jogador01: string) {
    this._id = createUuid().slice(0, 5);
    this._tabuleiro = ["", "", "", "", "", "", "", "", ""];
  }

  public get id() {
    return this._id;
  }

  public get valor() {
    return this._valor;
  }

  public set valor(novoValor: string) {
    this._valor = novoValor;
  }

  public get tabuleiro() {
    return this._tabuleiro;
  }

  public get id_jogador01() {
    return this._id_jogador01;
  }

  public get id_jogador02() {
    return this._id_jogador02;
  }

  public set id_jogador02(id_jogador02: string) {
    this._id_jogador02 = id_jogador02;
  }

  public toJson() {
    return {
      id: this.id,
      id_jogador01: this.id_jogador01,
      id_jogador02: this.id_jogador02,
      tabuleiro: this.tabuleiro,
    };
  }
}
