// Show GoBackPage Button
sendShowBtnToParent( 'visible' );

// Show External URL in New tab
const figures = document.querySelectorAll('figure a');
function sendShowBtnToParent( msg ) {
    window.parent.postMessage( msg, '*' );
}
figures.forEach( (figure) => {
    figure.setAttribute("target", "_parent");
});
