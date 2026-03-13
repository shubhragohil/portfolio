const words = [
"Software Developer",
"Comptetive Coding",
"Cloud Engineer"
];

let i = 0;
let j = 0;
let current = "";
let isDeleting = false;

function type(){

current = words[i];
let display = current.substring(0,j);

document.querySelector(".typing").textContent = display;

if(!isDeleting){
j++;
if(j > current.length){
isDeleting = true;
setTimeout(type,1000);
return;
}
}
else{
j--;
if(j === 0){
isDeleting = false;
i++;
if(i === words.length){
i = 0;
}
}
}

setTimeout(type,100);
}

type();
