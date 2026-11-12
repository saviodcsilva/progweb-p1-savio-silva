import { api } from '../api.js';

const STATUS_VALIDOS = ['aberto', 'pago', 'cancelado'];

function preparar({ clienteId, total, status }) {
  if (!clienteId) throw new Error('Selecione o cliente do pedido.');
  if (total === '' || Number.isNaN(Number(total))) {
    throw new Error('Informe o valor total em números.');
  }
  if (!STATUS_VALIDOS.includes(status)) {
    throw new Error('Status inválido.');
  }
  // Deixa valores negativos passarem para o backend validar a regra de negócio (400)
  return {
    clienteId: Number(clienteId),
    total: Number(total),
    status,
  };
}

export const pedidoService = {
  listar() {
    return api.get('/pedidos');
  },

  async criar(dados) {
    return api.post('/pedidos', preparar(dados));
  },

  async atualizar(id, dados) {
    return api.put(`/pedidos/${id}`, preparar(dados));
  },

  remover(id) {
    return api.delete(`/pedidos/${id}`);
  },
};
