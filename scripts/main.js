
import {cart, addToCart}  from "./cart.js";

const modal = document.querySelector("[data-modal]");
const ctaConfirmOrder = document.querySelector("[data-modal-open]");
const ctaCloseModal = document.querySelector("[data-modal-close]");


ctaConfirmOrder.addEventListener("click", () => {
  modal.showModal();
});

ctaCloseModal.addEventListener("click", () => {
  modal.close();
});


// This function fetches data from a JSON file and returns it as a Promise
async function getData() {
  const url = "../data/data.json";

  // Fetch data from the specified URL
  let response = await fetch(url);

  // Check if the response is not OK
  if (!response.ok) {
    throw new Error("Error fetching data");
  }

  // Parse the response as JSON and Return the fetched data
  return response.json();
}

function createElementWithClass(tag, classname = null, textContent = "") {
  const element = document.createElement(tag);
  element.className = classname;
  element.textContent = textContent;
  return element;
}

const main = document.querySelector("main");
const aside = document.querySelector("aside");

function createItemSection(item, index) {
  const section = createElementWithClass("section", "item");

  const divThumbnailCta = createElementWithClass("div", "thumbnail-cta");

  let pictureTag = document.createElement("picture");

  const sourceTablet = document.createElement("source");
  sourceTablet.setAttribute("media", "(min-width: 550px)");
  sourceTablet.setAttribute("srcset", `${item.image.tablet}`);

  const sourceDesktop = document.createElement("source");
  sourceDesktop.setAttribute("media", "(min-width: 1020px)");
  sourceDesktop.setAttribute("srcset", `${item.image.desktop}`);

  const imgTag = document.createElement("img");
  imgTag.setAttribute("src", `${item.image.mobile}`);
  imgTag.setAttribute("alt", `Thumbnail of ${item.name}`);

  const divCta = createElementWithClass("div", "cta");

  const divBtnAddToCart = createElementWithClass("div", "add-to-cart");
  divBtnAddToCart.setAttribute('data-ItemId', index)

  const paraAddToCart = createElementWithClass("p", "", "Add to Cart");

  const divBtnAddMore = createElementWithClass("div", "add-more");

  const divItemDetails = createElementWithClass("div", "item-details");

  const paraCategory = createElementWithClass("p", "category", item.category); // Replace with your actual item category

  const h3ItemTitle = createElementWithClass("h3", "item-title", item.name); // Replace with your actual item title

  const paraItemPrice = createElementWithClass("p", "item-price", item.price); // Replace with your actual item title

  const spanCurrencySymbol = createElementWithClass(
    "span",
    "currency-symbol",
    "$"
  );

  section.append(divThumbnailCta, divItemDetails);
  divThumbnailCta.append(pictureTag, divCta);
  pictureTag.append(sourceTablet, sourceDesktop, imgTag);
  divCta.append(divBtnAddToCart, divBtnAddMore);
  divBtnAddToCart.append(paraAddToCart);
  divBtnAddMore.innerHTML = `<button data-action="decrement"><p>-</p></button>
                      <p class="item-quantity">1</p>
                      <button data-action="increment"><p>+</p></button>`;
  divItemDetails.append(paraCategory);
  divItemDetails.append(paraCategory, h3ItemTitle, paraItemPrice);
  paraItemPrice.prepend(spanCurrencySymbol);

  divCta.addEventListener("click", (event) => {
    addAndRemoveCart(divBtnAddMore, divBtnAddToCart, event);
  });
  return section;
}

function createCartSection() {
  const h2Aside = createElementWithClass("h2", "");
  h2Aside.innerHTML = `Your Cart (<span class="carted-items">0</span>)`;

  const divCartPlacehorlder = createElementWithClass("div", "cart-placeholder");

  const divIllustration = createElementWithClass("div", "illustration");

  const imgIllustration = document.createElement("img");
  imgIllustration.setAttribute(
    "src",
    "./assets/images/illustration-empty-cart.svg"
  );
  imgIllustration.setAttribute(
    "alt",
    "Illustration showing an empty cart with no items"
  );

  const paraIllustration = createElementWithClass(
    "p",
    "description",
    "Your cart is empty. Add some desserts to get started!"
  );

  const divCartItemSection = createElementWithClass("div", "cart-item-section");

  let ulCartItems = document.createElement("ul");
  ulCartItems.setAttribute("id", "cart-items");
  /* li example
        <li>
                <p class="item-name">Classic Tiramisu</p>
                <span class="item-quantity-price">
                  <p class="item-quantity">1<span class="x">x</span></p>
                  <p class="item-price">@ <span
                      class="currency-symbol">$</span>505.50</p>
                  <p class="item-total-price"><span
                      class="currency-symbol">$</span>606.54</p>
                </span>
                <button class="delete-item-cta"
                  aria-label="Remove Item from cart"><p>x</p></button>
              </li>
        */

  const spanTotalPrice = createElementWithClass("span", "total-price");

  const paraTitleText = createElementWithClass("p", "title-text", "Order");

  const spanCurrencySymbol = createElementWithClass(
    "span",
    "currency-symbol",
    "$"
  );

  const paraTotalAmount = createElementWithClass("p", "total-amount", "45.25"); // add dynamicly

  const divMsg = createElementWithClass("div", "msg");
  divMsg.innerHTML = `This is a <strong>carbon-neutral</strong> delivery`;
  aside.append(h2Aside, divCartPlacehorlder);
  divCartPlacehorlder.append(divIllustration, divCartItemSection);
  divIllustration.append(imgIllustration, paraIllustration);
  divCartItemSection.append(
    ulCartItems,
    spanTotalPrice,
    divMsg,
    ctaConfirmOrder
  );
  spanTotalPrice.prepend(paraTitleText, paraTotalAmount);
  paraTotalAmount.prepend(spanCurrencySymbol);

  return aside;
}

async function renderItems() {
  try {
    const data = await getData();

    const fragment = document.createDocumentFragment();
    data.forEach((item, index) => {
      const section = createItemSection(item, index);
      fragment.append(section);
    });
    main.append(fragment);
  } catch (error) {
    main.innerHTML = "<p>Failed to load items. Please try again later.</p>";
  }
}

async function init() {
  createCartSection();
  await renderItems();
}

init();

function addAndRemoveCart(addSection, removeSection, event) {
  addSection.style.display = "flex";
  removeSection.style.display = "none";

  const cta = event.target.closest(".cta");

  const quantity = cta.querySelector(".item-quantity");

  // Determine the action (increment or decrement)
  const button = event.target.closest("button");
  const action = button?.dataset?.action;
 if (action === "increment") {
    quantity.textContent = parseInt(quantity.textContent) + 1;
  } else if (action === "decrement") {
    quantity.textContent = Math.max(0, parseInt(quantity.textContent) - 1);
    if (addSection.style.display == "flex" && quantity.textContent == "0") {
      setTimeout(() => {
        addSection.style.display = "none";
        removeSection.style.display = "block";
      }, 10000);
    }
  }
  addToCart(event);
}
