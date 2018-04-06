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
let cancelButton = document.createElement("Button");
cancelButton.id = "cancel";
cancelButton.onclick = "cancelEdit()";
cancelButton.appendChild(document.createTextNode("cancel"));


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
    addButton.addEventListener("click", addPerson);
} else if (addButton.attachEvent) {  // IE8 and earlier
    addButton.attachEvent("onclick", addPerson);
} // end if -- addButton click


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


function Person(id, age, relation, smoker) {
    this.id = id;
    this.age = age;
    this.relation = relation,
    this.smoker = smoker;

    // this.makePersonLI = makePersonLI(this);
}


function addPerson(evt) {
    evt.preventDefault();
    // get form data -- revalidate first?
    let person = new Person((personID > -1) ? personID : hhPeople.length,
                            ageField.value,
                            relationField.value,
                            smokerField.checked);

    console.log(personID, person.id);


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

    // We need to reset the form
    personID = -1;
    personForm.reset();
    addButton.innerHTML = "add";
    if (personForm.lastElementChild.firstElementChild.isSameNode(cancelButton)) {
        personForm.lastElementChild.replaceChild(submitButton, cancelButton);
    } // end if

    submitButton.disabled = (hhList.childElementCount > 0) ? false : true;

} // end addPerson


function editPerson(evt) {
    /*  Places person's data in form ready to re-add. Changes addButton to say
        'update', replaces submitButton with cancelButton. evt must be LI
        element.  */

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






} // end editPerson


function removePerson(evt) {
    // removes list item from hhlist
} // end removePerson


function submitHousehold(evt) {
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

    // Create edit and remove button nodes
    let editN = document.createElement("Button");
    editN.id = "edit-" + nodeLI.id;
    let editOnClick = document.createAttribute("onclick");
    editOnClick.value = "editPerson(this.parentElement)";
    editN.setAttributeNode(editOnClick);
    editN.appendChild(document.createTextNode("edit"));
    let removeN = document.createElement("Button");
    removeN.id = "remove-" + nodeLI.id;
    removeN.onclick = "removePerson(this.parentElement)";
    removeN.appendChild(document.createTextNode("remove"));

    // Create LI text node
    let text = ""
    text += "Age: " + person.age + " ";
    text += "Relationship: " + person.relation + " ";
    text += "Smoker: " + String(person.smoker);
    nodeLI.appendChild(document.createTextNode(text));
    nodeLI.appendChild(editN);
    nodeLI.appendChild(removeN);

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

    // hhList.children.forEach(function(item) {
    //     if ( item.id === String(personID) ) {
    //         return item;
    //     } // end if
    // }); // end forEach

    return null;
}


function findPersonObj(personID) {
    /* Returns an existing person list item element from the DOM. */

    // hhPeople.forEach(function() {
    //     if ( item.id === String(personID) ) {
    //         return item;
    //     } // end if
    // }); // end forEach

    return hhPeople[personID];
}
