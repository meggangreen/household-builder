// To Do:
// [x] Validate data entry (age is required and > 0, relationship is required)
// [x] Add people to a growing household list
// [x] Remove a previously added person from the list
// [x] Display the household list in the HTML as it is modified
// [ ] Serialize the household as JSON upon submission as a fake trip to the server
// [ ] On submission, put the serialized JSON in the provided "debug" DOM element
// [ ] and display that element.
// [ ] After submission the user should be able to make changes and resubmit.

"use strict";

// [ ] onClick listeners: submit, add, edit-id, remove-id
// [x] validation: age > 0, relationship !== ''
//      'add' button disabled until validation successful


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

if (addButton.addEventListener) {
    addButton.addEventListener("click", addEditPerson);
} else if (addButton.attachEvent) {  // IE8 and earlier
    addButton.attachEvent("onclick", addEditPerson);
} // end if -- addButton click


function Person(id, age, relation, smoker) {
    /* A person constructor. */

    this.id = id;
    this.age = age;
    this.relation = relation,
    this.smoker = smoker;

    // this.makePersonLI = makePersonLI(this);
}


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


// Validation functions
function validateInputs() {
    /* Validate age and relationship as they're being entered. */

    let ageInput = Number(ageField.value);
    let relationInput = relationField.value;
    if ( (isNaN(ageInput)) || (ageInput <= 0) || (relationInput === '') ) {
        addButton.disabled = true;
    } else {
        addButton.disabled = false;
    } // end if

} // end validateInputs


function addEditPerson(evt) {
    /* Add or edit a person's data. Triggered when add/update clicked. */

    evt.preventDefault();
    // get form data -- revalidate first?
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


    // compile payload
    // send ajax call to update db
    //      put json into 'debug'
    // display response (a success/failure message)
} // end submitHousehold


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
