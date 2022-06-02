const BASE_URL = 'http://localhost:3000/api';
const ID_PRODUCT = new URLSearchParams(window.location.search).get("id");
var btnAddToCart = document.getElementById("addToCart");
var quantity = document.getElementById('quantity');

quantity.addEventListener('change', () => {
    if (quantity.value > 100) {
        quantity.value = 100;
    }
    if (quantity.value < 0) {
        quantity.value = 0;
    }
})

/**
 * Send fetch request to API for GET product using ID
 */
function getProduct() {
    fetch(`${BASE_URL}/products/${ID_PRODUCT}`)
        .then((res) => {
            return res.json();
        })
        .then((product) => {
            printProduct(product)
        })
        .catch((err) => {
            console.log(err);
        })
};


/**
 * Print product
 * @param {Object} product 
 */
function printProduct(product) {
    document.title = product["name"];
    let imgContainer = document.getElementById("image");
    let img = document.createElement("img");
    img.src = product["imageUrl"];
    img.alt = product["altTxt"];
    imgContainer.appendChild(img);

    let title = document.getElementById("title");
    title.textContent = product["name"];

    let price = document.getElementById("price");
    price.textContent = product["price"];

    let description = document.getElementById("description");
    description.textContent = product["description"];

    let select = document.getElementById("colors");

    for (color in product["colors"]) {
        let option = document.createElement('option');
        option.value = product["colors"][color];
        option.textContent = product["colors"][color];
        select.appendChild(option);
    }
}

btnAddToCart.addEventListener("click", () => {
    isInLocalStorage() ? updateProduct() : addToCart();
})

/**
 * Check if product exist in localstorage
 * @returns { Bool }
 */
function isInLocalStorage() {
    let cart;
    if (localStorage.getItem("cart") === null) {
        localStorage.setItem("cart", JSON.stringify({}));
    }
    cart = JSON.parse(localStorage.getItem("cart"));
    return ID_PRODUCT in cart;

}

/**
 * Add product to localstorage
 */
function addToCart() {
    let quantity = parseInt(document.getElementById("quantity").value);
    let color = document.getElementById("colors").value;

    if (isFormValid(quantity, color)) {
        let product = { [color]: quantity }

        let cart = JSON.parse(localStorage.getItem("cart"));
        cart[ID_PRODUCT] = product;

        localStorage.setItem("cart", JSON.stringify(cart));
    }
}

/**
 * Upate Cart Product. If product exist increase quantity else add new color
 */
function updateProduct() {
    let color = document.getElementById("colors").value;
    let quantity = parseInt(document.getElementById("quantity").value);
    if (isFormValid(quantity, color)) {
        let cart = JSON.parse(localStorage.getItem("cart"));
        let product = cart[ID_PRODUCT];

        if (product.hasOwnProperty(color)) {
            product[color] += quantity;
            cart[ID_PRODUCT] = product;
            localStorage.setItem('cart', JSON.stringify(cart));
        } else {
            product[color] = quantity;
            cart[ID_PRODUCT] = product;
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }
}

/**
 * Check if quantity > 0 and color != empty
 * @param {int} quantity 
 * @param {string} color 
 * @returns bool
 */
function isFormValid(quantity, color) {
    let isValid = false;
    if (quantity != '0' && color != "")
        isValid = true;
    return isValid;
}

getProduct();