
"use strict";

document.addEventListener("DOMContentLoaded",()=>{

const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];

const header=$("#header");
const navigation=$("#navigation");
const menuToggle=$("#menuToggle");
const navLinks=$$(".nav-link");
const planButtons=$$(".plan-toggle-button");
const lightbox=$("#lightbox");
const lightboxDialog=$(".lightbox-dialog",lightbox);
const lightboxImage=$("#lightboxImage");
const lightboxCounter=$("#lightboxCounter");
const lightboxClose=$("#lightboxClose");
const galleryButtons=$$("[data-gallery]");
const imcForm=$("#imcForm");
const imcResult=$("#imcResult");
const imcValue=$("#imcValue");
const imcClassification=$("#imcClassification");
const contactButton=$("#contactDemoButton");
const contactFeedback=$("#contactFeedback");

const currentYear=$("#currentYear");
if(currentYear){
currentYear.textContent=new Date().getFullYear();
}

// CABEÇALHO
function updateHeader(){
header?.classList.toggle("scrolled",window.scrollY>50);
}

updateHeader();

window.addEventListener("scroll",updateHeader,{
passive:true
});

// MENU MOBILE
function closeMenu(){
if(!navigation||!menuToggle)return;

navigation.classList.remove("open");
menuToggle.setAttribute("aria-expanded","false");
menuToggle.setAttribute("aria-label","Abrir menu");
}

menuToggle?.addEventListener("click",()=>{
if(!navigation)return;

const opened=navigation.classList.toggle("open");

menuToggle.setAttribute("aria-expanded",String(opened));
menuToggle.setAttribute(
"aria-label",
opened?"Fechar menu":"Abrir menu"
);
});

$$(".navigation a").forEach(link=>{
link.addEventListener("click",closeMenu);
});

document.addEventListener("click",event=>{
if(
navigation?.classList.contains("open")&&
!navigation.contains(event.target)&&
!menuToggle?.contains(event.target)
){
closeMenu();
}
});

window.addEventListener("resize",()=>{
if(window.innerWidth>1000){
closeMenu();
}
});

// NAVEGAÇÃO ATIVA
if("IntersectionObserver" in window){
const sections=$$("main section[id]");

const sectionObserver=new IntersectionObserver(entries=>{
entries.forEach(entry=>{
if(!entry.isIntersecting)return;

navLinks.forEach(link=>{
const active=link.getAttribute("href")===
`#${entry.target.id}`;

link.classList.toggle("active",active);
});
});
},{
rootMargin:"-25% 0px -60% 0px",
threshold:0
});

sections.forEach(section=>{
sectionObserver.observe(section);
});
}

// ANIMAÇÕES DE ENTRADA
const revealElements=$$(".reveal");

const reducedMotion=window.matchMedia(
"(prefers-reduced-motion: reduce)"
).matches;

if(!reducedMotion&&"IntersectionObserver" in window){

const revealObserver=new IntersectionObserver(
(entries,observer)=>{
entries.forEach(entry=>{
if(!entry.isIntersecting)return;

entry.target.classList.add("visible");
observer.unobserve(entry.target);
});
},{
threshold:0.08,
rootMargin:"0px 0px -25px 0px"
}
);

revealElements.forEach(element=>{
revealObserver.observe(element);
});

document.documentElement.classList.add("js-ready");

}else{
revealElements.forEach(element=>{
element.classList.add("visible");
});
}

// PLANOS INTERATIVOS
const plans={
online:[
{
name:"Start",
description:"Uma estrutura inicial para organizar a rotina de treinamento.",
features:[
"Planejamento individualizado",
"Organização da rotina",
"Orientações gerais"
]
},
{
name:"Progress",
description:"Um conceito de acompanhamento remoto com revisões periódicas.",
features:[
"Planejamento individualizado",
"Acompanhamento periódico",
"Revisões do planejamento"
]
},
{
name:"Performance",
description:"Uma proposta abrangente de consultoria e acompanhamento online.",
features:[
"Planejamento individualizado",
"Revisões periódicas",
"Suporte ampliado"
]
}
],
presencial:[
{
name:"Essential",
description:"Uma proposta de acompanhamento presencial para desenvolver uma rotina de exercícios.",
features:[
"Orientação durante as sessões",
"Organização dos treinos",
"Atenção à execução"
]
},
{
name:"Evolution",
description:"Acompanhamento presencial estruturado, com atenção à técnica e à progressão.",
features:[
"Sessões orientadas",
"Acompanhamento da execução",
"Revisões do planejamento"
]
},
{
name:"Exclusive",
description:"Um conceito de acompanhamento individual com planejamento e revisões.",
features:[
"Planejamento individualizado",
"Orientação presencial",
"Acompanhamento ampliado"
]
}
]
};

function updatePlans(mode){
const selected=plans[mode];
if(!selected)return;

planButtons.forEach(button=>{
const active=button.dataset.mode===mode;

button.classList.toggle("active",active);
button.setAttribute("aria-pressed",String(active));
});

selected.forEach((plan,index)=>{
const number=index+1;

const name=$(`#planName${number}`);
const description=$(`#planDescription${number}`);
const features=$(`#planFeatures${number}`);

if(name)name.textContent=plan.name;

if(description){
description.textContent=plan.description;
}

if(features){
features.replaceChildren();

plan.features.forEach(feature=>{
const item=document.createElement("li");
item.textContent=feature;
features.appendChild(item);
});
}
});
}

planButtons.forEach(button=>{
button.addEventListener("click",()=>{
updatePlans(button.dataset.mode);
});
});

// GALERIA INTERATIVA
const gallery=galleryButtons.map(button=>{
const image=$("img",button);

return{
src:image?.src||"",
alt:image?.alt||"Fotografia ilustrativa de treinamento"
};
});

let galleryIndex=0;
let previousFocus=null;

function showGalleryImage(index){
if(!gallery.length||!lightboxImage)return;

galleryIndex=(index+gallery.length)%gallery.length;

const item=gallery[galleryIndex];

lightboxImage.src=item.src;
lightboxImage.alt=item.alt;

if(lightboxCounter){
lightboxCounter.textContent=
`${String(galleryIndex+1).padStart(2,"0")} / ${String(gallery.length).padStart(2,"0")}`;
}
}

function openLightbox(index){
if(!lightbox||!gallery.length)return;

previousFocus=document.activeElement;

showGalleryImage(index);

lightbox.classList.add("is-open");
lightbox.setAttribute("aria-hidden","false");

document.body.classList.add("lightbox-open");

lightboxClose?.focus();
}

function closeLightbox(){
if(!lightbox?.classList.contains("is-open"))return;

lightbox.classList.remove("is-open");
lightbox.setAttribute("aria-hidden","true");

document.body.classList.remove("lightbox-open");

if(lightboxImage){
lightboxImage.removeAttribute("src");
}

if(
previousFocus instanceof HTMLElement&&
previousFocus.isConnected
){
previousFocus.focus();
}

previousFocus=null;
}

galleryButtons.forEach((button,index)=>{
button.addEventListener("click",()=>{
openLightbox(index);
});
});

lightboxClose?.addEventListener("click",closeLightbox);

$$("[data-close-lightbox]").forEach(element=>{
element.addEventListener("click",closeLightbox);
});

$("#lightboxPrevious")?.addEventListener("click",()=>{
showGalleryImage(galleryIndex-1);
});

$("#lightboxNext")?.addEventListener("click",()=>{
showGalleryImage(galleryIndex+1);
});

// ACESSIBILIDADE DA GALERIA
document.addEventListener("keydown",event=>{

if(event.key==="Escape"){
closeMenu();
closeLightbox();
return;
}

if(!lightbox?.classList.contains("is-open"))return;

if(event.key==="ArrowRight"){
event.preventDefault();
showGalleryImage(galleryIndex+1);
}

if(event.key==="ArrowLeft"){
event.preventDefault();
showGalleryImage(galleryIndex-1);
}

if(event.key==="Tab"&&lightboxDialog){

const focusable=$$(
'button:not([disabled]),a[href],[tabindex="0"]',
lightboxDialog
).filter(element=>element.getClientRects().length>0);

if(!focusable.length){
event.preventDefault();
lightboxDialog.focus();
return;
}

const first=focusable[0];
const last=focusable[focusable.length-1];

if(event.shiftKey&&document.activeElement===first){
event.preventDefault();
last.focus();
}else if(
!event.shiftKey&&
document.activeElement===last
){
event.preventDefault();
first.focus();
}
}
});

// CALCULADORA DE IMC
function calculateIMC(weight,height){
const heightMeters=height/100;

return weight/(heightMeters*heightMeters);
}

function classifyIMC(value){
if(value<18.5){
return"Faixa de IMC abaixo de 18,5.";
}

if(value<25){
return"Faixa de IMC entre 18,5 e 24,9.";
}

if(value<30){
return"Faixa de IMC entre 25 e 29,9.";
}

return"Faixa de IMC igual ou superior a 30.";
}

imcForm?.addEventListener("submit",event=>{
event.preventDefault();

const weightInput=$("#weight");
const heightInput=$("#height");

const weight=Number(weightInput?.value);
const height=Number(heightInput?.value);

if(
!weightInput?.value||
!heightInput?.value||
!Number.isFinite(weight)||
!Number.isFinite(height)||
weight<20||
weight>350||
height<100||
height>250
){
if(imcResult&&imcClassification&&imcValue){
imcResult.hidden=false;
imcValue.textContent="--";
imcClassification.textContent=
"Informe um peso entre 20 e 350 kg e uma altura entre 100 e 250 cm.";
}
return;
}

const imc=calculateIMC(weight,height);

if(imcResult&&imcValue&&imcClassification){
imcResult.hidden=false;

imcValue.textContent=imc.toLocaleString("pt-BR",{
minimumFractionDigits:1,
maximumFractionDigits:1
});

imcClassification.textContent=
`${classifyIMC(imc)} O IMC não distingue massa muscular de gordura corporal e não determina, isoladamente, o estado de saúde.`;
}
});

// CONTATO DEMONSTRATIVO
contactButton?.addEventListener("click",()=>{
if(!contactFeedback)return;

contactFeedback.textContent=
"Esta é uma demonstração de interface. Em um site real, este botão poderia abrir o WhatsApp profissional do personal trainer. Nenhuma mensagem foi enviada.";
});

// FAQ
const faqItems=$$(".faq-item");

faqItems.forEach(item=>{
item.addEventListener("toggle",()=>{
if(!item.open)return;

faqItems.forEach(other=>{
if(other!==item){
other.open=false;
}
});
});
});

// MONITORAMENTO DE IMAGENS
$$("img").forEach(image=>{
image.addEventListener("error",()=>{
console.warn(
"Imagem indisponível:",
image.currentSrc||image.src
);
});
});

});
