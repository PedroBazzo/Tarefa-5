const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));
function appendLog(level, msg){
  const out = $('#debug-output');
  const time = new Date().toLocaleTimeString();
  const line = `[${time}] ${level.toUpperCase()}: ${msg}\n`;
  if(out) out.textContent = line + out.textContent;
  if(level === 'error') console.error(msg);
  else if(level === 'warn') console.warn(msg);
  else console.log(msg);
}
function safeText(el){ return el ? el.textContent.trim() : ''; }

let users = [];
let arr = [];
let intervalId = null;
let progressTimer = null;
let progressState = { running:false, elapsed:0, duration:10 };

function updateSidebarSummary(){
  $('#summary-items').textContent = String(document.querySelectorAll('#items-list li').length);
  $('#summary-users').textContent = String(users.length);
  const key = $('#storage-key') ? $('#storage-key').value : 'demoKey';
  $('#summary-storage').textContent = localStorage.getItem(key) ? 'presente' : 'nenhum';
}

function initNavArrows() {
  const navList = document.querySelector('.nav-list');
  const leftArrow = document.querySelector('.nav-arrow-left');
  const rightArrow = document.querySelector('.nav-arrow-right');
  
  if (!navList || !leftArrow || !rightArrow) return;

  function scrollNav(direction) {
    const scrollAmount = 200;
    const currentScroll = navList.scrollLeft;
    
    if (direction === 'left') {
      navList.scrollTo({
        left: currentScroll - scrollAmount,
        behavior: 'smooth'
      });
    } else {
      navList.scrollTo({
        left: currentScroll + scrollAmount,
        behavior: 'smooth'
      });
    }

    setTimeout(updateArrowStates, 300);
  }

  function updateArrowStates() {
    const scrollLeft = navList.scrollLeft;
    const scrollWidth = navList.scrollWidth;
    const clientWidth = navList.clientWidth;
    
    leftArrow.disabled = scrollLeft <= 0;
    rightArrow.disabled = scrollLeft >= scrollWidth - clientWidth - 5;

    if (leftArrow.disabled) {
      leftArrow.style.opacity = '0.4';
      leftArrow.style.cursor = 'not-allowed';
    } else {
      leftArrow.style.opacity = '1';
      leftArrow.style.cursor = 'pointer';
    }
    
    if (rightArrow.disabled) {
      rightArrow.style.opacity = '0.4';
      rightArrow.style.cursor = 'not-allowed';
    } else {
      rightArrow.style.opacity = '1';
      rightArrow.style.cursor = 'pointer';
    }
  }

  leftArrow.addEventListener('click', () => scrollNav('left'));
  rightArrow.addEventListener('click', () => scrollNav('right'));

  updateArrowStates();

  window.addEventListener('resize', updateArrowStates);

  navList.addEventListener('scroll', updateArrowStates);
}

function showAlert(){ alert('Exemplo de alert() — Projeto Demo JavaScript'); appendLog('info','alert exibido'); }
function showPrompt(){ const v = prompt('Digite seu nome:',''); if(v!==null) { showFormMessage('Olá, '+v); appendLog('info','prompt: '+v); } }
function showConfirm(){ const ok = confirm('Confirmar ação?'); showFormMessage(ok ? 'Confirmado' : 'Cancelado'); appendLog('info','confirm: '+ok); }

function showFormMessage(msg){
  const el = $('#form-messages'); if(el) el.textContent = msg;
  appendLog('info', msg);
  updateSidebarSummary();
}
function validateForm(){
  const n = $('#input-name'), e = $('#input-email'), a = $('#input-age');
  if(!n||!e||!a) { showFormMessage('Campos ausentes'); return false; }
  const name = n.value.trim(), email = e.value.trim(), age = parseInt(a.value,10);
  if(!name){ showFormMessage('Nome obrigatório'); return false; }
  if(!email || email.indexOf('@') === -1){ showFormMessage('E-mail inválido'); return false; }
  if(Number.isNaN(age) || age < 1 || age > 120){ showFormMessage('Idade inválida'); return false; }
  showFormMessage('Formulário válido. Obrigado, '+name+'!');
  return true;
}

