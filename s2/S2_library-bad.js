// ALUNO: Sávio da Costa Silva
// ============================================================
// S2_library-bad.js — Mãos à Obra da Semana 2 (Parte A)
// Este código FUNCIONA (rode: node S2_library-bad.js). E é ruim de propósito.
// Sua tarefa: NÃO refatore. Apenas leia e marque os cheiros.
//   Use // SMELL: <nome>        para cada code smell (nomes do slide 16)
//   Use // VIOLA: <S|O|L|I|D>   para cada princípio SOLID violado (slide 4)
// ============================================================

// VIOLA: S (God Class: gerencia acervo, usuários, empréstimos, envio de e-mail e relatórios)
class Library {
  constructor() {
    this.bks = []; // SMELL: Nome obscuro (deveria ser "livros" ou "books")
    this.us = [];  // SMELL: Nome obscuro (deveria ser "usuarios" ou "users")
    this.lns = []; // SMELL: Nome obscuro (deveria ser "emprestimos" ou "loans")
  }

  // SMELL: Long Function (método gigante que concentra quatro operações distintas)
  // VIOLA: O (para adicionar uma nova ação como "renew", é preciso abrir e alterar este método)
  doStuff(book, userId, action) {
    // SMELL: Switch sobre tipo (cadeia de if/else if decidindo comportamento pelo texto de action)
    if (action === 'add') {
      this.bks.push(book);
      console.log('Added: ' + book.t); // SMELL: Nome obscuro ("t" em vez de "title")
    } else if (action === 'lend') {
      // SMELL: Duplicate Code (laço manual de busca de usuário repetido mais abaixo na ação 'overdue')
      var u = null;
      for (var i = 0; i < this.us.length; i++) {
        if (this.us[i].id === userId) { u = this.us[i]; }
      }
      // SMELL: Duplicate Code (laço manual de busca de livro repetido na ação 'return')
      var b = null;
      for (var j = 0; j < this.bks.length; j++) {
        if (this.bks[j].t === book.t) { b = this.bks[j]; }
      }
      if (u != null && b != null && b.cp > 0) { // SMELL: Nome obscuro ("cp" em vez de "copies")
        b.cp = b.cp - 1;
        // SMELL: Magic Number (st: 1 sem constante semântica)
        // SMELL: Primitive Obsession (status representado por número solto em vez de enum/objeto)
        this.lns.push({ uid: userId, bt: book.t, d: new Date(), st: 1 });
        // SMELL: Comentário-desodorante (explica o que os números mágicos 1, 2 e 3 significam)
        // 1 = active, 2 = returned, 3 = overdue
        // VIOLA: D (acoplamento direto com fetch HTTP concreto; impossível testar sem disparar rede)
        fetch('http://email.api/send', {
          method: 'POST',
          body: JSON.stringify({ to: u.em, msg: 'Você pegou ' + book.t })
        }).then(r => { /* nada */ }).catch(e => {}); // SMELL: Erro engolido (catch vazio oculta falhas)
      }
    } else if (action === 'return') {
      for (var k = 0; k < this.lns.length; k++) {
        if (this.lns[k].uid === userId && this.lns[k].bt === book.t && this.lns[k].st === 1) {
          this.lns[k].st = 2; // SMELL: Magic Number
          for (var m = 0; m < this.bks.length; m++) {
            if (this.bks[m].t === book.t) { this.bks[m].cp = this.bks[m].cp + 1; }
          }
        }
      }
    } else if (action === 'overdue') {
      for (var n = 0; n < this.lns.length; n++) {
        // SMELL: Magic Number (1000 * 60 * 60 * 24 e prazo 7 soltos no cálculo)
        var diff = (new Date() - this.lns[n].d) / (1000 * 60 * 60 * 24);
        if (this.lns[n].st === 1 && diff > 7) {
          this.lns[n].st = 3; // SMELL: Magic Number
          var usr = null;
          for (var p = 0; p < this.us.length; p++) {
            if (this.us[p].id === this.lns[n].uid) { usr = this.us[p]; }
          }
          if (usr) {
            // VIOLA: D (dependência concreta de fetch e sem tratamento de erro)
            fetch('http://email.api/send', {
              method: 'POST',
              body: JSON.stringify({ to: usr.em, msg: 'Atrasado: ' + this.lns[n].bt })
            });
          }
        }
      }
    }
  }

  // SMELL: Long Parameter List (8 parâmetros soltos na assinatura)
  // SMELL: Data Clumps (addr, cty, st, zp andam sempre juntos e deveriam formar um objeto Endereco)
  // SMELL: Primitive Obsession (e-mail, telefone e CEP tratados como strings primitivas sem validação)
  registerUser(n, e, ph, addr, cty, st, zp, isAdm) {
    this.us.push({ id: this.us.length + 1, n: n, em: e, ph: ph, addr: addr, cty: cty, st: st, zp: zp, isAdm: isAdm });
  }

  // SMELL: Switch sobre tipo (if/else if encadeado sobre o código numérico de relatório)
  // VIOLA: O (novo tipo de relatório obriga a modificar este método)
  report(type) {
    if (type === 1) { // SMELL: Magic Number
      console.log('Total de livros: ' + this.bks.length);
    } else if (type === 2) { // SMELL: Magic Number
      console.log('Total de usuários: ' + this.us.length);
    } else if (type === 3) { // SMELL: Magic Number
      console.log('Total de empréstimos: ' + this.lns.length);
    }
  }
}

// Uso:
const lib = new Library();
lib.registerUser('Ana', 'ana@uepb.edu.br', '83999990000', 'Rua X, 10', 'Patos', 'PB', '58700-000', false);
lib.doStuff({ t: 'Clean Code', cp: 3 }, null, 'add');
lib.doStuff({ t: 'Clean Code' }, 1, 'lend');
lib.report(1);
