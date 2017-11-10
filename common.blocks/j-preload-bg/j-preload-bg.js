(function () {
    var preloadBgElements = document.getElementsByClassName('j-preload-bg');
    if(preloadBgElements.length) {
        for(var i=0; i < preloadBgElements.length; i++) {
            var item = preloadBgElements[i];
            var url = item.getAttribute('data-preload-bg-url'),
                className = item.getAttribute('data-preload-bg-class');

            if(url && className) {

                var img = new Image();
                img.src = url;

                img.addEventListener('load', addClassName);

                function addClassName() {
                    item.classList.add(className);
                }
            }
        }
    }
})();