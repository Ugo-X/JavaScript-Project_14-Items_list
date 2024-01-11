// ****** SELECT ITEMS **********
const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const groceryContainer = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

// edit option
let editElement;
let editFlag = false;
let editId = "";

// ======================================================
// ****** EVENT LISTENERS **********
// 1. Submit form
form.addEventListener("submit", addItem);
// 2. Clear items
clearBtn.addEventListener("click", clearItems);
// 3. load items 
window.addEventListener('DOMContentLoaded', setupItems)

// ****** FUNCTIONS **********
// =====================================================

// Function to add a new item
function addItem(e) {
  const id = new Date().getTime().toString();

  e.preventDefault();
  const value = grocery.value;

  // Check if the value is not an empty string and the edit flag is false
  if (value !== "" && !editFlag) {
    createListItem(id,value)
    // Show grocery container and display success alert
    groceryContainer.classList.add("show-container");
    displayAlert("Item successfully added", "success");

    // Add to local storage
    addToLocalStorage(id, value);

    // Set back to default state
    setBackToDefault();
  }
  // Check if editing an existing item
  else if (value && editFlag) {
    const text = grocery.value;
    editElement.innerHTML = value; // Update the content of the edited item
    displayAlert(`Changed to ${text}`, "success");
    // Edit local storage
    editLocalStorage(editId, value);
    setBackToDefault();
  }
  // Handle cases where the value is an empty string
  else {
    displayAlert("Please enter a value", "danger");
  }
}

// Function to delete an item
function deleteItem(evt) {
  const element = evt.currentTarget.closest(".grocery-item"); // Find the closest parent element with the class 'grocery-item'
  const id = element.dataset.id; // Get the ID of the item from the data-id attribute
  const itemText = element.querySelector(".title").textContent; // Get the text content of the item's title

  // Remove the item from the list
  list.removeChild(element);

  // Remove from local storage
  removeFromLocalStorage(id);

  // Check if there are no more items to display
  if (list.childElementCount === 0) {
    groceryContainer.classList.remove("show-container");
  }

  // Display alert for the deleted item
  displayAlert(`${itemText} deleted`, "danger");
}

// Function to edit an item
function editItem(evt) {
  const element = evt.currentTarget.parentElement.parentElement; // Get the parent element of the clicked button
  const id = element.dataset.id; // Get the ID of the item from the data-id attribute
  editElement = evt.currentTarget.parentElement.previousElementSibling; // Get the previous sibling of the button's parent, which is the title element
  grocery.value = editElement.innerHTML; // Set the input value to the current item's title
  editFlag = true;
  editId = id;
  submitBtn.textContent = "edit";
}

// ======================================================
// Display alert function
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  // Set timeout to make the alert disappear after a short while
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1300);
}

// Function to set back to default state
function setBackToDefault() {
  grocery.value = "";
  editFlag = false;
  editId = "";
  submitBtn.textContent = "submit";
}

// Function to clear all items
function clearItems(item) {
  const allItems = document.querySelectorAll(".grocery-item");

  // Remove each item from the list
  if (allItems.length > 0) {
    allItems.forEach(function (item) {
      list.removeChild(item);
    });
  }

  // Hide grocery container and display alert for cleared items
  groceryContainer.classList.remove("show-container");
  displayAlert("Deleted all items", "danger");

  // Set back to default here in case the user is still in edit mode
  setBackToDefault();

  // remove from local storage
  localStorage.removeItem("list");
}

// ========================================================
// ****** LOCAL STORAGE **********
// Adding items to local storage
function addToLocalStorage(id, value) {
  // Assigning our input value and id to an object
  const groceryItem = { id, value };

  // If the local storage has a key with the value of 'list', assign said value to the variable 'items'; otherwise, assign it an empty array.
  let items = getLocalStorage();
  console.log(items);

  // Push the new grocery item to the array
  items.push(groceryItem);

  // Update local storage with the new array
  localStorage.setItem("list", JSON.stringify(items));
}

// Remove from local storage
function removeFromLocalStorage(id) {
  // Filter out the item with the specified id
  let items = getLocalStorage().filter(function (item) {
    return item.id !== id;
  });

  // Update local storage with the filtered array
  localStorage.setItem("list", JSON.stringify(items));
}

// edit local storage
function editLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

// Function to retrieve items from local storage
const getLocalStorage = () => {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
};

// **** SETUP ITEMS ****
function setupItems(id, value){
  // get the items in the local storage
let items = getLocalStorage()
// if the the length of the array generated when we get the local storage is greater than 0 then we have items in the array, so we want to iterate over them and create an item with each of them in the grocery container
if(items.length > 0){
  items.forEach(function(item){
createListItem(item.id, item.value)
  })
groceryContainer.classList.add('show-container')
}

}



function createListItem(id, value){
  // Create a dynamic element for the new item
  const element = document.createElement("article");
  element.classList.add("grocery-item");
  const attribute = document.createAttribute("data-id");
  attribute.value = id;
  element.setAttributeNode(attribute);
  element.innerHTML = `<p class="title">${value}</p>
    <div class="btn-container">
      <button type="button" class="edit-btn">
        <i class="fa-solid fa-pen-to-square"></i>
      </button>
      <button type="button" class="delete-btn">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>`;

  // Append the new item to the grocery list
  list.appendChild(element);

  // Select buttons within the new item
  const editBtn = element.querySelector(".edit-btn");
  const deleteBtn = element.querySelector(".delete-btn");
  // Add event listeners to the buttons
  editBtn.addEventListener("click", editItem);
  deleteBtn.addEventListener("click", deleteItem);


}