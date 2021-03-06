/**
 * Sets the title to the container to that of the category the user is in
 */
function openCategory() {
    const category = getCatName();
    document.title += ` ${category}`;
    // Get the first child node of the #bg-container element
    const titleElem = document.querySelector('#bg-container').childNodes[1];
    // Set the title to that of the category
    titleElem.textContent += category;
    document.getElementById("add-new").setAttribute("onclick", "window.location.href='newText.html?category=" + category + "'");
    // Iterates through the users local storage, and calls for a button to be created for each text
    addEditButton();
    loadButtons();
}

/**
 * Updates the title of the container to indicate which category a text is being added to
 */
function updateName() {
    document.getElementById("cat_name").textContent = getCatName();
}

/**
 * Updates the element which contains a warning to display the current category
 */
function updateWarning(){
    const value = document.getElementById("warning").textContent;
    document.getElementById("warning").textContent = value.replace("name", getCatName());
}

/**
 * Create buttons from the users localStorage.
 */
function loadButtons() {
    // Copies the localStorage into an object.
    const storage = {...localStorage};
    for (let key in storage) {
        // If the key includes "categories", continue to the next iteration.
        if (key.includes("categories") || key.includes("userSettings")) continue;

        // Parse the value of key into a JSON object.
        const jsonObj = JSON.parse(key);
        // Continues if the JSON obj does not have a "category" property, or the category value is not the correct category.
        if (!(jsonObj.hasOwnProperty("category")) || jsonObj["category"] !== getCatName()) continue;

        // Defines JSON objects
        const name = jsonObj.name;
        const text = jsonObj.text;
        const color = jsonObj.color;

        // Creates and adds a button to the "categories-container" element.
        createButton(name, text, color);
    }
}

/**
 * Create a button from a name, text, and color
 * @param {*} name to display on the button
 * @param {*} text to be copied upon clicking the button
 * @param {*} color color of the button
 */
function createButton(name, text, color) {
    // Creates a new button element
    const button = document.createElement("button");

    // Sets the text on the button equal to the name
    button.textContent = name;
    // Sets the background color of the button to the one stored, or "" if null
    button.style.backgroundColor = color;
    // Add an "onclick" attribute to the button to copy the text upon clocking
    button.setAttribute("onclick", "copyText('" + text + "')");
    // Set the ID to the name, with "_" replacing spaces
    button.setAttribute("id", name.replaceAll(" ", "_"));
    // Add the button class
    button.setAttribute("class", "button");
    // Adds the button to the categories container element
    document.getElementById("categories-container").appendChild(button);
}

function addEditButton(){
    const edit = document.getElementById("edit");
    edit.setAttribute("onclick", "window.location.href='editCategory.html?category=" + getCatName().replaceAll(" ", "_") + "'");
}

function editCategoryName(){
    const newName = document.getElementById("cat_name").value;
    if (newName.length === 0) {
        document.getElementById("cat_name").setAttribute("placeholder", "This field is required");
        return;
    }
    
    let newColor = document.getElementById("cat_but_color").value;
    
    const current = getCatName();
    if (newName === current){
        document.getElementById("cat_name").value = "";
        document.getElementById("cat_name").setAttribute("placeholder", "Cannot use the same name");
        return;
    }
    const storage = {...localStorage};
    for (let key in storage){
        if (key.includes("category") || key === 'userSettings') continue;
        if (key.replaceAll("_", " ").includes(current)){
            const json = JSON.parse(storage[key]);
            json.cat = newName;
            if (newColor !== ""){
                json["color"] = newColor;
            }
            localStorage.setItem("categories " + newName, JSON.stringify(json));
            removeCategory(current);
            updateTexts(current, newName);
            window.location.href = "categoryView.html?category=" + newName.replaceAll(" ", "_");
        }
    }
}

function removeCategory(name){
    for (let key in localStorage){
        if (key === "categories " + name){
            localStorage.removeItem(key);
            removeTexts(name);
            return true;
        }
    }
    return false;
}

function removeTexts(category){
    const storage = {...localStorage};
    for (let element in storage){
        if (element.includes("categories") || element === "userSettings") continue;
        const json = JSON.parse(element);
        if (json.category === category){
            localStorage.removeItem(element);
        }
    }
}

function deleteCategory(){
    const input = document.getElementById('cat_name').value;
    const indication = document.getElementById("indication");
    const show_name = document.getElementById("show_name");
    let status = document.getElementById('status');
    show_name.textContent = input;
    

    status.textContent = (removeCategory(input) 
              ? "DELETED"
              : "NOT FOUND");

    indication.hidden = false;
}


