document.addEventListener('DOMContentLoaded', function() {
    const cartItemsContainer = document.getElementById('cart-items');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    const totalPriceElement = document.getElementById('total-price');
    const emptyCartMessage = document.getElementById('empty-cart-message');

    let cart = [];

    function updateCartDisplay() {
        cartItemsContainer.innerHTML = '';
        let totalPrice = 0;

        if (cart.length === 0) {
             emptyCartMessage.style.display = 'block';
           totalPriceElement.textContent = `Total sum:  ${totalPrice} $`
            return;
        }
        emptyCartMessage.style.display = 'none';


        const cartMap = new Map();
        cart.forEach(item => {
            if (cartMap.has(item.id)) {
                cartMap.get(item.id).quantity++;
            } else {
                 cartMap.set(item.id, {
                    ...item,
                    quantity: 1
                 });
            }
        });

        cartMap.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');

             const itemImage = document.createElement('img');
             itemImage.src = item.image;
             itemImage.alt = item.name;
              cartItemElement.appendChild(itemImage);

            const itemName = document.createElement('span');
            itemName.textContent = `${item.name} x${item.quantity}`;
             cartItemElement.appendChild(itemName);

            const itemPrice = document.createElement('span');
            itemPrice.textContent = `price: ${item.price * item.quantity} $`;
            cartItemElement.appendChild(itemPrice);

             const removeButton = document.createElement('button');
             removeButton.textContent = 'Delete';
                removeButton.addEventListener('click', function() {
                    removeItemFromCart(item.id);
                  });
             cartItemElement.appendChild(removeButton);

            cartItemsContainer.appendChild(cartItemElement);
               totalPrice += item.price * item.quantity;

         });
        totalPriceElement.textContent = `Total sum:  ${totalPrice} $`

    }

     function removeItemFromCart(productId) {
          const indexToRemove = cart.findIndex(item => item.id === productId);
          if (indexToRemove !== -1) {
                cart.splice(indexToRemove, 1)
                updateCartDisplay()
          }
    }


    function addItemToCart(productElement) {
         const productId = productElement.dataset.productId;
         const productName = productElement.querySelector('h3').textContent;
         const productImage = productElement.querySelector('img').src;
         const productPrice = parseFloat(productElement.querySelector('.product-price').textContent.replace(' $', ''));


           cart.push({
                id: productId,
                name: productName,
                image: productImage,
                price: productPrice
            });
             updateCartDisplay()
    }


    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
       button.addEventListener('click', function() {
             addItemToCart(this.closest('.product'))
        })
    });
    clearCartBtn.addEventListener('click', function() {
        cart = [];
        updateCartDisplay();
    });
     updateCartDisplay();
});