/**
 * get all product
 */
function getProducts() {
    fetch('http://localhost:3000/api/products')
        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then((values) => {
            printProduct(values);
        })
        .catch(function (err) {
            console.log(err);
        })
}

/**
 * Print all products
 * @param {Object} products 
 */
function printProduct(products){
    let itemsContainer = document.getElementById('items');
            for (let value in products) {
                let link = document.createElement('a');
                link.href = `./product.html?id=${products[value]['_id']}`;

                let article = document.createElement('article');
                link.appendChild(article);

                let img = document.createElement('img');
                img.src = `${products[value]["imageUrl"]}`;
                img.alt = `${products[value]["altTxt"]}`;
                article.appendChild(img);

                let h3 = document.createElement('h3');
                h3.className = 'productName';
                h3.textContent = products[value]['name'];
                article.appendChild(h3);

                let p = document.createElement('p');
                p.className = 'productDescription';
                p.textContent = products[value]['description']
                article.appendChild(p);

                itemsContainer.appendChild(link);
            }
}

getProducts();