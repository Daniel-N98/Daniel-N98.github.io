const def_cat_color = document.getElementById("def_cat_color");
const def_text_color = document.getElementById("def_text_color");

function setDefaultSettings(){
    if (getSettingsStorage() === null){
        const key = '{"def_cat_color":"#FFF","def_text_color":"#FFF"}';
        localStorage.setItem('userSettings', key);
    }
}

function replaceValue(value){
    localStorage.setItem('userSettings', JSON.stringify(value));
}

// Settings : {'def_cat_color:#817264', 'def_text_color:#fff'}

/**
 * Retrieves the value at the Settings key in the users LocalStorage.
 * 
 * @returns JSON Settings value 
 */
function getSettingsStorage(){
    return localStorage.getItem('userSettings');
}

/**
 * Retrieves the default category color includes '#'
 * 
 * @returns default category color
 */
function getDefaultCatColor(){
    const json = JSON.parse(getSettingsStorage());
    return json['def_cat_color'];

}

/**
 * Sets the default category color equal to the contents of user input
 */
function setDefaultCatColor(){
    const color = def_cat_color.value.replaceAll("#", "");
    const json = JSON.parse(getSettingsStorage());
    json['def_cat_color'] = `#${color}`;
    replaceValue(json);
}

/**
 * Retrieves the default text color includes '#'
 * 
 * @returns default text color
 */
function getDefaultTextColor(){
    const json = JSON.parse(getSettingsStorage());
    return json['def_text_color'];
}

/**
 * Sets the default text color equal to the contents of user input
 */
function setDefaultTextColor(){
    const color = def_text_color.value.replaceAll("#", "");
    const json = JSON.parse(getSettingsStorage());
    json['def_text_color'] = `#${color}`;
    replaceValue(json);
}

function updateSettings(){
    let result = "";
    if (def_cat_color.value !== ""){
        setDefaultCatColor();
        result = "Default category color updated\n"
    }
    if (def_text_color.value !== ""){
        setDefaultTextColor();
        result += "Default text color updated"
    }
    if (result.length === 0) result = "All fields are empty";
    const hiddenIndication = document.getElementById("hidden-indication");
    hiddenIndication.textContent = result;
    hiddenIndication.hidden = false;
}