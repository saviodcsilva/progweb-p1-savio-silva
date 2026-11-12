// s1/Extrato.js - composição: a Conta TEM UM Extrato
/*
 * 1. Por que isso é composição e não agregação?
 * Porque a Conta instancia o seu próprio Extrato internamente (#extrato = new Extrato())
 * e detém exclusividade sobre ele: o Extrato não existe fora da Conta e seu ciclo de
 * vida morre junto com o objeto Conta (relação todo-parte forte).
 *
 * 2. Por que listar() devolve uma cópia ([...this.#lancamentos])?
 * Para preservar o encapsulamento (cópia defensiva): se devolvesse a referência direta
 * do array privado #lancamentos, qualquer código externo poderia alterar a lista com
 * push() ou pop() sem passar pelos métodos de negócio da Conta.
 */
export class Extrato {
  #lancamentos = [];

  registrar(tipo, valor) {
    this.#lancamentos.push({ tipo, valor, data: new Date() });
  }

  listar() {
    return [...this.#lancamentos]; // cópia: ninguém altera o original por fora
  }
}