function createItemElement(text){
  const li = document.createElement('li');
  const span = document.createElement('span'); span.textContent = text;
  const actions = document.createElement('div');

  const btnEdit = document.createElement('button'); btnEdit.className = 'btn'; btnEdit.textContent = 'Editar';
  btnEdit.addEventListener('click', ()=> {
    const newT = prompt('Editar item:', text);
    if(newT !== null){ span.textContent = newT; appendLog('info','Item editado'); updateSidebarSummary(); }
  });

  const btnHighlight = document.createElement('button'); btnHighlight.className = 'btn'; btnHighlight.textContent = 'Destacar';
  btnHighlight.addEventListener('click', ()=> li.classList.toggle('highlight'));

  const btnRemove = document.createElement('button'); btnRemove.className = 'btn danger'; btnRemove.textContent = 'Remover';
  btnRemove.addEventListener('click', ()=> { li.remove(); appendLog('info','Item removido'); updateSidebarSummary(); });

  actions.appendChild(btnEdit); actions.appendChild(btnHighlight); actions.appendChild(btnRemove);
  li.appendChild(span); li.appendChild(actions);
  li.setAttribute('draggable','true');
  return li;
}
function addItem(text){ const list = $('#items-list'); if(!list) return; list.appendChild(createItemElement(text)); appendLog('info','Item adicionado: '+text); updateSidebarSummary(); }
function clearItems(){ const list = $('#items-list'); if(list){ list.innerHTML=''; appendLog('info','Itens limpos'); updateSidebarSummary(); } }

function renderArray(){ const out = $('#array-output'); if(out) out.textContent = JSON.stringify(arr,null,2); }
function arrayAdd(val){ if(val === undefined || String(val).trim()===''){ showFormMessage('Informe valor'); return; } const num = Number(val); arr.push(Number.isNaN(num) ? val : num); renderArray(); appendLog('info','Array push: '+val); updateStats(); }
function arrayRemoveLast(){ if(arr.length===0){ showFormMessage('Array vazio'); return; } const r = arr.pop(); renderArray(); appendLog('info','Array pop: '+r); updateStats(); }
function arrayMapDouble(){ arr = arr.map(x => typeof x==='number' ? x*2 : x); renderArray(); appendLog('info','map dobrado'); updateStats(); }
function arrayFilterEven(){ arr = arr.filter(x => typeof x==='number' && x%2===0); renderArray(); appendLog('info','filter pares'); updateStats(); }
function arrayReduceSum(){ const s = arr.filter(x=>typeof x==='number').reduce((a,b)=>a+b,0); showFormMessage('Soma: '+s); appendLog('info','reduce soma:'+s); }

function demoTimeout(){ showFormMessage('Aguardando 2s...'); setTimeout(()=>{ $('#timer-output').textContent='setTimeout concluído'; showFormMessage('setTimeout executado'); },2000); }
function startInterval(){ if(intervalId!==null){ showFormMessage('Intervalo já em execução'); return; } let c=0; intervalId = setInterval(()=>{ c++; $('#timer-output').textContent='Intervalo: '+c+'s'; },1000); showFormMessage('Intervalo iniciado'); }
function stopInterval(){ if(intervalId===null){ showFormMessage('Nenhum intervalo'); return; } clearInterval(intervalId); intervalId=null; showFormMessage('Intervalo parado'); $('#timer-output').textContent='Parado'; }
function generateRandom(){ const r=Math.round(Math.random()*10000)/100; $('#timer-output').textContent='Aleatório: '+r; appendLog('info','Math.random: '+r); }

function showNow(){ $('#date-output').textContent = 'Agora: '+(new Date()).toLocaleString(); appendLog('info','Date agora'); }
function addDaysToNow(days){ const now=new Date(); const fut=new Date(now.getTime()+days*24*60*60*1000); $('#date-output').textContent='Daqui a '+days+' dias: '+fut.toLocaleDateString(); appendLog('info','Data futura'); }
function compareWithToday(dateString){ if(!dateString){ showFormMessage('Selecione uma data'); return; } const sel=new Date(dateString); const today=new Date(); sel.setHours(0,0,0,0); today.setHours(0,0,0,0); const diff = Math.round((sel.getTime()-today.getTime())/(24*60*60*1000)); $('#date-output').textContent = 'Diferença em dias: '+diff; appendLog('info','Comparação data: '+diff); }

