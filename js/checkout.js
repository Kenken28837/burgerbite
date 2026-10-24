/* =========================
   BURGERBITE CHECKOUT
========================= */


/* =========================
   CART
========================= */

let cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];


/* =========================
   SETTINGS
========================= */

const DELIVERY_FEE = 49;


/* =========================
   EMAILJS SETTINGS
========================= */

const EMAILJS_SERVICE_ID =
    "service_26orz7m";

const EMAILJS_TEMPLATE_ID =
    "template_adspl78";

const EMAILJS_PUBLIC_KEY =
    "YEQqZ1YPyOb-ClNqF";


/* =========================
   GET ELEMENTS
========================= */

const checkoutItems =
    document.getElementById("checkout-items");

const checkoutEmpty =
    document.getElementById("checkout-empty");

const checkoutSubtotal =
    document.getElementById("checkout-subtotal");

const checkoutDelivery =
    document.getElementById("checkout-delivery");

const checkoutTotal =
    document.getElementById("checkout-total");

const cartCount =
    document.getElementById("cart-count");

const checkoutForm =
    document.getElementById("checkout-form");

const placeOrderButton =
    document.getElementById("place-order-btn");

const orderConfirmation =
    document.getElementById("order-confirmation");

const orderNumberElement =
    document.getElementById("order-number");


/* =========================
   FORMAT PRICE
========================= */

function formatPrice(price) {

    return `₱${Number(price).toLocaleString()}`;

}


/* =========================
   GET SUBTOTAL
========================= */

function getSubtotal() {

    return cart.reduce(

        (total, item) => {

            return total +
                (
                    Number(item.price) *
                    Number(item.quantity)
                );

        },

        0

    );

}


/* =========================
   GET DELIVERY
========================= */

function getDelivery() {

    if (cart.length === 0) {

        return 0;

    }

    return DELIVERY_FEE;

}


/* =========================
   GET TOTAL
========================= */

function getTotal() {

    return getSubtotal() +
        getDelivery();

}


/* =========================
   UPDATE CART COUNT
========================= */

function updateCartCount() {

    if (!cartCount) {

        return;

    }

    const totalItems =
        cart.reduce(

            (total, item) => {

                return total +
                    Number(item.quantity);

            },

            0

        );

    cartCount.textContent =
        totalItems;

}


/* =========================
   UPDATE TOTALS
========================= */

function updateTotals() {

    const subtotal =
        getSubtotal();

    const delivery =
        getDelivery();

    const total =
        getTotal();


    if (checkoutSubtotal) {

        checkoutSubtotal.textContent =
            formatPrice(subtotal);

    }


    if (checkoutDelivery) {

        checkoutDelivery.textContent =
            formatPrice(delivery);

    }


    if (checkoutTotal) {

        checkoutTotal.textContent =
            formatPrice(total);

    }


    /* Update price inside button */

    if (placeOrderButton) {

        const priceSpan =
            placeOrderButton.querySelector("span");

        if (priceSpan) {

            priceSpan.textContent =
                formatPrice(total);

        }

    }

}


/* =========================
   RENDER CHECKOUT ITEMS
========================= */

function renderCheckoutItems() {

    if (!checkoutItems) {

        return;

    }


    checkoutItems.innerHTML = "";


    /* EMPTY CART */

    if (cart.length === 0) {

        if (checkoutEmpty) {

            checkoutEmpty.style.display =
                "block";

        }


        if (placeOrderButton) {

            placeOrderButton.disabled =
                true;

        }


        updateTotals();

        updateCartCount();

        return;

    }


    /* CART HAS ITEMS */

    if (checkoutEmpty) {

        checkoutEmpty.style.display =
            "none";

    }


    if (placeOrderButton) {

        placeOrderButton.disabled =
            false;

    }


    /* CREATE ITEMS */

    cart.forEach(

        (item) => {

            const checkoutItem =
                document.createElement("article");


            checkoutItem.classList.add(
                "checkout-item"
            );


            checkoutItem.innerHTML = `

                <div class="checkout-item-image">

                    <img
                        src="${item.image}"
                        alt="${item.name}"
                    >

                </div>


                <div class="checkout-item-info">

                    <div class="checkout-item-info-top">

                        <h3>
                            ${item.name}
                        </h3>

                        <strong class="checkout-item-total">

                            ${formatPrice(
                                Number(item.price) *
                                Number(item.quantity)
                            )}

                        </strong>

                    </div>


                    <p>

                        ${formatPrice(item.price)}
                        ×
                        ${item.quantity}

                    </p>

                </div>

            `;


            checkoutItems.appendChild(
                checkoutItem
            );

        }

    );


    updateTotals();

    updateCartCount();

}


/* =========================
   GENERATE ORDER NUMBER
========================= */

function generateOrderNumber() {

    const randomNumber =
        Math.floor(
            1000 +
            Math.random() * 9000
        );


    return `BB-${randomNumber}`;

}


/* =========================
   SEND ORDER EMAIL
========================= */

