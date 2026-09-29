const url = "https://economia.awesomeapi.com.br/json/last/USD-BRL";

const valorAtual = document.getElementById("valor-atual");
const maiorValor = document.getElementById("maior-valor");
const menorValor = document.getElementById("menor-valor");
const mensagemStatus = document.getElementById("status");

// formata números como valores em reais
function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 4,
    maximumFractionDigits: 4
  });
}

async function buscarCotacao() {
  try {
    // envia a requisao para a API
    const resposta = await fetch(url);

    // verifica se a API respondeu com sucesso
    if (!resposta.ok) {
      throw new Error(`Erro na requisição: ${resposta.status}`);
    }

    // converte a resposta JSON em um objeto JavaScript
    const dados = await resposta.json();
    const cotacao = dados.USDBRL;

    if (!cotacao) {
      throw new Error("Cotação USD/BRL não encontrada.");
    }

    // os valores da API chegam como texto
    const atual = Number(cotacao.bid);
    const maxima = Number(cotacao.high);
    const minima = Number(cotacao.low);

    if (
      !Number.isFinite(atual) || atual <= 0 ||
      !Number.isFinite(maxima) || maxima <= 0 ||
      !Number.isFinite(minima) || minima <= 0
    ) {
      throw new Error("A API retornou valores inválidos.");
    }

    // exibe os valores na pag
    valorAtual.textContent = formatarMoeda(atual);
    maiorValor.textContent = formatarMoeda(maxima);
    menorValor.textContent = formatarMoeda(minima);

    mensagemStatus.textContent = "Cotação carregada com sucesso.";
  } catch (erro) {
    mensagemStatus.textContent =
      "Não foi possível carregar a cotação. Nova tentativa no próximo recarregamento.";

    mensagemStatus.classList.add("erro");
    console.error("Erro ao buscar cotação:", erro);
  }
}

// consulta a API assim que a página é carregada
buscarCotacao();