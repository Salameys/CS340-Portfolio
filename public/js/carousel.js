var imgIndex = 1;
var imgTimer;
var imgSlides;

function changeImgs(n) {
    clearInterval(imgTimer);
    if (n === -1) {
        imgTimer = setInterval(function () { changeImgs(n + 2) }, 5000);
    }
    else {
        imgTimer = setInterval(function () { changeImgs(n + 2) }, 5000);
    }

    if (n < 0) {
        showImgs(imgIndex -= 1);
    }
    else {
        showImgs(imgIndex += 1);
    }
}


function currentImg(n) {
    clearInterval(imgTimer);

    imgTimer = setInterval(function () { changeImgs(n + 1) }, 5000);

    showImgs(imgIndex = n);
}


function showImgs(n) {
    var i;
    var imgs = document.getElementsByClassName("carouselImgs");
    if (n > imgs.length) { imgIndex = 1 }
    if (n < 1) { imgIndex = imgs.length }
    for (i = 0; i < imgs.length; i++) {
        imgs[i].style.display = "none";
    }

    if (imgIndex > imgs.length) { imgIndex = 1 }
    imgs[imgIndex - 1].style.display = "block";

    setTimeout(showImgs, 5000);
}

window.addEventListener("load", function () {
    showImgs(imgIndex);

    imgTimer = setInterval(function () { changeImgs(1) }, 5000);

    imgSlides = document.getElementsByClassName('carouselShow')[0];
})