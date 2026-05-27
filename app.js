/* =============================================
   TEN DIGITAL MZ — app.js
   Integracoes: PayPal SDK + Stripe
   NOTA: Chaves secretas pertencem ao backend!
   ============================================= */

"use strict";

/* ─── CONFIGURACAO DE PAGAMENTO ─── */
const PAYMENT_CONFIG = {
  /* PayPal Client ID (publica — segura no frontend) */
  paypalClientId: "AbG0xPOzmsbEtMdqw9H9TswqIcTtT8P61xnJIX3KU_epOQyyKwK-VEJcZZXOe-YH7anyayKDmhCvXfUq",

  /* Stripe Publishable Key — começa com rk_test / pk_test */
  /* AVISO: a chave que forneceu começa com rk_test_ (restricted key).
     Para pagamentos use uma pk_test_ do Dashboard Stripe.
     Mantemos aqui para nao quebrar o flow de teste. */
  stripePublicKey: "rk_test_51RkOpJCexzLim5xuOlvct08qFjgjMHq9uapRYvbm904Qdl7uNjIdxD7c2Y7PxBd2adX8mfO35DLFzOoRpSLsquFU004sPAaGhZ",

  /* Taxa de cambio aproximada MT -> USD (apenas para PayPal/Stripe que usam USD) */
  mtToUsd: 0.016,

  /* Moeda base do site */
  currency: "MT",
};


const CHAT_CONFIG = {
  whatsappUrl: "https://wa.me/258844772002",
  simulatedResponses: [
    "Olá! Eu sou seu assistente virtual. Como posso ajudar hoje?",
    "Para falar diretamente com o vendedor, clique no botão WhatsApp ao lado.",
    "Este chat é uma demonstração local. Peça preços, métodos de pagamento ou envie dúvidas gerais.",
  ],
};
 
 /* Estado global da compra */

const CHAT_CONFIG = {
  whatsappUrl: "https://wa.me/258844772002",
  simulatedResponses: [
    "Olá! Eu sou seu assistente virtual. Como posso ajudar hoje?",
    "Para falar diretamente com o vendedor, clique no botão WhatsApp ao lado.",
    "Este chat é uma demonstração local. Peça preços, métodos de pagamento ou envie dúvidas gerais.",
  ],
};
 
 /* Estado global da compra */

/* Estado global da compra */
const cart = {
  productName : "",
  priceMT     : 0,
  category    : "",
  payMethod   : "mpesa",
};

/* ─── STRIPE ─── */
let stripe        = null;
let stripeElements= null;
let cardElement   = null;

function initStripe() {
  if (stripe) return;
  try {
    stripe        = Stripe(PAYMENT_CONFIG.stripePublicKey);
    stripeElements= stripe.elements();
    cardElement   = stripeElements.create("card", {
      style: {
        base: {
          color          : "#0a1628",
          fontFamily     : "'DM Sans', sans-serif",
          fontSize       : "15px",
          "::placeholder": { color: "#6a7fa8" },
        },
        invalid: { color: "#e24b4a" },
      },
    });
    cardElement.mount("#card-element");
    cardElement.on("change", (event) => {
      const display = document.getElementById("card-errors");
      display.textContent = event.error ? event.error.message : "";
    });
  } catch (e) {
    console.warn("Stripe nao inicializado:", e.message);
  }
}

/* ─── PAYPAL ─── */
let paypalLoaded = false;

function loadPayPalSDK(callback) {
  if (paypalLoaded) { if (callback) callback(); return; }
  const script  = document.createElement("script");
  script.src    = `https://www.paypal.com/sdk/js?client-id=${PAYMENT_CONFIG.paypalClientId}&currency=USD`;
  script.onload = () => {
    paypalLoaded = true;
    if (callback) callback();
  };
  script.onerror = () => {
    console.warn("PayPal SDK nao carregou. Verifique Client ID e ligacao.");
  };
  document.head.appendChild(script);
}