async function sendOrderEmail(order) {

    /* Check EmailJS */

    if (typeof emailjs === "undefined") {

        throw new Error(
            "EmailJS is not loaded. Check your checkout.html script tags."
        );

    }


    /* Check Public Key */

    if (
        EMAILJS_PUBLIC_KEY ===
        "PASTE_YOUR_PUBLIC_KEY_HERE"
    ) {

        throw new Error(
            "You have not added your EmailJS Public Key."
        );

    }


    /* Create order items */

    const orderItems =
        order.items
            .map(

                (item) => {

                    const itemTotal =
                        Number(item.price) *
                        Number(item.quantity);


                    return `${item.quantity}x ${item.name} — ${formatPrice(itemTotal)}`;

                }

            )
            .join("\n");


    /* =========================
       TEMPLATE PARAMETERS
    ========================= */

    const templateParams = {

        /* This must match the email field
           used in your EmailJS template */

        to_email:
            order.customer.email,


        customer_name:
            order.customer.name,


        order_number:
            order.orderNumber,


        order_items:
            orderItems,


        subtotal:
            formatPrice(
                order.subtotal
            ),


        delivery:
            formatPrice(
                order.delivery
            ),


        total:
            formatPrice(
                order.total
            ),


        payment_method:
            order.payment,


        customer_address:
            `${order.customer.address}, ${order.customer.city}`,


        customer_phone:
            order.customer.phone,


        customer_notes:
            order.customer.notes ||
            "None"

    };


    console.log(
        "Sending email with:",
        templateParams
    );


    /* SEND EMAIL */

    const response =
        await emailjs.send(

            EMAILJS_SERVICE_ID,

            EMAILJS_TEMPLATE_ID,

            templateParams,

            {
                publicKey:
                    EMAILJS_PUBLIC_KEY
            }

        );


    console.log(
        "EmailJS response:",
        response
    );


    return response;

}


/* =========================
   PLACE ORDER
========================= */

if (checkoutForm) {

    checkoutForm.addEventListener(

        "submit",

        async (event) => {

            event.preventDefault();


            /* CHECK CART */

            if (cart.length === 0) {

                alert(
                    "Your cart is empty. Please add a burger first."
                );

                return;

            }


            /* CHECK FORM */

            if (
                !checkoutForm.checkValidity()
            ) {

                checkoutForm.reportValidity();

                return;

            }


            /* DISABLE BUTTON */

            if (placeOrderButton) {

                placeOrderButton.disabled =
                    true;

                placeOrderButton.textContent =
                    "Sending order...";

            }


            /* GET FORM DATA */

            const formData =
                new FormData(
                    checkoutForm
                );


            const customerName =
                formData.get("fullName");


            const customerPhone =
                formData.get("phone");


            const customerEmail =
                formData.get("email");


            const customerAddress =
                formData.get("address");


            const customerCity =
                formData.get("city");


            const customerNotes =
                formData.get("notes");


            const paymentMethod =
                formData.get("payment");


            /* CREATE ORDER */

            const orderNumber =
                generateOrderNumber();


            const order = {

                orderNumber:
                    orderNumber,


                customer: {

                    name:
                        customerName,

                    phone:
                        customerPhone,

                    email:
                        customerEmail,

                    address:
                        customerAddress,

                    city:
                        customerCity,

                    notes:
                        customerNotes

                },


                payment:
                    paymentMethod,


                items:
                    [...cart],


                subtotal:
                    getSubtotal(),


                delivery:
                    getDelivery(),


                total:
                    getTotal(),


                date:
                    new Date()
                        .toLocaleString()

            };


            /* =========================
               SEND EMAIL FIRST
            ========================= */

            try {

                console.log(
                    "Sending order confirmation email..."
                );


                await sendOrderEmail(
                    order
                );


                console.log(
                    "Order email sent successfully!"
                );

            } catch (error) {

                console.error(
                    "EMAIL ERROR:",
                    error
                );


                alert(
                    "EMAIL FAILED!\n\n" +
                    (
                        error.text ||
                        error.message ||
                        "Unknown EmailJS error"
                    )
                );


                /* Re-enable button */

                if (placeOrderButton) {

                    placeOrderButton.disabled =
                        false;

                    placeOrderButton.textContent =
                        "Try Again";

                }


                /* STOP ORDER */

                return;

            }


            /* =========================
               SAVE LAST ORDER
            ========================= */

            localStorage.setItem(

                "lastOrder",

                JSON.stringify(
                    order
                )

            );


            /* SHOW ORDER NUMBER */

            if (orderNumberElement) {

                orderNumberElement.textContent =
                    orderNumber;

            }


            /* CLEAR CART */

            cart = [];


            localStorage.removeItem(
                "cart"
            );


            updateCartCount();


            /* SHOW CONFIRMATION */

            if (orderConfirmation) {

                orderConfirmation.classList.remove(
                    "hidden"
                );

            }


            /* RESET CHECKOUT ITEMS */

            if (checkoutItems) {

                checkoutItems.innerHTML =
                    "";

            }


            if (checkoutEmpty) {

                checkoutEmpty.style.display =
                    "block";

            }


            updateTotals();


            /* RESET FORM */

            checkoutForm.reset();


            /* SCROLL TO TOP */

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }

    );

}


/* =========================
   INITIALIZE
========================= */

renderCheckoutItems();

updateCartCount();
