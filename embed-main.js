// Toggle GoBackPage Button
const links = document.querySelectorAll('.embed-container a');
links.forEach( (link) => {
    sendRemoveBtnToParent('unvisible');
    link.addEventListener( 'click', function( e ) {
        sendShowBtnToParent( 'visible' );
    });
});
// Post Message to Parent
function sendShowBtnToParent( msg ) {
    window.parent.postMessage( msg, '*' );
}
function sendRemoveBtnToParent( msg ) {
    window.parent.postMessage( msg, '*' );
}

// Show External URL in New tab
const figures = document.querySelectorAll('figure a');
figures.forEach( (figure) => {
    figure.setAttribute("target", "_parent");
});
