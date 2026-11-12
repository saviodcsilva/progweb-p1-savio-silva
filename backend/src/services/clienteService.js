import { clienteModel } from '../models/clienteModel.js';
import { erro } from '../utils/erro.js';

export const clienteService = {
  listar() {
    return clienteModel.listar();
  },

  buscarPorId(id) {
    const cliente = clienteModel.buscarPorId(id);
    if (!cliente) throw erro(404, 'Cliente não encontrado');
    return cliente;
  },

  criar({ nome, email, telefone } = {}) {
    if (!nome || !email) {
      throw erro(400, 'Campos "nome" e "email" são obrigatórios');
    }
    if (clienteModel.existeEmail(email)) {
      throw erro(409, 'Já existe um cliente cadastrado com este e-mail');
    }
    return clienteModel.inserir({ nome, email, telefone });
  },

  atualizar(id, dados = {}) {
    const atualizado = clienteModel.atualizar(id, dados);
    if (!atualizado) throw erro(404, 'Cliente não encontrado');
    return atualizado;
  },

  remover(id) {
    const removido = clienteModel.remover(id);
    if (!removido) throw erro(404, 'Cliente não encontrado');
  },
};
