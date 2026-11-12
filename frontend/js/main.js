import { criarStore } from './state/store.js';
import { clienteService } from './services/clienteService.js';
import { clienteView } from './ui/clienteView.js';
import { pedidoService } from './services/pedidoService.js';
import { pedidoView } from './ui/pedidoView.js';
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

// ===================== PEDIDOS =====================
const pedidos = criarStore({
  status: 'carregando',
  pedidos: [],
  erro: null,
  editandoId: null,
  salvando: false,
});

pedidos.assinar(pedidoView.render);

clientes.assinar((estado) => {
  pedidoView.preencherClientes(estado.clientes);
  pedidoView.render(pedidos.get());
});

async function carregarPedidos() {
  pedidos.set({ status: 'carregando', erro: null });
  try {
    const lista = await pedidoService.listar();
    pedidos.set({ status: lista.length ? 'sucesso' : 'vazio', pedidos: lista });
  } catch (e) {
    pedidos.set({ status: 'erro', erro: e.message });
  }
}

async function salvarPedido(dados) {
  const { editandoId } = pedidos.get();
  aviso.limpar();
  pedidos.set({ salvando: true });
  try {
    if (editandoId) await pedidoService.atualizar(editandoId, dados);
    else await pedidoService.criar(dados);

    aviso.sucesso(editandoId ? 'Pedido atualizado.' : 'Pedido registrado.');
    pedidoView.limparForm();
    pedidos.set({ editandoId: null });
    await carregarPedidos();
  } catch (e) {
    aviso.erro(e.message);
  } finally {
    pedidos.set({ salvando: false });
  }
}

function editarPedido(id) {
  const pedido = pedidos.get().pedidos.find((p) => p.id === id);
  pedidoView.preencherForm(pedido);
  pedidos.set({ editandoId: id });
}

function cancelarEdicaoPedido() {
  pedidoView.limparForm();
  pedidos.set({ editandoId: null });
}

async function removerPedido(id) {
  if (!confirm(`Remover o pedido #${id}?`)) return;
  aviso.limpar();
  try {
    await pedidoService.remover(id);
    aviso.sucesso('Pedido removido.');
    if (pedidos.get().editandoId === id) cancelarEdicaoPedido();
    await carregarPedidos();
  } catch (e) {
    aviso.erro(e.message);
  }
}

pedidoView.aoEnviar(salvarPedido);
pedidoView.aoCancelar(cancelarEdicaoPedido);
pedidoView.aoRecarregar(carregarPedidos);
pedidoView.aoClicarNaLista({ editar: editarPedido, remover: removerPedido });

// ===================== INÍCIO =====================
carregarClientes();
carregarPedidos();
