'use strict';

// Make navbar transparent when it is on the top
const navbar = document.querySelector('#navbar');
const navbarHeight = navbar.getBoundingClientRect().height;
document.addEventListener('scroll', ()=>{
    if(window.scrollY > navbarHeight){
        navbar.classList.add('navbar-dark');
    } else {
        navbar.classList.remove('navbar-dark');
    }

});

// Handle scrolling when tapping on th navbar menu

const navbarMenu = document.querySelector('.navbar_menu');

navbarMenu.addEventListener('click', (event) => {
    const target = event.target;
    const link = target.dataset.link;
    if(link == null){
        return;
    }
    scrollIntoView(link);
});


//Handle scrolling when tapping on the contact button on home
const homeContactBtn= document.querySelector('.home_contact');

homeContactBtn.addEventListener('click', ()=>{
    scrollIntoView('#contact');
});

// Make home slowly fade to transparent as the window scrolls down


const home = document.querySelector('.home_contents');
const homeHeight = home.getBoundingClientRect().height;
document.addEventListener('scroll', ()=>{
    home.style.opacity = 1 - window.scrollY / homeHeight;
});

//Show "arrow up"button when scrolling down
const arrowUp = document.querySelector('.arrow-up')
document.addEventListener('scroll',()=> {
    if(window.scrollY > homeHeight / 2){
        arrowUp.classList.add('visible');
    } else {
        arrowUp.classList.remove('visible');
    }
});

//Handle click on the "arrow up" button
arrowUp.addEventListener('click', () => {
    window.scrollTo({top:0, left:0, behavior:'smooth'})

})

function scrollIntoView(selector){
    const scrollTo = document.querySelector(selector);
    scrollTo.scrollIntoView({ behavior: 'smooth'});
};

