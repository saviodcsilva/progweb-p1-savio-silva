const el = {
  form: document.querySelector('#form-cliente'),
  salvar: document.querySelector('#cli-salvar'),
  cancelar: document.querySelector('#cli-cancelar'),
  carregando: document.querySelector('#clientes-carregando'),
  erro: document.querySelector('#clientes-erro'),
  erroMsg: document.querySelector('#clientes-erro-msg'),
  recarregar: document.querySelector('#clientes-recarregar'),
  vazio: document.querySelector('#clientes-vazio'),
  sucesso: document.querySelector('#clientes-sucesso'),
  linhas: document.querySelector('#clientes-linhas'),
};

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

function linha(cliente, editandoId) {
  const tr = document.createElement('tr');
  if (cliente.id === editandoId) tr.className = 'editando';

  const acoes = celula('', 'text-end text-nowrap');
  acoes.append(
    botao('Editar', 'editar', cliente.id, 'btn-outline-primary me-1'),
    botao('Remover', 'remover', cliente.id, 'btn-outline-danger'),
  );

  tr.append(
    celula(cliente.id),
    celula(cliente.nome),
    celula(cliente.email),
    celula(cliente.telefone ?? '—', 'numero text-nowrap'),
    acoes,
  );
  return tr;
}

export const clienteView = {
  render({ status, clientes, erro, editandoId, salvando }) {
    el.carregando.classList.toggle('d-none', status !== 'carregando');
    el.erro.classList.toggle('d-none', status !== 'erro');
    el.vazio.classList.toggle('d-none', status !== 'vazio');
    el.sucesso.classList.toggle('d-none', status !== 'sucesso');

    el.erroMsg.textContent = erro ?? '';
    el.linhas.replaceChildren(...clientes.map((c) => linha(c, editandoId)));

    el.salvar.disabled = salvando;
    el.salvar.textContent = salvando
      ? 'Salvando…'
      : editandoId ? 'Salvar alterações' : 'Cadastrar cliente';
    el.cancelar.classList.toggle('d-none', !editandoId);
  },

  preencherForm(cliente) {
    el.form.nome.value = cliente.nome;
    el.form.email.value = cliente.email;
    el.form.telefone.value = cliente.telefone ?? '';
    el.form.nome.focus();
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
