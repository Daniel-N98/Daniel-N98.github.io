function openCategory() {
    const category = getCatName();
    // Get the first child node of the #bg-container element
    const titleElem = document.querySelector('#bg-container').childNodes[1];
    // Set the title to that of the category
    titleElem.textContent += category;
    document.getElementById("add-new").setAttribute("onclick", "window.location.href='../newText.html?category=" + category + "'")
    // Iterates through the users local storage, and calls for a button to be created for each text
    loadButtons();
}

function loadButtons() {
    // Copies the localStorage into an object
    const storage = {...localStorage};
    for (let key in storage) {
        // If the key includes "categories", continue to the next iteration
        if (key.includes("categories"))continue;
        
        // Parse the value of key into a JSON object
        const jsonObj = JSON.parse(key);
        // Continues if the JSON obj does not have a "category" property, or the category value is not the correct category
        if (!(jsonObj.hasOwnProperty("category")) || jsonObj["category"] !== getCatName()) continue;
        
        // Defines JSON objects
        const name = jsonObj.name;
        const text = jsonObj.text;
        const color = jsonObj.color;

        // Creates and adds a button to the "categories-container" element
        createButton(name, text, color);
    }
}

function createButton(name, text, color){
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

async function copyText(text) {
    // Create a new input element to hold the text being copied
    const input = document.createElement("input");
    // Set the inputs text value equal to the text being copied
    input.value = text;
    // Set the position as "fixed"
    input.style.position = "fixed";
    // Move the element far off screen as not to be seen by the user
    input.style.top = "-2000px";
    // Append the child node
    document.body.appendChild(input);

    // Displays a text indication that text has attempted to be copied
    const hiddenPar = document.getElementById("hidden-indication");
    // Displays the result of the operation, failed/succeeded
    const hiddenStatus = document.getElementById("indication-cat");

    input.select();
    try {
        // Attempt to copy the text to the users clipboard
        document.execCommand("copy");
        // Alter the result to indicate a successful copy
        hiddenStatus.textContent = "Succeded";
        // Update the color of the result to a shade of green
        hiddenStatus.style.color = "#00ff40";
      } catch (err) {
        // Red color is applied by default, so no need to set it here to indicate a fail
        // Alter the result to indicate a failed copy
        hiddenStatus.textContent = "Failed!";
      }
      // Remove the child node we appended
      document.body.removeChild(input);
      // Remove the hidden attribute so the text indication is shown
      hiddenPar.hidden = false
      setTimeout(function(){
        // Removes the text indication after 5 seconds
        hiddenPar.hidden = true;
    },5000);
}

function addNewText() {
    const catName = getCatName();
    const name = document.getElementById("text_name").value;
    const text = document.getElementById("text_copy").value;
    let color = document.getElementById("text_but_color").value;
    
    if (name.length === 0 || text.length === 0) {
        document.getElementById("text_name").setAttribute("placeholder", "This field is required");
        document.getElementById("text_copy").setAttribute("placeholder", "This field is required");
        return;
    }

    if (color.length === 0){
        color = "";
    }

    const json = '{"category":"' + catName + '", "name":"' + name + '", "text":"' + text + '", "color":"' + color + '"}';

    localStorage.setItem(json, "true");
    document.location.href = "../categories.html";
    history.back();
}

function getCatName() {
    const url = window.location.search;
    const urlParams = new URLSearchParams(url);
    const category = urlParams.get('category');
    return category.replace("_", " ");
}

/**
 * To-Do
 * Implement delete/edit features
 * Implement visual indication that a text has been copied (Mini auto closing pop up, button change etc)
 * Make categories/categoryView pages more easily recognisable
 * Implement settings, Account and signout functionality
 * Possibly remove Account/Signout buttons as it's not really needed since we're using LocalStorage.
 */