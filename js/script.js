// Função para adicionar novo campo de despesas
function add(){
    // Localiza o Container de Despesas 
    const despesasContainer = document.getElementById('despesas'); 

    // Conta as despesas existentes
    const despesaCount = despesasContainer.getElementsByClassName('despesa').length; 

    // Cria um nova DIV para a Despesa
    const novaDespesa = document.createElement('div'); 
    novaDespesa.classList.add('despesa');

    // Define o Conteúdo HTML da Nova Despesa
    novaDespesa.innerHTML = `
        <input type="number" class="valor" placeholder="Valor">
        <input type="text" placeholder="Descrição">
        <label><input type="radio" name="categoria${despesaCount}" value="essencial">Essencial</label>
        <label><input type="radio" name="categoria${despesaCount}" value="desejo">Desejo</label>
        <label><input type="radio" name="categoria${despesaCount}" value="poupanca">Poupança</label>
        <button class="btnRemove" onclick="remove(this)">
            <img src="./assets/icons/trash.svg" alt="Remover" class="icon">    
        </button>
    `;

    // Adiciona a Nova Despesa ao Container
    despesasContainer.appendChild(novaDespesa);

    // Foca no campo de valor da nova despesa criada
    novaDespesa.querySelector('.valor').focus();

    novaDespesa.scrollIntoView({ behavior: 'smooth', block: 'start'});
}

// Função para remover a DIV que foi criada
function remove(button){
    // Localiza o Elemento Pai da Despesa
    const despesa = button.parentElement;
    // Remove a Despesa da árvore DOM
    despesa.remove();
}