function toggleTheme(){ document.body.classList.toggle('theme-dark'); appendLog('info','Tema alternado'); }
function applyAnimation(){ const box = $('#box'); if(!box) return; box.classList.remove('animated'); void box.offsetWidth; box.classList.add('animated'); appendLog('info','Animação aplicada'); }

function saveToStorage(){ const k = $('#storage-key') ? $('#storage-key').value || 'demoKey' : 'demoKey'; const v = $('#storage-value') ? $('#storage-value').value : ''; try{ localStorage.setItem(k,v); $('#storage-output').textContent = `Salvo: [${k}]="${v}"`; appendLog('info','localStorage.setItem '+k); }catch(e){ appendLog('error','Erro localStorage: '+e.message); } updateSidebarSummary(); }
function readFromStorage(){ const k = $('#storage-key') ? $('#storage-key').value || 'demoKey' : 'demoKey'; const v = localStorage.getItem(k); $('#storage-output').textContent = v===null ? `Chave "${k}" não encontrada.` : `Lido: [${k}]="${v}"`; appendLog('info','localStorage.getItem '+k); updateSidebarSummary(); }
function removeFromStorage(){ const k = $('#storage-key') ? $('#storage-key').value || 'demoKey' : 'demoKey'; localStorage.removeItem(k); $('#storage-output').textContent = `Removido: ${k}`; appendLog('info','localStorage.removeItem '+k); updateSidebarSummary(); }

function renderUsersTable(){ const tbody = document.querySelector('#users-table tbody'); if(!tbody) return; tbody.innerHTML=''; users.forEach((u,idx)=>{ const tr=document.createElement('tr'); const tdName=document.createElement('td'); tdName.textContent=u.name; const tdAge=document.createElement('td'); tdAge.textContent=String(u.age); const tdActions=document.createElement('td'); const btnEdit=document.createElement('button'); btnEdit.className='btn'; btnEdit.textContent='Editar'; btnEdit.addEventListener('click',()=>editUser(idx)); const btnRemove=document.createElement('button'); btnRemove.className='btn danger'; btnRemove.textContent='Remover'; btnRemove.addEventListener('click',()=>{ users.splice(idx,1); renderUsersTable(); appendLog('info','Usuário removido'); updateStats(); }); tdActions.appendChild(btnEdit); tdActions.appendChild(btnRemove); tr.appendChild(tdName); tr.appendChild(tdAge); tr.appendChild(tdActions); tbody.appendChild(tr); }); updateStats(); }
function addUserFromForm(){ const n=$('#user-name'), a=$('#user-age'); if(!n||!a) return; const name=n.value.trim(), age=parseInt(a.value,10); if(!name||Number.isNaN(age)){ showFormMessage('Nome e idade válidos obrigatórios'); return; } users.push({name,age}); n.value=''; a.value=''; renderUsersTable(); appendLog('info','Usuário adicionado: '+name); updateStats(); }
function editUser(idx){ const u = users[idx]; if(!u) return; const newName = prompt('Editar nome', u.name); if(newName === null) return; const newAgeStr = prompt('Editar idade', String(u.age)); if(newAgeStr === null) return; const newAge = parseInt(newAgeStr,10); if(!newName || Number.isNaN(newAge)){ showFormMessage('Dados inválidos'); return; } users[idx] = {name:newName, age:newAge}; renderUsersTable(); appendLog('info','Usuário editado: '+newName); updateStats(); }

function debounce(fn, delay){ let t=null; return function(){ const args=arguments; clearTimeout(t); t=setTimeout(()=>fn.apply(null,args),delay); }; }
function applyFilter(text){ const list = document.querySelectorAll('#items-list li'); const q = (text||'').trim().toLowerCase(); list.forEach(li=>{ const txt = li.querySelector('span') ? li.querySelector('span').textContent.toLowerCase() : ''; li.style.display = txt.indexOf(q)!==-1 ? '' : 'none'; }); $('#filter-status').textContent = q ? 'Filtrando por: '+q : 'Nenhum filtro'; appendLog('info','Filtro: '+q); }

