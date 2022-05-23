let totalQuantity = 0;
let totalPrice = 0;
let totalQuantitySpan = document.getElementById('totalQuantity');
let totalPriceSpan = document.getElementById('totalPrice');
const orderBtn = document.getElementById("order");
const validEmail = (email) => {
    let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    return regex.test(email);
}
const hasNumber = (string) => {
    return /\d/.test(string);
}

/**
 * Get cart from localstorage
 * @returns JSON
 */
function getCart(){
    if (localStorage.getItem("cart") === null) {
        localStorage.setItem("cart", JSON.stringify({}));
    }
    return JSON.parse(localStorage.getItem('cart'));
}

/**
 * Fetch product by id from API
 * @param {string} id 
 */
function fetchProductById(id){
    fetch(`http://localhost:3000/api/products/${id}`)
    .then((res) => {
        return res.json();
    })
    .then((result) => {
        printProduct(id, result);
    })
    .catch((err) => {
        console.log(err);
    })
}

/**
 * Print product on page
 * @param {string} id 
 * @param {object} result 
 */
function printProduct(id, result){
    let section = document.getElementById("cart__items");
    let cart = getCart();
    for(let color in cart[id]){
        let quantity = cart[id][color];
        let article = document.createElement('article');
            article.classList.add('cart__item');
            article.dataset.id = id;
            article.dataset.color = color;

            let divImg = document.createElement('div');
            divImg.classList.add('cart__item__img');

            let img = document.createElement('img');
            img.src = result['imageUrl'];
            img.alt = result["altTxt"];

            divImg.appendChild(img);

            let divCartItemContent = document.createElement('div');
            divCartItemContent.classList.add('cart__item__content');

            let divCartItemDescription = document.createElement('div');
            divCartItemDescription.classList.add('cart__item__content__description');

            let productName = document.createElement('h2');
            productName.textContent = result["name"];

            let productColor = document.createElement('p');
            productColor.textContent = color;

            let productPrice = document.createElement('p');
            productPrice.textContent = `${result["price"]} €`;

            divCartItemDescription.appendChild(productName);
            divCartItemDescription.appendChild(productColor);
            divCartItemDescription.appendChild(productPrice);

            let divCartItemSettings = document.createElement('div');
            divCartItemSettings.classList.add('cart__item__content__settings');

            let divCartItemQuantity = document.createElement('div');
            divCartItemQuantity.classList.add('cart__item__content__settings__quantity');

            let productQuantity = document.createElement('p');
            productQuantity.textContent = 'Qté : ';

            let inputQuantity = document.createElement('input');
            inputQuantity.type = 'number';
            inputQuantity.classList.add('itemQuantity');
            inputQuantity.name = 'itemQuantity';
            inputQuantity.min = "1";
            inputQuantity.max = "100";
            inputQuantity.value = quantity;

            inputQuantity.addEventListener("change", () => {
                let qte = inputQuantity.value;
                if(qte >= 100){
                    qte = 100;
                    inputQuantity.value = qte;
                } else if(qte <= 0){
                    qte = 1;
                    inputQuantity.value = qte;
                }
                updateCartPriceQuantity(id, color, qte, result['price']);
            })
            
            divCartItemQuantity.appendChild(productQuantity);
            divCartItemQuantity.appendChild(inputQuantity);


            let divDeleteItem = document.createElement('div');
            divDeleteItem.classList.add('cart__item__content__settings__delete');

            let deleteBtn = document.createElement('p');
            deleteBtn.classList.add('deleteItem');
            deleteBtn.textContent = 'Supprimer';

            deleteBtn.addEventListener('click', () => {
                deleteProductFromCart(id, color, cart[id][color], result['price']);
            })

            divDeleteItem.appendChild(deleteBtn);

            divCartItemSettings.appendChild(divCartItemQuantity);
            divCartItemSettings.appendChild(divDeleteItem);

            divCartItemContent.appendChild(divCartItemDescription);
            divCartItemContent.appendChild(divCartItemSettings);

            article.appendChild(divImg);
            article.appendChild(divCartItemContent);
            article.appendChild(divCartItemContent);

            section.appendChild(article);

            setTotalQuantityAndPrice(1, quantity, result["price"]);
    }
}

/**
 * Init cart, load ID and product
 */
function loadCart(){
    totalQuantity = 0;
    totalPrice = 0;
    let ids = Object.keys(getCart());
    ids.forEach(id => {
        fetchProductById(id);
    });
}

/**
 * Update price and quantity 
 * @param {string} id 
 * @param {string} color 
 * @param {int} newQte 
 * @param {int} price 
 */
