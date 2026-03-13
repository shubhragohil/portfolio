// typing animation

const text = [
"Python Developer",
"Computer Vision Enthusiast",
"Web Developer",
"DSA Learner"
];

let count = 0;
let index = 0;
let currentText = "";
let letter = "";

function type(){

if(count === text.length){
count = 0;
}

currentText = text[count];
letter = currentText.slice(0, ++index);

document.querySelector(".typing").textContent = letter;

if(letter.length === currentText.length){
count++;
index = 0;
}

setTimeout(type,120);
}

type();


// star background

const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars=[];

for(let i=0;i<200;i++){
stars.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
size:Math.random()*2,
speed:Math.random()*1
});
}

function drawStars(){

ctx.clearRect(0,0,canvas.width,canvas.height);

ctx.fillStyle="white";

stars.forEach(star=>{

ctx.beginPath();
ctx.arc(star.x,star.y,star.size,0,Math.PI*2);
ctx.fill();

star.y+=star.speed;

if(star.y>canvas.height){
star.y=0;
star.x=Math.random()*canvas.width;
}

});

requestAnimationFrame(drawStars);

}

drawStars();


// GSAP scroll animation

gsap.from("section",{
opacity:0,
y:80,
duration:1,
stagger:0.3
});