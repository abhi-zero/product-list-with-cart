import { cart } from "./cart.js";
import { createElementWithClass } from "./main.js";
const modalUl = document.querySelector(".modal-ul");

export function generateItemForModal() {
  modalUl.innerHTML = "";  // Clear existing items in modal before adding new ones
  const fragment = document.createDocumentFragment();
  cart.forEach((item) => {

    const modalLi = createElementWithClass("li", "ordered-item");
    
    const imgItem = document.createElement("img");
    imgItem.setAttribute("src", item.image);
    imgItem.setAttribute("alt", `Thumbnail of ${item.name}`);

    const paraItemName = createElementWithClass("p", "item-name", item.name);

    const spanQuantityPrice = createElementWithClass(
      "span",
      "item-quantity-price"
    );

    const paraItemQuantity = createElementWithClass(
      "p",
      "item-quantity",
      item.quantity
    );
    const spanXSymbol = createElementWithClass("span", "x", "x");

    const paraItemPrice = createElementWithClass("p", "item-price");
    const spanCurrencySymbol = createElementWithClass("span", "currency-symbol", "$");
    paraItemPrice.append(spanCurrencySymbol, document.createTextNode(item.price));

    const paraItemTotalPrice = createElementWithClass("p", "item-total-price");
    const spanTotalCurrencySymbol = createElementWithClass("span", "currency-symbol", "$");
    paraItemTotalPrice.append(spanTotalCurrencySymbol, document.createTextNode(item.price * item.quantity));

    fragment.append(modalLi);
    modalLi.append(imgItem, paraItemName, spanQuantityPrice, paraItemTotalPrice);
    spanQuantityPrice.append(paraItemQuantity, paraItemPrice);
    paraItemQuantity.prepend(spanXSymbol)
  });
  modalUl.append(fragment);
}
 


