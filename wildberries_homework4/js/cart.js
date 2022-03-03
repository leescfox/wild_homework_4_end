const cart = () => {
    const cartBtn = document.querySelector('.button-cart')
    const cart = document.getElementById('modal-cart')
    const cartCloseBtn = cart.querySelector('.modal-close')
    const goodsContainer = document.querySelector('.long-goods-list')
    const modalForm = document.querySelector('.modal-form')

    const addToCart = (id) => {
        const goods = JSON.parse(localStorage.getItem('goods'))
        const clickedGood = goods.find((good) => good.id === id)
        const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
        if (cart.some((good) => good.id === clickedGood.id)) {
            cart.map((good) => {
                if (good.id === clickedGood.id) {
                    good.count++
                }
                return good
            })
        } else {
            clickedGood.count = 1
            cart.push(clickedGood)
        }
        localStorage.setItem('cart', JSON.stringify(cart))
    }

    const cartRender = (cartGoods) => {
        const cartTotal = document.querySelector('.card-table__total')
        const cartTable = document.querySelector('.cart-table__goods')
        cartTable.innerHTML = ''
        let TotalPrice = 0

        cartGoods.forEach((good) => {
            const tr = document.createElement('tr')
            TotalPrice = +TotalPrice + +good.price * +good.count
            tr.innerHTML = `
                <td>${good.name}</td>
                <td>${good.price}$</td>
                <td><button class="cart-btn-minus">-</button></td>
                <td>${good.count}</td>
                <td><button class="cart-btn-plus">+</button></td>
                <td>${+good.count * +good.price}$</td>
                <td><button class="cart-btn-delete">x</button></td>
            `

            cartTable.append(tr)

            tr.addEventListener('click', (event) => {
                if (event.target.classList.contains('cart-btn-minus')) {
                    minusGood(good.id)
                } else if (event.target.classList.contains('cart-btn-plus')) {
                    plusGood(good.id)
                } else if (event.target.classList.contains('cart-btn-delete')) {
                    deleteGood(good.id)
                }
            })
        })
        cartTotal.textContent = `${TotalPrice}$`
    }

    const minusGood = (id) => {
        const cart = JSON.parse(localStorage.getItem('cart'))
        const newCart = cart.map((good) => {
            if (good.id === id && good.count > 0) {
                good.count--
            }
            return good
        })
        localStorage.setItem('cart', JSON.stringify(newCart))
        cartRender(newCart)
    }

    const plusGood = (id) => {
        const cart = JSON.parse(localStorage.getItem('cart'))
        const newCart = cart.map((good) => {
            if (good.id === id) {
                good.count++
            }
            return good
        })
        localStorage.setItem('cart', JSON.stringify(newCart))
        cartRender(newCart)
    }

    const deleteGood = (id) => {
        const cart = JSON.parse(localStorage.getItem('cart'))
        const newCart = cart.filter((good) => good.id !== id)

        localStorage.setItem('cart', JSON.stringify(newCart))
        cartRender(newCart)
    }

    const sendForm = () => {
        const cartArray = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
        const userName = document.querySelector('.modal-input:first-of-type')
        const userPhone = document.querySelector('.modal-input:last-of-type')
        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify({
                cart: cartArray,
                name: userName.value,
                phone: userPhone.value
            })
        }).then(() => {
            cart.style.display = ''
        }).then(() => {
            localStorage.removeItem('cart')
        }).then(() => {
            userName.value = ''
            userPhone.value = ''
        })
    }

    modalForm.addEventListener('submit', (event) => {
        event.preventDefault()
        sendForm()
    })

    cartBtn.addEventListener('click', () => {
        const cartArray = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
        cartRender(cartArray)
        cart.style.display = 'flex';
    })

    cartCloseBtn.addEventListener('click', () => {
        cart.style.display = '';
    })

    cart.addEventListener('click', (event) => {
        if (event.target.classList.contains('overlay')) {
            cart.style.display = ''
        }
    })

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            cart.style.display = ''
        }
    })

    if (goodsContainer) {
        goodsContainer.addEventListener('click', (event) => {
            if (event.target.closest('.add-to-cart')) {
                const buttonToCart = event.target.closest('.add-to-cart')
                const goodId = buttonToCart.dataset.id
                addToCart(goodId)
            }
        })
    }
}

cart()