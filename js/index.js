//CRUD : CREATE , READ , UPDATE , DELETE

// 1 - Create (User adds product by himself)

//We will use object to store all items to a product in one variable which is stored in an array
// We retireve item written by user in form usign JS and store them and display them in table

var prouductNameInput = document.getElementById("productName"); // variable here is object
var prouductPriceInput = document.getElementById("productPrice");
var prouductCategoryInput = document.getElementById("productCategory");
var prouductDescriptionInput = document.getElementById("productDescription");
var prouductImageInput = document.getElementById("productImage")
var productSearchInput = document.getElementById("productSearchInput")

//define variabe in global scope to so items are added to it 
var products = []
/* what user enter in a HTML form is stored in value which is what we want to take from it */

var temp;//temp variable for index for update

var addBtn = document.getElementById("addBtn")
var updateBtn = document.getElementById("updateBtn")

var regex = {
    productName: {
        value: /^[A-Z][a-z]{2,10}$/,
        isValid: false //added is>Valid to check if all inputs are valid
    },
    productPrice: {
        value: /^([1-9][0-9]{0,3}|10000)$/,
        isValid: false
    },
    productCategory: {
        value: /^(tv|mobile|screen|laptop)$/i,
        isValid: false
    },
    productDescription: {
        value: /^[A-Za-z0-9 .,'"()-]{20,200}$/,
        isValid: false
    },
    productImage: {
        value: /^image\/(png|jpeg)$/,
        isValid: false
    }

}

//Ask localStorage does it have any data stored to be displayed?
if (localStorage.getItem("productList") !== null) {
    products = JSON.parse(localStorage.getItem("productList"))
    //anyt items in local storgae add into products 
    //destringfy products using JSON.parse()
    displayProducts(products)
}

function addProduct() {

    //console.log(prouductImageInput.files)//outputs Filelist which gives us info about the image and it contaqins image name which will give us the true image name we need
    //we will add id to each product instead of index
    var product = {
        id: products.length,
        name: prouductNameInput.value,
        price: prouductPriceInput.value,
        category: prouductCategoryInput.value,
        description: prouductDescriptionInput.value,
        //image:prouductImageInput.value ; this method is wrong as it gives us a fake extension for our image 
        //any image we will use must be in images folder
        image: prouductImageInput.files[0]?.name//optional chain: ? after files[0] checks if files[0] exists , if it doen\t stop if it does continue
    }
    products.push(product)
    displayProducts(products)

    //we will take whole array and store it in localStorage
    //JSON.stringfy() turns item into a string in form of JSON string
    localStorage.setItem("productList", JSON.stringify(products))

    clearForm()
}
/* Clean code concept: A function only does one thing */
function displayProducts(list) {
    var cartona = ''
    for (var i = 0; i < list.length; i++) {

        //if item is deleted and reaplced with null ignore it
        if (list[i] == null) {
            continue
        }
        //if search input is empty ,highlighted name for product should be empty
        if (productSearchInput.value == "") {
            list[i].newName = null
        }
        /* line 61 explanation : if image of products of i exists put it if it does not put not-found-iimage instead */
        cartona += `
                <tr>
                    <th scope="row">${i + 1}</th>
                    <td><img src="images/${list[i].image ? list[i].image : "image-not-found.jpg"}" style="width:50px" alt=></td>
                    <td>${list[i].newName ? list[i].newName : list[i].name}</td>
                    <td>${list[i].price}</td>
                    <td>${list[i].category}</td>
                    <td>${list[i].description}</td>
                    <td>
                        <button class="btn btn-danger" onclick="deleteProduct(${list[i].id})"><i class="fa-solid fa-trash"></i>Delete</button>
                        <button class="btn btn-success" onclick="fillUpdateInputs(${list[i].id})"><i class="fa-solid fa-pen-to-square"></i>Update</button>
                    </td>
                </tr>
                `
    }
    document.getElementById("tableOfProducts").innerHTML = cartona
}

//we will assign an id to each product instead of index
function deleteProduct(id) {
    //old way using index
    //products.splice(index, 1)

    //new way using id
    for (let i = 0; i < products.length; i++) {
        if (id == products[i].id) {
            products[id] = null //instead of removing product we make it null 
            /*products.splice(i, 1)
            displayProducts(products)
            localStorage.setItem("productList", JSON.stringify(products))*/
            break
        }
    }
    displayProducts(products)
    localStorage.setItem("productList", JSON.stringify(products))
}

/*Update will be done on 2 stages 
   1)emptying the form and removing add button ,replacing it with update button
   2)adding update data
*/
function fillUpdateInputs(id) {
    //1st half of update
    for (let i = 0; i < products.length; i++) {
        if (id == products[i]?.id) {
            temp = i
            prouductNameInput.value = products[i]?.name

            prouductPriceInput.value = products[i]?.price

            prouductCategoryInput.value = products[i]?.category

            prouductDescriptionInput.value = products[i]?.description

            //image fill will be done later

            addBtn.classList.replace("d-block", "d-none")
            updateBtn.classList.replace("d-none", "d-block")
        }

    }
}

function updateProduct() {
    //2nd half of update
    products[temp].name = prouductNameInput.value

    products[temp].price = prouductPriceInput.value

    products[temp].category = prouductCategoryInput.value

    products[temp].description = prouductDescriptionInput.value

    products[temp].image = prouductImageInput.files[0]?.name


    localStorage.setItem("productList", JSON.stringify(products))
    displayProducts(products)

    updateBtn.classList.replace("d-block", "d-none")
    addBtn.classList.replace("d-none", "d-block")
    clearForm()
}

//after every update or addition of data we want to clear our form
function clearForm() {
    prouductNameInput.value = ''
    prouductPriceInput.value = ''
    prouductCategoryInput.value = ''
    prouductDescriptionInput.value = ''
    prouductImageInput.value = ''

    prouductNameInput.classList.remove("is-valid")
    prouductPriceInput.classList.remove("is-valid")
    prouductCategoryInput.classList.remove("is-valid")
    prouductDescriptionInput.classList.remove("is-valid")

}

//To only display searched items that match out seach we will make an array with items that match our search adn display will use this array and incase there is no search made diaply will give us the origional list found in local storage
function searchProducts(term) {
    //if term is empty do not enter the searchItems array adn sue producs array
    if (term == "") {
        displayProducts(products)
        return//so functiioon immmediatly exits
    }

    //searched items
    var searchItems = []
    //we are searching for what is written in isearch value
    for (var i = 0; i < products.length; i++) {
        //lower case name of object and input term and ask if term value entered if dound in  object names
        if (products[i]?.name.toLowerCase().includes(term.toLowerCase())) {
            //highlight live search we found 
            products[i].newName = products[i]?.name.replace(term, `<span class="text-danger">${term}</span>`)

            searchItems.push(products[i])
        }
    }
    displayProducts(searchItems)
}

//we want to use regex to validate our inputs


//we will write our regex with object for all our inputs
function validateProductInputs(element) {

    //prouductImageInput.files[0].type

    if (element.id == "productImage") {
        if (regex[element.id].value.test(element.files[0]?.type)) {
            element.classList.add("is-valid")
            element.classList.remove("is-invalid")
            regex[element.id].isValid = true
            //make alert class invisible 
            element.nextElementSibling.classList.replace("d-block", "d-none")
        } else {
            element.classList.add("is-invalid")
            element.classList.remove("is-valid")
            regex[element.id].isValid = false

            //element.nextElementSibling: gives us element right after our selected elemnt
            //make alert class visible 
            element.nextElementSibling.classList.replace("d-none", "d-block")
        }
    } else {
        if (regex[element.id].value.test(element.value)) {
            element.classList.add("is-valid")
            element.classList.remove("is-invalid")
            regex[element.id].isValid = true
            //make alert class invisible 
            element.nextElementSibling.classList.replace("d-block", "d-none")
        } else {
            element.classList.add("is-invalid")
            element.classList.remove("is-valid")
            regex[element.id].isValid = false

            //element.nextElementSibling: gives us element right after our selected elemnt
            //make alert class visible 
            element.nextElementSibling.classList.replace("d-none", "d-block")
        }
    }
    if (element.value == '') {
        element.classList.remove("is-invalid")
    }
    toggleAddBTn()
}

//toggle add btn if every input is valid
function toggleAddBTn() {
    if (regex.productName.isValid == true && regex.productPrice.isValid == true && regex.productCategory.isValid == true && regex.productDescription.isValid == true) {
        addBtn.disabled = false
    } else {
        addBtn.disabled = true //some attributes when written in JS are treated as boolean values such as diabled
    }
}
