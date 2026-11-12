import { api } from '../api.js';

function preparar({ nome, cpf, email }) {
  const dados = {
    nome: (nome ?? '').trim(),
    cpf: (cpf ?? '').replace(/\D/g, ''),
    email: (email ?? '').trim() || null,
  };
  if (!dados.nome) throw new Error('Informe o nome.');
  if (dados.cpf.length !== 11) throw new Error('O CPF precisa ter 11 dígitos.');
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
