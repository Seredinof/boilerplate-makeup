/**
 * Created by Алексей on 17.06.2016.
 */
var jSticky = (function(){

    function setSticky(id, settings) {
        var settings = settings || { top: '0px', clientHeight: true };

        var elem = document.getElementById(id);

        if(settings.clientHeight) {
            var div = document.createElement('div');
            div.className = "wrapper-j-sticky-" + id;
            elem.parentNode.insertBefore(div, elem.nextSibling);
        }


        /*window.addEventListener('resize', function(){
            div.style.height = elem.clientHeight + "px";
        });*/

        if(parseInt(settings.top) != 0) {
            window.addEventListener('scroll', function(){
                var scrolled = window.pageYOffset || document.documentElement.scrollTop;

                if(parseInt(settings.top) <= parseInt(scrolled)){

                    if(settings.clientHeight) div.style.height = elem.clientHeight + "px";
                    elem.style.position = "fixed";
                    elem.style.zIndex = 99;
                    elem.style.width = '100%';
                    elem.style.top = 0;
                    elem.classList.add(settings.classActive);

                } else {
                    elem.classList.remove(settings.classActive);
                    elem.removeAttribute('style');
                    if(settings.clientHeight) div.removeAttribute('style');
                }
            });
        } else {
            if(settings.clientHeight) div.style.height = elem.clientHeight + "px";
            elem.style.position = "fixed";
            elem.style.zIndex = 99;
            elem.style.width = '100%';
            elem.style.top = 0;
        }


        if(settings.clientHeight) div.appendChild(elem);
    }
    return setSticky;
}());

document.addEventListener("DOMContentLoaded", function(){
    jSticky('navbar', {
        top: 1 +'px',
        classActive: 'b-navbar_sticky',
        clientHeight: false
    });
});

