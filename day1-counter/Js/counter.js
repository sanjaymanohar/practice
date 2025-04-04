let counter = document.getElementById("counter"),
    count = localStorage.getItem("count") ? Number(localStorage.getItem("count")) : 0;
let timer = null;


counter.textContent = count;

function startCounter() {
    if (!timer) {
        timer = setInterval(function () {
            count++;
            counter.textContent = count;
            localStorage.setItem("count", count); 
        }, 1000);
    }
}

function stopCounter() {
    clearInterval(timer);
    timer = null;
}

function resetCounter() {
    clearInterval(timer);
    timer = null;
    count = 0;
    counter.textContent = count;
    localStorage.setItem("count", count); 
}

document.addEventListener("click", function (e) {
    if (e.target.id === "start") startCounter();
    if (e.target.id === "stop") stopCounter();
    if (e.target.id === "reset") resetCounter();
});
