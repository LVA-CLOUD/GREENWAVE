const counters = document.querySelectorAll('.counter');

const animateCounter = (counter) => {

    const target = +counter.dataset.target;
    const duration = 3000;
    const start = 3;
    const startTime = performance.now();

    const update = (currentTime) => {

        const progress = Math.min((currentTime - startTime) / duration, 1);
        const value = Math.floor(progress * target);

        counter.innerText = value;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            counter.innerText = target;
        }
    };

    requestAnimationFrame(update);
};

const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
        }

    });

}, { threshold: 0.6 });

counters.forEach(counter => observer.observe(counter));







AOS.init()

let cart = JSON.parse(localStorage.getItem("greenwave_cart")) || []

const cartList = document.getElementById("cartList")
const cartTotal = document.getElementById("cartTotal")
const cartBadge = document.getElementById("cartBadge")

const container = document.getElementById("productContainer")

// =============================
// CARREGAR PRODUTOS
// =============================

fetch("./produtos.json")
    .then(res => res.json())
    .then(produtos => {

        produtos.forEach(prod => {

            const card = document.createElement("div")

            card.className = "col-md-4 product-card"
            card.dataset.category = prod.categoria

            card.innerHTML = `
        
        <div class="card h-100 shadow-sm border-0">

            <img src="${prod.imagem}" class="card-img-top">

            <div class="card-body">

                <h5 class="card-title fw-bold">
                    ${prod.nome}
                </h5>

                <span class="text-primary fw-bold">
                    R$ ${prod.preco}
                </span>

                <p class="small text-muted">
                    ${prod.descricao}
                </p>

            </div>

            <div class="card-footer bg-white border-0">

                <button class="btn btn-dark w-100 btn-add-cart"
                    data-name="${prod.nome}"
                    data-price="${prod.preco}">
                    
                    Adicionar ao carrinho

                </button>

            </div>

        </div>
        `

            container.appendChild(card)

        })

        initCartButtons()
    })


// =============================
// BOTÕES DO CARRINHO
// =============================

function initCartButtons() {

    document.querySelectorAll(".btn-add-cart").forEach(btn => {

        btn.addEventListener("click", e => {

            const name = btn.dataset.name
            const price = parseFloat(btn.dataset.price)

            cart.push({ name, price })

            updateCart()

            flyToCart(btn)

        })

    })

}
// =============================
// LIMPAR CARRINHO
// =============================

const btnClearCart = document.getElementById("btnClearCart")

btnClearCart.addEventListener("click", () => {

    if (cart.length === 0) {
        alert("O carrinho já está vazio")
        return
    }

    if (confirm("Deseja realmente limpar o carrinho?")) {

        cart = []

        localStorage.removeItem("greenwave_cart")

        updateCart()

    }

})


// =============================
// ATUALIZAR CARRINHO
// =============================

function updateCart() {

    cartList.innerHTML = ""

    let total = 0

    cart.forEach(item => {

        total += item.price

        cartList.innerHTML += `
        
        <div class="d-flex justify-content-between mb-2">

            <span>${item.name}</span>

            <span>R$${item.price}</span>

        </div>
        `
    })

    cartTotal.innerText = "R$" + total
    cartBadge.innerText = cart.length

    localStorage.setItem("greenwave_cart", JSON.stringify(cart))
}

updateCart()


// =============================
// ANIMAÇÃO AMAZON
// =============================

function flyToCart(button) {

    const img = button.closest(".card").querySelector("img")

    const clone = img.cloneNode()

    const cartIcon = document.querySelector(".cart-icon")

    clone.style.position = "fixed"
    clone.style.width = "80px"
    clone.style.zIndex = "9999"

    const rect = img.getBoundingClientRect()

    clone.style.top = rect.top + "px"
    clone.style.left = rect.left + "px"

    document.body.appendChild(clone)

    gsap.to(clone, {
        top: cartIcon.getBoundingClientRect().top,
        left: cartIcon.getBoundingClientRect().left,
        scale: 0.2,
        duration: .8,
        onComplete() { clone.remove() }
    })
}


// =============================
// BUSCA
// =============================

const search = document.getElementById("productSearch")

search.addEventListener("input", () => {

    const value = search.value.toLowerCase()

    document.querySelectorAll(".product-card").forEach(card => {

        const name = card.querySelector(".card-title").innerText.toLowerCase()

        card.style.display = name.includes(value) ? "block" : "none"

    })

})


// =============================
// FILTROS
// =============================

document.querySelectorAll(".filter-btn").forEach(btn => {

    btn.addEventListener("click", () => {

        document.querySelector(".filter-btn.active")?.classList.remove("active")
        btn.classList.add("active")

        const category = btn.dataset.category

        document.querySelectorAll(".product-card").forEach(card => {

            if (category === "all" || card.dataset.category === category) {

                card.style.display = "block"

            } else {

                card.style.display = "none"

            }

        })

    })

})


// =============================
// CHECKOUT WHATSAPP
// =============================

document.getElementById("btnCheckout").addEventListener("click", () => {

    if (cart.length === 0) {

        alert("Seu carrinho está vazio")
        return

    }

    let msg = "Olá! Gostaria de um orçamento:\n\n"

    cart.forEach(item => {
        msg += `• ${item.name} - R$${item.price}\n`
    })

    const total = cart.reduce((acc, i) => acc + i.price, 0)

    msg += `\nTotal: R$${total}`

    const url = `https://wa.me/12983090908?text=${encodeURIComponent(msg)}`

    window.open(url, "_blank")

})