function renderPayPalButton() {
  const container = document.getElementById("paypal-button-container");
  container.innerHTML = "";
  const amountUSD = (cart.priceMT * PAYMENT_CONFIG.mtToUsd).toFixed(2);

  if (!window.paypal) {
    container.innerHTML = '<p style="color:var(--text-muted);font-size:13px;text-align:center;">PayPal a carregar...</p>';
    return;
  }

  window.paypal.Buttons({
    createOrder(data, actions) {
      return actions.order.create({
        purchase_units: [{
          description : cart.productName,
          amount      : { value: amountUSD, currency_code: "USD" },
        }],
      });
    },
    onApprove(data, actions) {
      return actions.order.capture().then((details) => {
        closeModal();
        showToast(`Pagamento aprovado! Obrigado, ${details.payer.name.given_name}. Codigo enviado para o seu email.`, "success");
        /* TODO: chamar backend para entregar produto */
      });
    },
    onError(err) {
      console.error("PayPal error:", err);
      showToast("Erro no pagamento PayPal. Tente novamente.", "error");
    },
    onCancel() {
      showToast("Pagamento cancelado.", "error");
    },
    style: { layout: "vertical", color: "blue", shape: "rect", label: "pay" },
  }).render("#paypal-button-container");
}

/* ─── MODAL ─── */
function openModal(name, price, cat) {
  cart.productName = name;
  cart.priceMT     = price;
  cart.category    = cat;
  cart.payMethod   = "mpesa";

  document.getElementById("modal-title").textContent = name;
  document.getElementById("modal-price").innerHTML   =
    price.toLocaleString("pt") + ' <small>MT</small>';
  document.getElementById("modal-sub").textContent   =
    "Preencha os dados para finalizar: " + name;

  /* Mostrar/ocultar campo UID */
  const uid   = document.getElementById("uid-group");
  const label = document.getElementById("uid-label");
  if (cat === "ff") {
    uid.style.display = "block";
    label.textContent = "ID do Jogador (Free Fire UID)";
  } else if (cat === "in") {
    uid.style.display = "block";
    label.textContent = "Email / Usuario da Conta Internacional";
  } else {
    uid.style.display = "none";
  }

  /* Reset metodo de pagamento */
  selectPayMethod("mpesa");

  document.getElementById("modal").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modal").classList.remove("open");
  document.body.style.overflow = "";
  document.getElementById("modal-email").value = "";
  const uid = document.getElementById("modal-uid");
  if (uid) uid.value = "";
  document.getElementById("card-errors").textContent = "";
}

/* ─── SELECAO DO METODO ─── */
function selectPayMethod(method) {
  cart.payMethod = method;

  document.querySelectorAll(".pay-method").forEach((el) =>
    el.classList.toggle("active", el.dataset.method === method)
  );

  /* Painel Stripe */
  const stripeForm = document.getElementById("stripe-form");
  const paypalBox  = document.getElementById("paypal-button-container");
  const mpesaBox   = document.getElementById("mpesa-info");
  const btnPay     = document.getElementById("btn-pay");

  stripeForm.classList.add("hidden");
  paypalBox.classList.add("hidden");
  if (mpesaBox) mpesaBox.style.display = "none";

  if (method === "stripe") {
    stripeForm.classList.remove("hidden");
    initStripe();
    btnPay.style.display = "flex";
  } else if (method === "paypal") {
    paypalBox.classList.remove("hidden");
    btnPay.style.display = "none";
    loadPayPalSDK(renderPayPalButton);
  } else {
    /* M-Pesa */
    if (mpesaBox) mpesaBox.style.display = "block";
    btnPay.style.display = "flex";
  }
}

/* ─── FINALIZAR COMPRA ─── */
async function finalizarCompra() {
  const email = document.getElementById("modal-email").value.trim();
  if (!email || !email.includes("@")) {
    showToast("Por favor insira um email valido.", "error");
    return;
  }

  if (cart.payMethod === "stripe") {
    await handleStripePayment(email);
  } else if (cart.payMethod === "mpesa") {
    handleMpesa(email);
  }
}