function updateCartPriceQuantity(id, color, newQte, price){
    let cart = getCart();
    let oldQte = cart[id][color];
    let qte;
    if(newQte > oldQte){
        let qteToAdd = newQte - oldQte;
        qte = oldQte + qteToAdd;
        setTotalQuantityAndPrice(1, qteToAdd, price);
    } else {
        let qteToSubstract = oldQte - newQte;
        qte = oldQte - qteToSubstract;
        setTotalQuantityAndPrice(2, qteToSubstract, price);
    }
    updateCart(id, color, qte);
}

/**
 * Update cart in localstorage
 * @param {string} id 
 * @param {string} color 
 * @param {int} qte 
 */
function updateCart(id, color, qte){
    let cart = getCart();
    let product = cart[id];
    product[color] = qte
    cart[id] = product;
    localStorage.setItem('cart', JSON.stringify(cart));
}

/**
 * Set total quantity and total price using type 1 : add, 2 : substract
 * @param {int} type 
 * @param {int} quantity 
 * @param {int} price 
 */
 function setTotalQuantityAndPrice(type, quantity, price) {
    if(type === 1){
        totalQuantity += quantity;
        totalPrice += quantity * price;
    } else if(type === 2) {
        totalQuantity -= quantity;
        totalPrice -= quantity * price;        
        console.log(quantity, price, totalPrice, totalQuantity);
    }
    totalQuantitySpan.textContent = totalQuantity;
    totalPriceSpan.textContent = totalPrice;
}

/**
 * Delete product from cart
 * @param {string} id
 * @param {string} color
 */
function deleteProductFromCart(id, color, qte, price) {
    let cart = getCart();
    let product = cart[id];
    let productContainer = document.getElementById('cart__items');
    if (Object.keys(product).length > 1) {
        delete product[color];
        cart[id] = product;
        localStorage.setItem('cart', JSON.stringify(cart));
    } else {
        delete cart[id];
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    productContainer.textContent = '';
    console.log(`Fonction deleteFromProductCart, quantité : ${qte}, prix : ${price}`)
    setTotalQuantityAndPrice(2, qte, price)
    loadCart();
}

loadCart();

orderBtn.addEventListener("click", (e) => {
    e.preventDefault();
    isFormCorrect();
})

/**
 * Check form validity
 */
function isFormCorrect(){
    let valid = true;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const addr = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const email = document.getElementById('email').value;

    if(hasNumber(firstName)){
        errorMessage('Prénom invalide il ne doit pas contenir de chiffre.', 'firstNameErrorMsg');
        valid = false;
    }
    if(firstName === ''){
        errorMessage('Le champ prénom ne peut être vide.', 'firstNameErrorMsg');
        valid = false;
    }
    if(hasNumber(lastName)){
        errorMessage('Nom invalide il ne doit pas contenir de chiffre.', 'lastNameErrorMsg');
        valid = false;
    }
    if(lastName === ''){
        errorMessage('Le champ nom ne peut être vide.', 'lastNameErrorMsg');
        valid = false;
    }
    if(addr === ''){
        errorMessage('Le champ addresse ne peut être vide.', 'addressErrorMsg');
        valid = false;
    }
    if(city === ''){
        errorMessage('Le champ ville ne peut être vide.', 'cityErrorMsg');
        valid = false;
    }
    if(!validEmail(email)){
        errorMessage('Addresse email invalide.', 'emailErrorMsg');
        valid = false;
    }

    if(valid){
        let ids = Object.keys(getCart());
        postForm(firstName, lastName, addr, city, email, ids);
    }
}

/**
 * Post contact object and products [] to backend
 * @param {string} firstName 
 * @param {string} lastName 
 * @param {string} addr 
 * @param {string} city 
 * @param {string} email 
 * @param {array} ids 
 */
function postForm(firstName, lastName, addr, city, email, ids){
    fetch('http://localhost:3000/api/products/order', {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            contact: {
                firstName: firstName,
                lastName: lastName,
                address: addr,
                city: city,
                email: email
            },
            products: ids
        }),
    })
    .then((res) => {
        return res.json();
    })
    .then((result) => {
        localStorage.clear()
        document.location.href = `confirmation.html?commande=${result.orderId}`
    })
    .catch((err) => {
        console.log(err);
    })
}

/**
 * Change text error of dom element
 * @param {string} string 
 * @param {DomElement} divId 
 */
function errorMessage(string, divId){
    let errorContainer = document.getElementById(divId);
    errorContainer.textContent = string;
}
