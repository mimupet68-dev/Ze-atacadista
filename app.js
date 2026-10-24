import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const cfg=window.ZE_CONFIG||{};
const connected=Boolean(cfg.SUPABASE_URL&&cfg.SUPABASE_ANON_KEY);
const db=connected?createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY):null;
const demo=[
{id:"d1",name:"Ração para cães (exemplo)",description:"Produto demonstrativo — substitua pelo seu estoque.",price:89.90,category:"Rações",emoji:"🐶",active:true},
{id:"d2",name:"Areia higiênica (exemplo)",description:"Produto demonstrativo — substitua pelo seu estoque.",price:24.90,category:"Gatos",emoji:"🐱",active:true},
{id:"d3",name:"Brinquedo pet (exemplo)",description:"Produto demonstrativo — substitua pelo seu estoque.",price:14.90,category:"Acessórios",emoji:"🦴",active:true}
];
let products=[],cart=[];
const money=n=>Number(n||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const el=id=>document.getElementById(id);
el("year").textContent=new Date().getFullYear();
function render(list){products=list;const q=el("search").value.toLowerCase();const visible=list.filter(p=>(p.name+" "+(p.description||"")+" "+(p.category||"")).toLowerCase().includes(q));el("products").innerHTML=visible.map(p=>`<article class="product"><div class="emoji">${esc(p.emoji||"🐾")}</div><h3>${esc(p.name)}</h3><p>${esc(p.description||"")}</p><div class="price">${money(p.price)}</div><button data-add="${esc(p.id)}">Adicionar ao carrinho</button></article>`).join("")||"<p>Nenhum produto encontrado.</p>";el("status").textContent=connected?"Produtos online":"Modo demonstração — banco ainda não configurado";document.querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>add(b.dataset.add));}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
async function load(){if(!db){render(demo);return}const {data,error}=await db.from("products").select("id,name,description,price,category,emoji,active").eq("active",true).order("name");if(error){el("status").textContent="Não foi possível carregar o catálogo online";render(demo);return}render(data||[]);}
function add(id){const p=products.find(x=>String(x.id)===String(id));if(!p)return;const row=cart.find(x=>String(x.id)===String(id));row?row.qty++:cart.push({...p,qty:1});drawCart();}
function drawCart(){el("cartCount").textContent=cart.reduce((a,x)=>a+x.qty,0);el("cartItems").innerHTML=cart.map(p=>`<div class="cartrow"><span>${esc(p.name)} × ${p.qty}</span><span>${money(p.price*p.qty)} <button data-remove="${esc(p.id)}">−</button></span></div>`).join("")||"<p>Seu carrinho está vazio.</p>";el("total").textContent=money(cart.reduce((a,p)=>a+p.price*p.qty,0));document.querySelectorAll("[data-remove]").forEach(b=>b.onclick=()=>{const p=cart.find(x=>String(x.id)===b.dataset.remove);if(p&&--p.qty<=0)cart=cart.filter(x=>x!==p);drawCart();});}
el("search").addEventListener("input",()=>render(products));el("cartBtn").onclick=()=>el("cartPanel").classList.remove("hidden");el("closeCart").onclick=()=>el("cartPanel").classList.add("hidden");
el("orderForm").addEventListener("submit",async e=>{e.preventDefault();if(!cart.length){alert("Adicione pelo menos um produto.");return}if(!db){alert("A loja ainda está em modo demonstração. Configure o banco online antes de receber pedidos reais.");return}const f=new FormData(e.currentTarget);const payload={customer_name:f.get("customer_name"),phone:f.get("phone"),notes:f.get("notes"),items:cart.map(p=>({product_id:p.id,name:p.name,unit_price:p.price,quantity:p.qty})),total:cart.reduce((a,p)=>a+p.price*p.qty,0),status:"novo"};const {error}=await db.from("orders").insert(payload);if(error){alert("Não foi possível registrar o pedido. Tente novamente ou entre em contato com a loja.");return}alert("Pedido registrado! A loja entrará em contato para confirmar.");cart=[];drawCart();e.currentTarget.reset();el("cartPanel").classList.add("hidden");});
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("/sw.js").catch(()=>{}));
load();drawCart();