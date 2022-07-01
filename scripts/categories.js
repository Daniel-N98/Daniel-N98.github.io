const container = document.getElementById("categories-container");

function addCategory() {
    const name = document.getElementById("cat_name").value;
    if (name.length === 0) {
        document.getElementById("cat_name").setAttribute("placeholder", "This field is required");
        return;
    }
    let color = document.getElementById("cat_but_color").value;
    if (color.length === 0){
        color = "";
    }
    const json = '{"cat":"' + name + '", "color":"' + color + '"}';

    localStorage.setItem("categories " + name.replaceAll(" ", "_"), json);

    //localStorage.setItem(name.replace(" ", "_"), "category");
    document.location.href = "../html/categories.html";
    createButtons();
}

function removeCategory(name) {
}

// Used in development phase to manually clear LocalStorage
function deleteStorage(){
    localStorage.clear();
    location.reload();
}

function createButtons() {
    const storage = {...localStorage};
    for (let element in storage) {
        if (element.includes("category"))continue;
        
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
    window.location.href = '../html/categoryView.html?category=' + button.textContent.toLowerCase().replace(" ", "_");
}
