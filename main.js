'use strict';
//is mobile?
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
let a =0;
const home_ = document.querySelector('#home');
//const summary = document.querySelector('#summary');
const about = document.querySelector('#about');
const skills = document.querySelector('#skills');
const work = document.querySelector('#work');
const testimonials = document.querySelector('#testimonials');
const git = document.querySelector('#git');

const home_Height = home_.getBoundingClientRect().height;
//const summaryHeight = summary.getBoundingClientRect().height;
const aboutHeight = about.getBoundingClientRect().height;
const skillsHeight = skills.getBoundingClientRect().height;
const workHeight = work.getBoundingClientRect().height;
const testimonialsHeight = testimonials.getBoundingClientRect().height;
const gitHeight = git.getBoundingClientRect().height;
console.log("Hegiht");
console.log(home_Height);
console.log(skillsHeight);
let work_height=1;
    document.addEventListener('scroll', ()=>{
        if(a==0 && isMobile()){
            console.log('mobile');
            //summary.remove();
            if(window.scrollY > (home_Height/6)){
                
                about.classList.add('show-ani');
                
            } else {
                about.classList.remove('show-ani');
            }
            
            if(window.scrollY > homeHeight+(aboutHeight*(0.70))){
                //console.log("skills")
                skills.classList.add('show-ani');
            } else {
                skills.classList.remove('show-ani');
            }

            if(window.scrollY > homeHeight+aboutHeight+(skillsHeight*(5/6))){
                //console.log("skills")
                work.classList.add('show-ani');
            } else {
                work.classList.remove('show-ani');
            }

            if(window.scrollY > homeHeight+aboutHeight+skillsHeight+(workHeight*(0.88))){
                //console.log("skills")
                testimonials.classList.add('show-ani');
            } else {
                testimonials.classList.remove('show-ani');
            }
            if(work_height == 1){
                if(window.scrollY > homeHeight+aboutHeight+skillsHeight+(workHeight*(9/10))){
                    //console.log("skills")
                    git.classList.add('show-ani');
                } else {
                    git.classList.remove('show-ani');
                }
            }
            else if(work_height == 2){
                if(window.scrollY > homeHeight+aboutHeight+skillsHeight+(workHeight*(0.47))){
                    //console.log("skills")
                    git.classList.add('show-ani');
                } else {
                    git.classList.remove('show-ani');
                }
            }
            else if(work_height == 3){
                if(window.scrollY > homeHeight+aboutHeight+skillsHeight+(workHeight*(0.35))){
                    //console.log("skills")
                    git.classList.add('show-ani');
                } else {
                    git.classList.remove('show-ani');
                }
            }
            else if(work_height == 4){
                if(window.scrollY > homeHeight+aboutHeight+skillsHeight+(workHeight*(1/6))){
                    //console.log("skills")
                    git.classList.add('show-ani');
                } else {
                    git.classList.remove('show-ani');
                }
            }
        }
        else if(a==0 && !(isMobile())){
            console.log('mobileX');
            if(window.scrollY > (home_Height/6)){
                
                about.classList.add('show-ani');
                
            } else {
                about.classList.remove('show-ani');
            }
            
            if(window.scrollY > homeHeight+(aboutHeight*(1/4))){
                //console.log("skills")
                skills.classList.add('show-ani');
            } else {
                skills.classList.remove('show-ani');
            }

            if(window.scrollY > homeHeight+aboutHeight+(skillsHeight*(1/4))){
                //console.log("skills")
                work.classList.add('show-ani');
            } else {
                work.classList.remove('show-ani');
            }

            if(window.scrollY > homeHeight+aboutHeight+skillsHeight+(workHeight*(3/4))){
                //console.log("skills")
                testimonials.classList.add('show-ani');
            } else {
                testimonials.classList.remove('show-ani');
            }

            if(work_height == 1){
                if(window.scrollY > homeHeight+aboutHeight+skillsHeight+(workHeight*(1/5))){
                    //console.log("skills")
                    git.classList.add('show-ani');
                } else {
                    git.classList.remove('show-ani');
                }
            }
            else if(work_height == 2){
                if(window.scrollY > homeHeight+aboutHeight+skillsHeight*(0.8)){
                    //console.log("skills")
                    git.classList.add('show-ani');
                } else {
                    git.classList.remove('show-ani');
                }
            }
            else if(work_height == 3){
                if(window.scrollY > homeHeight+aboutHeight+skillsHeight*(0.7)){
                    //console.log("skills")
                    git.classList.add('show-ani');
                } else {
                    git.classList.remove('show-ani');
                }
            }
            else if(work_height == 4){
                if(window.scrollY > homeHeight+aboutHeight+skillsHeight*(0.75)){
                    //console.log("skills")
                    git.classList.add('show-ani');
                } else {
                    git.classList.remove('show-ani');
                }
            }
        }
        
        }

    );




// Make navbar transparent when it is on the top
const navbar = document.querySelector('#navbar');
const navbarHeight = navbar.getBoundingClientRect().height;
document.addEventListener('scroll', ()=>{
    if(window.scrollY > navbarHeight/6){
        navbar.classList.add('navbar-dark');
    } else {
        navbar.classList.remove('navbar-dark');
    }

});