async function handleStripePayment(email) {
  if (!stripe || !cardElement) {
    showToast("Stripe nao esta pronto. Tente novamente.", "error");
    return;
  }

  const btn = document.getElementById("btn-pay");
  setButtonLoading(btn, true);

  /*
   * PRODUCAO: crie um PaymentIntent no seu backend:
   *   POST /api/create-payment-intent -> { clientSecret }
   * e use stripe.confirmCardPayment(clientSecret, {...})
   *
   * Em modo teste usamos createPaymentMethod para validar o cartao.
   */
  const { paymentMethod, error } = await stripe.createPaymentMethod({
    type            : "card",
    card            : cardElement,
    billing_details : { email },
  });

  setButtonLoading(btn, false);

  if (error) {
    document.getElementById("card-errors").textContent = error.message;
    return;
  }

function appendChatMessage(text, sender = "agent") {
  const container = document.getElementById("chat-messages");
  if (!container) return;
  const message = document.createElement("div");
  message.className = `chat-message ${sender}`;
  message.textContent = text;
  container.appendChild(message);
  container.scrollTop = container.scrollHeight;
}

function getSimulatedResponse(userText) {
  const lower = userText.toLowerCase();
  if (lower.includes("preço") || lower.includes("preco") || lower.includes("valor")) {
    return "Os preços estão na seção Produtos. Pergunte sobre Free Fire, Gift Cards ou Streaming para obter exemplos.";
  }
  if (lower.includes("whatsapp") || lower.includes("zap") || lower.includes("suporte")) {
    return "Clique no botão WhatsApp para abrir o chat rápido com o número +258 84 477 2002.";
  }
  if (lower.includes("pagamento") || lower.includes("cartão") || lower.includes("mpesa")) {
    return "Aceitamos M-Pesa, cartões via Stripe e PayPal. Escolha o método de pagamento no modal de compra.";
  }
  if (lower.includes("free fire") || lower.includes("diamantes")) {
    return "Temos pacotes de diamantes Free Fire visíveis na seção de produtos. Clique em Comprar para iniciar.";
  }
  return CHAT_CONFIG.simulatedResponses[Math.floor(Math.random() * CHAT_CONFIG.simulatedResponses.length)];
}

function toggleChatWidget() {
  const widget = document.getElementById("chat-widget");
  if (!widget) return;
  widget.classList.toggle("open");
  widget.setAttribute("aria-hidden", widget.classList.contains("open") ? "false" : "true");
}

function closeChatWidget() {
  const widget = document.getElementById("chat-widget");
  if (!widget) return;
  widget.classList.remove("open");
  widget.setAttribute("aria-hidden", "true");
}

function sendChatMessage() {
  const input = document.getElementById("chat-input");
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  appendChatMessage(text, "user");
  input.value = "";
  setTimeout(() => appendChatMessage(getSimulatedResponse(text), "agent"), 450);
}
 
 /* ─── FILTROS DE PRODUTO ─── */

  /* Simulacao — em producao confirmar no backend */
  console.log("PaymentMethod criado:", paymentMethod.id);
  closeModal();
  showToast("Pagamento processado! Codigo enviado para " + email, "success");
}

function handleMpesa(email) {
  /* M-Pesa em Mocambique requer integracao backend (API Vodacom MZ).
     Por agora informamos o numero para pagamento manual. */
  closeModal();
  showToast("Envie o pagamento por M-Pesa para +258 8X XXX XXXX. Codigo enviado apos confirmacao.", "success");
}

/* ─── FILTROS DE PRODUTO ─── */
function filterProd(cat, btn) {
  document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  document.querySelectorAll(".prod-card").forEach((c) => {
    c.style.display = cat === "all" || c.dataset.cat === cat ? "block" : "none";
  });
}

/* ─── UTILIDADES ─── */
function setButtonLoading(btn, loading) {
  const spinner = btn.querySelector(".spinner");
  btn.disabled  = loading;
  if (spinner) spinner.style.display = loading ? "inline-block" : "none";
  btn.querySelector(".btn-label").textContent = loading ? "A processar..." : "Finalizar Compra";
}

function showToast(msg, type = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.className   = `toast ${type}`;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 4500);
}

/* ─── EVENTOS ─── */
document.addEventListener("DOMContentLoaded", () => {
  /* Fechar modal ao clicar fora */
  document.getElementById("modal").addEventListener("click", (e) => {
    if (e.target === document.getElementById("modal")) closeModal();
  });

  /* Tecla Escape fecha modal */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
});
cat > /mnt/user-data/outputs/js/app.js << 'JSEOF'
/* =============================================
   TEN DIGITAL MZ — app.js  v2
   Registro, Login, PayPal, Stripe, Free Fire
   ============================================= */
