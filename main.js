// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Phone mask
const telefone = document.getElementById('telefone');
if (telefone) {
  telefone.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    else if (v.length > 0) v = `(${v}`;
    e.target.value = v;
  });
}

// WhatsApp Business — número do corretor
const WA_NUMBER = '5538999643928';

// Monta a mensagem e abre o WhatsApp Business
function enviarParaWhatsApp(dados) {
  const tipoMap = {
    apartamento: 'Apartamento',
    casa: 'Casa / Sobrado',
    cobertura: 'Cobertura',
    terreno: 'Terreno / Lote',
    comercial: 'Comercial',
    '': 'Não informado'
  };

  const orcamentoMap = {
    '500k-1m': 'R$ 500k – R$ 1M',
    '1m-2m': 'R$ 1M – R$ 2M',
    '2m-5m': 'R$ 2M – R$ 5M',
    '5m+': 'Acima de R$ 5M',
    '': 'Não informado'
  };

  const msg = [
    '🏠 *Nova solicitação – Universun Imóveis*',
    '',
    `👤 *Nome:* ${dados.nome}`,
    `📱 *WhatsApp:* ${dados.telefone}`,
    `📧 *E-mail:* ${dados.email}`,
    `🏡 *Tipo:* ${tipoMap[dados.tipo] || dados.tipo}`,
    `💰 *Orçamento:* ${orcamentoMap[dados.orcamento] || dados.orcamento}`,
    `📝 *Mensagem:* ${dados.mensagem || 'Não informado'}`,
    '',
    '_Enviado pelo site universunimoveis.com_'
  ].join('\n');

  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank', 'noopener');
}

// Formulário de contato → WhatsApp Business
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validação mínima
    const nome = document.getElementById('nome').value.trim();
    const tel = document.getElementById('telefone').value.trim();
    const email = document.getElementById('email').value.trim();
    const lgpd = document.getElementById('lgpd').checked;

    if (!nome || !tel || !email || !lgpd) {
      if (!lgpd) document.getElementById('lgpd').focus();
      return;
    }

    const btn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnLoading = document.getElementById('btnLoading');
    const successMsg = document.getElementById('formSuccess');

    btn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';

    const dados = {
      nome,
      telefone: tel,
      email,
      tipo: document.getElementById('tipo').value,
      orcamento: document.getElementById('orcamento').value,
      mensagem: document.getElementById('mensagem').value.trim()
    };

    // Abre WhatsApp Business com a mensagem formatada
    enviarParaWhatsApp(dados);

    // Feedback visual
    setTimeout(() => {
      btn.style.display = 'none';
      successMsg.style.display = 'block';
      form.reset();
    }, 800);
  });
}

// Fade-in on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.card, .depo-card, .stat-item, .feature').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// ===== SOFIA CHAT WIDGET =====
const sofiaFab = document.getElementById('sofiaFab');
const sofiaWindow = document.getElementById('sofiaWindow');
const sofiaClose = document.getElementById('sofiaClose');
const sofiaMessages = document.getElementById('sofiaMessages');
const sofiaInput = document.getElementById('sofiaInput');
const sofiaSend = document.getElementById('sofiaSend');

let sofiaHistory = [];
let sofiaOpen = false;
let sofiaLoading = false;

function toggleSofia() {
  sofiaOpen = !sofiaOpen;
  sofiaFab.classList.toggle('open', sofiaOpen);
  sofiaWindow.classList.toggle('open', sofiaOpen);
  sofiaWindow.setAttribute('aria-hidden', String(!sofiaOpen));
  if (sofiaOpen) setTimeout(() => sofiaInput.focus(), 300);
}

sofiaFab.addEventListener('click', toggleSofia);
sofiaClose.addEventListener('click', toggleSofia);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && sofiaOpen) toggleSofia();
});

function appendMessage(role, text) {
  const div = document.createElement('div');
  div.className = `sofia-msg sofia-msg--${role === 'user' ? 'user' : 'bot'}`;
  const p = document.createElement('p');
  p.textContent = text;
  div.appendChild(p);
  sofiaMessages.appendChild(div);
  sofiaMessages.scrollTop = sofiaMessages.scrollHeight;
}

function showTyping() {
  const div = document.createElement('div');
  div.className = 'sofia-msg sofia-typing';
  div.id = 'sofiaTyping';
  div.innerHTML = '<div class="sofia-typing-dots"><span></span><span></span><span></span></div>';
  sofiaMessages.appendChild(div);
  sofiaMessages.scrollTop = sofiaMessages.scrollHeight;
}

function removeTyping() {
  const el = document.getElementById('sofiaTyping');
  if (el) el.remove();
}

async function sendMessage() {
  const text = sofiaInput.value.trim();
  if (!text || sofiaLoading) return;

  sofiaLoading = true;
  sofiaInput.disabled = true;
  sofiaSend.disabled = true;
  sofiaInput.value = '';

  appendMessage('user', text);
  sofiaHistory.push({ role: 'user', content: text });
  showTyping();

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: sofiaHistory })
    });

    removeTyping();

    if (!res.ok) throw new Error('API error ' + res.status);

    const data = await res.json();
    const reply = data.message || 'Desculpe, não consegui processar sua mensagem.';

    appendMessage('assistant', reply);
    sofiaHistory.push({ role: 'assistant', content: reply });

  } catch {
    removeTyping();
    appendMessage('assistant', 'Desculpe, ocorreu um erro. Entre em contato pelo WhatsApp (38) 9 9964-3928.');
  } finally {
    sofiaLoading = false;
    sofiaInput.disabled = false;
    sofiaSend.disabled = false;
    sofiaInput.focus();
  }
}

sofiaSend.addEventListener('click', sendMessage);
sofiaInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
