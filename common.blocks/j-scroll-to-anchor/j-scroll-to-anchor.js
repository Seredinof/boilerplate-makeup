function scrollToAnchor() {
    let scrollers = document.getElementsByClassName('j-scroll-to-anchor');

    for(let i=0; i < scrollers.length; i++) {
        scrollers[i].addEventListener('click', function (e) {
            let id = this.getAttribute('href').slice(1),
                top;
            e.preventDefault();
                if(id.length) {
                   top = getTop(document.getElementById(id));
                }

            $('body,html').animate({scrollTop: top}, 750);

            $('#navbarNav').collapse('hide');
        })
    }

    function getTop(elem) { // кроме IE8-
        let box = elem.getBoundingClientRect();
        return box.top + pageYOffset - 75;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    scrollToAnchor();
});