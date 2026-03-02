// CONTADOR COM INTERSECTION OBSERVER

const counters = document.querySelectorAll('.counter');

const startCounter = (counter) => {

    counter.innerText = '0';

    const target = +counter.getAttribute('data-target');
    const increment = target / 40;

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
    threshold: 0.5 
});

counters.forEach(counter => {
    observer.observe(counter);
});


        // LÓGICA DO CARRINHO
        let cart = [];
        const cartList = document.getElementById('cartList');
        const cartEmpty = document.getElementById('cartEmpty');
        const cartSubtotal = document.getElementById('cartSubtotal');
        const cartTotal = document.getElementById('cartTotal');
        const cartBadge = document.getElementById('cartBadge');

        function updateCart() {
            cartList.innerHTML = '';
            let subtotal = 0;

            if (cart.length === 0) {
                cartEmpty.classList.remove('d-none');
            } else {
                cartEmpty.classList.add('d-none');
                cart.forEach((item, index) => {
                    subtotal += item.price;
                    const itemElement = document.createElement('div');
                    itemElement.className = 'cart-item';
                    itemElement.innerHTML = `
                        <div>
                            <h6 class="mb-0 small">${item.name}</h6>
                            <small class="text-success">R$ ${item.price.toFixed(2)}</small>
                        </div>
                        <button class="btn btn-sm btn-outline-danger" onclick="removeItem(${index})">&times;</button>
                    `;
                    cartList.appendChild(itemElement);
                });
            }

            cartSubtotal.innerText = `R$ ${subtotal.toFixed(2)}`;
            cartTotal.innerText = `R$ ${subtotal.toFixed(2)}`;
            cartBadge.innerText = cart.length;
        }

        function removeItem(index) {
            cart.splice(index, 1);
            updateCart();
        }

        document.querySelectorAll('.btn-add-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const name = e.target.getAttribute('data-name');
                const price = parseFloat(e.target.getAttribute('data-price'));
                cart.push({ name, price });
                updateCart();
                
                // Abre o carrinho automaticamente ao adicionar
                const bsOffcanvas = new bootstrap.Offcanvas(document.getElementById('cartDrawer'));
                bsOffcanvas.show();
            });
        });

        document.getElementById('btnClearCart').addEventListener('click', () => {
            cart = [];
            updateCart();
        });

        