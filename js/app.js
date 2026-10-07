const listaContas = document.getElementById('lista-contas');
const botaoAdicionar = document.getElementById('adicionar-conta');

const totalElemento = document.getElementById('total');
const subtotalElemento = document.getElementById('subtotal');

const mesAtualElemento = document.getElementById('mes-atual');
const botaoMesAnterior = document.getElementById('mes-anterior');
const botaoProximoMes = document.getElementById('proximo-mes');


// ==============================
// MODAL DE CONTA
// ==============================

const modalConta = document.getElementById('modal-conta');
const formConta = document.getElementById('form-conta');

const fecharModalConta =
    document.getElementById('fechar-modal-conta');

const cancelarModalConta =
    document.getElementById('cancelar-modal-conta');

const campoDia =
    document.getElementById('conta-dia');

const campoNome =
    document.getElementById('conta-nome');

const campoValor =
    document.getElementById('conta-valor');


// ==============================
// MODAL DE POUPANÇA
// ==============================

const modalPoupanca =
    document.getElementById('modal-poupanca');

const formPoupanca =
    document.getElementById('form-poupanca');

const fecharModalPoupanca =
    document.getElementById('fechar-modal-poupanca');

const cancelarModalPoupanca =
    document.getElementById('cancelar-modal-poupanca');

const campoPoupancaValor =
    document.getElementById('poupanca-valor');


// ==============================
// POUPANÇA
// ==============================

const poupancaElemento =
    document.getElementById('poupanca');

const botaoPoupanca =
    document.getElementById('adicionar-poupanca');


// ==============================
// LOCAL STORAGE
// ==============================

const CHAVE_CONTAS = 'financas_contas';
const CHAVE_PAGAMENTOS = 'financas_pagamentos';
const CHAVE_POUPANCA = 'financas_poupanca';
const CHAVE_EXCLUSOES = 'financas_exclusoes';


// ==============================
// MÊS INICIAL
// ==============================

let mesAtual = new Date(2026, 9, 1);


// ==============================
// DADOS
// ==============================

// Contas

let contas = JSON.parse(
    localStorage.getItem(CHAVE_CONTAS)
) || [];


// Pagamentos separados por mês

let pagamentos = JSON.parse(
    localStorage.getItem(CHAVE_PAGAMENTOS)
) || {};


// Poupança acumulada

let poupanca = Number(
    localStorage.getItem(CHAVE_POUPANCA)
) || 0;


// Exclusões específicas por mês

let exclusoes = JSON.parse(
    localStorage.getItem(CHAVE_EXCLUSOES)
) || {};


// ==============================
// SALVAR DADOS
// ==============================

function salvarContas() {

    localStorage.setItem(
        CHAVE_CONTAS,
        JSON.stringify(contas)
    );
}


function salvarPagamentos() {

    localStorage.setItem(
        CHAVE_PAGAMENTOS,
        JSON.stringify(pagamentos)
    );
}


function salvarPoupanca() {

    localStorage.setItem(
        CHAVE_POUPANCA,
        poupanca
    );
}


function salvarExclusoes() {

    localStorage.setItem(
        CHAVE_EXCLUSOES,
        JSON.stringify(exclusoes)
    );
}


// ==============================
// MESES
// ==============================

const nomesMeses = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
];


// ==============================
// FORMATAÇÃO
// ==============================

function formatarMoeda(valor) {

    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}


// ==============================
// IDENTIFICAR O MÊS ATUAL
// ==============================

function obterChaveMes() {

    const ano =
        mesAtual.getFullYear();

    const mes = String(
        mesAtual.getMonth() + 1
    ).padStart(2, '0');

    return `${ano}-${mes}`;
}


// ==============================
// VERIFICAR SE A CONTA PERTENCE AO MÊS
// ==============================

