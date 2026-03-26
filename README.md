# Tarefa-5 — Projeto Interativo com JavaScript, HTML e CSS

Este repositório apresenta uma aplicação web interativa criada como exercício de integração entre **HTML**, **CSS** e **JavaScript puro (ES6)**.  
O objetivo é demonstrar, de forma didática, o uso de **diversos recursos nativos do JS**, incluindo manipulação do DOM, armazenamento local, eventos, animações e lógica de CRUD.

---

## Visão Geral

A aplicação reúne mais de **10 funcionalidades completas** implementadas no arquivo `script.js`.  
O HTML (`index.html`) estruturando as seções e componentes interativos, enquanto o CSS (`style.css`)define a aparência e o layout do sistema.

---

## Principais Funcionalidades

O projeto demonstra o uso integrado de **funções JavaScript**, **eventos DOM** e **armazenamento local**, organizados em seções modulares:

1. **Diálogos básicos:**  
   Utiliza `alert()`, `prompt()` e `confirm()` para interação com o usuário.

2. **Formulário e validação:**  
   - Campos de nome, e-mail e idade.  
   - Validação de dados obrigatórios e tipos.  
   - Exibição de mensagens personalizadas.  
   - Integração com logs automáticos.

3. **Manipulação de itens (CRUD básico):**  
   - Adição, edição, destaque e remoção de itens da lista.  
   - Atualização automática de estatísticas e painel lateral.  
   - Exportação dos itens em formato JSON.

4. **Operações com arrays:**  
   - Funções de `push`, `pop`, `map`, `filter` e `reduce`.  
   - Exibição formatada em JSON.  
   - Cálculo dinâmico da soma dos valores numéricos.

5. **Timers e aleatoriedade:**  
   - Demonstração de `setTimeout` e `setInterval`.  
   - Geração de números aleatórios com `Math.random()`.  
   - Controle para iniciar e parar intervalos.

6. **Datas e comparações:**  
   - Exibe a data e hora atuais.  
   - Calcula datas futuras com base em dias adicionados.  
   - Compara datas selecionadas com o dia atual, mostrando a diferença em dias.

7. **Tema e animações:**  
   - Alternância entre modo claro e escuro com `classList.toggle`.  
   - Aplicação de animação CSS reinicializável via JavaScript.

8. **Armazenamento Local (`localStorage`):**  
   - Salvar, ler e remover pares de chave/valor.  
   - Atualização em tempo real no painel lateral.  
   - Tratamento de erros com `try/catch`.

9. **CRUD de usuários:**  
   - Cadastro dinâmico de usuários (nome e idade).  
   - Edição e exclusão com botões interativos.  
   - Atualização automática da tabela e estatísticas.  
   - Exportação dos dados para arquivo JSON.

10. **Filtro com debounce:**  
    - Campo de busca com atraso de 300ms.  
    - Filtragem eficiente da lista de itens.  
    - Exibição de status do filtro ativo.

11. **Drag & Drop:**  
    - Implementação completa com eventos `dragstart`, `dragover`, `drop`.  
    - Clonagem e movimentação de elementos entre áreas.  
    - Botão “Remover” gerado dinamicamente após o drop.

12. **Galeria interativa:**  
    - Três imagens SVG geradas dinamicamente.  
    - Navegação entre imagens (anterior/próxima).  
    - Miniaturas (`thumbs`) clicáveis.  
    - Log automático da imagem exibida.

13. **To-Do List com persistência:**  
    - Adição de tarefas persistentes via `localStorage`.  
    - Checkbox de conclusão.  
    - Remoção individual e limpeza de concluídas.  
    - Re-renderização automática ao carregar a página.

14. **Barra de progresso animada:**  
    - Animação de preenchimento com `setInterval`.  
    - Controle de duração (1 a 10 segundos).  
    - Botões de iniciar e parar.  
    - Exibição percentual dinâmica.

15. **Estatísticas em tempo real:**  
    - Atualização contínua de contadores (itens, usuários, soma de array).  
    - Chamadas automáticas de `updateStats()`.

16. **Painel de logs:**  
    - Cada ação gera um registro com timestamp.  
    - Cores e níveis: info, warn e error.  
    - Opção de limpar logs manualmente.

17. **Detecção de seleção de texto:**  
    - Ouvinte `selectionchange` que registra textos selecionados.  
    - Evita trechos longos (>200 caracteres) para não poluir o log.

18. **Exportação geral:**  
    - Exporta dados completos (`itens`, `usuários`, `arrays`) em JSON.  
    - Permite download direto no navegador.

19. **Reset do estado da aplicação:**  
    - Botão “Limpar Tudo” que remove itens, usuários e storage.  
    - Restaura os valores iniciais e reinicia as estatísticas.

