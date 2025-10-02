document.addEventListener("DOMContentLoaded", () => {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const clearCartBtn = document.getElementById("clear-cart");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function renderCart() {
        cartItems.innerHTML = "";
        let total = 0;

        cart.forEach((item, index) => {
            total += item.price * item.quantity;

            const li = document.createElement("li");
            li.innerHTML = `
                ${item.title} x${item.quantity} - $${(item.price * item.quantity).toLocaleString("es-CL")}
                <button class="btn btn-sm btn-danger remove-item" data-index="${index}">❌</button>
            `;
            cartItems.appendChild(li);
        });

        cartTotal.textContent = `$${total.toLocaleString("es-CL")}`;
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    function addToCart(product) {
        const existing = cart.find(p => p.id === product.id);
        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        renderCart();
    }

    document.querySelectorAll(".add-to-cart").forEach(btn => {
        btn.addEventListener("click", () => {
            const product = {
                id: btn.dataset.id,
                title: btn.dataset.title,
                price: parseInt(btn.dataset.price),
                image: btn.dataset.image
            };
            addToCart(product);
        });
    });

    cartItems.addEventListener("click", e => {
        if (e.target.classList.contains("remove-item")) {
            cart.splice(e.target.dataset.index, 1);
            renderCart();
        }
    });

    clearCartBtn.addEventListener("click", () => {
        cart = [];
        renderCart();
    });

    renderCart();
});

document.addEventListener("DOMContentLoaded", () => {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const clearCartBtn = document.getElementById("clear-cart");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function renderCart() {
        cartItems.innerHTML = "";
        let total = 0;

        cart.forEach((item, index) => {
            total += item.price * item.quantity;

            const li = document.createElement("li");
            li.innerHTML = `
                ${item.title} x${item.quantity} - $${(item.price * item.quantity).toLocaleString("es-CL")}
                <button class="btn btn-sm btn-danger remove-item" data-index="${index}">❌</button>
            `;
            cartItems.appendChild(li);
        });

        cartTotal.textContent = `$${total.toLocaleString("es-CL")}`;
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    function addToCart(product) {
        const existing = cart.find(p => p.id === product.id);
        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        renderCart();
    }

    document.querySelectorAll(".add-to-cart").forEach(btn => {
        btn.addEventListener("click", () => {
            const product = {
                id: btn.dataset.id,
                title: btn.dataset.title,
                price: parseInt(btn.dataset.price),
                image: btn.dataset.image
            };
            addToCart(product);
        });
    });

    cartItems.addEventListener("click", e => {
        if (e.target.classList.contains("remove-item")) {
            cart.splice(e.target.dataset.index, 1);
            renderCart();
        }
    });

    clearCartBtn.addEventListener("click", () => {
        cart = [];
        renderCart();
    });

    renderCart();
});
