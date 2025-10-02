document.addEventListener("DOMContentLoaded", () => {
  const cartKey = "cart_v1";
  const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
  const cartItemsEl = document.getElementById("cart-items");
  const cartTotalEl = document.getElementById("cart-total");
  const clearCartBtn = document.getElementById("clear-cart");
  const checkoutBtn = document.getElementById("checkout-btn");

  
checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) return alert("El carrito está vacío");

    const name = prompt("Nombre (opcional):") || "";
    const email = prompt("Email (opcional):") || "";

    fetch("/ruta-a-webpay-prueba/", { // <- ajusta la URL correcta de tu vista
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken
      },
      body: JSON.stringify({ items: cart, name, email })
    })
    .then(res => res.text())
    .then(html => {
      document.open();
      document.write(html);
      document.close();
    })
    .catch(err => {
      console.error(err);
      alert("Error al iniciar el pago");
    });
});





  let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

  function formatCLP(n) {
    return "$" + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function renderCart() {
    cartItemsEl.innerHTML = "";
    let total = 0;
    cart.forEach((item, idx) => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center bg-dark border-0 text-light";
      let subtotal = item.price * item.quantity;
      total += subtotal;
      li.innerHTML = `
        <div class="d-flex align-items-center gap-2">
          <img src="${item.image}" style="width:60px;height:60px;object-fit:cover;border-radius:6px" />
          <div>
            <div class="fw-bold">${item.title}</div>
            <div class="small">x${item.quantity} • ${formatCLP(item.price)}</div>
          </div>
        </div>
        <div>
          <div>${formatCLP(subtotal)}</div>
          <button class="btn btn-sm btn-danger remove-item" data-idx="${idx}">Eliminar</button>
        </div>
      `;
      cartItemsEl.appendChild(li);
    });
    cartTotalEl.textContent = formatCLP(total);
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }

  function addToCart(product) {
    const existing = cart.find(p => p.id === product.id);
    if (existing) existing.quantity++;
    else cart.push({...product, quantity:1});
    renderCart();
    cartModal.show();
  }

  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      const product = {
        id: btn.dataset.id,
        title: btn.dataset.title,
        price: parseFloat(btn.dataset.price),
        image: btn.dataset.image
      };
      addToCart(product);
    });
  });

  cartItemsEl.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-item")) {
      const idx = e.target.dataset.idx;
      cart.splice(idx,1);
      renderCart();
    }
  });

  clearCartBtn.addEventListener("click", () => {
    cart = [];
    renderCart();
  });

  // CSRF token helper (Django)
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
  const csrftoken = getCookie('csrftoken');

  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) return alert("El carrito está vacío");

    // opcional: pedir datos básicos al usuario
    const name = prompt("Nombre (opcional):") || "";
    const email = prompt("Email (opcional):") || "";

    fetch("{% url 'cart_checkout' %}", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken
      },
      body: JSON.stringify({ items: cart, name, email })
    })
    .then(res => res.text())
    .then(html => {
      // Reemplazamos el documento con el HTML que Webpay espera (form auto-post)
      document.open();
      document.write(html);
      document.close();
    })
    .catch(err => {
      console.error(err);
      alert("Error al iniciar el pago");
    });
  });

  // render initial
  renderCart();
});

let carrito = [];

function actualizarCarrito() {
    const carritoContainer = document.getElementById('carrito-container');
    const carritoLista = document.getElementById('carrito-lista');
    const carritoTotal = document.getElementById('carrito-total');
    const formWebpay = document.getElementById('form-webpay');
    const montoWebpay = document.getElementById('monto-webpay');

    carritoLista.innerHTML = '';

    if (carrito.length === 0) {
        carritoContainer.style.display = 'none';
        formWebpay.style.display = 'none';
        return;
    }

    carrito.forEach(item => {
        let li = document.createElement('li');
        li.textContent = `${item.nombre} - $${item.precio.toLocaleString('es-CL')}`;
        carritoLista.appendChild(li);
    });

    let total = carrito.reduce((acc, item) => acc + item.precio, 0);
    carritoTotal.textContent = `$${total.toLocaleString('es-CL')}`;
    montoWebpay.value = total;

    carritoContainer.style.display = 'block';
    formWebpay.style.display = 'block';
}

// Evento agregar al carrito
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function() {
        let nombre = this.dataset.nombre;
        let precio = parseInt(this.dataset.precio);
        carrito.push({ nombre, precio });
        actualizarCarrito();
    });
});

