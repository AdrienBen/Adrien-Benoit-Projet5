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

function formatPrice(price) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(parseInt(price))
}

function generateCartItemHtml(cartItem) {
  let htmlCartItem = `
      <article class="cart__item" data-id="{${cartItem._id}}" data-color="{${cartItem.color}}">
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
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cartItem.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
            </article>
  `;
  console.log(cartItem);

  return htmlCartItem;
}

  

async function getTotalPrice(cartItems) {
  let price = 0;

  // Pour chaque item dans notre panier
  for (const cartItem of cartItems) {
    price += parseInt(cartItem.quantity) * parseInt(cartItem.price);
  }
  return formatPrice(price);
}

async function displayCart() {
  // On récupère le container du panier
  const cartContainer = document.querySelector("#cart__items");
  // On récupère le panier
  const cartItems = await getCart();

  // On s'assure que le html du panier est vide
  cartContainer.innerHTML = '';
  // Pour chaque item du panier
  for (const cartItem of cartItems) {
    cartContainer.innerHTML += generateCartItemHtml(cartItem);
  }
  // On affiche le prix total
  const totalPriceContainer = document.querySelector("#totalPrice");
  totalPriceContainer.innerHTML = await getTotalPrice(cartItems);
}


displayCart();

const fields = document.querySelectorAll(".cart__order__form__question input")
console.log(fields)

const button = document.querySelector("#order")
console.log(button)

function isEmailValid(email) {
  let re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
  return re.test(email);
}

function validateForm(event) {
  // Par défaut le formulaire est valide
  let isFormValid = true;
  
  event.preventDefault();

  // On parcoure les champs
  fields.forEach( function(field) {
    
    // Si un champs n'est pas valide
    if(field.value.length === 0) {

      // on invalide le formulaire
      isFormValid = false;

    } else if(field.type === "email") {
      isFormValid = isEmailValid(field.value);
    }
    
  })

  // si le formulaire est toujours valide
  if(isFormValid){

    // on confirme le panier
    confirmCart();
  } else {
    // sinon on invalide le panier
    invalidCart();
  }
}
button.addEventListener("click", validateForm)

function confirmCart(){
  // Vider le localStorage
  localStorage.clear();
  // Remplacer par une URL propre (let url = )
  window.location.assign("http://127.0.0.1:5500/front/html/confirmation.html")
}

function invalidCart(){
  window.alert("Merci de bien vouloir remplir correctement les champs ci-dessous")
}