// Função para calcular as despesas
function calcular() {
    const saldo = parseFloat(document.getElementById('saldo').value);
    const despesas = document.getElementsByClassName('despesa');

    let totalEssencial = 0;
    let totalDesejo = 0;
    let totalPoupanca = 0;

    const detalhes = [];

    for (let despesa of despesas) {
        const valor = parseFloat(despesa.querySelector('.valor').value);
        if (isNaN(valor)){
            alert('Por favor, preencha todos os campos de valor.')
            return;
        }
        // const categoria = despesa.querySelector('input[type="radio"]:checked').value;
        const descricao = despesa.querySelector('input[type="text"]').value;
        const categoria = despesa.querySelector('input[type="radio"]:checked').value;

        detalhes.push({ categoria, valor, descricao });

        if (categoria === 'essencial'){
            totalEssencial += valor;
        } else if (categoria === 'desejo'){
            totalDesejo += valor;
        } else if (categoria === 'poupanca'){
            totalPoupanca += valor;
        }
    }

    const percentualEssencial = (totalEssencial / saldo) * 100;
    const percentualDesejo = (totalDesejo / saldo) * 100;
    const percentualPoupanca = (totalPoupanca / saldo) * 100;

    const aviso = document.getElementById('aviso');
    aviso.innerText = '';

    let excedeuEssencial = false;
    let excedeuDesejo = false;
    let excedeuPoupanca = false;
    let avisoMensagem = ''; // Inicializa a mensagem de aviso

    if (percentualEssencial > 50){
        document.getElementById('valorEssencial').style.color = 'red';
        excedeuEssencial = true;
    }
    if (percentualDesejo > 30){
        document.getElementById('valorDesejo').style.color = 'red';
        excedeuDesejo = true;
    }
    if (percentualPoupanca > 20){
        document.getElementById('valorPoupanca').style.color = 'red';
        excedeuPoupanca = true;
    }

    if (excedeuEssencial || excedeuDesejo || excedeuPoupanca) {
        let totalExcedido = 0;
        if (excedeuEssencial) {
            totalExcedido += totalEssencial - (saldo * 0.5);
            avisoMensagem += 'Essencial, ';
        }
        if (excedeuDesejo) {
            totalExcedido += totalDesejo - (saldo * 0.3);
            avisoMensagem += 'Desejo, ';
        }
        if (excedeuPoupanca) {
            totalExcedido += totalPoupanca - (saldo * 0.2);
            avisoMensagem += 'Poupança, ';
        }

        avisoMensagem = avisoMensagem.slice(0, -2); // Remove a última vírgula e espaço
        aviso.innerHTML = ''; // Limpa o conteúdo existente, se houver

        // Cria um novo elemento <a>
        const linkResumo = document.createElement('a');
        linkResumo.href = '#';
        linkResumo.innerHTML = `<span style="color: red;">Excedeu ${avisoMensagem}</span>`;

        // Adiciona um evento de clique ao link
        linkResumo.addEventListener('click', function (event) {
            event.preventDefault(); // Previne o comportamento padrão do link
            const mensagemResumo = `Você excedeu <span style="color: red;">R$ ${totalExcedido.toFixed(2).replace('.', ',')}</span> do valor calculado.`;
            openModal(mensagemResumo);
        });

        aviso.appendChild(linkResumo);
        aviso.style.color = 'red';
    } else {
        aviso.innerHTML = '';
        aviso.style.color = '';
    }
     
    document.getElementById('valorEssencial').innerHTML = '<strong><span style="color: #34495e;">Essencial:</span> R$ ' + totalEssencial.toFixed(2).replace('.', ',') + '</strong>';
    document.getElementById('valorDesejo').innerHTML =  '<strong><span style="color: #34495e;">Desejo:</span> R$ ' + totalDesejo.toFixed(2).replace('.', ',') + '</strong>';
    document.getElementById('valorPoupanca').innerHTML = '<strong><span style="color: #34495e;">Poupança:</span> R$ ' + totalPoupanca.toFixed(2).replace('.', ',') + '</strong>';
    document.getElementById('tabelaPorcentagens').style.display = 'block';
    document.getElementById('limpar').style.display = 'block'; // Mostrar botão de limpar

    // Atualiza a tabela com os detalhes das despesas
    const detalhesEssencial = document.getElementById('detalhesEssencial');
    const detalhesDesejo = document.getElementById('detalhesDesejo');
    const detalhesPoupanca = document.getElementById('detalhesPoupanca');

    detalhesEssencial.innerHTML = '';
    detalhesDesejo.innerHTML = '';
    detalhesPoupanca.innerHTML = '';

    // Função para formatar a primeira letra em maiúscula
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    detalhes.forEach(detalhe => {
        const div = document.createElement('div');
        const descricaoCapitalizada = capitalizeFirstLetter(detalhe.descricao);
        div.innerHTML = `R$ ${detalhe.valor.toFixed(2).replace('.', ',')} | ${descricaoCapitalizada}`;

        if (detalhe.categoria === 'essencial') {
            detalhesEssencial.appendChild(div);
        } else if (detalhe.categoria === 'desejo') {
            detalhesDesejo.appendChild(div);
        } else if (detalhe.categoria === 'poupanca') {
            detalhesPoupanca.appendChild(div);
        }
    });

    const tabelaDetalhes = document.getElementById('tabelaDetalhes');
    tabelaDetalhes.style.display = 'table';
    tabelaDetalhes.scrollIntoView({behavior: 'smooth', block: 'start'});

    // Após calcular, rolar para a fieldset de resultados
    document.getElementById('resultados').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Função para calcular e exibir as porcentagens automaticamente
function calcularPorcentagens() {
    const saldo = parseFloat(document.getElementById('saldo').value);

    if (!isNaN(saldo)) {
        document.getElementById('resultados').style.display = 'block'; // Mostra a fiedlset 'resultados'
        const percentualEssencial = (50 * saldo) / 100;
        const percentualDesejo = (30 * saldo) / 100;
        const percentualPoupanca = (20 * saldo) / 100;

        document.getElementById('percentual-essencial').innerHTML = '<strong>R$ ' + percentualEssencial.toFixed(2).replace('.', ',') + '</strong>';
        document.getElementById('percentual-desejo').innerHTML =  '<strong>R$ ' + percentualDesejo.toFixed(2).replace('.', ',') + '</strong>';
        document.getElementById('percentual-poupanca').innerHTML = '<strong>R$ ' + percentualPoupanca.toFixed(2).replace('.', ',') + '</strong>';

        // Focar no elemento 'resultados'após calcular
        resultados.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } else {
        document.getElementById('resultados').style.display = 'none'; // Oculta a fieldset na ausência de valor no campo saldo líquido
    }
}

function limparCampos() {
    document.getElementById('saldo').value = '';
    document.getElementById('despesas').innerHTML = `
        <div class="despesa">
            <input type="number" class="valor" placeholder="Valor">
            <input type="text" placeholder="Descrição">
            <label><input type="radio" name="categoria0" value="essencial"> Essencial</label>
            <label><input type="radio" name="categoria0" value="desejo"> Desejo</label>
            <label><input type="radio" name="categoria0" value="poupanca"> Poupança</label>
        </div>
    `;
    document.getElementById('percentual-essencial').innerHTML = '0%';
    document.getElementById('percentual-desejo').innerHTML = '0%';
    document.getElementById('percentual-poupanca').innerHTML = '0%';
    document.getElementById('aviso').innerText = '';
    document.getElementById('tabelaPorcentagens').style.display = 'none';
    document.getElementById('limpar').style.display = 'none';
    document.getElementById('resultados').style.display = 'none';
    document.getElementById('tabelaDetalhes').style.display = 'none';
    document.getElementById('listaArquivos').style.display = 'none';
}

// Formatar o valor digitado no campo de valor
function formatCurrency(event) {
    let value = event.target.value;
    const cursorPosition = event.target.selectionStart;
    
    // Remove qualquer caractere que não seja dígito
    value = value.replace(/\D/g, "");

    if (value) {
        // Adiciona zeros à esquerda se o valor tiver menos de 3 dígitos
        while (value.length < 3) {
            value = "0" + value;
        }

        // Converte para número e divide por 100 para manter duas casas decimais
        value = (parseFloat(value) / 100).toFixed(2).toString();    

        // Substitui o ponto por vírgula para decimais
        value = value.replace(".", ",");

        // Separa a parte inteira da parte decimal
        const parts = value.split(",");

        // Adiciona pontos como separadores de milhar na parte inteira
        parts[0] = parts[0].replace(/\B(?=(\d{4})+(?!\d))/g, ".");

        // Junta a parte inteira e a parte decimal novamente
        value = parts.join(".");
    } else {
        value = "0,00";
    }

    // Atualiza o valor do campo sem mover o cursor
    event.target.value = value;

    // Ajusta a posição do cursor
    const newCursorPosition = cursorPosition + (event.target.value.length - value.length);
    event.target.setSelectionRange(newCursorPosition, newCursorPosition);
}
    
// Aplica o formato automaticamente ao digitar no campo saldo
document.getElementById('saldo').addEventListener('input', formatCurrency);

// Aplica o formato automaticamente ao digitar nos campos de valor das despesas
document.addEventListener('input', function(event){
    if (event.target.classList.contains('valor')) {
        formatCurrency(event);
    }
});

// Função para salvar Despesas
document.getElementById('salvar').addEventListener('click', function() {
    const saldo = document.getElementById('saldo').value.trim();
    const despesas = [];
// Função para Salvar Despesas
    document.querySelectorAll('.despesa').forEach(despesaDiv => {
        const valor = despesaDiv.querySelector('.valor').value.trim();
        const descricao = despesaDiv.querySelector('input[type="text"]').value.trim();
        const categoria = despesaDiv.querySelector('input[type="radio"]:checked')?.value;

        if (valor && descricao && categoria) {
            despesas.push({
                valor,
                descricao,
                categoria
            });
        }
    });

        if (saldo && despesas.length > 0) {
            const nomeArquivo = prompt("Digite um nome para salvar as despesas:");
            if (nomeArquivo) {
                const dados = {
                    saldo,
                    despesas
                };
                localStorage.setItem("despesa_" + nomeArquivo, JSON.stringify(dados));
                alert("Despesas salvas com sucesso!");
            } else {
                alert("Nome do arquivo não pode estar vazio.");
            }
        } else {
            alert("Preencha todos os campos obrigatórios antes de salvar.");
        }
});

//Função para listar arquivos salvos
document.getElementById('listar').addEventListener('click', function() {
    const listaArquivos = document.getElementById('listaArquivos');
    listaArquivos.innerHTML = ""; // Limpa a lista antes de preencher

    // Itera sobre todas as chaves no localStorage
    for (let i = 0; i < localStorage.length; i++){
        const chave = localStorage.key(i);
        if (chave.startsWith("despesa_")) {
            const nomeArquivo = chave.replace("despesa_", "");
            const link = document.createElement('a');
            link.textContent = nomeArquivo;
            link.href = '#';  // Define um link vazio, já que não temos uma funcionalidade real de carregar aqui
            link.addEventListener('click', function(event) {
                event.preventDefault(); // Impede o comportamento padrão do link
                carregarDespesas(chave); // Função para carregar as despesas correspondentes
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent='X';
            deleteButton.classList.add('delete-button');
            deleteButton.addEventListener('click', function(event){
                event.stopPropagation(); // Impede que o clique no botão de exclusão acione o click do link
                localStorage.removeItem(chave);
                atualizarLista(); // Atualiza a lista após a remoção
            });
                
            const li = document.createElement('li');
            li.appendChild(link); // Adiciona o link como filho do <li>
            li.appendChild(deleteButton); // Adciiona o botão de exclusão como filho do <li>
            listaArquivos.appendChild(li); // Adiciona o <li> à lista
        }  
    }  
    
        // Verifica se a lista está vazia e exibe o placeholder se necessário
        if (listaArquivos.children.length === 0) {
            listaArquivos.innerHTML = "<li>Nenhuma despesa salva</li>";
        }
    });
    
    function carregarDespesas(chave) {
        const dadosSalvos = localStorage.getItem(chave);
        if (dadosSalvos) {
            const dados = JSON.parse(dadosSalvos);
            document.getElementById('saldo').value = dados.saldo;
    
            // Limpa despesas existentes
            document.querySelectorAll('.despesa').forEach(despesaDiv => {
                despesaDiv.remove();
            });
    
            // Preenche com despesas carregadas
            dados.despesas.forEach(despesa => {
                const novaDespesaDiv = document.createElement('div');
                novaDespesaDiv.classList.add('despesa');
                novaDespesaDiv.innerHTML = `
                    <input type="number" class="valor" placeholder="Valor" value="${despesa.valor}">
                    <input type="text" placeholder="Descrição" value="${despesa.descricao}">
                    <label><input type="radio" name="categoria-${Math.random()}" value="essencial" ${despesa.categoria === 'essencial' ? 'checked' : ''}>Essencial</label>
                    <label><input type="radio" name="categoria-${Math.random()}" value="desejo" ${despesa.categoria === 'desejo' ? 'checked' : ''}>Desejo</label>
                    <label><input type="radio" name="categoria-${Math.random()}" value="poupanca" ${despesa.categoria === 'poupanca' ? 'checked' : ''}>Poupança</label>
                    <button class="btnRemove" onclick="remove(this)">
                        <img src="/assets/icons/trash.svg" alt="Remover" class="icon">    
                    </button>
                `;
                document.getElementById('despesas').appendChild(novaDespesaDiv);
            });
    
            // Exibe o botão 'Limpar'
            document.getElementById('limpar').style.display = 'block';

            alert("Despesas carregadas com sucesso!");
            document.getElementById('listaArquivos').style.display = 'none';
        } else {
            alert("Nenhum dado encontrado com o nome especificado");
        }
    }
    let listaArquivosVisivel = false;
    document.getElementById('listar').addEventListener('click', function() {
        const listaArquivos = document.getElementById('listaArquivos');
        if (listaArquivosVisivel) {
            listaArquivos.style.display = 'none';
            listaArquivosVisivel = false;
        } else {
            listaArquivos.style.display = 'block';
            listaArquivosVisivel = true;
        }
    });    

    // Função para atualizar a lista de arquivos
    function atualizarLista() {
        const listaArquivos = document.getElementById('listaArquivos');
        listaArquivos.innerHTML = ""; // Limpa a lista antes de preencher

        //Itera sobre todas as chaves no localStorage
        for (let i = 0; i < localStorage.length; i++) {
            const chave = localStorage.key(i);
            if (chave.startsWith("despesa_")) {
                const nomeArquivo = chave.replace("despesa_", "");
                const link = document.createElement('a');
                link.textContent = nomeArquivo;
                link.href = '#';
                link.addEventListener('click', function(event) {
                    event.preventDefault();
                    carregarDespesas(chave);
                });
    
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'X';
                deleteButton.classList.add('delete-button');
                deleteButton.addEventListener('click', function(event) {
                    event.stopPropagation(); // Impede que o clique no botão de exclusão acione o click do link
                    const chave = "despesa_" + nomeArquivo;
                    localStorage.removeItem(chave);
                    atualizarLista(); //  Atualiza a lista após a remoção

                    // Verifica se a lista está vazia e exibe o placeholder se necessário
                    if (listaArquivos.children.length === 0) {
                        listaArquivos.innerHTML = "<li>Nenhuma despesa salva</li>";
                    }
                });
    
                const li = document.createElement('li');
                li.appendChild(link);
                li.appendChild(deleteButton);
                listaArquivos.appendChild(li);
            }
        }
    
        // Verifica se a lsita está vazia e exibe o placeholder se necessário
        if (listaArquivos.children.length === 0) {
            listaArquivos.innerHTML = "<li>Nenhuma despesa salva</li>";
        }
    }
    

// MODAL
document.addEventListener('DOMContentLoaded', function() {
    const alertGifContainer = document.getElementById('alertGifContainer');
    // Adiciona a classe 'show'após um pequeno atraso para iniciar a animação de fade-in
    setTimeout(() => alertGifContainer.classList.add('show'), 10); // permite que a animação para mostrar a imagem seja autorizada

    // Referências aos elementos da modal
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modalMessage');
    const closeModal = document.querySelector('.close');
    const modalOk = document.getElementById('modalOk');

    // Função para abrir o modal
    function openModal(message) {
        modalMessage.innerHTML = message;
        modal.style.display = 'block';
    }

    // Função para fechar a modal
    function closeModalFunc() {
        modal.style.display = 'none';
    }

    // Evento para fechar a modal quando o botão "OK" for clicado
    modalOk.addEventListener('click', closeModalFunc);

    // Evento para fechar a modal quando o "X" for clicado
    closeModal.addEventListener('click', closeModalFunc);

    // Evento para fechar a modal quando clicar fora dela
    window.addEventListener('click', function(event){
        if (event.target === modal) {
            closeModalFunc();
        }
    });

    window.openModal = openModal;
    
});

// Event listener para calcular automaticamente as porcentagens ao digitar o saldo
document.getElementById('saldo').addEventListener('input', calcularPorcentagens);

// Vincula a função add() ao botão btnPlus
document.getElementById('btnPlus').addEventListener('click', add);
// Vincula a função calcular() ao botão calcular
document.getElementById('calcular').addEventListener('click', calcular);
// Vincula a função limparCampos() ao botão limpar
document.getElementById('limpar').addEventListener('click', limparCampos);
// Vincula a função lista() ao botão listar
document.getElementById('listar').addEventListener('click', listar);