function contaPertenceAoMes(conta) {

    /*
     * Contas antigas não possuem a propriedade "mes".
     *
     * Como o projeto começou em Outubro/2026,
     * consideramos essas contas como sendo de Outubro/2026.
     */

    if (!conta.mes) {

        return obterChaveMes() === '2026-10';
    }


    return conta.mes === obterChaveMes();
}


// ==============================
// VERIFICAR SE A CONTA FOI PAGA
// ==============================

function contaFoiPaga(conta) {

    const chaveMes =
        obterChaveMes();

    return pagamentos[chaveMes]?.includes(
        conta.id
    ) ?? false;
}


// ==============================
// VERIFICAR SE A CONTA FOI EXCLUÍDA
// ==============================

function contaFoiExcluida(conta) {

    const chaveMes =
        obterChaveMes();

    return exclusoes[chaveMes]?.includes(
        conta.id
    ) ?? false;
}


// ==============================
// EXCLUIR CONTA DO MÊS
// ==============================

function excluirContaDoMes(contaId) {

    const chaveMes =
        obterChaveMes();


    if (!exclusoes[chaveMes]) {

        exclusoes[chaveMes] = [];
    }


    if (!exclusoes[chaveMes].includes(contaId)) {

        exclusoes[chaveMes].push(contaId);
    }


    // Remove o pagamento daquele mês

    if (pagamentos[chaveMes]) {

        pagamentos[chaveMes] =
            pagamentos[chaveMes].filter(
                id => id !== contaId
            );
    }


    salvarExclusoes();
    salvarPagamentos();

    renderizarContas();
}


// ==============================
// PAGAR CONTA
// ==============================

function pagarConta(contaId) {

    const chaveMes =
        obterChaveMes();


    if (!pagamentos[chaveMes]) {

        pagamentos[chaveMes] = [];
    }


    if (!pagamentos[chaveMes].includes(contaId)) {

        pagamentos[chaveMes].push(contaId);
    }


    salvarPagamentos();

    renderizarContas();
}


// ==============================
// ABRIR MODAL DE CONTA
// ==============================

function abrirModalConta() {

    modalConta.classList.add('ativo');

    modalConta.setAttribute(
        'aria-hidden',
        'false'
    );


    formConta.reset();


    setTimeout(() => {

        campoDia.focus();

    }, 100);
}


// ==============================
// FECHAR MODAL DE CONTA
// ==============================

function fecharModalContaFunc() {

    modalConta.classList.remove('ativo');

    modalConta.setAttribute(
        'aria-hidden',
        'true'
    );


    formConta.reset();
}


// ==============================
// BOTÃO ADICIONAR CONTA
// ==============================

botaoAdicionar.addEventListener(
    'click',
    abrirModalConta
);


// ==============================
// FECHAR MODAL DE CONTA
// ==============================

fecharModalConta.addEventListener(
    'click',
    fecharModalContaFunc
);


cancelarModalConta.addEventListener(
    'click',
    fecharModalContaFunc
);


// ==============================
// FECHAR CONTA CLICANDO FORA
// ==============================

modalConta.addEventListener(
    'click',
    event => {

        if (event.target === modalConta) {

            fecharModalContaFunc();
        }
    }
);


// ==============================
// ADICIONAR CONTA PELO FORMULÁRIO
// ==============================