"use strict";

/* ─── CONFIG ─── */
const CFG = {
  paypalClientId : "AbG0xPOzmsbEtMdqw9H9TswqIcTtT8P61xnJIX3KU_epOQyyKwK-VEJcZZXOe-YH7anyayKDmhCvXfUq",
  stripeKey      : "rk_test_51RkOpJCexzLim5xuOlvct08qFjgjMHq9uapRYvbm904Qdl7uNjIdxD7c2Y7PxBd2adX8mfO35DLFzOoRpSLsquFU004sPAaGhZ",
  mtToUsd        : 0.016,
};

/* ─── ESTADO ─── */
const cart = { name:"", price:0, cat:"", method:"mpesa" };

/* ─── USUARIOS (localStorage como DB simples) ─── */
function getUsers() {
  try { return JSON.parse(localStorage.getItem("tdmz_users")||"[]"); } catch(e){return[];}
}
function saveUsers(u){ localStorage.setItem("tdmz_users", JSON.stringify(u)); }
function getCurrentUser(){
  try { return JSON.parse(localStorage.getItem("tdmz_current")||"null"); } catch(e){return null;}
}
function setCurrentUser(u){ localStorage.setItem("tdmz_current", JSON.stringify(u)); }
function clearCurrentUser(){ localStorage.removeItem("tdmz_current"); }

/* ─── NAV: actualizar UI conforme auth ─── */
function updateNavAuth(){
  const user = getCurrentUser();
  const guest = document.getElementById("nav-guest");
  const pill  = document.getElementById("nav-user");
  if(user){
    guest.style.display = "none";
    pill.classList.add("show");
    document.getElementById("nav-avatar").textContent   = (user.nome||"U")[0].toUpperCase();
    document.getElementById("nav-username").textContent = user.nome||user.email;
  } else {
    guest.style.display = "flex";
    pill.classList.remove("show");
  }
}

function logout(){
  clearCurrentUser();
  updateNavAuth();
  showToast("Sessao terminada. Ate logo!", "success");
}

/* ─── AUTH MODAL ─── */
function openAuth(tab){
  document.getElementById("modal-auth").classList.add("open");
  document.body.style.overflow = "hidden";
  switchAuthTab(tab||"login");
}
function closeAuth(){
  document.getElementById("modal-auth").classList.remove("open");
  document.body.style.overflow = "";
}
function switchAuthTab(tab){
  ["login","register"].forEach(t=>{
    document.getElementById("tab-"+t).classList.toggle("active", t===tab);
    document.getElementById("panel-"+t).classList.toggle("active", t===tab);
  });
}

function doLogin(){
  const email = document.getElementById("login-email").value.trim();
  const pass  = document.getElementById("login-pass").value;
  const err   = document.getElementById("login-err");
  err.classList.remove("show");
  const users = getUsers();
  const user  = users.find(u => u.email===email && u.pass===btoa(pass));
  if(!user){ err.classList.add("show"); return; }
  setCurrentUser(user);
  closeAuth();
  updateNavAuth();
  showToast("Bem-vindo de volta, "+user.nome+"!", "success");
}

function doRegister(){
  const nome    = document.getElementById("reg-nome").value.trim();
  const apelido = document.getElementById("reg-apelido").value.trim();
  const email   = document.getElementById("reg-email").value.trim();
  const tel     = document.getElementById("reg-tel").value.trim();
  const pass    = document.getElementById("reg-pass").value;
  const pass2   = document.getElementById("reg-pass2").value;
  const err     = document.getElementById("reg-err");
  err.classList.remove("show");
  err.textContent = "Este email ja esta em uso.";

  if(!nome||!email||!pass){ err.textContent="Preencha todos os campos obrigatorios."; err.classList.add("show"); return; }
  if(pass.length<6){ err.textContent="Password deve ter pelo menos 6 caracteres."; err.classList.add("show"); return; }
  if(pass!==pass2){ err.textContent="As passwords nao coincidem."; err.classList.add("show"); return; }

  const users = getUsers();
  if(users.find(u=>u.email===email)){ err.classList.add("show"); return; }

  const newUser = { id: Date.now(), nome, apelido, email, tel, pass: btoa(pass), createdAt: new Date().toISOString() };
  users.push(newUser);
  saveUsers(users);
  setCurrentUser(newUser);
  closeAuth();
  updateNavAuth();
  showToast("Conta criada! Bem-vindo, "+nome+"!", "success");
}

