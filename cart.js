/* =========================
   BURGERBITE CART
========================= */


/* =========================
   GET CART
========================= */

let cart = JSON.parse(localStorage.getItem("cart")) || [];


/* Delivery fee */

const DELIVERY_FEE = 49;


/* =========================
   ELEMENTS
========================= */

const cartItemsContainer =
    document.getElementById("cart-items");

const emptyCart =
    document.getElementById("empty-cart");

const cartItemText =
    document.getElementById("cart-item-text");

const cartCount =
    document.getElementById("cart-count");

const subtotalElement =
    document.getElementById("subtotal");

const deliveryElement =
    document.getElementById("delivery");

const totalElement =
    document.getElementById("total");

const checkoutButton =
    document.getElementById("checkout-btn");

const clearCartButton =
    document.getElementById("clear-cart-btn");


/* =========================
   SAVE CART
========================= */

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}


/* =========================
   FORMAT PRICE
========================= */

function formatPrice(price) {

    return `₱${price.toLocaleString()}`;

}


/* =========================
   UPDATE CART COUNT
========================= */

function updateCartCount() {

    const totalItems = cart.reduce(
        (total, item) => {

            return total + item.quantity;

        },
        0
    );


    cartCount.textContent = totalItems;

}


/* =========================
   CALCULATE SUBTOTAL
========================= */

function getSubtotal() {

    return cart.reduce(
        (total, item) => {

            return total +
                (item.price * item.quantity);

        },
        0
    );

}


/* =========================
   UPDATE SUMMARY
========================= */

function updateSummary() {

    const subtotal = getSubtotal();


    const delivery =
        cart.length > 0
            ? DELIVERY_FEE
            : 0;


    const total =
        subtotal + delivery;


    subtotalElement.textContent =
        formatPrice(subtotal);


    deliveryElement.textContent =
        formatPrice(delivery);


    totalElement.textContent =
        formatPrice(total);

}


/* =========================
   RENDER CART
========================= */

function renderCart() {


    /* Clear old items */

    cartItemsContainer.innerHTML = "";


    /* Empty cart */

    if (cart.length === 0) {

        emptyCart.classList.remove("hidden");

        cartItemText.textContent =
            "No items";

        checkoutButton.classList.add("disabled");

        updateSummary();

        updateCartCount();

        return;

    }


    /* Cart has items */

    emptyCart.classList.add("hidden");

    checkoutButton.classList.remove("disabled");


    const totalItems = cart.reduce(
        (total, item) => {

            return total + item.quantity;

        },
        0
    );


    cartItemText.textContent =
        `${totalItems} item${totalItems !== 1 ? "s" : ""}`;


    /* Create cart items */

    cart.forEach((item) => {


        const cartItem =
            document.createElement("article");


        cartItem.classList.add("cart-item");


        cartItem.innerHTML = `

            <div class="cart-item-image">

                <img
                    src="${item.image}"
                    alt="${item.name}"
                >

            </div>


            <div class="cart-item-info">

                <h3>
                    ${item.name}
                </h3>


                <span class="cart-item-price">

                    ${formatPrice(item.price)}

                </span>


                <div class="quantity-controls">

                    <button
                        class="quantity-btn decrease-btn"
                        data-id="${item.id}"
                    >
                        −
                    </button>


                    <span class="quantity-number">

                        ${item.quantity}

                    </span>


                    <button
                        class="quantity-btn increase-btn"
                        data-id="${item.id}"
                    >
                        +

                    </button>

                </div>

            </div>


            <div class="cart-item-actions">

                <strong class="cart-item-total">

                    ${formatPrice(
                        item.price * item.quantity
                    )}

                </strong>


                <button
                    class="remove-item"
                    data-id="${item.id}"
                >

                    Remove

                </button>

            </div>

        `;


        cartItemsContainer.appendChild(cartItem);

    });


    updateSummary();

    updateCartCount();

}


/* =========================
   INCREASE QUANTITY
========================= */

function increaseQuantity(id) {

    const item = cart.find(
        (item) => item.id === id
    );


    if (item) {

        item.quantity++;

    }


    saveCart();

    renderCart();

}


/* =========================
   DECREASE QUANTITY
========================= */

function decreaseQuantity(id) {

    const item = cart.find(
        (item) => item.id === id
    );


    if (!item) {

        return;

    }


    if (item.quantity > 1) {

        item.quantity--;

    } else {

        cart = cart.filter(
            (item) => item.id !== id
        );

    }


    saveCart();

    renderCart();

}


/* =========================
   REMOVE ITEM
========================= */

function removeItem(id) {

    cart = cart.filter(
        (item) => item.id !== id
    );


    saveCart();

    renderCart();

}


/* =========================
   CART BUTTON EVENTS
========================= */

cartItemsContainer.addEventListener(
    "click",
    (event) => {


        const id =
            event.target.dataset.id;


        if (
            event.target.classList.contains(
                "increase-btn"
            )
        ) {

            increaseQuantity(id);

        }


        if (
            event.target.classList.contains(
                "decrease-btn"
            )
        ) {

            decreaseQuantity(id);

        }


        if (
            event.target.classList.contains(
                "remove-item"
            )
        ) {

            removeItem(id);

        }

    }
);


/* =========================
   CLEAR CART
========================= */

clearCartButton.addEventListener(
    "click",
    () => {


        if (cart.length === 0) {

            return;

        }


        const confirmClear =
            confirm(
                "Are you sure you want to clear your cart?"
            );


        if (confirmClear) {

            cart = [];

            saveCart();

            renderCart();

        }

    }
);


/* =========================
   INITIALIZE
========================= */

renderCart();