// Handle scrolling when tapping on th navbar menu

const navbarMenu = document.querySelector('.navbar_menu');
const section_containers = document.querySelectorAll('.section_container');
navbarMenu.addEventListener('click', (event) => {
    const target = event.target;
    const link = target.dataset.link;
    if(link == null){
        return;
    }
    a=1;
    section_containers.forEach((section) =>{
        section.classList.add('show');
    });
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

// Remove GoBackPage Button
const btnid = document.querySelector('.backbtn');
// Receive message from Child
function receiveMsgFromChild( e ) {
    console.log( '자식으로부터 받은 메시지 ', e.data );
    if(e.data == "visible"){
        btnid.classList.add('visible');
    }
    else {
        btnid.classList.remove('visible');
    }
}
window.addEventListener( 'message', receiveMsgFromChild );

//Handle click on the "arrow up" button
arrowUp.addEventListener('click', () => {
    scrollIntoView('#home');
});

// Handle projects  when tapping on th work_categoris
const workBtnContainer = document.querySelector('.work_categories');
const projectContainter = document.querySelector('.work_projects');
const projects = document.querySelectorAll('.project'); 
const projectsInfo = document.querySelectorAll('.project_info');
const projectH2 = document.querySelector('.project_h2');
workBtnContainer.addEventListener('click', (event) => {
    // projectH2.classList.remove('invisible');
    const filter = event.target.dataset.filter || event.target.parentNode.dataset.filter;
    console.log(event.target.parentNode.dataset.filter) 
    if(filter == null){
        return;
    }
    //Remove selection from the previous item and select the new one
    const active = document.querySelector('.category_btn.selected');
    active.classList.remove('selected');
    projectsInfo.forEach((projectInfo) =>{
        projectInfo.classList.add('invisible');
        if(filter === 'Main' && projectInfo.classList.contains('benepia_info')){
            projectInfo.classList.remove('invisible');
        }
    });
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
        if(filter === 'Main' && project.classList.contains('benepia')) {
            project.classList.add('active');
        }else{
            project.classList.remove('active');
        }
        if ( filter === '*' || filter === project.dataset.type)
        {
            if ( filter === '*'){
                work_height =1;
            } else if(filter === "Main"){
                work_height=3;
                
            } else if(filter === "electronics"){
                work_height=3;
                
            } else if(filter === "Software"){
                work_height=2;
                
            }
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

projectsInfo.forEach((projectInfo) =>{
    projectInfo.classList.add('invisible');
    if(projectInfo.classList.contains('benepia_info')){
        projectInfo.classList.remove('invisible');
    }
});

projects.forEach(project => {
    project.addEventListener('click', function() {
        // 모든 프로젝트에서 active 제거
        projects.forEach(p => p.classList.remove('active'));
        // 클릭한 프로젝트에 active 추가
        this.classList.add('active');
    });
});

projects.forEach((project) =>{


    
    project.addEventListener('click', (event) => {
        /*
        // 클릭한 프로젝트에 active 추가
        if(!project.classList.contains('active')) {
            project.classList.add('active');
        }else{
            project.classList.remove('active');
        }
*/
        // projectH2.classList.add('invisible');
        projectsInfo.forEach((projectInfo) =>{
            if(projectInfo.classList.contains(event.target.id) ==true || projectInfo.classList.contains(event.target.parentNode.id) ==true)
            {
                if(!projectInfo.classList.contains('invisible')){
                    projectInfo.classList.add('invisible');
                    // projectH2.classList.remove('invisible');
                    return;
                }

                projectInfo.classList.remove('invisible');

                
                

                var element = document.querySelector('.work_projects'); 
                element.scrollIntoView({behavior: "smooth"});
            }
            else{
                projectInfo.classList.add('invisible');
                console.log("no search",projectInfo);
            }
        });
        
        
    });
});

//Activate the menu when scrolling.
const sectionIds = [
    '#home',
    //'#summary',
    '#about',
    '#skills',
    '#work',
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

function popUpInputForm(){
    const hiddenForm = document.querySelector('#hiddenForm');

    // hiddenForm안에 데이터는 모두 초기화
    document.querySelector('#dollar').value = '';
    document.querySelector('#percent').value = '';
    document.querySelector('#result').value = '';

    if( hiddenForm.style.display === 'none' || hiddenForm.style.display === ''){
        hiddenForm.style.display = 'block';
    }else{
        hiddenForm.style.display = 'none';
    }
}


function calculate() {
    const dollar = document.querySelector('#dollar').value;
    const percent = document.querySelector('#percent').value;
    const result = document.querySelector('#result');

    if(dollar === '' || percent === ''){
        alert('값을 입력해주세요.');
        return;
    }
    
    // 익절률시 percent%만큼 수익이고 원하는 수익금은 dollar일 경우 얼마를 투자해야하는가
    const investment = dollar / (percent / 100);
    result.value = investment.toFixed(2); // 소수점 둘째자리까지 표시

}

function erase(){
    const dollar = document.querySelector('#dollar');
    const percent = document.querySelector('#percent');
    const result = document.querySelector('#result');

    dollar.value = '';
    percent.value = '';
    result.value = '';
}