formConta.addEventListener(
    'submit',
    event => {

        event.preventDefault();


        const dia =
            Number(campoDia.value);


        const nome =
            campoNome.value.trim();


        const valor =
            campoValor.value.trim();


        // ==============================
        // VALIDAÇÃO DO DIA
        // ==============================

        if (
            !Number.isInteger(dia) ||
            dia < 1 ||
            dia > 31
        ) {

            alert(
                'Digite um dia válido entre 1 e 31.'
            );

            campoDia.focus();

            return;
        }


        // ==============================
        // VALIDAÇÃO DO NOME
        // ==============================

        if (!nome) {

            alert(
                'Digite o nome da conta.'
            );

            campoNome.focus();

            return;
        }


        // ==============================
        // CONVERTER VALOR
        // ==============================

        const valorNumerico =
            Number(
                valor
                    .replace(/\./g, '')
                    .replace(',', '.')
            );


        // ==============================
        // VALIDAÇÃO DO VALOR
        // ==============================

        if (
            isNaN(valorNumerico) ||
            valorNumerico <= 0
        ) {

            alert(
                'Digite um valor válido.'
            );

            campoValor.focus();

            return;
        }


        // ==============================
        // CRIAR CONTA
        // ==============================

        const novaConta = {

            id: Date.now(),

            dia: dia,

            nome: nome,

            valor: valorNumerico,

            // A conta pertence somente
            // ao mês em que foi criada.

            mes: obterChaveMes()
        };


        contas.push(novaConta);


        salvarContas();


        renderizarContas();


        fecharModalContaFunc();
    }
);


// ==============================
// ABRIR MODAL DE POUPANÇA
// ==============================

function abrirModalPoupanca() {

    modalPoupanca.classList.add('ativo');

    modalPoupanca.setAttribute(
        'aria-hidden',
        'false'
    );


    formPoupanca.reset();


    setTimeout(() => {

        campoPoupancaValor.focus();

    }, 100);
}


// ==============================
// FECHAR MODAL DE POUPANÇA
// ==============================

function fecharModalPoupancaFunc() {

    modalPoupanca.classList.remove('ativo');

    modalPoupanca.setAttribute(
        'aria-hidden',
        'true'
    );


    formPoupanca.reset();
}


// ==============================
// BOTÃO DA POUPANÇA
// ==============================

if (botaoPoupanca) {

    botaoPoupanca.addEventListener(
        'click',
        abrirModalPoupanca
    );
}


// ==============================
// FECHAR MODAL DE POUPANÇA
// ==============================

fecharModalPoupanca.addEventListener(
    'click',
    fecharModalPoupancaFunc
);


cancelarModalPoupanca.addEventListener(
    'click',
    fecharModalPoupancaFunc
);


// ==============================
// FECHAR POUPANÇA CLICANDO FORA
// ==============================

modalPoupanca.addEventListener(
    'click',
    event => {

        if (event.target === modalPoupanca) {

            fecharModalPoupancaFunc();
        }
    }
);


// ==============================
// ADICIONAR VALOR À POUPANÇA
// ==============================

formPoupanca.addEventListener(
    'submit',
    event => {

        event.preventDefault();


        const valor =
            campoPoupancaValor.value.trim();


        const valorNumerico =
            Number(
                valor
                    .replace(/\./g, '')
                    .replace(',', '.')
            );


        if (
            isNaN(valorNumerico) ||
            valorNumerico <= 0
        ) {

            alert(
                'Digite um valor válido.'
            );

            campoPoupancaValor.focus();

            return;
        }


        poupanca += valorNumerico;


        salvarPoupanca();

        atualizarPoupanca();


        fecharModalPoupancaFunc();
    }
);


// ==============================
// ATUALIZAR POUPANÇA
// ==============================

function atualizarPoupanca() {

    poupancaElemento.textContent =
        formatarMoeda(poupanca);
}


// ==============================
// ATUALIZAR MÊS NA TELA
// ==============================

function atualizarMes() {

    const mes =
        nomesMeses[mesAtual.getMonth()];

    const ano =
        mesAtual.getFullYear();


    mesAtualElemento.textContent =
        `${mes} ${ano}`;


    renderizarContas();
}


// ==============================
// RENDERIZAR CONTAS
// ==============================

