'use strict';
const about = document.querySelector('#about');
const aboutHeight = about.getBoundingClientRect().height;
document.addEventListener('scroll', ()=>{
    if(window.scrollY > aboutHeight/10){
        about.classList.add('about-show');
    } else {
        about.classList.remove('about-show');
    }

});



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

//Navbar toggle button for small screen
const navbarToggleBtn = document.querySelector('.navbar_toggle-btn');
navbarToggleBtn.addEventListener
('click', () => {
    console.log("hello");
    navbarMenu.classList.toggle('open');
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
    /* remove navbarMenu when if scrolling*/
    navbarMenu.classList.remove('open');
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
    scrollIntoView('#home');
});

// Handle projects  when tapping on th work_categoris
const workBtnContainer = document.querySelector('.work_categories');
const projectContainter = document.querySelector('.work_projects');
const projects = document.querySelectorAll('.project'); 
workBtnContainer.addEventListener('click', (event) => {
    const filter = event.target.dataset.filter || event.target.parentNode.dataset.filter;
    if(filter == null){
        return;
    }
    //Remove selection from the previous item and select the new one
    const active = document.querySelector('.category_btn.selected');
    active.classList.remove('selected');
    //const target = e.target.nodeName === 'BUTTON' ? e.target: e.target.parentNode;
    if(event.target.dataset.filter == null){
        event.target.parentNode.classList.add('selected');
    }
    else{
        event.target.classList.add('selected');
    }
    projectContainter.classList.add('anim-out');
    setTimeout(() => {
    projects.forEach((project) =>{
        if ( filter === '*' || filter === project.dataset.type)
        {
            /*project.style.display = 'block';*/
            project.classList.remove('invisible');
        }
        else{
            /*project.style.display = 'none';*/
            project.classList.add('invisible');
        }
    });
    projectContainter.classList.remove('anim-out');
    }, 300);

    /*
    위와 같다.
    for(let project of projects) {

    }

    let project;
    for(let i = 0; i < projects.length ; i++) {
        project = projects[i];
    }

    console.log(filter);
    */ 
    
});

//Activate the menu when scrolling.
const sectionIds = [
    '#home',
    '#about',
    '#skills',
    '#work',
    '#testimonials',
    '#git',
    '#contact',
];
const sections = sectionIds.map(id => document.querySelector(id));
const navItems = sectionIds.map(id => document.querySelector(`[data-link="${id}"]`));

let selectedNavIndex = 0;
let selectedNavItem = navItems[0];
function selectNavItem(selected){
    selectedNavItem.classList.remove('active');
    selectedNavItem = selected;
    selectedNavItem.classList.add('active');
}
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3,
}

const observerCallback = (entries,observer) => {
    entries.forEach(entry => {
        if(!entry.isIntersecting && entry.intersectionRatio > 0){
            const index = sectionIds.indexOf(`#${entry.target.id}`);
            //스크롤이 아래로
            if(entry.boundingClientRect.y <0){
                selectedNavIndex = index +1;
            } else{
                selectedNavIndex = index -1; 
            }
        }
    });
};
const observer = new IntersectionObserver(observerCallback, observerOptions);

sections.forEach(section => observer.observe(section));

window.addEventListener('wheel', () => {

    if (window.scrollY === 0) {
        selectedNavIndex = 0;
    } else if (Math.round(window.scrollY + window.innerHeight) >= document.body.clientHeight) {
        selectedNavIndex = navItems.length -1
    }
    selectNavItem(navItems[selectedNavIndex]);
});


const description = document.querySelector('.home_description');
setTimeout(() => {
    description.classList.add('show');
    }, 1000);


function scrollIntoView(selector){
    const scrollTo = document.querySelector(selector);
    scrollTo.scrollIntoView({ behavior: 'smooth'});
    selectNavItem(navItems[sectionIds.indexOf(selector)]);
};

