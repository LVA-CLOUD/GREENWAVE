// CONTADOR COM INTERSECTION OBSERVER

const counters = document.querySelectorAll('.counter');

const startCounter = (counter) => {

    counter.innerText = '0';

    const target = +counter.getAttribute('data-target');
    const increment = target / 200;

    const updateCounter = () => {
        const current = +counter.innerText;

        if (current < target) {
            counter.innerText = Math.ceil(current + increment);
            setTimeout(updateCounter, 10);
        } else {
            counter.innerText = target;
        }
    };

    updateCounter();
};

const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {
            startCounter(entry.target);
            observer.unobserve(entry.target); // roda só uma vez
        }

    });

}, {
    threshold: 0.5 // ativa quando 50% do elemento estiver visível
});

counters.forEach(counter => {
    observer.observe(counter);
});