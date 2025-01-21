const modal = document.querySelector('[data-modal]');
const ctaConfirmOrder = document.querySelector('[data-modal-open]');
const ctaCloseModal = document.querySelector('[data-modal-close]');

console.log(modal);
console.log(ctaConfirmOrder);
console.log(ctaCloseModal);
ctaConfirmOrder.addEventListener('click', () =>{
    modal.showModal();
});

ctaCloseModal.addEventListener('click', () => {
    modal.close();
});