// une fonction qui recupere le panier actuel
async function getCart() {
  // On récupère le panier dans le local storage
  let cart = localStorage.getItem("cart");

  // Si le local storage est vide pour la clé cart
  if (cart === null) {
    // on initialize notre panier avec un tableau vide
    cart = JSON.stringify([]);
    // on écrit dans le localstorage notre panier initial
    localStorage.setItem("cart", cart);
  }
  // On retourne notre panier sous forme d'object
  return JSON.parse(cart);
}

async function displayTotalPrice() {
  const cartItems = await getCart();
  let price = 0;

  // Pour chaque item dans notre panier
  for (const cartItem of cartItems) {
    price += parseInt(cartItem.quantity) * parseInt(cartItem.price);
  }

  // On affiche le prix total
  const totalPriceContainer = document.querySelector("#totalPrice");
  totalPriceContainer.innerHTML = formatPrice(price);
}

async function updateItemQuantity(productId, productColor, newQuantity) {
  if (parseInt(newQuantity) >= 100) {
    alert("Vous ne pouvez pas ajouter plus de 100 articles similaires");
  }

  const currentCart = await getCart();

  const elementToUpdate = currentCart.find(
    (cartItem) => cartItem._id === productId && cartItem.color === productColor
  );

  const index = currentCart.indexOf(elementToUpdate);

  if (index > -1) {
    // Si la nouvelle quantité est inférieure ou égale à zero
    if (parseInt(newQuantity) <= 0) {
      // On supprime l'élément
      currentCart.splice(index, 1);
      window.location.reload();
    } else {
      // sinon
      // On applique la nouvelle valeur
      elementToUpdate.quantity = parseInt(newQuantity);
    }
  }

  // On réécrit le panier du localstorage avec la valeur du panier modifié
  localStorage.setItem("cart", JSON.stringify(currentCart));
  displayTotalPrice();
}

// On retire le produit
async function removeItemFromCart(productId, productColor) {
  const currentCart = await getCart();

  const elementToRemove = currentCart.find(
    (cartItem) => cartItem._id === productId && cartItem.color === productColor
  );

  const index = currentCart.indexOf(elementToRemove);
  console.log(elementToRemove);
  if (index > -1) {
    currentCart.splice(index, 1);
  }

  await localStorage.setItem("cart", JSON.stringify(currentCart));

  window.location.reload();
}
// On convertit obligatoirement en euro
function formatPrice(price) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(parseInt(price));
}
// On récupère le produit et on l'affiche dans le panier
function generateCartItemHtml(cartItem) {
  let htmlCartItem = `
      <article class="cart__item" data-id="${cartItem._id}" data-color="${
    cartItem.color
  }">
                <div class="cart__item__img">
                  <img src="${cartItem.imageUrl}" alt="${cartItem.description}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${cartItem.name}</h2>
                    <p>${cartItem.color}</p>
                    <p>${formatPrice(cartItem.price)} </p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${
                        cartItem.quantity
                      }">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
            </article>
  `;

  return htmlCartItem;
}

// ??
async function displayCart() {
  // On récupère le container du panier
  const cartContainer = document.querySelector("#cart__items");

  if (cartContainer === null) {
    return;
  }

  // On récupère le panier
  const cartItems = await getCart();

  // On s'assure que le html du panier est vide
  cartContainer.innerHTML = "";
  // Pour chaque item du panier
  for (const cartItem of cartItems) {
    // On insere l'élément html
    cartContainer.innerHTML += generateCartItemHtml(cartItem);
  }

  const cartItemsDOM = document.querySelectorAll(".cart__item");
  console.log(cartItemsDOM);

  cartItemsDOM.forEach((cartItem) => {
    const productId = cartItem.dataset.id;
    const color = cartItem.dataset.color;

    // On supprime un produit en clickant sur le bouton supprimé
    cartItem
      .querySelector(".deleteItem")
      .addEventListener("click", function (event) {
        removeItemFromCart(productId, color);
      });

    // On ajoute un évenement au changement de l'input
    cartItem
      .querySelector(".itemQuantity")
      .addEventListener("change", function (event) {
        //On récupère la quantité dans via la nouvelle valeur de l'input
        let value = event.target.value;
        updateItemQuantity(productId, color, value);
      });
  });

  displayTotalPrice()
}