function renderizarContas() {

    listaContas.innerHTML = '';


    contas
        .sort((a, b) => a.dia - b.dia)
        .forEach(conta => {

            // ==============================
            // VERIFICAR SE PERTENCE AO MÊS
            // ==============================

            if (!contaPertenceAoMes(conta)) {

                return;
            }


            // ==============================
            // VERIFICAR EXCLUSÃO
            // ==============================

            if (contaFoiExcluida(conta)) {

                return;
            }


            const linha =
                document.createElement('tr');


            const pago =
                contaFoiPaga(conta);


            linha.innerHTML = `
                <td>
                    ${conta.dia}
                </td>

                <td>
                    ${conta.nome}
                </td>

                <td>
                    ${formatarMoeda(conta.valor)}
                </td>

                <td>
                    ${
                        pago
                            ? `
                                <span class="status-pago">
                                    Pago
                                </span>
                            `
                            : `
                                <button
                                    class="botao-pagar"
                                    data-conta-id="${conta.id}"
                                >
                                    Pagar
                                </button>
                            `
                    }
                </td>

                <td>
                    <button
                        class="botao-excluir"
                        data-conta-id="${conta.id}"
                    >
                        Excluir
                    </button>
                </td>
            `;


            listaContas.appendChild(linha);
        });


    // ==============================
    // BOTÕES PAGAR
    // ==============================

    document
        .querySelectorAll('.botao-pagar')
        .forEach(botao => {

            botao.addEventListener(
                'click',
                () => {

                    const contaId =
                        Number(
                            botao.dataset.contaId
                        );

                    pagarConta(contaId);
                }
            );
        });


    // ==============================
    // BOTÕES EXCLUIR
    // ==============================

    document
        .querySelectorAll('.botao-excluir')
        .forEach(botao => {

            botao.addEventListener(
                'click',
                () => {

                    const contaId =
                        Number(
                            botao.dataset.contaId
                        );


                    const conta =
                        contas.find(
                            conta =>
                                conta.id === contaId
                        );


                    if (!conta) {

                        return;
                    }


                    const confirmar =
                        confirm(
                            `Excluir "${conta.nome}" apenas de ${nomesMeses[mesAtual.getMonth()]} ${mesAtual.getFullYear()}?`
                        );


                    if (!confirmar) {

                        return;
                    }


                    excluirContaDoMes(contaId);
                }
            );
        });


    atualizarResumo();
}


// ==============================
// RESUMO
// ==============================

function atualizarResumo() {

    const contasDoMes =
        contas.filter(
            conta =>
                contaPertenceAoMes(conta) &&
                !contaFoiExcluida(conta)
        );


    const total =
        contasDoMes.reduce(
            (soma, conta) =>
                soma + conta.valor,
            0
        );


    const subtotal =
        contasDoMes
            .filter(
                conta => contaFoiPaga(conta)
            )
            .reduce(
                (soma, conta) =>
                    soma + conta.valor,
                0
            );


    totalElemento.textContent =
        formatarMoeda(total);


    subtotalElemento.textContent =
        formatarMoeda(subtotal);


    atualizarPoupanca();
}


// ==============================
// MÊS ANTERIOR
// ==============================

botaoMesAnterior.addEventListener(
    'click',
    () => {

        mesAtual.setMonth(
            mesAtual.getMonth() - 1
        );


        atualizarMes();
    }
);


// ==============================
// PRÓXIMO MÊS
// ==============================

botaoProximoMes.addEventListener(
    'click',
    () => {

        mesAtual.setMonth(
            mesAtual.getMonth() + 1
        );


        atualizarMes();
    }
);


// ==============================
// FECHAR MODAIS COM ESC
// ==============================

document.addEventListener(
    'keydown',
    event => {

        if (event.key !== 'Escape') {

            return;
        }


        if (
            modalConta.classList.contains('ativo')
        ) {

            fecharModalContaFunc();

            return;
        }


        if (
            modalPoupanca.classList.contains('ativo')
        ) {

            fecharModalPoupancaFunc();
        }
    }
);


// ==============================
// INICIALIZAÇÃO
// ==============================

atualizarMes();

atualizarPoupanca();
