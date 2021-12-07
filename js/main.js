///////////////////////////////////////
/* Pegar os valores digitados nos Inputs e 
armazena em variáveis para usar nos Cálculos */
const valor_input = document.getElementById("valor");
const div_result = document.getElementById("result");
const span_aviso = document.getElementById("aviso");

// Objeto com os cálculos finalizados
///////////////////////////////////////
var final_debito = {};
var final_credito = {};

///////////////////////////////////////
/* Função para pegar o Radio Input selecionado.
Verifica o que está ON e ai mostra o VALUE */
function getRadioValor(name) {
  var radios = document.getElementsByName(name);
  for (var i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      return radios[i].value;
    }
  }
  return null;
}

///////////////////////////////////////
/* Função para remover a mascara do Input de Valor */
function removeMaskMoney(x){
  x = parseFloat(x.replace(",", '').replaceAll(".", ''));
  if(isNaN(x)) return 0;
  if(x < 100) x*=100;
  return x/100;
}

///////////////////////////////////////
// Função do Cálculo do Parcelamento
function calcular(e) {
  e.preventDefault();

  var valor = removeMaskMoney(valor_input.value);
  var cartao = getRadioValor("cartao");

  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL' 
  });

  console.log(cartao);
  console.log(valor);

  if (valor !== 0 && cartao !== null) {
    fetch("js/taxas.json")
      .then((resolve) => resolve.json())
      .then((json) => {
        switch (cartao) {
          case "visa":
            if (json.visa.debito !== 0) {
              let percSubord = json.taxa_subordinado - (json.visa.debito + json.markup_master);
              let liqSubord = (valor * percSubord) / 100;
              let valorMaster = (valor * (100 - percSubord)) / 100;
              let liqMaster = valorMaster - (json.visa.debito * valor) / 100;
              let creditoNcc = liqMaster - (valor * json.markup_master) / 100;
              let total = creditoNcc + liqSubord;
              let taxa = (total / valor) * 100 - 100;

              // Montando o JSON Temporário do Cálculo
              final_debito.produto = "Débito";
              final_debito.parcelas = "À Vista";
              final_debito.liqsubord = formatter.format(liqSubord);
              final_debito.creditoncc = formatter.format(creditoNcc);
              final_debito.total = formatter.format(total);
              final_debito.taxa = taxa.toFixed(2) + "%";
            }
            Object.entries(json.visa.credito).forEach(([index, valorTaxaCR]) => {
                let percSubord = json.taxa_subordinado - (valorTaxaCR + json.taxas_rr[index] + json.markup_master);
                let liqSubord = (valor * percSubord) / 100;
                let valorMaster = (valor * (100 - percSubord)) / 100;
                let liqMaster = valorMaster - ((valorTaxaCR * valor) / 100 + (json.taxas_rr[index] * liqSubord) / 100);
                let creditoNcc = liqMaster - (valor * json.markup_master) / 100;
                let total = creditoNcc + liqSubord;
                let taxa = (total / valor) * 100 - 100;

                // Montando o JSON Temporário do Cálculo
                let parcelas_credito = {};
                parcelas_credito.produto = "Crédito";
                parcelas_credito.parcelas = index.substring(1, 3) + "x";
                parcelas_credito.liquido_surbordinado = formatter.format(liqSubord);
                parcelas_credito.credito_ncc = formatter.format(creditoNcc);
                parcelas_credito.total = formatter.format(total);
                parcelas_credito.taxa = taxa.toFixed(2) + "%";
                final_credito[index] = parcelas_credito;
              }
            );
            break;

          case "mastercard":
            if (json.mastercard.debito !== 0) {
              let percSubord = json.taxa_subordinado - (json.mastercard.debito + json.markup_master);
              let liqSubord = (valor * percSubord) / 100;
              let valorMaster = (valor * (100 - percSubord)) / 100;
              let liqMaster = valorMaster - (json.mastercard.debito * valor) / 100;
              let creditoNcc = liqMaster - (valor * json.markup_master) / 100;
              let total = creditoNcc + liqSubord;
              let taxa = (total / valor) * 100 - 100;

              // Montando o JSON Temporário do Cálculo
              final_debito.produto = "Débito";
              final_debito.parcelas = "À Vista";
              final_debito.liqsubord = formatter.format(liqSubord);
              final_debito.creditoncc = formatter.format(creditoNcc);
              final_debito.total = formatter.format(total);
              final_debito.taxa = taxa.toFixed(2) + "%";
            }
            Object.entries(json.mastercard.credito).forEach(([index, valorTaxaCR]) => {
                let percSubord = json.taxa_subordinado - (valorTaxaCR + json.taxas_rr[index] + json.markup_master);
                let liqSubord = (valor * percSubord) / 100;
                let valorMaster = (valor * (100 - percSubord)) / 100;
                let liqMaster = valorMaster - ((valorTaxaCR * valor) / 100 + (json.taxas_rr[index] * liqSubord) / 100);
                let creditoNcc = liqMaster - (valor * json.markup_master) / 100;
                let total = creditoNcc + liqSubord;
                let taxa = (total / valor) * 100 - 100;

                // Montando o JSON Temporário do Cálculo
                let parcelas_credito = {};
                parcelas_credito.produto = "Crédito";
                parcelas_credito.parcelas = index.substring(1, 3) + "x";
                parcelas_credito.liquido_surbordinado = formatter.format(liqSubord);
                parcelas_credito.credito_ncc = formatter.format(creditoNcc);
                parcelas_credito.total = formatter.format(total);
                parcelas_credito.taxa = taxa.toFixed(2) + "%";
                final_credito[index] = parcelas_credito;
              }
            );
            break;

          case "elo":
            if (json.elo.debito !== 0) {
              let percSubord = json.taxa_subordinado - (json.elo.debito + json.markup_master);
              let liqSubord = (valor * percSubord) / 100;
              let valorMaster = (valor * (100 - percSubord)) / 100;
              let liqMaster = valorMaster - (json.elo.debito * valor) / 100;
              let creditoNcc = liqMaster - (valor * json.markup_master) / 100;
              let total = creditoNcc + liqSubord;
              let taxa = (total / valor) * 100 - 100;

              // Montando o JSON Temporário do Cálculo
              final_debito.produto = "Débito";
              final_debito.parcelas = "À Vista";
              final_debito.liqsubord = formatter.format(liqSubord);
              final_debito.creditoncc = formatter.format(creditoNcc);
              final_debito.total = formatter.format(total);
              final_debito.taxa = taxa.toFixed(2) + "%";
            }
            Object.entries(json.elo.credito).forEach(([index, valorTaxaCR]) => {
              let percSubord = json.taxa_subordinado - (valorTaxaCR + json.taxas_rr[index] + json.markup_master);
              let liqSubord = (valor * percSubord) / 100;
              let valorMaster = (valor * (100 - percSubord)) / 100;
              let liqMaster = valorMaster - ((valorTaxaCR * valor) / 100 + (json.taxas_rr[index] * liqSubord) / 100);
              let creditoNcc = liqMaster - (valor * json.markup_master) / 100;
              let total = creditoNcc + liqSubord;
              let taxa = (total / valor) * 100 - 100;

              // Montando o JSON Temporário do Cálculo
              let parcelas_credito = {};
              parcelas_credito.produto = "Crédito";
              parcelas_credito.parcelas = index.substring(1, 3) + "x";
              parcelas_credito.liquido_surbordinado = formatter.format(liqSubord);
              parcelas_credito.credito_ncc = formatter.format(creditoNcc);
              parcelas_credito.total = formatter.format(total);
              parcelas_credito.taxa = taxa.toFixed(2) + "%";
              final_credito[index] = parcelas_credito;
            });
            break;

          case "hipercard":
            if (json.hipercard.debito !== 0) {
              let percSubord = json.taxa_subordinado - (json.hipercard.debito + json.markup_master);
              let liqSubord = (valor * percSubord) / 100;
              let valorMaster = (valor * (100 - percSubord)) / 100;
              let liqMaster = valorMaster - (json.hipercard.debito * valor) / 100;
              let creditoNcc = liqMaster - (valor * json.markup_master) / 100;
              let total = creditoNcc + liqSubord;
              let taxa = (total / valor) * 100 - 100;

              // Montando o JSON Temporário do Cálculo
              final_debito.produto = "Débito";
              final_debito.parcelas = "À Vista";
              final_debito.liqsubord = formatter.format(liqSubord);
              final_debito.creditoncc = formatter.format(creditoNcc);
              final_debito.total = formatter.format(total);
              final_debito.taxa = taxa.toFixed(2) + "%";
            }
            Object.entries(json.hipercard.credito).forEach(([index, valorTaxaCR]) => {
                let percSubord = json.taxa_subordinado - (valorTaxaCR + json.taxas_rr[index] + json.markup_master);
                let liqSubord = (valor * percSubord) / 100;
                let valorMaster = (valor * (100 - percSubord)) / 100;
                let liqMaster = valorMaster - ((valorTaxaCR * valor) / 100 + (json.taxas_rr[index] * liqSubord) / 100);
                let creditoNcc = liqMaster - (valor * json.markup_master) / 100;
                let total = creditoNcc + liqSubord;
                let taxa = (total / valor) * 100 - 100;

                // Montando o JSON Temporário do Cálculo
                let parcelas_credito = {};
                parcelas_credito.produto = "Crédito";
                parcelas_credito.parcelas = index.substring(1, 3) + "x";
                parcelas_credito.liquido_surbordinado = formatter.format(liqSubord);
                parcelas_credito.credito_ncc = formatter.format(creditoNcc);
                parcelas_credito.total = formatter.format(total);
                parcelas_credito.taxa = taxa.toFixed(2) + "%";
                final_credito[index] = parcelas_credito;
              }
            );
            break;

          case "amex":
            if (json.amex.debito !== 0) {
              let percSubord = json.taxa_subordinado - (json.amex.debito + json.markup_master);
              let liqSubord = (valor * percSubord) / 100;
              let valorMaster = (valor * (100 - percSubord)) / 100;
              let liqMaster = valorMaster - (json.amex.debito * valor) / 100;
              let creditoNcc = liqMaster - (valor * json.markup_master) / 100;
              let total = creditoNcc + liqSubord;
              let taxa = (total / valor) * 100 - 100;

              // Montando o JSON Temporário do Cálculo
              final_debito.produto = "Débito";
              final_debito.parcelas = "À Vista";
              final_debito.liqsubord = formatter.format(liqSubord);
              final_debito.creditoncc = formatter.format(creditoNcc);
              final_debito.total = formatter.format(total);
              final_debito.taxa = taxa.toFixed(2) + "%";
            }
            Object.entries(json.amex.credito).forEach(([index, valorTaxaCR]) => {
                let percSubord = json.taxa_subordinado - (valorTaxaCR + json.taxas_rr[index] + json.markup_master);
                let liqSubord = (valor * percSubord) / 100;
                let valorMaster = (valor * (100 - percSubord)) / 100;
                let liqMaster = valorMaster - ((valorTaxaCR * valor) / 100 + (json.taxas_rr[index] * liqSubord) / 100);
                let creditoNcc = liqMaster - (valor * json.markup_master) / 100;
                let total = creditoNcc + liqSubord;
                let taxa = (total / valor) * 100 - 100;

                // Montando o JSON Temporário do Cálculo
                let parcelas_credito = {};
                parcelas_credito.produto = "Crédito";
                parcelas_credito.parcelas = index.substring(1, 3) + "x";
                parcelas_credito.liquido_surbordinado =
                  formatter.format(liqSubord);
                parcelas_credito.credito_ncc = formatter.format(creditoNcc);
                parcelas_credito.total = formatter.format(total);
                parcelas_credito.taxa = taxa.toFixed(2) + "%";
                final_credito[index] = parcelas_credito;
              }
            );
            break;

          case "diners":
            if (json.diners.debito !== 0) {
              let percSubord = json.taxa_subordinado - (json.diners.debito + json.markup_master);
              let liqSubord = (valor * percSubord) / 100;
              let valorMaster = (valor * (100 - percSubord)) / 100;
              let liqMaster = valorMaster - (json.diners.debito * valor) / 100;
              let creditoNcc = liqMaster - (valor * json.markup_master) / 100;
              let total = creditoNcc + liqSubord;
              let taxa = (total / valor) * 100 - 100;

              // Montando o JSON Temporário do Cálculo
              final_debito.produto = "Débito";
              final_debito.parcelas = "À Vista";
              final_debito.liqsubord = formatter.format(liqSubord);
              final_debito.creditoncc = formatter.format(creditoNcc);
              final_debito.total = formatter.format(total);
              final_debito.taxa = taxa.toFixed(2) + "%";
            }
            Object.entries(json.diners.credito).forEach(([index, valorTaxaCR]) => {
                let percSubord = json.taxa_subordinado - (valorTaxaCR + json.taxas_rr[index] + json.markup_master);
                let liqSubord = (valor * percSubord) / 100;
                let valorMaster = (valor * (100 - percSubord)) / 100;
                let liqMaster = valorMaster - ((valorTaxaCR * valor) / 100 + (json.taxas_rr[index] * liqSubord) / 100);
                let creditoNcc = liqMaster - (valor * json.markup_master) / 100;
                let total = creditoNcc + liqSubord;
                let taxa = (total / valor) * 100 - 100;

                // Montando o JSON Temporário do Cálculo
                let parcelas_credito = {};
                parcelas_credito.produto = "Crédito";
                parcelas_credito.parcelas = index.substring(1, 3) + "x";
                parcelas_credito.liquido_surbordinado = formatter.format(liqSubord);
                parcelas_credito.credito_ncc = formatter.format(creditoNcc);
                parcelas_credito.total = formatter.format(total);
                parcelas_credito.taxa = taxa.toFixed(2) + "%";
                final_credito[index] = parcelas_credito;
              }
            );
            break;
        }
        geraTabela();
      });
  } else {
    span_aviso.innerHTML = `
      <strong>
        <em>
          <p style="color:red">Ops! Verifique se o Valor está preenchido e/ou se escolheu a Bandeira do Cartão</p>
        </em>
      </strong>`;
  }    
}

