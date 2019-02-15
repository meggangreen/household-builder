// To Do:
// [x] Validate data entry (age is required and > 0, relationship is required)
// [x] Add people to a growing household list
// [x] Remove a previously added person from the list
// [x] Display the household list in the HTML as it is modified
// [x] Serialize the household as JSON upon submission as a fake trip to the server
// [x] On submission, put the serialized JSON in the provided "debug" DOM element
// [x] and display that element.
// [x] After submission the user should be able to make changes and resubmit.

// notes:
// [x] onClick listeners: submit, add, edit-id, remove-id
// [x] validation: age > 0, relationship !== ''
//      'add' button disabled until validation successful
//      'submit' button disabled until list has items

// I learned JavaScript recently and in ES6. I know the project asks for ES5; I
// am unsure what differences might exist. I tried to check the MDN and W3Schools
// docs for browser compatibility.

// I have exposure to Jasmine for testing JS, but am not sure how quickly or
// elegantly I could implement it for this project. I will forego testing.


"use strict";

// Variable assignments
let hhList = document.getElementsByTagName("ol")[0]
let hhPeople = new Array();
let personID = -1;
let personForm = document.getElementsByTagName("form")[0];
let addButton = document.getElementsByTagName("button")[0];
let submitButton = document.getElementsByTagName("button")[1];
let ageField = document.getElementsByName("age")[0];
let relationField = document.getElementsByName("rel")[0];
let smokerField = document.getElementsByName("smoker")[0];

// Make a cancel button to use in edit mode
let cancelButton = createDocButton("cancel", "edit", "cancelEdit()");

// First thing on page load
addButton.disabled = true;
submitButton.disabled = true;

// Add event listeners
if (ageField.addEventListener) {
    ageField.addEventListener("keyup", validateInputs);
} else if (ageField.attachEvent) {  // IE8 and earlier
    ageField.attachEvent("onkeyup", validateInputs);
} // end if -- ageField keyup

if (relationField.addEventListener) {
    relationField.addEventListener("change", validateInputs);
} else if (relationField.attachEvent) {  // IE8 and earlier
    relationField.attachEvent("onchange", validateInputs);
} // end if -- relationField change

if (smokerField.addEventListener) {
    smokerField.addEventListener("change", validateInputs);
} else if (smokerField.attachEvent) {  // IE8 and earlier
    smokerField.attachEvent("onchange", validateInputs);
} // end if -- smokerField change

if (addButton.addEventListener) {
    addButton.addEventListener("click", addEditPerson);
} else if (addButton.attachEvent) {  // IE8 and earlier
    addButton.attachEvent("onclick", addEditPerson);
} // end if -- addButton click

if (submitButton.addEventListener) {
    submitButton.addEventListener("click", submitHousehold);
} else if (submitButton.attachEvent) {  // IE8 and earlier
    submitButton.attachEvent("onclick", submitHousehold);
} // end if -- submitButton click


// Person constructor
function Person(id, age, relation, smoker) {
    /* A person constructor. */

    this.id = id;
    this.age = age;
    this.relation = relation,
    this.smoker = smoker;

} // end Person


// Validation function
function validateInputs() {
    /* Validate age and relationship as they're being entered. */

    let ageInput = Number(ageField.value);
    let relationInput = relationField.value;
    let errorDIV = document.getElementById("error");
    let errorMessage = "";
    if (isNaN(ageInput)) {
        errorMessage = errorMessage + "Age needs to be a number.";
    } else if (ageInput <= 0) {
        errorMessage = errorMessage + "Age must be greater than 0.";
    } else if (relationInput === '') {
        errorMessage = errorMessage + "Relationship cannot be empty.";
    } // end if


    if ( errorMessage ) {
        addButton.disabled = true;
        errorDIV.innerHTML = errorMessage;
    } else {
        addButton.disabled = false;
        errorDIV.innerHTML = "";
    } // end if

} // end validateInputs


// Event handler callback functions
function addEditPerson(evt) {
    /* Add or edit a person's data. Triggered when add/update clicked. */

    evt.preventDefault();
    // get form data -- revalidate first? I don't think it's necessary
    let person = new Person((personID > -1) ? personID : hhPeople.length,
                            ageField.value,
                            relationField.value,
                            smokerField.checked);

    // Send person to be made into a list item element
    let personLI = makePersonLI(person);

    if (personID > -1) {
        hhPeople[personID] = person;
        let personToReplace = findPersonLI(personID);
        hhList.replaceChild(personLI, personToReplace);
    } else {
        hhPeople.push(person);
        hhList.appendChild(personLI);
    } // end if

    resetForm();

} // end addEditPerson


