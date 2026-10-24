/* =========================
   BURGERBITE MAIN JAVASCRIPT
========================= */


/* Get the saved cart from localStorage */

let cart = JSON.parse(localStorage.getItem("cart")) || [];


/* =========================
   UPDATE CART COUNT
========================= */

function updateCartCount() {

    const cartCount = document.getElementById("cart-count");

    if (!cartCount) {
        return;
    }


    const totalItems = cart.reduce((total, item) => {

        return total + item.quantity;

    }, 0);


    cartCount.textContent = totalItems;

}


/* Run when page loads */

updateCartCount();
