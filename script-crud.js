//botao adicionar tarefa
const btnAdicionarTarefa = document.querySelector('.app__button--add-task');
//botao cancelar tarefa
const btnCancelarTarefa = document.querySelector('.app__form-footer__button--cancel');
//botao remover tarefas concluidas
const btnRemoverTarefasConcluidas = document.querySelector('#btn-remover-concluidas');
//botao remover todas as tarefas
const btnRemoverTarefasTotas = document.querySelector('#btn-remover-todas');
//formulario adicionar tarefa
const formAdicionarTarefa = document.querySelector('.app__form-add-task');
//area texto formulario
const textArea = document.querySelector('.app__form-textarea');

//ul lista tarefas
const ulTarefas = document.querySelector('.app__section-task-list');
const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description');

//lista de tarefa
let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

//tarefa selecionada
let tarefaSelecionada = null;
let litarefaSelecionada = null;

function atualizarTarefas () {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function criarElementoTarefa (tarefa){
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');

    const svg = document.createElement('svg');
    svg.innerHTML = `<svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
    <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
</svg>`;
    li.append(svg);

    const paragrafo = document.createElement('p');
    paragrafo.textContent = tarefa.descricao;
    paragrafo.classList.add('app__section-task-list-item-description');
    li.append(paragrafo);

    const botao = document.createElement('button');
    botao.classList.add('app_button-edit');
    li.append(botao);

    botao.onclick = () => {
        let novaDescricao = prompt("Qual é o novo nome da tarefa?");
        if(novaDescricao){
            paragrafo.textContent = novaDescricao;
            tarefa.descricao = novaDescricao;
            atualizarTarefas ();
        }
        console.log('nova descricao da tarefa: ', novaDescricao);
    }

    const img = document.createElement('img');
    img.setAttribute('src', './imagens/edit.png');
    botao.append(img);

    if(tarefa.completa) {
        li.classList.add('app__section-task-list-item-complete');
        botao.setAttribute('disabled', 'disabled');
    } else{
        li.onclick = () => {
            document.querySelectorAll('.app__section-task-list-item-active')
            .forEach(elemento => {
                elemento.classList.remove('app__section-task-list-item-active')
            });
    
            if(tarefaSelecionada == tarefa){
                paragrafoDescricaoTarefa.textContent = '';
                tarefaSelecionada = null;
                litarefaSelecionada = null;
                return
            }
            tarefaSelecionada = tarefa;
            litarefaSelecionada = li;
            paragrafoDescricaoTarefa.textContent = tarefa.descricao;
    
            li.classList.add('app__section-task-list-item-active');
        }
    }

    return li
}

btnAdicionarTarefa.addEventListener('click', () => {
    //alterar a classe hidden, se tem tira, se nao tem insere
    formAdicionarTarefa.classList.toggle('hidden');
});

formAdicionarTarefa.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const tarefa = {
        descricao: textArea.value
    };
    tarefas.push(tarefa);
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
    atualizarTarefas();
    textArea.value = '';
    formAdicionarTarefa.classList.add('hidden');
});

tarefas.forEach(tarefa => {
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
});

btnCancelarTarefa.addEventListener('click', () => {
    textArea.value = '';
    formAdicionarTarefa.classList.toggle('hidden');
})

document.addEventListener('FocoFinalizado', () => {
    if(tarefaSelecionada && litarefaSelecionada){
        litarefaSelecionada.classList.remove('app__section-task-list-item-active');
        litarefaSelecionada.classList.add('app__section-task-list-item-complete');
        litarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled');
        tarefaSelecionada.completa = true;
        atualizarTarefas()
    }
})

const removerTarefas = (somenteCompletas) =>{
    const seletor = somenteCompletas ? ".app__section-task-list-item-complete" : ".app__section-task-list-item"
    
    document.querySelectorAll(seletor).forEach(elemento  => {
        elemento.remove();
    })
    tarefas = somenteCompletas ? tarefas.filter(tarefa => !tarefa.completa) : [];
    atualizarTarefas();
}

btnRemoverTarefasConcluidas.onclick = () => removerTarefas(true);
btnRemoverTarefasTotas.onclick = () => removerTarefas(false);