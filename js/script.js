// ==========================================
// 1. CONTADOR COM INTERSECTION OBSERVER
// ==========================================
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
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

counters.forEach(counter => observer.observe(counter));

// ==========================================
// 2. LÓGICA DO CARRINHO (GREENWAVE)
// ==========================================

// --- NOVIDADE: CARREGA DADOS DO LOCALSTORAGE AO INICIAR ---
let cart = JSON.parse(localStorage.getItem('greenwave_cart')) || [];

const cartList = document.getElementById('cartList');
const cartEmpty = document.getElementById('cartEmpty');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartTotal = document.getElementById('cartTotal');
const cartBadge = document.getElementById('cartBadge');

function updateCart() {
    if (!cartList) return; 
    
    // --- NOVIDADE: SALVA NO LOCALSTORAGE SEMPRE QUE ATUALIZA ---
    localStorage.setItem('greenwave_cart', JSON.stringify(cart));
    
    cartList.innerHTML = '';
    let subtotal = 0;

    if (cart.length === 0) {
        cartEmpty?.classList.remove('d-none');
        if(cartTotal) cartTotal.innerText = `R$ 0,00`;
        if(cartSubtotal) cartSubtotal.innerText = `R$ 0,00`;
    } else {
        cartEmpty?.classList.add('d-none');
        cart.forEach((item, index) => {
            subtotal += item.price;
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item d-flex justify-content-between align-items-center mb-3';
            
            itemElement.innerHTML = `
                <div>
                    <h6 class="mb-0 small fw-bold" style="color: white;">${item.name}</h6>
                    <small class="text-success">R$ ${item.price.toFixed(2).replace('.', ',')}</small>
                </div>
                <button class="btn btn-sm btn-outline-danger border-0" onclick="removeItem(${index})">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            `;                    
            cartList.appendChild(itemElement);
        });
    }

    if (cartSubtotal) cartSubtotal.innerText = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    if (cartTotal) cartTotal.innerText = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    if (cartBadge) cartBadge.innerText = cart.length;
}

// Chamar uma vez ao carregar a página para mostrar o que já estava salvo
updateCart();

function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}

// Event Listeners para os botões com ANIMAÇÃO
document.querySelectorAll('.btn-add-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-add-cart');
        const name = btn.getAttribute('data-name');
        const price = parseFloat(btn.getAttribute('data-price'));
        
        cart.push({ name, price });
        updateCart();

        const textoOriginal = btn.innerHTML;
        btn.classList.add('btn-success-animated');
        btn.innerHTML = '<i class="fa-solid fa-check me-2"></i>ADICIONADO!';
        btn.disabled = true;

        if(cartBadge) {
            cartBadge.classList.add('cart-pop');
            setTimeout(() => cartBadge.classList.remove('cart-pop'), 300);
        }

        setTimeout(() => {
            btn.classList.remove('btn-success-animated');
            btn.innerHTML = textoOriginal;
            btn.disabled = false;
        }, 1500);
    });
});

// Limpar Carrinho
document.getElementById('btnClearCart')?.addEventListener('click', () => {
    if(confirm("Deseja limpar todos os itens da cesta?")) {
        cart = [];
        updateCart();
    }
});

// Checkout via WhatsApp
document.getElementById('btnCheckout')?.addEventListener('click', () => {
    if (cart.length === 0) {
        alert("A sua cesta está vazia!");
        return;
    }

    let mensagem = "Olá GreenWave! Gostaria de um orçamento para:\n\n";
    cart.forEach(item => {
        mensagem += `• ${item.name} (R$ ${item.price.toFixed(2)})\n`;
    });
    
    const total = cart.reduce((acc, item) => acc + item.price, 0);
    mensagem += `\n*Total: R$ ${total.toFixed(2)}*`;

    const whatsappLink = `https://wa.me/12983090908?text=${encodeURIComponent(mensagem)}`;
    window.open(whatsappLink, '_blank');
});