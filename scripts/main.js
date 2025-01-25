// Import the cart and addToCart functions from the cart.js file
import { cart, addToCart, updateCartView } from "./cart.js";
import { generateItemForModal } from "./modal.js";

// Select the modal elements in the DOM for displaying and closing the modal
const modal = document.querySelector("[data-modal]");
const ctaConfirmOrder = document.querySelector("[data-modal-open]");
const ctaCloseModal = document.querySelector("[data-modal-close]");

// Event listener to open the modal when clicking on the confirm order button
ctaConfirmOrder.addEventListener("click", () => {
  modal.showModal();
  generateItemForModal();
});

// Event listener to close the modal when clicking on the close modal button
ctaCloseModal.addEventListener("click", () => {
  modal.close();
  clearCart();
});

// This function fetches data from a JSON file and returns it as a Promise
export async function getData() {
  
  const url = "https://raw.githubusercontent.com/abhi-zero/product-list-with-cart/main/data/data.json"; // URL to the data file

  // Fetch data from the specified URL
  let response = await fetch(url);

  // Check if the response is not OK
  if (!response.ok) {
    throw new Error("Error fetching data");
  }

  // Parse the response as JSON and return the fetched data
  return response.json();
}

// Helper function to create an HTML element with a class and optional text content
export function createElementWithClass(tag, classname, textContent = "") {
  const element = document.createElement(tag);
  element.className = classname;
  element.textContent = textContent;
  return element;
}

// Select the main and aside elements in the DOM
const main = document.querySelector("main");
const aside = document.querySelector("aside");

// Function to create and return a section element for each item
function createItemSection(item, index) {
  const section = createElementWithClass("section", "item");
  section.setAttribute("data-ItemId", index);

  const divThumbnailCta = createElementWithClass("div", "thumbnail-cta");

  let pictureTag = document.createElement("picture");

  // Create source tags for tablet and desktop image sizes
  const sourceTablet = document.createElement("source");
  sourceTablet.setAttribute("media", "(min-width: 550px)");
  sourceTablet.setAttribute("srcset", `${item.image.tablet}`);

  const sourceDesktop = document.createElement("source");
  sourceDesktop.setAttribute("media", "(min-width: 1020px)");
  sourceDesktop.setAttribute("srcset", `${item.image.desktop}`);

  const imgTag = document.createElement("img");
  imgTag.setAttribute("src", `${item.image.mobile}`);
  imgTag.setAttribute("alt", `Thumbnail of ${item.name}`);
  imgTag.setAttribute("id", "item-img");

  // Create div for the call-to-action (CTA) buttons
  const divCta = createElementWithClass("div", "cta");
  divCta.setAttribute("data-ItemId", index);
  const divBtnAddToCart = createElementWithClass("div", "add-to-cart");
  divBtnAddToCart.classList.add(".visibilty-block");

  // Add text to the "Add to Cart" button
  const paraAddToCart = createElementWithClass("p", "", "Add to Cart");

  const divBtnAddMore = createElementWithClass("div", "add-more");
  divBtnAddMore.classList.add("hidden");

  const divItemDetails = createElementWithClass("div", "item-details");

  // Display the item category, name, and price
  const paraCategory = createElementWithClass("p", "category", item.category);
  const h3ItemTitle = createElementWithClass("h3", "item-title", item.name);
  const paraItemPrice = createElementWithClass("p", "item-price", item.price);

  const spanCurrencySymbol = createElementWithClass(
    "span",
    "currency-symbol",
    "$"
  );

  // Append the created elements to their respective parent elements
  section.append(divThumbnailCta, divItemDetails);
  divThumbnailCta.append(pictureTag, divCta);
  pictureTag.append(sourceTablet, sourceDesktop, imgTag);
  divCta.append(divBtnAddToCart, divBtnAddMore);
  divBtnAddToCart.append(paraAddToCart);
  divBtnAddMore.innerHTML = `<button data-action="decrement"><p>-</p></button>
                      <p class="item-quantity" data-itemid='${index}'>0</p>
                      <button data-action="increment"><p>+</p></button>`;
  divItemDetails.append(paraCategory);
  divItemDetails.append(paraCategory, h3ItemTitle, paraItemPrice);
  paraItemPrice.prepend(spanCurrencySymbol);

  // Event listener to handle adding/removing items from the cart
  divCta.addEventListener("click", (event) => {
    addAndRemoveCart(divBtnAddMore, divBtnAddToCart, event, imgTag);
  });

  return section;
}

