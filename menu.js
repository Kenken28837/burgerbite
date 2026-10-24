/* =========================
   BURGERBITE MENU
========================= */


/* =========================
   BURGER DATA
========================= */


let burgers = [];

async function loadBurgersFromFirestore() {
    try {
        const snapshot = await db.collection("products").get();

        burgers = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));

        console.log("Burgers loaded from Firestore:", burgers);

        displayBurgers();
    } catch (error) {
        console.error("Error loading burgers from Firestore:", error);
        menuGrid.innerHTML =
            "<p>Unable to load the menu. Please try again later.</p>";
    }
}



/* =========================
   GET HTML ELEMENTS
========================= */

const menuGrid =
    document.getElementById("menu-grid");


const filterButtons =
    document.querySelectorAll(".filter-btn");


const cartCount =
    document.getElementById("cart-count");


/* =========================
   GET CART
========================= */

let cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];


/* =========================
   DISPLAY BURGERS
========================= */

function displayBurgers(
    burgerList = burgers
) {

    if (!menuGrid) {
        return;
    }


    /* Clear existing burgers */

    menuGrid.innerHTML = "";


    /* Create burger cards */

    burgerList.forEach(
        (burger) => {


            const burgerCard =
                document.createElement(
                    "article"
                );


            burgerCard.classList.add(
                "burger-card"
            );


            burgerCard.dataset.category =
                burger.category;


            burgerCard.innerHTML = `

                <!-- =========================
                     BURGER IMAGE
                ========================== -->

                <div class="burger-image">


                    <img
                        src="${burger.image}"
                        alt="${burger.name}"
                    >


                    <!-- BURGER NUMBER -->

                    <span class="burger-number">

                        ${burger.number}

                    </span>


                    <!-- BURGER TAG -->

                    <span class="burger-tag">

                        ${burger.tag}

                    </span>


                </div>


                <!-- =========================
                     BURGER INFORMATION
                ========================== -->

                <div class="burger-info">


                    <div class="burger-top">


                        <div>


                            <span class="burger-category">

                                ${burger.category}

                            </span>


                            <h2>

                                ${burger.name}

                            </h2>


                        </div>


                        <span class="burger-price">

                            ₱${burger.price}

                        </span>


                    </div>


                    <!-- DESCRIPTION / DETAILS -->

                    <p class="burger-description">

                        ${burger.description}

                    </p>


                    <!-- ADD TO CART -->

                    <button
                        class="add-to-cart"
                        data-id="${burger.id}"
                    >

                        <span class="button-text">

                            Add to cart

                        </span>


                        <span class="button-plus">

                            +

                        </span>

                    </button>


                </div>

            `;


            menuGrid.appendChild(
                burgerCard
            );


        }

    );

}


/* =========================
   ADD TO CART
========================= */

function addToCart(id) {


    /* Find selected burger */

    const selectedBurger =
        burgers.find(
            (burger) =>
                burger.id === id
        );


    if (!selectedBurger) {
        return;
    }


    /* Check if burger already exists */

    const existingItem =
        cart.find(
            (item) =>
                item.id === id
        );


    /* Increase quantity */

    if (existingItem) {

        existingItem.quantity++;

    }


    /* Add new burger */

    else {

        cart.push({

            id:
                selectedBurger.id,

            name:
                selectedBurger.name,

            category:
                selectedBurger.category,

            price:
                selectedBurger.price,

            image:
                selectedBurger.image,

            quantity:
                1

        });

    }


    /* Save cart */

    saveCart();


    /* Update cart count */

    updateCartCount();


}


/* =========================
   SAVE CART
========================= */

function saveCart() {


    localStorage.setItem(

        "cart",

        JSON.stringify(
            cart
        )

    );


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

            (total, item) =>

                total +
                item.quantity,

            0

        );


    cartCount.textContent =
        totalItems;


}


/* =========================
   ADD TO CART EVENTS
========================= */

if (menuGrid) {


    menuGrid.addEventListener(

        "click",

        (event) => {


            const button =
                event.target.closest(
                    ".add-to-cart"
                );


            if (!button) {
                return;
            }


            const burgerId =
                button.dataset.id;


            /* Add burger */

            addToCart(
                burgerId
            );


            /* =========================
               BUTTON FEEDBACK
            ========================= */

            const buttonText =
                button.querySelector(
                    ".button-text"
                );


            if (!buttonText) {
                return;
            }


            const originalText =
                buttonText.textContent;


            buttonText.textContent =
                "Added ✓";


            button.classList.add(
                "added"
            );


            button.disabled =
                true;


            setTimeout(

                () => {


                    buttonText.textContent =
                        originalText;


                    button.classList.remove(
                        "added"
                    );


                    button.disabled =
                        false;


                },

                1000

            );


        }

    );


}


/* =========================
   FILTER BURGERS
========================= */

filterButtons.forEach(

    (button) => {


        button.addEventListener(

            "click",

            () => {


                /* =========================
                   REMOVE ACTIVE STATE
                ========================= */

                filterButtons.forEach(

                    (btn) => {

                        btn.classList.remove(
                            "active"
                        );

                    }

                );


                /* =========================
                   ACTIVATE BUTTON
                ========================= */

                button.classList.add(
                    "active"
                );


                /* Get selected category */

                const category =
                    button.dataset.filter;


                /* =========================
                   SHOW ALL
                ========================= */

                if (
                    category === "all"
                ) {

                    displayBurgers();

                    return;

                }


                /* =========================
                   FILTER BURGERS
                ========================= */

                const filteredBurgers =
                    burgers.filter(

                        (burger) =>

                            burger.category ===
                            category

                    );


                displayBurgers(
                    filteredBurgers
                );


            }

        );


    }

);


/* =========================
   INITIALIZE MENU 
========================= */


loadBurgersFromFirestore();
updateCartCount();
