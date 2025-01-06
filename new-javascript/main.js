let sortAtoZBtn = document.getElementById("sort-low-high");
let sortBtoABtn = document.getElementById("sort-high-low");
let productdata = [];
function fetchdata() {
    fetch("http://localhost:3000/product") // Replace with your actual API endpoint
        .then(response => response.json())
        .then(data => {
            adddata(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Function to display fetched products on the page
function adddata(data) {
    const cardContainer = document.getElementById("product-container");
    const store = data.map((product) => {
        return addProductCard(product.id, product.image, product.name, product.price, product.category);
    });
    cardContainer.innerHTML = store.join('');
}

// Function to generate the HTML for each product card
function addProductCard(id, image, name, price, category) {
    return `
        <div class="col">
            <div class="card">
                <div class="card-img">
                    <img src="${image}" alt="${name}">
                </div>
                <div class="card-body">
                    <h4 class="card-title">${name}</h4>
                    <p class="card-price">Price: $${price}</p>
                    <p class="card-id">ID: ${id}</p>
                    <p class="card-category">Category: ${category}</p>
                    <button data-id="${id}" class="card-delete btn btn-danger">Delete</button>
                    <button data-id="${id}" class="card-edit btn btn-warning">Edit</button>
                </div>
            </div>
        </div>`;
}

// Function to handle adding new product data via the form
function postdata() {
    let form = document.getElementById("product-form");
    form.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent the default form submission

        // Get form data
        let image = document.getElementById("product-image").value;
        let name = document.getElementById("product-title").value;
        let price = document.getElementById("product-price").value;
        let category = document.getElementById("product-category").value;

        // Create an object to hold the new product data
        let product = {
            image: image,
            name: name,
            price: price,
            category: category
        };

        // Send the new product data to the server
        fetch('http://localhost:3000/product', { // Replace with your actual API endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Product added:', data);
            fetchdata();  // Reload the product list after adding the new product
        })
        .catch(error => {
            console.error('Error adding product:', error);
        });
    });
}

// Function to handle delete product
function deleteProduct(id) {
    fetch(`http://localhost:3000/product/${id}`, { // Replace with your actual API endpoint
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(() => {
        fetchdata();  // Refresh the product list after deletion
    })
    .catch(error => {
        console.error('Error deleting product:', error);
    });
}

// Function to handle edit product
let editingProductId = null; // Track the product being edited

// Function to handle edit product
function editProduct(id) {
    fetch(`http://localhost:3000/product/${id}`) // Fetch product details
        .then(response => response.json())
        .then(product => {
            // Populate the form with the product data
            document.getElementById("product-title").value = product.name;
            document.getElementById("product-price").value = product.price;
            document.getElementById("product-image").value = product.image;
            document.getElementById("product-category").value = product.category;

            // Store the product ID in the variable for later use
            editingProductId = id;

            // Update the form button to say "Update" instead of "Add"
            const formButton = document.querySelector('#product-form button');
            formButton.textContent = "Update";
        })
        .catch(error => {
            console.error('Error fetching product for editing:', error);
        });
}

// Function to handle adding or updating product data via the form
function postdata() {
    let form = document.getElementById("product-form");

    form.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent default form submission

        // Get form data
        let image = document.getElementById("product-image").value;
        let name = document.getElementById("product-title").value;
        let price = document.getElementById("product-price").value;
        let category = document.getElementById("product-category").value;

        // Create an object to hold the new or updated product data
        let product = {
            image: image,
            name: name,
            price: price,
            category: category
        };

        if (editingProductId) {
            // If we're editing an existing product, use PUT
            fetch(`http://localhost:3000/product/${editingProductId}`, { // Replace with your actual API endpoint
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product)
            })
            .then(response => response.json())
            .then(() => {
                fetchdata(); // Refresh the product list after editing
                resetForm(); // Reset the form after edit
            })
            .catch(error => {
                console.error('Error editing product:', error);
            });
        } else {
            // If we're adding a new product, use POST
            fetch('http://localhost:3000/product', { // Replace with your actual API endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Product added:', data);
                fetchdata(); // Reload the product list after adding
                resetForm(); // Reset the form after adding a new product
            })
            .catch(error => {
                console.error('Error adding product:', error);
            });
        }
    });
}

// Function to reset the form after editing or adding
function resetForm() {
    // Clear the form fields and reset the button text
    document.getElementById("product-form").reset();
    const formButton = document.querySelector('#product-form button');
    formButton.textContent = "Add"; // Reset the button back to "Add"
    editingProductId = null; // Clear the editing state
}

// Event listeners for edit and delete buttons
document.addEventListener("click", function (e) {
    if (e.target && e.target.classList.contains("card-delete")) {
        const id = e.target.getAttribute("data-id");
        deleteProduct(id);
    }
    if (e.target && e.target.classList.contains("card-edit")) {
        const id = e.target.getAttribute("data-id");
        editProduct(id); 
    }
});


fetchdata();
postdata();

