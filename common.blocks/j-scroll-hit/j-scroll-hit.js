function jScrollHit() {
    let elems = document.getElementsByClassName('j-scroll-hit');
    for(let i=0; i<elems.length; i++) {
        let elem = elems[i],
            targetIdArray = elem.getAttribute('data-hit-target').split(','),
            targetArray = targetIdArray.map((targetId)=>(document.getElementById(targetId))),
            cls = elem.getAttribute('data-hit-class');

        window.addEventListener("scroll", function(){
            if(targetArray.some((target)=>(isElemHitTarget(elem, target)))) {
                elem.classList.add(cls);
            } else {
                elem.classList.remove(cls);
            }
        }, false);
    }

    function isElemHitTarget(elem, target) {
        let elemBounding = elem.getBoundingClientRect(),
            targetBounding = target.getBoundingClientRect();
        return targetBounding.top < elemBounding.bottom && targetBounding.bottom > elemBounding.top;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    jScrollHit();
});