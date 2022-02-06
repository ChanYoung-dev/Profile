const atags = document.querySelectorAll('a');
atags.forEach( (atag) => {
    check_href = atag.getAttribute("href")
    // Show External URL in New tab
    if (check_href.startsWith("http") == true){
        atag.setAttribute("target", "_parent");
    }
    else{
        sendRemoveBtnToParent('unvisible');
        // Show button
        atag.addEventListener( 'click', function( e ) {
            sendShowBtnToParent( 'visible' );
        });
    }
});

/*
// Toggle GoBackPage Button
const links = document.querySelectorAll('.embed-container a');
links.forEach( (link) => {
    sendRemoveBtnToParent('unvisible');
    link.addEventListener( 'click', function( e ) {
        sendShowBtnToParent( 'visible' );
    });
});
*/
// Post Message to Parent
function sendShowBtnToParent( msg ) {
    window.parent.postMessage( msg, '*' );
}
function sendRemoveBtnToParent( msg ) {
    window.parent.postMessage( msg, '*' );
}

const All_Details = document.querySelectorAll('details');

All_Details.forEach(deet=>{
    deet.open = false
})

/*
// Show External URL in New tab
const figures = document.querySelectorAll('figure a');
figures.forEach( (figure) => {
    figure.setAttribute("target", "_parent");
});
*/