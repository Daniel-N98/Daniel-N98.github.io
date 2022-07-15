const container = document.getElementById("categories-container");

function addCategory() {
    const name = document.getElementById("cat_name").value;
    if (name.length === 0) {
        document.getElementById("cat_name").setAttribute("placeholder", "This field is required");
        return;
    }
    let color = document.getElementById("cat_but_color").value;
    if (color.length === 0) {
        color = getDefaultCatColor();
    }
    if (!checkCategory(name)){
        document.getElementById("cat_name").setAttribute("placeholder", "Category Name already exists");
        document.getElementById("cat_name").value = "";
        return;
    }
    const json = '{"cat":"' + name + '", "color":"' + color + '"}';

    localStorage.setItem("categories " + name, json);

    //localStorage.setItem(name.replace(" ", "_"), "category");
    document.location.href = "categories.html";
    createButtons();
}

function checkCategory(categoryName){
    const storage = {...localStorage};
    for (let key in storage){
        if (key.includes("categories ")){
            // Parse the value of key into a JSON object.
            const jsonObj = JSON.parse(storage[key]);
            if (jsonObj.cat === categoryName){
                return false;
            }
        }
    }
        return true;
}

function createButtons() {
    const storage = {...localStorage};
    for (let element in storage) {
        if (element.includes("category") || element.includes("userSettings")) continue;

        const json = storage[element];
        const parsed = JSON.parse(json);
        let name = parsed["cat"];
        const color = parsed["color"];

        const button = document.createElement("button");

        button.style.backgroundColor = color;
        button.setAttribute("class", "button");
        button.textContent = name.replaceAll("_", " ");
        name = name.replaceAll(" ", "_");
        button.setAttribute("onclick", "addButtonCookie(" + name + ")");
        button.setAttribute("id", name);
        document.getElementById("categories-container").appendChild(button);
    }
}

function addButtonCookie(button) {
    window.location.href = 'categoryView.html?category=' + button.textContent.replaceAll(" ", "_");
}


