if (!('requestAnimationFrame' in window)) {

    window.requestAnimationFrame = window.webkitRequestAnimationFrame;
    window.cancelAnimationFrame = window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame;
};

