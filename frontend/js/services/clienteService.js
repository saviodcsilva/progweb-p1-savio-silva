import { api } from '../api.js';

function preparar({ nome, email, telefone }) {
  const dados = {
    nome: (nome ?? '').trim(),
    email: (email ?? '').trim(),
    telefone: (telefone ?? '').trim() || null,
  };
  if (!dados.nome) throw new Error('Informe o nome do cliente.');
  if (!dados.email) throw new Error('Informe o e-mail do cliente.');
  return dados;
}

export const clienteService = {
  listar() {
    return api.get('/clientes');
  },

  async criar(dados) {
    return api.post('/clientes', preparar(dados));
  },

  async atualizar(id, dados) {
    return api.put(`/clientes/${id}`, preparar(dados));
  },

  remover(id) {
    return api.delete(`/clientes/${id}`);
  },
};