function bindDragAndDrop(){ const src = $('#drag-source'), tgt = $('#drag-target'); if(!src||!tgt) return; src.addEventListener('dragstart', function(ev){ const li = ev.target.closest('li'); if(!li) return; ev.dataTransfer.setData('text/plain', li.getAttribute('data-id')); ev.dataTransfer.effectAllowed='move'; }); tgt.addEventListener('dragover', function(ev){ ev.preventDefault(); tgt.classList.add('drag-over'); }); tgt.addEventListener('dragleave', ()=>tgt.classList.remove('drag-over')); tgt.addEventListener('drop', function(ev){ ev.preventDefault(); tgt.classList.remove('drag-over'); const id = ev.dataTransfer.getData('text/plain'); if(!id) return; const li = src.querySelector('li[data-id="'+id+'"]'); if(li){ const clone = li.cloneNode(true); clone.removeAttribute('data-id'); const remove = document.createElement('button'); remove.className='btn danger'; remove.textContent='Remover'; remove.addEventListener('click', ()=>clone.remove()); clone.appendChild(remove); tgt.appendChild(clone); appendLog('info','Arrastado: '+id); } }); }

let galleryIndex = 0;
const gallerySources = [
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='640' height='420'><rect width='100%' height='100%' fill='%230f766e'/><text x='50%' y='50%' fill='white' font-size='40' dominant-baseline='middle' text-anchor='middle'>Imagem 1</text></svg>",
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='640' height='420'><rect width='100%' height='100%' fill='%23115e59'/><text x='50%' y='50%' fill='white' font-size='40' dominant-baseline='middle' text-anchor='middle'>Imagem 2</text></svg>",
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='640' height='420'><rect width='100%' height='100%' fill='%23063f3a'/><text x='50%' y='50%' fill='white' font-size='40' dominant-baseline='middle' text-anchor='middle'>Imagem 3</text></svg>"
];
function showGallery(index){ const img = $('#gallery-image'); if(!img) return; galleryIndex = (index + gallerySources.length) % gallerySources.length; img.src = gallerySources[galleryIndex]; appendLog('info','Gallery show index '+galleryIndex); }
function bindGallery(){ $$('.thumb').forEach((t,idx)=> t.addEventListener('click', ()=> showGallery(idx))); const prev = $('#gallery-prev'), next = $('#gallery-next'); if(prev) prev.addEventListener('click', ()=> showGallery(galleryIndex-1)); if(next) next.addEventListener('click', ()=> showGallery(galleryIndex+1)); showGallery(0); }

function renderTodo(){ const ul = $('#todo-list'); if(!ul) return; ul.innerHTML=''; const saved = JSON.parse(localStorage.getItem('demo_todo')||'[]'); saved.forEach((t,i)=>{ const li = document.createElement('li'); const chk = document.createElement('input'); chk.type='checkbox'; chk.checked = !!t.done; chk.addEventListener('change', ()=>{ saved[i].done = chk.checked; localStorage.setItem('demo_todo', JSON.stringify(saved)); renderTodo(); }); const span = document.createElement('span'); span.textContent = t.text; const btn = document.createElement('button'); btn.className='btn danger'; btn.textContent='Remover'; btn.addEventListener('click', ()=>{ saved.splice(i,1); localStorage.setItem('demo_todo', JSON.stringify(saved)); renderTodo(); }); li.appendChild(chk); li.appendChild(span); li.appendChild(btn); ul.appendChild(li); }); }
function addTodo(){ const input = $('#todo-input'); if(!input) return; const text = input.value.trim(); if(!text) return; const saved = JSON.parse(localStorage.getItem('demo_todo')||'[]'); saved.push({text, done:false}); localStorage.setItem('demo_todo', JSON.stringify(saved)); input.value=''; renderTodo(); appendLog('info','ToDo adicionado'); }
function clearCompletedTodo(){ const saved = JSON.parse(localStorage.getItem('demo_todo')||'[]'); const filtered = saved.filter(t=>!t.done); localStorage.setItem('demo_todo', JSON.stringify(filtered)); renderTodo(); appendLog('info','ToDo concluídas limpas'); }

