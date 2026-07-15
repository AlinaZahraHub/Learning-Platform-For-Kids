// Floating Donut
const donut = document.querySelector('.floating-donut');
if (donut) {
    const style = document.createElement('style');
    style.innerHTML = `@keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-20px); } 100% { transform: translateY(0px); } }`;
    document.head.appendChild(style);
    donut.style.animation = "float 3s ease-in-out infinite";
}

// Mouse Trail
document.addEventListener('mousemove', (e) => {
     const candyOptions = ['🍭', '🍬', '✨', '🍩', '🍦', '⭐'];
    const span = document.createElement('span');
    span.classList.add('candy-trail');
    span.innerText = candyOptions[Math.floor(Math.random() * candyOptions.length)];
    span.style.left = (e.pageX + 10) + 'px';
    span.style.top = (e.pageY + 10) + 'px';
    document.body.appendChild(span);
    requestAnimationFrame(() => {
        span.style.opacity = '0';
        span.style.transform = 'translateY(-20px) scale(0.5)';
    });
    setTimeout(() => span.remove(), 500);
});