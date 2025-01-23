export let cart = [];

class CartItem {
    constructor(cartItemId, quantity){
        this.cartItemId = cartItemId;
        this.quantity = quantity;
    }
}

export function addToCart(event){
    const productId = event.target.cloest
    console.log(productId);
    
}