function startProgress(duration){
  if(progressState.running) return;
  progressState.running = true;
  progressState.duration = Math.max(1, Number(duration)||10);
  progressState.elapsed = 0;
  const fill = $('#progress-fill'), label = $('#progress-label');
  if(!fill || !label) return;
  fill.style.width = '0%';
  label.textContent = '0%';
  progressTimer = setInterval(()=> {
    progressState.elapsed += 0.1;
    const pct = Math.min(100, Math.round((progressState.elapsed / progressState.duration) * 100));
    fill.style.width = pct + '%';
    label.textContent = pct + '%';
    if(progressState.elapsed >= progressState.duration){ clearInterval(progressTimer); progressState.running = false; appendLog('info','Progress concluído'); }
  }, 100);
}
function stopProgress(){ if(progressTimer) clearInterval(progressTimer); progressState.running=false; $('#progress-fill').style.width='0%'; $('#progress-label').textContent='0%'; appendLog('info','Progress parado'); }

function updateStats(){
  $('#stat-items').textContent = String(document.querySelectorAll('#items-list li').length);
  $('#stat-users').textContent = String(users.length);
  const sum = arr.filter(x=>typeof x==='number').reduce((a,b)=>a+b,0);
  $('#stat-array-sum').textContent = String(sum);
}

document.addEventListener('selectionchange', ()=> {
  const s = document.getSelection();
  if(s && s.toString().trim().length>0 && s.toString().trim().length<200) appendLog('info','Texto selecionado: '+s.toString().trim());
});