function updateTexts(category, newCategory){
    console.log(`${category} : ${newCategory}`);
    const storage = {...localStorage};
    for (let key in storage){
        if (key.includes("categories ") || key === 'userSettings')continue;
        const json = JSON.parse(key);
        if (json.hasOwnProperty("category") && (json["category"] === category)){
            json["category"] = newCategory;
            localStorage.removeItem(key);
            localStorage.setItem(JSON.stringify(json), "true");
        }
    }
}
/**
 * Copy the text parameter to the users clipboard, and display a visual indication.
 * @param {*} text
 */
async function copyText(text) {
    // Displays a text indication that text has attempted to be copied
    const hiddenPar = document.getElementById("hidden-indication");
    // Displays the result of the operation, failed/succeeded
    const hiddenStatus = document.getElementById("indication-cat");
    navigator.clipboard.writeText(text).then(() => {
        // Alter the result to indicate a successful copy
        hiddenStatus.textContent = "Succeeded";
        // Update the color of the result to a shade of green
        hiddenStatus.style.color = "#00ff40";
    }).catch(error => {
        hiddenStatus.textContent = "Failed!";
        console.log('Error whilst copying text: ', error);
    });

    hiddenPar.hidden = false
    setTimeout(function () {
        // Removes the text indication after 5 seconds
        hiddenPar.hidden = true;
    }, 5000);
}

/**
 * Adds a new text to the category the user is in.
 * Stores data as a JSON string, within the users localStorage.
 *
 *
 * @returns if name or text input fields are empty
 */
function addNewText() {
    // Define the category name
    const catName = getCatName();

    // Define all values for the new text button from the user input fields
    const name = document.getElementById("text_name").value;
    const text = document.getElementById("text_copy").value;
    let color = document.getElementById("text_but_color").value;

    // Add placeholders if name, or text is empty indicating they are required fields
    if (name.length === 0 || text.length === 0) {
        document.getElementById("text_name").setAttribute("placeholder", "This field is required");
        document.getElementById("text_copy").setAttribute("placeholder", "This field is required");
        return;
    }

    if (!checkName(name)){
        document.getElementById("text_name").setAttribute("placeholder", "Text Name already exists");
        document.getElementById("text_name").value = "";
        return;
    }

    // Set color equal to an empty string if the string is undefined
    if (color.length === 0 || color === '#') {
        color = getDefaultTextColor();
    }

    // Create the JSON strong from the text button values
    const json = '{"category":"' + catName + '", "name":"' + name + '", "text":"' + text + '", "color":"' + color + '"}';

    // Store the JSON string in users localStorage. Value is irrelevant 
    localStorage.setItem(json, "true");
    // Returns to the previous page
    history.back();
}

function checkName(textName){
    const catName = getCatName();
    const storage = {...localStorage};
    for (let key in storage){
        if (key.includes("categories") || key.includes("userSettings")) continue;

        // Parse the value of key into a JSON object.
        const jsonObj = JSON.parse(key);
        // Continues if the JSON obj does not have a "category" property, or the category value is not the correct category.
        if (!(jsonObj.hasOwnProperty("category")) || jsonObj["category"] !== catName) continue;
        if (jsonObj.name === textName){
            return false;
        }
    }
    return true;
}

/**
 * Returns the category name from the URL parameter ("category");
 * @returns category name
 */
function getCatName() {
    // Define the current window URL
    const url = window.location.search;
    const urlParams = new URLSearchParams(url);
    // Get the value of key "category"
    const category = urlParams.get('category');
    // Return the key without "_" characters
    return category.replaceAll("_", " ");
}

function openDelete(){
    const cat = getCatName();
    window.location.href = 'deleteText.html?category=' + cat.replaceAll("_", " ");
}

function deleteText(){
    const name = document.getElementById("text_name");
    const indication = document.getElementById("indication");
    const text = document.getElementById("text");
    if (name.value === ""){
        name.setAttribute("placeholder", "This field is required");
        return;
    }
    text.textContent = name.value;
    text.hidden = false;
    indication.textContent = "";
    const storage = {...localStorage};
    for (let key in storage){
        if (key.includes("categories ") || key === 'userSettings')continue;

        const json = JSON.parse(key);
        if (json["category"] === getCatName() && json["name"] === name.value){
            localStorage.removeItem(key);
            
            indication.textContent += " was deleted.";
            indication.hidden = false;
            return;
        }
    }
    indication.textContent += " was not found.";
    indication.hidden = false;
}