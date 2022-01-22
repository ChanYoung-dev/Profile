// Show GoBackPage Button
sendShowBtnToParent( 'visible' );

// Show External URL in New tab
/*
const figures = document.querySelectorAll('figure a');

figures.forEach( (figure) => {
    figure.setAttribute("target", "_parent");
});
*/

const atags = document.querySelectorAll('a');
atags.forEach( (atag) => {
    check_href = atag.getAttribute("href");
    // Show External URL in New tab
    if (check_href.startsWith("http") == true){
        atag.setAttribute("target", "_parent");
    }
});


function sendShowBtnToParent( msg ) {
    window.parent.postMessage( msg, '*' );
}