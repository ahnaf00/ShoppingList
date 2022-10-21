(() =>{
    const filterInputElm    = document.querySelector("filter")
    const nameInputElm      = document.querySelector(".nameInput")
    const priceInputElm     = document.querySelector(".priceInput")
    const msgELm            = document.querySelector(".msg")
    const collectionELm     = document.querySelector(".collection")
    const form              = document.querySelector("form")
    let products = localStorage.getItem("storeProducts") 
        ? JSON.parse(localStorage.getItem("storeProducts")) 
        : []
    const submitBtnElm = document.querySelector(".submit-btn button")
    // Receiving Inputs
    function receieveInputs()
    {
        const name = nameInputElm.value
        const price = priceInputElm.value

        return {name , price}

    }

    function clearMessage(){
        msgELm.textContent = ""
    }

    function showMessage(msg, action = "success"){
        const textMsg = `<div class="alert alert-${action}" role="alert">
        ${msg}
    </div>`

    msgELm.insertAdjacentHTML("afterbegin", textMsg)
    setTimeout(() =>{
        clearMessage()
    }, 2000)
    }

    function validateInputs(name , price)
    {
        let isValid = true
        // check input is empty
        if( name === "" || price === "")
        {
            isValid = false
            showMessage("Please provide necessary Info", "danger")
        }

        if( Number(price) !== Number(price) )
        {
            isValid = false
            showMessage("Please provide Price in Number", "danger")
        }


        return isValid
    }
    // Reset Input 
    function resetInput()
    {
        nameInputElm.value  = ""
        priceInputElm.value = ""
    }

    // Add Product Function
    function addProduct(name, price )
    {
        const product = {
            id : products.length + 1,
            name, 
            price,
        }
        // Memory Data Store
        products.push(product)

        return product
    }

    // Add Porduct To Storage
    function addProductToStorage(product)
    {
        let products 
        if( localStorage.getItem("storeProducts") )
        {
            products = JSON.parse(localStorage.getItem("storeProducts"))
            // Update and add the new produc
            products.push(product)
            // localStorage.setItem( "storeProducts" , JSON.stringify(products) )
        }else{
            products = []
            products.push(product)
            // localStorage.setItem("storeProducts", JSON.stringify(products))
        }
        localStorage.setItem( "storeProducts" , JSON.stringify(products) )

        // let products = []
        // products.push(product)
        // localStorage.setItem("storeProducts", JSON.stringify(products))
        
    }

    // Show product To ui
    function showProductToUi(productInfo)
    {
        // Remove not found product message on adding new product 
        const notFoundMsgElm = document.querySelector(".not-found-product")
        if( notFoundMsgElm )
        {
            notFoundMsgElm.remove()
        }
        const {id , name, price} = productInfo
        const elm = `
        <li class="list-group-item collection-item d-flex flex-row justify-content-between" data-productId = "${id}">
            <div class="product-info">
            <strong>${name}</strong> - <span class="price">$${price}</span>
            </div>
            <div class="action-btn">
            <i class="fa fa-pencil-alt float-right me-2 edit-product"></i>
            <i class="fa fa-trash-alt float-right delete-product" ></i>
            </div>
        </li>`

        collectionELm.insertAdjacentHTML("afterbegin", elm)
        showMessage("Product Added Successfully")
    }

    // Update ptoduct to data store
    function updateProduct(receivedProduct, storageProducts = products)
    {
        const updatedProducts = products.map(product =>{
            if(product.id === receivedProduct.id)
            {
                return {
                    ...product, 
                    name:receivedProduct.name,
                    price:receivedProduct.price
                }
            }else {
                return product
            }
        })
        return updatedProducts
    }

    function clearEditForm()
    {
        submitBtnElm.classList.remove("update-btn")
        submitBtnElm.classList.remove("btn-secondary")
        submitBtnElm.textContent = "Submit"
        submitBtnElm.removeAttribute("[data-id]")
    }

    function updateProductToStorage(product)
    {
        // lengthy Way
        // Find the existing product from localstorage
        let products
        products = JSON.parse(localStorage.getItem("storeProducts"))
        // Update product with new product update
        products = updateProduct(product, products)
        // Save back to local storage

        // alternative wayr
        localStorage.setItem("storeProducts", JSON.stringify(products))
    }

    function handleFormSubmit(evt)
    {
        // prevent Browser Reload
        evt.preventDefault()
        // Receiving Inputs
        const {name , price} = receieveInputs()
        // Validation Check
        const isValid = validateInputs(name , price)
        if(!isValid) return 

        // Reset Input 
        resetInput()

        if( submitBtnElm.classList.contains("update-product") )
        {
            // User want to update data 
            console.log("update product")
            const id = Number(submitBtnElm.dataset.id)
            // Update Data to memory store
            const product = {
                id,
                name, 
                price
            }
            const updatedProducts = updateProduct(product)
            // Memory Store
            products = updatedProducts
            // Local Store
            updateProductToStorage(product)
            // DOM Update
            showAllProductsToUi(products)
            // Clear Eidt state 
            clearEditForm()
        }else{
            // Add Product to Data store
            const product = addProduct(name, price)

            // Add Data to Local Store 
            addProductToStorage(product)
            // Add Product To the Ui
            showProductToUi(product)
        }

        

        console.log(name , price)
    }

    function getProductID(evt)
    {
        const liElm = evt.target.parentElement.parentElement
        const id = Number(liElm.getAttribute("data-productId"))
        return id
    }

    // Remove Item
    function removeItem(id)
    {
        products = products.filter((product) => product.id !== id)
    }

    function removeItemFromUi(id)
    {
        document.querySelector(`[data-productId = "${id}"]`).remove()
        showMessage("Product Deleted Successfully", "warning")
    }

    function removeProductFromStorage(id)
    {
        let products
        products = JSON.parse(localStorage.getItem("storeProducts"))
        products = products.filter((product) => product.id !== id )
        localStorage.setItem("storeProducts", JSON.stringify(products))
    }

    function findProduct(id){
        const foundProduct = products.find( (product) => product.id === id )
        return foundProduct
    }

    function populateEditForm(product)
    {
        nameInputElm.value  = product.name
        priceInputElm.value = product.price

        // Change the submit button
        submitBtnElm.textContent = "Update Button"
        submitBtnElm.classList.add("btn-secondary")
        submitBtnElm.classList.add("update-product")
        submitBtnElm.setAttribute("data-id", product.id)
    }

    function handleManipulateProduct(evt)
    {
        const id = getProductID(evt)

        if(evt.target.classList.contains("delete-product"))
        {
            // Get the product ID
            // const id = getProductID(evt)
            // Remove Product From Data Store
            removeItem(id)
            // Remove data from local stroage 
            removeProductFromStorage(id)
            // Remove item from the UI
            removeItemFromUi(id)
        }else if ( evt.target.classList.contains("edit-product"))
        {
            // Finding the product
            const foundProduct = findProduct(id)
            console.log(foundProduct)
            // populating existing form in edit state 
            populateEditForm(foundProduct)

        }
        // console.log(evt.target)
    }

    function showAllProductsToUi(products)
    {
        // clear existing content from collentionElm/ul
        collectionELm.textContent = ""
        let liElms
        liElms =
        products.length === 0
            ? '<div class="alert alert-info not-found-product">No Products to Show</div>'
            : ''
        // Soring product bt descending order
        products.sort((a, b) => b.id - a.id)
        products.forEach((product) => {
            const { id, name, price } = product
            liElms += `<li
            class="list-group-item collection-item d-flex flex-row justify-content-between"
            data-productId="${id}"
        >
            <div class="product-info">
            <strong>${name}</strong>- <span class="price">$${price}</span>
            </div>
            <div class="action-btn">
            <i class="fa fa-pencil-alt edit-product me-2"></i>
            <i class="fa fa-trash-alt delete-product"></i>
            </div>
        </li>`
        })
        collectionELm.insertAdjacentHTML("afterbegin", liElms)
    }

    function init()
    {
        // ==== Form ====
        form.addEventListener( "submit", handleFormSubmit )
        collectionELm.addEventListener( "click", handleManipulateProduct )

        document.addEventListener( "DOMContentLoaded", () => showAllProductsToUi(products) )
    }

    init()
})()

