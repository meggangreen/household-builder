// To Do:
// Validate data entry (age is required and > 0, relationship is required)
// Add people to a growing household list
// Remove a previously added person from the list
// Display the household list in the HTML as it is modified
// Serialize the household as JSON upon submission as a fake trip to the server
// On submission, put the serialized JSON in the provided "debug" DOM element
// and display that element.
// After submission the user should be able to make changes and submit the
// household again.

use strict;

// onClick listeners: submit, add, edit-id, remove-id
// validation: age > 0, relationship !== '---'
//      'add' button disabled until validation successful

// Variable assignments
let addButton = document.getElementsByTagName("button")[0];
let submitButton = document.getElementsByTagName("button")[1];
let ageField = document.getElementsByName("age")[0];
let relationField = document.getElementsByName("relationship")[0];
let smokerField = document.getElementsByName("smoker")[0];


// Validation listeners
ageField.onkeyup(function() {
    let ageInput = Number(ageField.value);
    if ( ( isNaN(ageInput) ) || ( ageInput <= 0 ) ) {

    }
});


function add_person(age, relationship, smoker=null) {
    // add a list item to the hhlist:
    //      id, age, relationship, 'non' | 'smoker', edit, remove
}


function edit_person(id) {
    // calls to remove list item from hhlist ?
    // places list item data in form ready to add (update)
}


function remove_person(id) {
    // removes list item from hhlist
}


function submit_household() {
    // compile payload
    // send ajax call to update db
    //      put json into 'debug'
    // display response (a success/failure message)
}
