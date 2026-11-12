import { pedidoModel } from '../models/pedidoModel.js';
import { clienteModel } from '../models/clienteModel.js';
import { erro } from '../utils/erro.js';

const STATUS_VALIDOS = ['aberto', 'pago', 'cancelado'];

export const pedidoService = {
  listar(clienteId) {
    if (clienteId) return pedidoModel.listarPorCliente(Number(clienteId));
    return pedidoModel.listar();
  },

  buscarPorId(id) {
    const pedido = pedidoModel.buscarPorId(id);
    if (!pedido) throw erro(404, 'Pedido não encontrado');
    return pedido;
  },

  criar({ clienteId, total, status } = {}) {
    if (!clienteId || total === undefined) {
      throw erro(400, 'Campos "clienteId" e "total" são obrigatórios');
    }
    if (!(Number(total) > 0)) {
      throw erro(400, 'O valor "total" do pedido deve ser maior que zero');
    }
    if (status && !STATUS_VALIDOS.includes(status)) {
      throw erro(400, `Status inválido. Use: ${STATUS_VALIDOS.join(', ')}`);
    }
    if (!clienteModel.buscarPorId(Number(clienteId))) {
      throw erro(422, 'Cliente informado não existe');
    }
    return pedidoModel.inserir({ clienteId, total, status });
  },

  atualizar(id, dados = {}) {
    if (dados.status && !STATUS_VALIDOS.includes(dados.status)) {
      throw erro(400, `Status inválido. Use: ${STATUS_VALIDOS.join(', ')}`);
    }
    if (dados.total !== undefined && !(Number(dados.total) > 0)) {
      throw erro(400, 'O valor "total" do pedido deve ser maior que zero');
    }
    const atualizado = pedidoModel.atualizar(id, dados);
    if (!atualizado) throw erro(404, 'Pedido não encontrado');
    return atualizado;
  },

  remover(id) {
    const removido = pedidoModel.remover(id);
    if (!removido) throw erro(404, 'Pedido não encontrado');
  },
};