displayCart();

const button = document.querySelector("#order");

// On vérifie que l'email est bien noté
function isEmailValid(email) {
  let re =
    /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
  return re.test(email);
}
// On valide le formulaire
async function validateForm(event) {
  event.preventDefault();
  // Par défaut le formulaire est valide
  const lastNameInput = document.querySelector("#lastName");
  const firstNameInput = document.querySelector("#firstName");
  const addressInput = document.querySelector("#address");
  const cityInput = document.querySelector("#city");
  const emailInput = document.querySelector("#email");

  // On vérifie que les champs sont valides
  const isFormValid =
    lastNameInput.value.length !== 0 &&
    firstNameInput.value.length !== 0 &&
    addressInput.value.length !== 0 &&
    cityInput.value.length !== 0 &&
    isEmailValid(emailInput.value);

  // On construit l'object contact
  let contactData = {
    lastName: lastNameInput.value,
    firstName: firstNameInput.value,
    address: addressInput.value,
    city: cityInput.value,
    email: emailInput.value,
  };

  const cartItems = await getCart();
  const productIds = cartItems.map((item) => item._id); // un tableau d'ids

  const orderData = {
    contact: contactData,
    products: productIds,
  };

  // si le formulaire est toujours valide
  if (isFormValid) {
    // on confirme le panier
    confirmCart(orderData);
  } else {
    // sinon on invalide le panier
    invalidCart();
  }
}

if (button !== null) {
  button.addEventListener("click", validateForm);
}
// On affiche le numéro de commande
async function sendOrder(orderData) {
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json", // le format de ce qu'on veut en retour
      "Content-Type": "application/json", // le format de ce qu'on envoie
    },
    body: JSON.stringify(orderData), // data c'est l'object qui contiendra ce qu'on veut envoyer
  };
  try {
    const response = await fetch(
      "http://localhost:3000/api/products/order",
      options
    );
    const result = await response.json();
    return result;
  } catch (err) {
    console.error(err);
    return false;
  }
}
// On confirme la commande
async function confirmCart(orderData) {
  const result = await sendOrder(orderData);
  if (result !== false) {
    const orderId = result.orderId;
    // Vider le localStorage
    localStorage.clear();
    // Remplacer par une URL propre (let url = )
    window.location.assign(
      "http://127.0.0.1:5500/front/html/confirmation.html?orderId=" + orderId
    );
  }
}
// Affiche une erreur si le client remplit mal le formulaire
function invalidCart() {
  window.alert(
    "Merci de bien vouloir remplir correctement les champs ci-dessous"
  );
}

// ??
function displayOrderId(orderId) {
  const orderIdContainer = document.querySelector("#orderId");
  orderIdContainer.textContent = orderId;
}

// L'interface URLSearchParams définit des méthodes utilitaires pour travailler avec la chaîne de requête (les paramètres GET) d'une URL
const urlSearchParams = new URLSearchParams(window.location.search);
// Retourne un iterator permettant de parcourir toutes les paires clé / valeur contenues dans cet objet.
const params = Object.fromEntries(urlSearchParams.entries());

if (params.orderId !== undefined) {
  displayOrderId(params.orderId);
}

// Gestion de la modification de quantité
function changeQuantity() {
  document.querySelectorAll(".itemQuantity").forEach((btn) => {
    btn.addEventListener("change", (e) => {
      for (let l = 0; l < cartItem.length; l++) {
        if (
          cartItem._id === e.target.dataset.id &&
          cartItem.color === e.target.dataset.color
        ) {
          cartItem.quantity = e.target.value;
          localStorage.setItem("panier", JSON.stringify(cartItem));
          calculTotal();
          window.location.reload();
          return;
        }
      }
    });
  });
}