document.addEventListener('DOMContentLoaded', ()=> {

  if($('#btn-alert')) $('#btn-alert').addEventListener('click', showAlert);
  if($('#btn-prompt')) $('#btn-prompt').addEventListener('click', showPrompt);
  if($('#btn-confirm')) $('#btn-confirm').addEventListener('click', showConfirm);

  const demoForm = $('#demo-form');
  if(demoForm) demoForm.addEventListener('submit', (ev)=>{ ev.preventDefault(); if(validateForm()){ showFormMessage('Formulário enviado (simulado)'); demoForm.reset(); } });
  if($('#btn-validate-only')) $('#btn-validate-only').addEventListener('click', validateForm);

  if($('#btn-add-item')) $('#btn-add-item').addEventListener('click', ()=>{ const v = $('#new-item-text') ? $('#new-item-text').value.trim() : ''; addItem(v || ('Item '+Math.floor(Math.random()*1000))); if($('#new-item-text')) $('#new-item-text').value=''; });
  if($('#btn-clear-items')) $('#btn-clear-items').addEventListener('click', clearItems);
  if($('#btn-export-items')) $('#btn-export-items').addEventListener('click', ()=> {
    const items = Array.from(document.querySelectorAll('#items-list li span')).map(s=>s.textContent);
    const blob = new Blob([JSON.stringify(items,null,2)], {type:'application/json'}); const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'items.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); appendLog('info','Itens exportados');
  });

  if($('#btn-array-add')) $('#btn-array-add').addEventListener('click', ()=>{ const v = $('#array-item') ? $('#array-item').value : ''; arrayAdd(v); if($('#array-item')) $('#array-item').value=''; });
  if($('#btn-array-remove')) $('#btn-array-remove').addEventListener('click', arrayRemoveLast);
  if($('#btn-array-map')) $('#btn-array-map').addEventListener('click', arrayMapDouble);
  if($('#btn-array-filter')) $('#btn-array-filter').addEventListener('click', arrayFilterEven);
  if($('#btn-array-reduce')) $('#btn-array-reduce').addEventListener('click', arrayReduceSum);

  if($('#btn-timeout')) $('#btn-timeout').addEventListener('click', demoTimeout);
  if($('#btn-interval-start')) $('#btn-interval-start').addEventListener('click', startInterval);
  if($('#btn-interval-stop')) $('#btn-interval-stop').addEventListener('click', stopInterval);
  if($('#btn-random')) $('#btn-random').addEventListener('click', generateRandom);

  if($('#btn-now')) $('#btn-now').addEventListener('click', showNow);
  if($('#btn-add-10days')) $('#btn-add-10days').addEventListener('click', ()=> addDaysToNow(10));
  if($('#btn-compare-date')) $('#btn-compare-date').addEventListener('click', ()=> compareWithToday($('#date-compare') ? $('#date-compare').value : ''));

  if($('#btn-toggle-theme')) $('#btn-toggle-theme').addEventListener('click', toggleTheme);
  if($('#btn-animate')) $('#btn-animate').addEventListener('click', applyAnimation);
  if($('#btn-box-toggle')) $('#btn-box-toggle').addEventListener('click', ()=> { const b=$('#box'); if(b) b.classList.toggle('highlight'); });

  if($('#btn-storage-save')) $('#btn-storage-save').addEventListener('click', saveToStorage);
  if($('#btn-storage-read')) $('#btn-storage-read').addEventListener('click', readFromStorage);
  if($('#btn-storage-clear')) $('#btn-storage-clear').addEventListener('click', removeFromStorage);

  if($('#btn-user-add')) $('#btn-user-add').addEventListener('click', addUserFromForm);

  const fi = $('#filter-input');
  if(fi) fi.addEventListener('input', debounce((ev)=> applyFilter(ev.target.value || ''), 300));
  if($('#btn-filter-clear')) $('#btn-filter-clear').addEventListener('click', ()=> { if(fi) fi.value=''; applyFilter(''); });

  bindDragAndDrop();

  bindGallery();

  if($('#btn-todo-add')) $('#btn-todo-add').addEventListener('click', addTodo);
  if($('#btn-todo-clear')) $('#btn-todo-clear').addEventListener('click', clearCompletedTodo);
  if($('#btn-todo-save')) $('#btn-todo-save').addEventListener('click', ()=> { appendLog('info','ToDo salvo manualmente'); });
  renderTodo();

  if($('#btn-progress-start')) $('#btn-progress-start').addEventListener('click', ()=> startProgress( Number($('#progress-duration') ? $('#progress-duration').value : 10) ));
  if($('#btn-progress-stop')) $('#btn-progress-stop').addEventListener('click', stopProgress);

  if($('#btn-log')) $('#btn-log').addEventListener('click', ()=> appendLog('info','Log exemplo') );
  if($('#btn-warn')) $('#btn-warn').addEventListener('click', ()=> appendLog('warn','Warn exemplo') );
  if($('#btn-error')) $('#btn-error').addEventListener('click', ()=> appendLog('error','Error exemplo') );
  if($('#btn-clear-logs')) $('#btn-clear-logs').addEventListener('click', ()=> { const o = $('#debug-output'); if(o) o.textContent=''; });

  if($('#btn-clear-items')) $('#btn-clear-items').addEventListener('click', clearItems);
  if($('#btn-clear-all')) $('#btn-clear-all').addEventListener('click', ()=> { clearItems(); users=[]; renderUsersTable(); localStorage.clear(); appendLog('info','Estado resetado'); updateStats(); });
  if($('#btn-export-users')) $('#btn-export-users').addEventListener('click', ()=> {
    const blob = new Blob([JSON.stringify(users,null,2)], {type:'application/json'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download='users.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); appendLog('info','Usuários exportados');
  });
  if($('#btn-export-all')) $('#btn-export-all').addEventListener('click', ()=> {
    const data = { items: Array.from(document.querySelectorAll('#items-list li span')).map(s=>s.textContent), users: users, array: arr };
    const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download='project-export.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); appendLog('info','Export completo');
  });

  if($('#btn-focus-name')) $('#btn-focus-name').addEventListener('click', ()=> { const n = $('#input-name'); if(n){ n.focus(); appendLog('info','Focado no nome'); } });

  addItem('Item inicial A'); addItem('Item inicial B'); arr = [1,2,3]; renderArray(); users = [{name:'Alice',age:28},{name:'Bruno',age:32}]; renderUsersTable(); updateStats(); appendLog('info','Inicialização concluída');
});

function initActiveSectionHighlight() {
  const navLinks = document.querySelectorAll('.nav-list a');
  const sections = document.querySelectorAll('.section');
  
  function setActiveLink() {
    let currentSection = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }
  
  window.addEventListener('scroll', setActiveLink);
  setActiveLink(); 
}

function initBackToTop() {
  const backToTopBtn = document.getElementById('btn-back-to-top');
  if (!backToTopBtn) return;
  
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNavArrows();
  initActiveSectionHighlight();
  initBackToTop();
  
  updateThemeStatus();
  
  appendLog('info', 'Sistema de navegação inicializado');
});

function updateThemeStatus() {
  const themeStatus = document.getElementById('theme-status');
  if (themeStatus) {
    themeStatus.textContent = document.body.classList.contains('theme-dark') ? 'Escuro' : 'Claro';
  }
}

const originalToggleTheme = toggleTheme;
toggleTheme = function() {
  originalToggleTheme();
  updateThemeStatus();
};