// Function to create the cart section of the page
function createCartSection() {
  const h2Aside = createElementWithClass("h2", "");
  h2Aside.innerHTML = `Your Cart (<span class="carted-items">0</span>)`;

  const divCartPlacehorlder = createElementWithClass("div", "cart-placeholder");

  const divIllustration = createElementWithClass("div", "illustration");

  // Add an illustration and message if the cart is empty
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

  const spanTotalPrice = createElementWithClass("span", "total-price");

  const paraTitleText = createElementWithClass("p", "title-text", "Order");

  const paraTotalAmount = createElementWithClass("p", "total-amount", "$-- --");

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
  return aside;
}

// Function to render items on the page
async function renderItems() {
  try {
    const data = await getData(); // Fetch the data

    const fragment = document.createDocumentFragment();
    // Create and append sections for each item
    data.forEach((item, index) => {
      const section = createItemSection(item, index);
      fragment.append(section);
    });
    main.append(fragment);
  } catch (error) {
    // Handle error in case the data fetching fails
    main.innerHTML = "<p>Failed to load items. Please try again later.</p>";
  }
}

// Initialize the page by creating the cart section and rendering items
async function init() {
  createCartSection();
  await renderItems();
  updateCartView();
}

// Run the initialization function
init();

// Function to handle adding and removing items from the cart
function addAndRemoveCart(addSection, removeSection, event, item) {
  addSection.classList.add("visibilty-flex");
  addSection.classList.remove("hidden");
  removeSection.classList.add("hidden");
  removeSection.classList.remove("visibilty-block");
  item.classList.add("selected-item");

  const cta = event.target.closest(".cta");

  const quantity = cta.querySelector(".item-quantity");
  if (quantity.textContent == "0") {
    quantity.textContent = parseInt(quantity.textContent) + 1;
  }
  // Determine the action (increment or decrement) based on the button clicked
  const button = event.target.closest("button");
  const action = button?.dataset?.action;

  if (action === "increment") {
    quantity.textContent = parseInt(quantity.textContent) + 1;
  } else if (action === "decrement") {
    if (quantity.textContent == "0") {
      showPlaceholder();
      return;
    }
    quantity.textContent = Math.max(0, parseInt(quantity.textContent) - 1);

    // Hide the add button if the quantity is zero, and show it after a delay
    if (quantity.textContent == "0") {
      addSection.classList.remove("visibilty-flex");
      addSection.classList.add("hidden");
      removeSection.classList.remove("hidden");
      removeSection.classList.add("visibilty-block");
      item.classList.remove("selected-item");
    }
  }
  // Add the item to the cart
  addToCart(event, quantity);
}

function clearCart() {
  cart.length = 0;
  localStorage.removeItem("cartItems");
  updateCartView();
  clearStyles();
}

function clearStyles() {
  const itemImgs = document.querySelectorAll("#item-img");
  for (let itemImg of itemImgs) {
    itemImg.classList.remove("selected-item");
  }
  const allBtnAddToCarts = document.querySelectorAll(".add-to-cart");
  for (let btnAddTocart of allBtnAddToCarts) {
    btnAddTocart.classList.remove("hidden");
    btnAddTocart.classList.add("visibilty-block");
  }
  const allBtnAddMore = document.querySelectorAll(".add-more");
  for (let btnAddMore of allBtnAddMore) {
    btnAddMore.classList.remove("visibilty-flex");
    btnAddMore.classList.add("hidden");
  }
  const quantityValue = document.querySelectorAll(".item-quantity");
  for (let quantity of quantityValue) {
    quantity.textContent = "0";
  }
}

export function resetQuantity() {
  const allSections = document.querySelectorAll("section[data-itemid]");
  
  allSections.forEach((section) => {
    const imgElement = section.querySelector("#item-img");
    const quantityElement = section.querySelector(".item-quantity");
    const btnAddToCart = section.querySelector(".add-to-cart");
    const btnAddMore = section.querySelector(".add-more");
    const itemId = section.dataset.itemId;
    const cartItem = cart.find((item) => {
      return item.cartItemId == itemId;
    });
   
    if (!cartItem) {
      quantityElement.textContent = "0";
      imgElement.classList.remove('selected-item');
      btnAddToCart.classList.remove("hidden");
      btnAddToCart.classList.add("visibilty-block");
      btnAddMore.classList.remove("visibilty-flex");
      btnAddMore.classList.add("hidden");
    }
  });

}

const illustration = document.querySelector(".illustration");
const cartItemSection = document.querySelector(".cart-item-section");
export function showPlaceholder() {
  if (cart.length == 0) {
    illustration.style.display = "block";
    cartItemSection.style.display = "none";
  } else {
    illustration.style.display = "none";
    cartItemSection.style.display = "grid";
  }
}

