function openCategory() {
    const url = window.location.search;
    const urlParams = new URLSearchParams(url);

    const category = urlParams.get('category');
    const titleElem = document.querySelector('#bg-container').childNodes[1];
    titleElem.textContent += category.replaceAll("_", " ");
    loadButtons(category);
}

function loadButtons(category) {
    const storage = {...localStorage};
    document.getElementById("add-new").setAttribute("onclick", "window.location.href='../newText.html?category=" + category + "'")
    for (let element in storage) {
        if (element.includes("categories ")) {
            continue;
        }
        const jsonObj = JSON.parse(element);
        if (jsonObj.hasOwnProperty("category") && jsonObj["category"] === getCatName()) {
            console.log(element);
            const name = jsonObj.name;
            const text = jsonObj.text;
            const color = jsonObj.color;

            const button = document.createElement("button");

            button.textContent = name;
            button.style.backgroundColor = color;
            button.setAttribute("id", name.replaceAll(" ", "_"));
            button.setAttribute("class", "button");
            button.setAttribute("onclick", "copyText('" + text + "')");

            document.getElementById("categories-container").appendChild(button);
        }
    }
}

function updateName() {
    document.getElementById("cat_name").textContent = getCatName();
}

async function copyText(button) {
    const input = document.createElement("input");
    input.value = button;
    input.style.position = "fixed";
    input.style.top = "-2000px";
    document.body.appendChild(input);

    input.select();
    try {
        const res = await Promise.resolve(document.execCommand("copy"));
        document.body.removeChild(input);
        return res;
      } catch (err) {
        return Promise.resolve(false);
      }
}

function addNewText() {
    const name = document.getElementById("text_name").value;
    
    if (name.length === 0) {
        document.getElementById("text_name").setAttribute("placeholder", "This field is required");
        return;
    }
    const text = document.getElementById("text_copy").value;

    if (text.length === 0) {
        document.getElementById("text_copy").setAttribute("placeholder", "This field is required");
        return;
    }

    let color = document.getElementById("text_but_color").value;
    if (color.length === 0){
        color = "";
    }

    const catName = getCatName();
    
    const json = '{"category":"' + catName + '", "name":"' + name + '", "text":"' + text + '", "color":"' + color + '"}';

    localStorage.setItem(json, text);
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