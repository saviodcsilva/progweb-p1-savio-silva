import { criarStore } from './state/store.js';
import { clienteService } from './services/clienteService.js';
import { clienteView } from './ui/clienteView.js';
import { contaService } from './services/contaService.js';
import { contaView } from './ui/contaView.js';
import { aviso } from './ui/aviso.js';

// ===================== CLIENTES =====================
const clientes = criarStore({
  status: 'carregando',
  clientes: [],
  erro: null,
  editandoId: null,
  salvando: false,
});

clientes.assinar(clienteView.render);

async function carregarClientes() {
  clientes.set({ status: 'carregando', erro: null });
  try {
    const lista = await clienteService.listar();
    clientes.set({ status: lista.length ? 'sucesso' : 'vazio', clientes: lista });
  } catch (e) {
    clientes.set({ status: 'erro', erro: e.message });
  }
}

async function salvarCliente(dados) {
  const { editandoId } = clientes.get();
  aviso.limpar();
  clientes.set({ salvando: true });
  try {
    if (editandoId) await clienteService.atualizar(editandoId, dados);
    else await clienteService.criar(dados);

    aviso.sucesso(editandoId ? 'Cliente atualizado.' : 'Cliente cadastrado.');
    clienteView.limparForm();
    clientes.set({ editandoId: null });
    await carregarClientes();
  } catch (e) {
    aviso.erro(e.message);
  } finally {
    clientes.set({ salvando: false });
  }
}

function editarCliente(id) {
  const cliente = clientes.get().clientes.find((c) => c.id === id);
  clienteView.preencherForm(cliente);
  clientes.set({ editandoId: id });
}

function cancelarEdicaoCliente() {
  clienteView.limparForm();
  clientes.set({ editandoId: null });
}

async function removerCliente(id) {
  if (!confirm(`Remover o cliente #${id}?`)) return;
  aviso.limpar();
  try {
    await clienteService.remover(id);
    aviso.sucesso('Cliente removido.');
    if (clientes.get().editandoId === id) cancelarEdicaoCliente();
    await carregarClientes();
  } catch (e) {
    aviso.erro(e.message);
  }
}

clienteView.aoEnviar(salvarCliente);
clienteView.aoCancelar(cancelarEdicaoCliente);
clienteView.aoRecarregar(carregarClientes);
clienteView.aoClicarNaLista({ editar: editarCliente, remover: removerCliente });

// ===================== CONTAS =====================
const contas = criarStore({
  status: 'carregando',
  contas: [],
  erro: null,
  editandoId: null,
  salvando: false,
});

contas.assinar(contaView.render);

clientes.assinar((estado) => {
  contaView.preencherClientes(estado.clientes);
  contaView.render(contas.get());
});

async function carregarContas() {
  contas.set({ status: 'carregando', erro: null });
  try {
    const lista = await contaService.listar();
    contas.set({ status: lista.length ? 'sucesso' : 'vazio', contas: lista });
  } catch (e) {
    contas.set({ status: 'erro', erro: e.message });
  }
}

async function salvarConta(dados) {
  const { editandoId } = contas.get();
  aviso.limpar();
  contas.set({ salvando: true });
  try {
    if (editandoId) await contaService.atualizar(editandoId, dados);
    else await contaService.criar(dados);

    aviso.sucesso(editandoId ? 'Conta atualizada.' : 'Conta aberta.');
    contaView.limparForm();
    contas.set({ editandoId: null });
    await carregarContas();
  } catch (e) {
    aviso.erro(e.message);
  } finally {
    contas.set({ salvando: false });
  }
}

function editarConta(id) {
  const conta = contas.get().contas.find((c) => c.id === id);
  contaView.preencherForm(conta);
  contas.set({ editandoId: id });
}

function cancelarEdicaoConta() {
  contaView.limparForm();
  contas.set({ editandoId: null });
}

async function removerConta(id) {
  if (!confirm(`Remover a conta #${id}?`)) return;
  aviso.limpar();
  try {
    await contaService.remover(id);
    aviso.sucesso('Conta removida.');
    if (contas.get().editandoId === id) cancelarEdicaoConta();
    await carregarContas();
  } catch (e) {
    aviso.erro(e.message);
  }
}

contaView.aoEnviar(salvarConta);
contaView.aoCancelar(cancelarEdicaoConta);
contaView.aoRecarregar(carregarContas);
contaView.aoClicarNaLista({ editar: editarConta, remover: removerConta });

// ===================== INÍCIO =====================
carregarClientes();
carregarContas();
