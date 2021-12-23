/* Une fonction asynchrone qui permet d'aller récupérer dans le html, le prix, le titre, la description, l'image et la couleur 
sous forme de string en utilisant les " templates string " grace auxquelle on peut écrire directement des variables
 * à l'intérieur de notre string */
async function displayProduct(product) {
    const titleContainer = document.querySelector('#title')
    const priceContainer = document.querySelector('#price')
    const descriptionContainer = document.querySelector('#description')
    const imageContainer = document.querySelector('#image');
    const colorsContainer = document.querySelector('#colors');

     // On vide l'interieur de la div container pour y générer notre nom
     // On vient concatener le html généré via les données du produit
    titleContainer.innerHTML = product.name;
     // On vide l'interieur de la div container pour y générer notre prix
     // On vient concatener le html généré via les données du produit
    priceContainer.innerHTML = product.price;
     // On vide l'interieur de la div container pour y générer notre description
     // On vient concatener le html généré via les données du produit
    descriptionContainer.innerHTML = product.description;
     // On vide l'interieur de la div container pour y générer notre couleur
     // On vient concatener le html généré via les données du produit
    imageContainer.innerHTML = `<img src="${product.imageUrl}" alt="${product.description}">`

    // On boucle sur notre liste de couleur 
    for (let i = 0; i < product.colors.length; i++) {
        // pour chaqur couleur
        const color = product.colors[i];
        colorsContainer.innerHTML += `<option value="${color}">${color}</option>`
    }
    
}

/*
 * Une fonction asynchrone (pour pouvoir utiliser await) qui récupère la liste
 * des produits 
 * depuis l'api et les affiches dans la page
 */
async function getProduct(productId) {
    // On effectue la requete http sur l'api des produits qui nous retourne une réponse 
    const response = await fetch ("http://localhost:3000/api/products/" + productId);
    console.log(response)
    // On transforme la réponse en object javascript (un tableau de produits sous forme d'objet dans notre cas)
    const product = await response.json();
    
    console.log(product);

// On utilise pour afficher les produits à partir du tableau récupéré
    await displayProduct(product);
}

// L'interface URLSearchParams définit des méthodes utilitaires pour travailler avec la chaîne de requête (les paramètres GET) d'une URL
const urlSearchParams = new URLSearchParams(window.location.search);
// Retourne un iterator permettant de parcourir toutes les paires clé / valeur contenues dans cet objet.
const params = Object.fromEntries(urlSearchParams.entries());

// L'instruction if exécute une condition, dans notre cas !== veux dire "L'opérateur d'inégalité stricte"
if(params.id !== undefined) {
    getProduct(params.id)
}