/* ─── MODAL COMPRA ─── */
function openModal(name, price, cat){
  const user = getCurrentUser();
  if(!user){ openAuth("login"); showToast("Entre ou crie conta para comprar.", "error"); return; }

  cart.name  = name;
  cart.price = price;
  cart.cat   = cat;
  cart.method= "mpesa";

  document.getElementById("modal-title").textContent           = name;
  document.getElementById("modal-price-display").innerHTML     = price.toLocaleString("pt")+" <small>MT</small>";
  document.getElementById("modal-sub").textContent             = "Produto: "+name;
  document.getElementById("modal-email").value                 = user.email||"";

  const uid   = document.getElementById("uid-group");
  const label = document.getElementById("uid-label");
  if(cat==="ff"){ uid.style.display="block"; label.textContent="ID do Jogador (Free Fire UID)"; }
  else if(cat==="in"){ uid.style.display="block"; label.textContent="Email / Usuario da Conta Internacional"; }
  else { uid.style.display="none"; }

  // Reset
  document.getElementById("buy-step1").style.display = "block";
  document.getElementById("buy-step2").style.display = "none";
  selectPayMethod("mpesa");

  document.getElementById("modal-buy").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeBuyModal(){
  document.getElementById("modal-buy").classList.remove("open");
  document.body.style.overflow = "";
  document.getElementById("modal-uid").value   = "";
  document.getElementById("card-errors").textContent = "";
}

/* ─── SELECAO METODO ─── */
function selectPayMethod(m){
  cart.method = m;
  document.querySelectorAll(".pay-method").forEach(el=>el.classList.toggle("active", el.dataset.method===m));
  document.getElementById("stripe-form").classList.add("hidden");
  document.getElementById("paypal-button-container").classList.add("hidden");
  document.getElementById("mpesa-info").classList.add("hidden");
  document.getElementById("btn-pay").style.display = "flex";

  if(m==="stripe"){ document.getElementById("stripe-form").classList.remove("hidden"); initStripe(); }
  else if(m==="paypal"){ document.getElementById("paypal-button-container").classList.remove("hidden"); document.getElementById("btn-pay").style.display="none"; loadPayPal(renderPayPal); }
  else { document.getElementById("mpesa-info").classList.remove("hidden"); }
}

/* ─── STRIPE ─── */
let stripe=null, cardEl=null;
function initStripe(){
  if(stripe) return;
  try{
    stripe = Stripe(CFG.stripeKey);
    const els = stripe.elements();
    cardEl = els.create("card",{style:{base:{color:"#0a1628",fontFamily:"'DM Sans',sans-serif",fontSize:"14px","::placeholder":{color:"#6a7fa8"}},invalid:{color:"#e24b4a"}}});
    cardEl.mount("#card-element");
    cardEl.on("change",e=>{ document.getElementById("card-errors").textContent = e.error?e.error.message:""; });
  }catch(e){ console.warn("Stripe:",e.message); }
}

/* ─── PAYPAL ─── */
let ppLoaded=false;
function loadPayPal(cb){
  if(ppLoaded){ cb&&cb(); return; }
  const s=document.createElement("script");
  s.src=`https://www.paypal.com/sdk/js?client-id=${CFG.paypalClientId}&currency=USD`;
  s.onload=()=>{ ppLoaded=true; cb&&cb(); };
  s.onerror=()=>showToast("PayPal nao carregou. Verifique a ligacao.","error");
  document.head.appendChild(s);
}
function renderPayPal(){
  const c=document.getElementById("paypal-button-container"); c.innerHTML="";
  if(!window.paypal){ c.innerHTML='<p style="font-size:12px;color:var(--muted);text-align:center">PayPal a carregar...</p>'; return; }
  const usd=(cart.price*CFG.mtToUsd).toFixed(2);
  window.paypal.Buttons({
    createOrder:(_,a)=>a.order.create({purchase_units:[{description:cart.name,amount:{value:usd,currency_code:"USD"}}]}),
    onApprove:(_,a)=>a.order.capture().then(d=>{ closeBuyModal(); showSuccess(cart.cat, d.payer.email_address||getCurrentUser().email); }),
    onError:e=>{ console.error(e); showToast("Erro PayPal. Tente novamente.","error"); },
    onCancel:()=>showToast("Pagamento cancelado.","error"),
    style:{layout:"vertical",color:"blue",shape:"rect",label:"pay"},
  }).render("#paypal-button-container");
}

/* ─── FINALIZAR ─── */
async function finalizarCompra(){
  const email = document.getElementById("modal-email").value.trim();
  if(!email||!email.includes("@")){ showToast("Insira um email valido.","error"); return; }

  if(cart.method==="stripe"){
    if(!stripe||!cardEl){ showToast("Stripe nao pronto. Tente novamente.","error"); return; }
    const btn=document.getElementById("btn-pay");
    setBtnLoading(btn,true);
    const{paymentMethod,error}=await stripe.createPaymentMethod({type:"card",card:cardEl,billing_details:{email}});
    setBtnLoading(btn,false);
    if(error){ document.getElementById("card-errors").textContent=error.message; return; }
    console.log("PM:",paymentMethod.id);
    closeBuyModal();
    showSuccess(cart.cat, email);
  } else if(cart.method==="mpesa"){
    closeBuyModal();
    showSuccess(cart.cat, email);
  }
}

function setBtnLoading(btn,on){
  btn.disabled=on;
  btn.querySelector(".btn-label").textContent = on?"A processar...":"Confirmar Compra";
  btn.querySelector(".spinner").style.display = on?"inline-block":"none";
}

/* ─── SUCESSO + CODIGO FF ─── */
function showSuccess(cat, email){
  if(cat==="ff"){
    // Gera codigo de demonstracao (em producao viria do backend)
    const code = generateCode();
    document.getElementById("modal-buy").classList.add("open");
    document.getElementById("buy-step1").style.display = "none";
    document.getElementById("buy-step2").style.display = "block";
    document.getElementById("success-msg").textContent  = "Compra confirmada! Copia o codigo abaixo e resgata em shop.garena.sg";
    document.getElementById("redemption-box").style.display = "block";
    document.getElementById("redemption-code").textContent  = code;
    document.getElementById("success-email-note").textContent = "Codigo tambem enviado para: "+email;
    document.getElementById("copied-ok").style.display="none";
  } else {
    showToast("Compra confirmada! Codigo enviado para "+email, "success");
    setTimeout(()=>{ document.getElementById("modal-buy").classList.remove("open"); document.body.style.overflow=""; }, 300);
  }
}

function generateCode(){
  const chars="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let c="";
  for(let i=0;i<16;i++){ c+=chars[Math.floor(Math.random()*chars.length)]; if((i+1)%4===0&&i<15)c+="-"; }
  return c;
}

function copyCode(){
  const code = document.getElementById("redemption-code").textContent;
  if(navigator.clipboard){
    navigator.clipboard.writeText(code).then(()=>{ document.getElementById("copied-ok").style.display="inline"; });
  } else {
    const ta=document.createElement("textarea"); ta.value=code; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta);
    document.getElementById("copied-ok").style.display="inline";
  }
}

/* ─── FILTRO PRODUTOS ─── */
function filterProd(cat, btn){
  document.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
  document.querySelectorAll(".prod-card").forEach(c=>{ c.style.display=(cat==="all"||c.dataset.cat===cat)?"block":"none"; });
}

/* ─── TOAST ─── */
function showToast(msg, type="success"){
  const t=document.getElementById("toast");
  t.textContent=msg; t.className="toast "+type; t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"), 4200);
}

/* ─── INIT ─── */
document.addEventListener("DOMContentLoaded",()=>{
  updateNavAuth();
  // Fechar modais ao clicar fora
  document.getElementById("modal-buy").addEventListener("click",e=>{ if(e.target===document.getElementById("modal-buy")) closeBuyModal(); });
  document.getElementById("modal-auth").addEventListener("click",e=>{ if(e.target===document.getElementById("modal-auth")) closeAuth(); });
  document.addEventListener("keydown",e=>{ if(e.key==="Escape"){ closeBuyModal(); closeAuth(); } });
});
