const el = {
  form: document.querySelector('#form-pedido'),
  cliente: document.querySelector('#ped-cliente'),
  salvar: document.querySelector('#ped-salvar'),
  cancelar: document.querySelector('#ped-cancelar'),
  carregando: document.querySelector('#pedidos-carregando'),
  erro: document.querySelector('#pedidos-erro'),
  erroMsg: document.querySelector('#pedidos-erro-msg'),
  recarregar: document.querySelector('#pedidos-recarregar'),
  vazio: document.querySelector('#pedidos-vazio'),
  sucesso: document.querySelector('#pedidos-sucesso'),
  linhas: document.querySelector('#pedidos-linhas'),
};

const reais = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const ROTULO_STATUS = {
  aberto: 'Aberto',
  pago: 'Pago',
  cancelado: 'Cancelado',
};

let nomeDoCliente = new Map();

function celula(texto, classe = '') {
  const td = document.createElement('td');
  td.textContent = texto;
  td.className = classe;
  return td;
}

function botao(texto, acao, id, classe) {
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = texto;
  b.className = `btn btn-sm ${classe}`;
  b.dataset.acao = acao;
  b.dataset.id = id;
  return b;
}

function linha(pedido, editandoId) {
  const tr = document.createElement('tr');
  if (pedido.id === editandoId) tr.className = 'editando';

  const nomeCliente = nomeDoCliente.get(pedido.clienteId)
    ?? `cliente #${pedido.clienteId} (removido)`;

  const acoes = celula('', 'text-end text-nowrap');
  acoes.append(
    botao('Editar', 'editar', pedido.id, 'btn-outline-primary me-1'),
    botao('Remover', 'remover', pedido.id, 'btn-outline-danger'),
  );

  tr.append(
    celula(pedido.id),
    celula(nomeCliente),
    celula(ROTULO_STATUS[pedido.status] ?? pedido.status),
    celula(reais.format(pedido.total), 'numero text-end text-nowrap'),
    acoes,
  );
  return tr;
}

export const pedidoView = {
  preencherClientes(clientes) {
    nomeDoCliente = new Map(clientes.map((c) => [c.id, c.nome]));
    const escolhido = el.cliente.value;

    const opcoes = clientes.map((c) => new Option(`${c.nome} (#${c.id})`, c.id));
    el.cliente.replaceChildren(new Option('Selecione…', ''), ...opcoes);

    if (nomeDoCliente.has(Number(escolhido))) el.cliente.value = escolhido;
  },

  render({ status, pedidos, erro, editandoId, salvando }) {
    el.carregando.classList.toggle('d-none', status !== 'carregando');
    el.erro.classList.toggle('d-none', status !== 'erro');
    el.vazio.classList.toggle('d-none', status !== 'vazio');
    el.sucesso.classList.toggle('d-none', status !== 'sucesso');

    el.erroMsg.textContent = erro ?? '';
    el.linhas.replaceChildren(...pedidos.map((p) => linha(p, editandoId)));

    el.salvar.disabled = salvando;
    el.salvar.textContent = salvando
      ? 'Salvando…'
      : editandoId ? 'Salvar alterações' : 'Registrar pedido';
    el.cancelar.classList.toggle('d-none', !editandoId);
  },

  preencherForm(pedido) {
    el.form.clienteId.value = pedido.clienteId;
    el.form.total.value = pedido.total;
    el.form.status.value = pedido.status;
    el.form.total.focus();
  },

  limparForm() {
    el.form.reset();
  },

  aoEnviar(fn) {
    el.form.addEventListener('submit', (evento) => {
      evento.preventDefault();
      fn(Object.fromEntries(new FormData(el.form)));
    });
  },

  aoCancelar(fn) {
    el.cancelar.addEventListener('click', fn);
  },

  aoRecarregar(fn) {
    el.recarregar.addEventListener('click', fn);
  },

  aoClicarNaLista({ editar, remover }) {
    el.linhas.addEventListener('click', (evento) => {
      const alvo = evento.target.closest('button[data-acao]');
      if (!alvo) return;
      const id = Number(alvo.dataset.id);
      if (alvo.dataset.acao === 'editar') editar(id);
      if (alvo.dataset.acao === 'remover') remover(id);
    });
  },
};