function choosePersonToEdit(evt) {
    /* Places person's data in form ready to re-add. Changes addButton to say
       'update', replaces submitButton with cancelButton. evt must be LI
       element.
    */

    // Change form layout
    submitButton.disabled = true;
    addButton.innerHTML = "update";
    personForm.lastElementChild.replaceChild(cancelButton, submitButton);

    // Get person and fill in form with person attributes
    personID = Number(evt.id);
    let person = hhPeople[personID];
    ageField.value = person.age;
    relationField.value = person.relation;
    smokerField.checked = person.smoker;

} // end choosePersonToEdit


function cancelEdit(evt) {
    /* Triggered when user clicks cancel while in edit mode. */
    resetForm();
}


function removePerson(evt) {
    /* Remove personLI from hhList and replace person with null in hhPeople. */

    // if confirmRemove() is true --> click ok/cancel (true/false) to confirm

    personID = Number(evt.id);
    hhPeople[personID] = null;
    let personToRemove = findPersonLI(personID);
    hhList.removeChild(personToRemove);

    resetForm();

} // end removePerson


function submitHousehold(evt) {
    /* Sends JSON -- made of non-null objects from hhPeople -- to server. */

    evt.preventDefault();

    // Serialize JSON payload
    let hhPeopleClean = cleanOutNulls(hhPeople);
    let hhPeopleSerial = JSON.stringify(hhPeopleClean);

    // Get response message area ready
    let debugEl = document.getElementsByClassName("debug")[0];
    debugEl.style.display = "inline-block";
    debugEl.insertAdjacentText("beforeend", "JSON: " + hhPeopleSerial);

    // Send to server
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", 'index.html', true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.onload = function () {
        if ( this.readyState == 4 && this.status == 200 ) {
            debugEl.insertAdjacentHTML("beforeend", "<p>Response: success!</p>");
        } else {
            debugEl.insertAdjacentHTML("beforeend", "<p>Response: failure</p>");
        } // end if
    };
    xhttp.send(hhPeopleSerial);

} // end submitHousehold


// Helper functions
function resetForm() {
    /* Resets all aspects of the form. */

    personID = -1;
    personForm.reset();
    addButton.innerHTML = "add";
    addButton.disabled = true;
    if (personForm.lastElementChild.firstElementChild.isSameNode(cancelButton)) {
        personForm.lastElementChild.replaceChild(submitButton, cancelButton);
    } // end if

    submitButton.disabled = (hhList.childElementCount > 0) ? false : true;

} // end resetForm


function cleanOutNulls(arr) {
    /* Returns copy of the arr setting null values to 'remove' for processing on
       the backend. Uses one pass for speed.

       Ideally, people can populate this list by pulling their current household
       members from the database and add to, edit, or remove from the list, and
       then submit changes to the database. It's not perfect as is, because the
       same family member could get added and removed 1000 times, but it's fine.
    */

    // let newArr = new Array();
    let newArr = arr.map((element, index) => element || {id:index, remove:true})

    //  {
    //     // console.log(element);
    //     if ( element ) {
    //         return element;
    //         // newArr.push(element);
    //     } else {
    //         return {id:index, remove:true};
    //     } // end if
    // });


    // for ( let i = 0; i < arr.length; i++ ) {
    //     if ( arr[i] ) {
    //         newArr.push(arr[i]);
    //     } else {
    //         newArr.push({id:i, remove:true});
    //     } // end if
    // } // end for

    return newArr;

} // end cleanOutNulls


function makePersonLI(person) {
    /* Returns a new person list item element for placing in the DOM. */

    // Create LI element
    let nodeLI = document.createElement("LI");
    nodeLI.id = String(person.id);

    // Create LI text node
    let text = ""
    text += "Age: " + person.age + " ";
    text += "Relationship: " + person.relation + " ";
    text += "Smoker: " + String(person.smoker);
    nodeLI.appendChild(document.createTextNode(text));

    // Create edit and remove button nodes
    let buttons = [["edit", "choosePersonToEdit(this.parentElement)"],
                   ["remove", "removePerson(this.parentElement)"]];
    for ( let i = 0; i < buttons.length; i++ ) {
        let button = createDocButton(buttons[i][0], nodeLI.id, buttons[i][1])
        nodeLI.appendChild(button);
    } // end for

    return nodeLI;

} // end makePersonLI


function findPersonLI(personID) {
    /* Returns an existing person list item element from the DOM. */

    let peopleLI = hhList.children;
    for ( let i = 0; i < peopleLI.length; i++ ) {
        if ( peopleLI[i].id === String(personID) ) {
            return peopleLI[i];
        } // end if
    } // end for

    return null;
}


function createDocButton(name, bID, func) {

    let buttonNode = document.createElement("Button");
    buttonNode.id = name + "-" + bID;
    let buttonOnClick = document.createAttribute("onclick");
    buttonOnClick.value = func;
    buttonNode.setAttributeNode(buttonOnClick);
    buttonNode.appendChild(document.createTextNode(name));

    return buttonNode;
}
