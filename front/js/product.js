// une fonction qui recupere le panier actuel
async function getCart() {
  // On récupère le panier dans le local storage
  let cart = localStorage.getItem("cart");

  // Si le local storage est vide pour la clé cart
  if (cart === null) {
    // on initialize notre panier avec un tableau vide
    cart = JSON.stringify([]);
    localStorage.setItem("cart", cart);
  }
  // On retourne notre panier sous forme d'object
  return JSON.parse(cart);
}

// une fonction qui ajoute le produit au panier en utilisant le panier actuel
async function addProductToCart(product) {
  if(product.color === "") {
    return alert("Veuillez choisir une couleur");
  }
  
  // On récupère le panier actuel dans le local storage via notre function
  const currentCart = await getCart();


  // On regarde si un produit avec le meme _id et la meme couleur existe dans le panier
  const foundProduct = currentCart.find(
    (cartItem) => cartItem._id === product._id && cartItem.color === product.color
  );

  // Si un produit existe
  if (foundProduct !== undefined) {
    foundProduct.quantity = parseInt(foundProduct.quantity) + parseInt(product.quantity);
  } else {
    // si le produit n'existe pas
    // On ajoute notre produit dans le panier
    currentCart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(currentCart));
  alert("Vous venez d'ajouter un produit au panier");
}

/* Une fonction asynchrone qui permet d'aller récupérer dans le html, le prix, le titre, la description, l'image et la couleur 
sous forme de string en utilisant les " templates string " grace auxquelle on peut écrire directement des variables
 * à l'intérieur de notre string */
async function displayProduct(product) {
  const titleContainer = document.querySelector("#title");
  const priceContainer = document.querySelector("#price");
  const descriptionContainer = document.querySelector("#description");
  const imageContainer = document.querySelector("#image");
  const colorsInput = document.querySelector("#colors");
  const quantityInput = document.querySelector("#quantity");
  const addProductButton = document.querySelector("#addToCart");

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
  imageContainer.innerHTML = `<img src="${product.imageUrl}" alt="${product.description}">`;

  // On boucle sur notre liste de couleur
  for (let i = 0; i < product.colors.length; i++) {
    // pour chaque couleur
    const color = product.colors[i];
    colorsInput.innerHTML += `<option value="${color}">${color}</option>`;
  }

  // On attache une fonction à l'évenement onclick du bouton #addToCart
  addProductButton.onclick = function () {
    if(quantityInput.value <= 0) {
      return alert("Veuillez entrer un quantité")
    }
    // On crée notre produit à ajouter
    const productToAdd = {
      _id: product._id,
      name: product.name,
      description: product.description,
      imageUrl: product.imageUrl,
      color: colorsInput.value, // on récupère la valeur du select des couleurs
      quantity: quantityInput.value, // on récupère la valeur de l'input de la quantité
    };

    // On appelle notre fonction addProductToCart avec notre produit à ajouter
    addProductToCart(productToAdd);
  };
}

/*
 * Une fonction asynchrone (pour pouvoir utiliser await)
 * qui récupère un produit par son id
 * depuis l'api et les affiches dans la page
 */
async function getProduct(productId) {
  // On effectue la requete http sur l'api des produits qui nous retourne une réponse
  const response = await fetch(
    "http://localhost:3000/api/products/" + productId
  );
  // On transforme la réponse en object javascript (un tableau de produits sous forme d'objet dans notre cas)
  const product = await response.json();


  // On utilise pour afficher les produits à partir du tableau récupéré
  await displayProduct(product);
}

// L'interface URLSearchParams définit des méthodes utilitaires pour travailler avec la chaîne de requête (les paramètres GET) d'une URL
const urlSearchParams = new URLSearchParams(window.location.search);
// Retourne un iterator permettant de parcourir toutes les paires clé / valeur contenues dans cet objet.
const params = Object.fromEntries(urlSearchParams.entries());

// L'instruction if exécute une condition, dans notre cas !== veux dire "L'opérateur d'inégalité stricte"
if (params.id !== undefined) {
  getProduct(params.id);
}
