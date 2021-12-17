function generateProductHtml (product) {
    let htmlProduct = `
    <a href="./product.html?id=${product._id}">
        <article>
            <img src="${product.imageUrl}" alt="${product.description}">
             <h3 class="productName">${product.name}</h3>
            <p class="productDescription">${product.description}</p>
     </article>
    </a>
    `;
    return htmlProduct;
}

async function displayProducts(products, container) {
    let productListContainer = document.querySelector ("#items");
    productListContainer.innerHTML = "";

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        productListContainer.innerHTML += generateProductHtml(product);
        
    }
}

async function getProducts() {
    const response = await fetch ("http://localhost:3000/api/products");
    productList = await response.json();

    await displayProducts (productList);
}

getProducts();