function geraTabela() {

  let headers = ['Tipo','Parcelas','Crédito em Conta Corrente','Crédito para Compras','Total', 'Taxa']
  div_result.innerHTML = "";
  div_result.innerHTML = `
    <h2 class="subtitle colored is-4">Valor da Simulação<br/>R$ ${valor_input.value}</h2>
    <p class="description">Veja abaixo a Simulação já calculada no Débito e no Crédito</p>
  `;

  let table = document.createElement('table');
  table.setAttribute("align", "center");
  table.setAttribute("border", "3");
  table.setAttribute("cellpadding", "3");
  
  let headerRow = document.createElement('tr');

  headers.forEach(headerText => {
    let header = document.createElement('th');
    let textNode = document.createTextNode(headerText);  
    header.appendChild(textNode);
    headerRow.appendChild(header);
  });

  table.appendChild(headerRow);

  Object.values(final_debito).forEach(debito => {
    let row = document.createElement('tr');
    let cell = document.createElement('td');
    let textNode = document.createTextNode(debito);
    cell.appendChild(textNode);
    row.appendChild(cell);  
    table.appendChild(cell);
  });

  Object.values(final_credito).forEach(credito => {
    let row = document.createElement('tr');
      Object.values(credito).forEach(text => {
        let cell = document.createElement('td');
        let textNode = document.createTextNode(text);
        cell.appendChild(textNode);
        row.appendChild(cell);
      });
    table.appendChild(row);
  });
  
  div_result.appendChild(table);

   div_result.innerHTML += `
    <br/>
    <a onclick='window.location.reload()'><strong>Fazer nova Simulação</strong></p>
  `;
}