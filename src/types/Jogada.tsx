import { Lance } from "./Lance";
import { Peca } from "./Peca";

export type Jogada = {
    peca: Peca,
    lances: Lance[]
};