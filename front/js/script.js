/**
 * Une fonction qui prend en paramètre un produit
 * sous forme d'objet
 * ex: product = { _id: 1, name: "", description: "", price: 0 }
 * génère le html d'un produit 
 * sous forme de string en utilisant les 'template string' (``)
 * grace auxquelle on peut écrire directement des variables
 * à l'intérieur de notre string
 */
function generateProductHtml (product) {
    let htmlProduct = ` 
        <a href="./product.html?id=${product._id}">
            <article>
                <img src= "${product.imageUrl}" alt="${product.description}">
                <h3 class="productName">${product.name}</h3>
                <p class="productDescription">${product.description}</p>
            </article>
        </a>
    `;
    return htmlProduct;
}

/**
 * Une fonction qui prend en paramètre un tableau de produits
 * et genere le html pour chacun de ces produits
 */
async function displayProducts(products) {
    // On selectionne l'élement html qui contiendra notre liste
    let productListContainer = document.querySelector("#items");
    // On vide l'interieur de la div container pour y générer notre liste de produits
    productListContainer.innerHTML = "";

    // On boucle sur notre liste de produits
    for (let i = 0; i < products.length; i++) {
        // Pour chaque produit de notre liste de produits
        const product = products[i];
        // On vient concatener le html généré via les données du produit
        productListContainer.innerHTML += generateProductHtml(product);   
    }
}


/**
 * Une fonction asynchrone (pour pouvoir utiliser await) qui récupère la liste
 * des produits 
 * depuis l'api et les affiche dans la page
 */
async function getProducts() {
    // On effectue la requete http sur l'api des produits qui nous retourne une réponse 
    const response = await fetch ("http://localhost:3000/api/products");
    
    // On transforme la réponse en object javascript (un tableau de produits sous forme d'objet dans notre cas)
    // ex: [ { id: 1, nom: "toto"}, { id: 2, nom: "tata" }]
    productList = await response.json();

    // On utilise affiche les produits à partir du tableau récupéré
    await displayProducts (productList);
}

// On appelle getProducts
getProducts();
