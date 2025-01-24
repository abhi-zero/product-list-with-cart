import { createElementWithClass, getData } from "./main.js";

export let cart = JSON.parse(localStorage.getItem("cartItems")) || [];

class CartItem {
  constructor(cartItemId, quantity, data) {
    this.cartItemId = cartItemId;
    this.quantity = quantity;
    this.name = data.name;
    this.price = data.price;
    this.image = data.image.thumbnail; 
  }
}

export function addToCart(event, quantity) {
  const productId = event.target.closest(".cta")?.dataset?.itemid;
  const quantityValue = parseInt(quantity.textContent, 10);

  // Validate
  if (!productId) {
    console.error("Invalid product ID");
    return;
  }
  if (isNaN(quantityValue)) {
    console.error("Invalid quantity value");
    return;
  }

  saveItemInToCart(productId, quantityValue);
  displayItemCount();
 
  return true;
}

async function saveItemInToCart(productId, quantityValue) {
  try {
    const data = await getData();
    // Fetch the product data from the API
    // Check if the item is already in the cart
    const isPresent = cart.some((item) => item.cartItemId == productId);
    if (!isPresent) {
      const item = await new CartItem(productId, quantityValue, data[productId]);
      cart.push(item);
    } else if (quantityValue == 0 && isPresent) {
      const index = cart.findIndex((item) => item.cartItemId == productId);
      if (index !== -1) {
        cart.splice(index, 1);
      }
    } else {
      const item = cart.find((elem) => elem.cartItemId == productId)
      item.quantity = quantityValue;
    }

    console.log(productId, quantityValue);
    
    storeCartItemsInLocalStorage();
    generateItemForCart();
  } catch (error) {
    console.error("Error fetching data:", error);
    return;
  }
  
  return true;
}

function displayItemCount() {
  const totalCartedItem = document.querySelector(".carted-items");
  totalCartedItem.textContent = cart.length;
  return true;
}

function storeCartItemsInLocalStorage() {
  localStorage.setItem("cartItems", JSON.stringify(cart));
  return true;
}




function generateItemForCart() {
  // generate item for cart
  const ulList = document.querySelector("#cart-items");
  ulList.innerHTML = "";
  cart.forEach((item) => {
    const li = document.createElement("li");
    
    const paraItemName = createElementWithClass(
      "p",
      "item-name",
      item.name
    );
    const spanQuantityPrice = createElementWithClass(
      "span",
      "item-quantity-price"
    );
  
    const paraItemQuantity = createElementWithClass(
      "p",
      "item-quantity",
       item.quantity
    );
    const spanXSymbol = createElementWithClass(
      "span",
      "x",
      "x"
    )
    
    
    const paraItemPrice = createElementWithClass(
      "p",
      "item-price",
    )
    paraItemPrice.innerHTML =  `@ <span class="currency-symbol">$</span>${item.price}`
  
    const paraItemTotalPrice = createElementWithClass(
      "p",
      "item-total-price",
    );
    paraItemTotalPrice.innerHTML = `<span class="currency-symbol">$</span>${item.price * item.quantity}`
  
    const buttonDeleteItem = createElementWithClass(
      "button",
      "delete-item-cta",
    );
    buttonDeleteItem.setAttribute("aria-label", "Remove Item from cart");
    const paraButtonText = document.createElement('p');
    paraButtonText.textContent = "x";
  
    ulList.append(li)
    li.append(paraItemName, spanQuantityPrice, buttonDeleteItem);
    spanQuantityPrice.append(paraItemQuantity, paraItemPrice, paraItemTotalPrice);
    paraItemQuantity.prepend(spanXSymbol);
    buttonDeleteItem.append(paraButtonText);
  })
  
 
  return ulList;
}

