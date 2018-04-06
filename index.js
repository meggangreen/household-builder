// To Do:
// [x] Validate data entry (age is required and > 0, relationship is required)
// [ ] Add people to a growing household list
// [ ] Remove a previously added person from the list
// [ ] Display the household list in the HTML as it is modified
// [ ] Serialize the household as JSON upon submission as a fake trip to the server
// [ ] On submission, put the serialized JSON in the provided "debug" DOM element
// [ ] and display that element.
// [ ] After submission the user should be able to make changes and submit the
// [ ] household again.

"use strict";

// [ ] onClick listeners: submit, add, edit-id, remove-id
// [x] validation: age > 0, relationship !== ''
//      'add' button disabled until validation successful


// Variable assignments
let personID = null;
let addButton = document.getElementsByTagName("button")[0];
let submitButton = document.getElementsByTagName("button")[1];
let ageField = document.getElementsByName("age")[0];
let relationField = document.getElementsByName("rel")[0];
let smokerField = document.getElementsByName("smoker")[0];

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


// Validation functions
function validateInputs() {
    let ageInput = Number(ageField.value);
    let relationInput = relationField.value;
    if ( (isNaN(ageInput)) || (ageInput <= 0) || (relationInput === '') ) {
        addButton.disabled = true;
    } else {
        addButton.disabled = false;
    } // end if
} // end validateInputs


function addPerson(age, relationship, smoker=null) {
    // add a list item to the hhlist:
    //      id, age, relationship, 'non' | 'smoker', edit, remove
} // end addPerson


function editPerson(id) {
    // calls to remove list item from hhlist ?
    // places list item data in form ready to add (update)
}


function removePerson(id) {
    // removes list item from hhlist
}


function submitHousehold() {
    // compile payload
    // send ajax call to update db
    //      put json into 'debug'
    // display response (a success/failure message)
}
