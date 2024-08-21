// Pega os valores digitados nos Inputs e armazena em variáveis para usar nos cálculos
const inputValor = document.getElementById("valor");
const divResultado = document.getElementById("resultado");
const spanAviso = document.getElementById("aviso");
const selectContrato = document.getElementById("contrato");

// Objetos para armazenar os cálculos finalizados
const resultadoDebito = {};
const resultadoCredito = {};

// Função para pegar o Radio Input selecionado
function obterValorRadio(nome) {
  const radios = document.getElementsByName(nome);
  for (const radio of radios) {
    if (radio.checked) {
      return radio.value;
    }
  }
  return null;
}

// Função para remover a máscara do Input de Valor
function removerMascaraMoeda(valor) {
  valor = parseFloat(valor.replace(",", '').replaceAll(".", ''));
  if (isNaN(valor)) return 0;
  if (valor < 100) valor *= 100;
  return valor / 100;
}

// Função para formatar valores em BRL
const formatadorMoeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

// Função para realizar os cálculos de débito
function calcularDebito(valor, cartao, json, taxaSubordinado) {
  const { markup_master } = json;
  let percSubordinado = taxaSubordinado - (json[cartao].debito + markup_master);
  let liquidoSubordinado = (valor * percSubordinado) / 100;
  let valorMaster = (valor * (100 - percSubordinado)) / 100;
  let liquidoMaster = valorMaster - (json[cartao].debito * valor) / 100;
  let creditoNcc = liquidoMaster - (valor * markup_master) / 100;
  let total = creditoNcc + liquidoSubordinado;
  //let taxa = (total / valor) * 100 - 100;

  resultadoDebito.produto = "Débito";
  resultadoDebito.parcelas = "À Vista";
  resultadoDebito.liquidoSubordinado = formatadorMoeda.format(liquidoSubordinado);
  resultadoDebito.creditoNcc = formatadorMoeda.format(creditoNcc);
  resultadoDebito.total = formatadorMoeda.format(total);
  //resultadoDebito.taxa = taxa.toFixed(2) + "%";
}

// Função para realizar os cálculos de crédito
function calcularCredito(valor, cartao, json, taxaSubordinado) {
  const { markup_master, taxas_rr } = json;
  for (const [indice, valorTaxaCredito] of Object.entries(json[cartao].credito)) {
    let percSubordinado = taxaSubordinado - (valorTaxaCredito + taxas_rr[indice] + markup_master);
    let liquidoSubordinado = (valor * percSubordinado) / 100;
    let valorMaster = (valor * (100 - percSubordinado)) / 100;
    let liquidoMaster = valorMaster - ((valorTaxaCredito * valor) / 100 + (taxas_rr[indice] * liquidoSubordinado) / 100);
    let creditoNcc = liquidoMaster - (valor * markup_master) / 100;
    let total = creditoNcc + liquidoSubordinado;
    //let taxa = (total / valor) * 100 - 100;

    resultadoCredito[indice] = {
      produto: "Crédito",
      parcelas: `${indice.substring(1, 3)}x`,
      liquidoSubordinado: formatadorMoeda.format(liquidoSubordinado),
      creditoNcc: formatadorMoeda.format(creditoNcc),
      total: formatadorMoeda.format(total),
      //taxa: taxa.toFixed(2) + "%"
    };
  }
}

// Função principal de cálculo do parcelamento
function calcular(evento) {
  evento.preventDefault();

  const valor = removerMascaraMoeda(inputValor.value);
  const cartao = obterValorRadio("cartao");
  const contrato = selectContrato.value ? parseFloat(selectContrato.value) : null;

  if (valor !== 0 && cartao !== null) {
    fetch("/js/taxas.json")
      .then(response => response.json())
      .then(json => {
        const taxaSubordinado = contrato !== null ? contrato : json.taxa_subordinado;

        if (json[cartao].debito !== 0) {
          calcularDebito(valor, cartao, json, taxaSubordinado);
        }
        calcularCredito(valor, cartao, json, taxaSubordinado);
        gerarTabela();
      });
  } else {
    spanAviso.innerHTML = `
      <strong>
        <em>
          <p style="color:red">Ops! Verifique se o valor está preenchido e/ou se escolheu a bandeira do cartão</p>
        </em>
      </strong>`;
  }
}

// Função para gerar a tabela com os resultados
function gerarTabela() {
  const cabecalhos = ['Tipo', 'Parcelas', 'Crédito em Conta Corrente', 'Crédito para Compras', 'Total'];
  divResultado.innerHTML = `
    <h2 class="subtitle colored is-4">Valor da Simulação<br/>R$ ${inputValor.value}</h2>
    <p class="description">Veja abaixo a simulação já calculada no débito e no crédito</p>
  `;

  const tabela = document.createElement('table');
  tabela.setAttribute("align", "center");
  tabela.setAttribute("border", "3");
  tabela.setAttribute("cellpadding", "3");

  const linhaCabecalho = document.createElement('tr');
  cabecalhos.forEach(textoCabecalho => {
    const cabecalho = document.createElement('th');
    const noTexto = document.createTextNode(textoCabecalho);
    cabecalho.appendChild(noTexto);
    linhaCabecalho.appendChild(cabecalho);
  });

  tabela.appendChild(linhaCabecalho);

  adicionarLinhaTabela(tabela, resultadoDebito);
  Object.values(resultadoCredito).forEach(credito => adicionarLinhaTabela(tabela, credito));

  divResultado.appendChild(tabela);
  divResultado.innerHTML += `
    <br/>
    <a onclick='window.location.reload()'><strong>Fazer nova Simulação</strong></a>
  `;
}

// Função auxiliar para adicionar uma linha à tabela
function adicionarLinhaTabela(tabela, dados) {
  const linha = document.createElement('tr');
  Object.values(dados).forEach(texto => {
    const celula = document.createElement('td');
    const noTexto = document.createTextNode(texto);
    celula.appendChild(noTexto);
    linha.appendChild(celula);
  });
  tabela.appendChild(linha);
}
