let pedidos = [];
let proximoId = 1;

export const pedidoModel = {
  listar() {
    return pedidos;
  },

  listarPorCliente(clienteId) {
    return pedidos.filter((p) => p.clienteId === clienteId);
  },

  buscarPorId(id) {
    return pedidos.find((p) => p.id === id) ?? null;
  },

  inserir({ clienteId, total, status }) {
    const novo = {
      id: proximoId++,
      clienteId: Number(clienteId),
      dataCriacao: new Date().toISOString(),
      status: status ?? 'aberto',
      total: Number(total),
    };
    pedidos.push(novo);
    return novo;
  },

  atualizar(id, dados) {
    const i = pedidos.findIndex((p) => p.id === id);
    if (i === -1) return null;
    pedidos[i] = { ...pedidos[i], ...dados, id };
    return pedidos[i];
  },

  remover(id) {
    const antes = pedidos.length;
    pedidos = pedidos.filter((p) => p.id !== id);
    return pedidos.length < antes;
  },
};
