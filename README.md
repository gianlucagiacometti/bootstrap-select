# bootstrap-select

Extension class for the Bootstrap (https://getbootstrap.com) Select element

This program is written in plain JavaScript and is designed for Bootstrao 5.2.x and modern browsers.

The minimum version of ECMAScript is 2017. I reserve the right to switch to newer versions of ECMAScript at any times without further notice.

Although the W3C Recommendations do not mention it for HTML 5, the HTML 4.01 Recommendations (https://www.w3.org/TR/html401/interact/forms.html#h-17.6) state that: "Note. Implementors are advised that future versions of HTML may extend the grouping mechanism to allow for nested groups (i.e., OPTGROUP elements may nest). This will allow authors to represent a richer hierarchy of choices."
For this reason the bsSelect class is already recursive.

The bsSelect class uses the Input and the Dropdown elements of Bootstrap, for a maximum level of compatibility.

This program is released under the MIT licence.


## Requires

Bootstrap >= 5.2
Boostrap Icons >= 1.9 (only if option images are used)


## Usage

Add these lines in the html &lt;head&gt; section:

    <link rel="stylesheet" href="bootstrap.select.css">
    <script src="bootstrap.select.js"></script>

NOTE: the values of "href" and "src" attributes must reproduce the folder structure where the two files are located.

The "selectInserted" CSS animation provides an authomatic way to create a new bsSelect class element.

You may:

1. Add to the &lt;select&gt; element the class "bootstrap-select".

        <select id="myselect" class="bootstrap-select">...</select>

2. Add the "bootstrap-select" class dynamically via JavaScript when the DOM is already loaded.

        <select id="myselect">...</select>

        document.querySelector("#myselect").classList.add("bootstrap-select")

3. Create a new class element manually via JavaScript without using the "bootstrap-select" class (the value of randomIndex must be a 16-digit string).

        <select id="myselect">...</select>

	    let randomIndex = "" + Date.now() + Math.floor(Math.random()*1000)
	    let mySelectElement = new bsSelect("myselect", randomIndex, classElementParameters)

	    # The classElementParameters is an optional object. The default value is {}.


## Options

### Optional parameters for the Class element 

| Property   | Type | Default   | Accepted values     | Description                                                        |
|------------|------|-----------|---------------------|--------------------------------------------------------------------|
| visibility | text | collapsed | collapsed, expanded | Sets the visibility of the dropdown menu at the time of creation.  |


### Optional classes for the &lt;select&gt; element

| Class          | Description                                                                                     |
|----------------|-------------------------------------------------------------------------------------------------|
| label-floating | Styles the &lt;select&gt; element as the Bootstrap &lt;input&gt; element with a floating label. |


### Optional properties for &lt;select&gt; element

| Property | Type    | Default | Description                                       |
|----------|---------|---------|---------------------------------------------------|
| disabled | boolean | false   | Disables the &lt;select&gt; element.              |
| multiple | boolean | false   | Creates a multiple choice &lt;select&gt; element. |


### Optional attributes for the &lt;option&gt; element

| Attribute                         | Type         | Description                                                                                                                                                                                                |
|-----------------------------------|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| data-bs-select-option-icon        | text         | The name of the Bootstrap icon which will be prepended to the text of the &lt;option&gt; element (without "bi-").                                                                                                    |
| data-bs-select-option-icon-class  | text         | The name of the class which will be added to the &lt;i&gt; element of the icon.                                                                                                                            |
| data-bs-select-option-image       | text         | The "src" attribute of the image which will be inserted at the very right of the text of the &lt;option&gt; element.                                                                                               |
| data-bs-select-option-image-class | text         | The name of the class which will be added to the &lt;img&gt; element of the &lt;option&gt; image.                                                                                                                  |
| data-bs-select-option-comment     | text or html | The content of the comment which will be inserted below the text of the &lt;option&gt; element. The comment has a default style. All additional styles must be specified in the html as classes or inline styles.  |


### Optional properties for the &lt;option&gt; element

| Property | Type    | Default | Description                                   |
|----------|---------|---------|-----------------------------------------------|
| disabled | boolean | false   | Disables the &lt;option&gt; element.          |
| selected | boolean | false   | Marks the &lt;option&gt; element as selected. |


## Methods

| Name                                     | Description                                                                                                                                                         | Parameters                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Example |
|------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------|
| sort(parameters)                         | Sorts the options of the &lt;select&gt; element.                                                                                                                    | mode: "asc" / "desc" (default: "asc")<br>disabled: "ignore" / "top" / "bottom" / "include" (default: "ignore")<br>sortDisabled: "true" / "false" (default: "true")<br>emptyDisabledValue: "top" / "include" (default: "top")<br>optionGroups: "include" / "ignore" (default: "include")                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |         |
|                                          |                                                                                                                                                                     | { mode: "asc" } => Sorts the option texts from A to Z.<br>{ mode: "desc" } => Sorts the option texts from Z to A.<br>{ disabled: "ignore" } => Sorts the option texts not including the disabled options.<br>{ disabled: "top" } => Moves all the disabled options to the top of the list.<br>{ disabled: "bottom" } => Moves all the disabled options to the bottom of the list.<br>{ disabled: "include" } => Includes all the disabled options in the sorting.<br>{ sortDisabled: "true" } => Sorts the disabled options according to the <b>mode</b> parameter (this parameter may be set ONLY if the parameter <b>disabled</b> is set to "top" or "bottom").<br>{ sortDisabled: "false" } => Does not sort the disabled options (this parameter may be set ONLY if the parameter <b>disabled</b> is set to "top" or "bottom").<br>{ emptyDisabledValues: "top" } => Moves all disabled options with empty value ("") to the top of the list.<br>{ emptyDisabledValues: "include" } => Includes all disabled options with empty value ("") in the sorting (this value of the parameter may be set ONLY if the parameter <b>disabled</b> is set to "include").<br>{ optionGroups: "include" } => Includes the option groups in the sorting, according to the parameter <b>mode</b> and to the text of their attribute <em><b>label</b></em>.<br>{ optionGroups: "ignore" } => Keeps the position of the option groups fixed in the list and sorts the groups of options in between separately.  |         |
| insert(options, parent)                  | Inserts a single &lt;option&gt; element, an array of &lt;option&gt; elements, an empty &lt; optgroup&gt; element or an array of empty &lt;optgroup&gt; elements.    | Acceptable <b>options</b> are both html strings or JavaScript DOM elements and their combinations:<br>1. '<option value"myvalue">My text</option>'<br>2. ['<option value="anothervalue">Another text</option>', '<option value="" disabled>Disabled value</option>']<br>3. option (where option is an element created by: option = document.createElement("option"); option.value = "2"; option.text = "New option")<br>4. [option, otherdomoptionelement]<br>5. [option, '<optgroup id="my-group-id" label="My group"></optgroup>']<br><br>The optional parameter <b>parent</b> may be:<br>"0" (default value) => The options will be inserted as children of the listbox.<br>"The attribute id of an &lt;optgroup&gt; element" => The options will be inserted as children of that &lt;optgroup&gt;.<br>"The random 16-dgit index of an &lt;optgroup&gt; element" => The options will be inserted as children of that &lt;optgroup&gt;.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |         |
| remove(parameters)                       | Remove one or more &lt;option&gt; or &lt;optgroup&gt; elements according to the specified parameters.                                                               | value: <em>single value</em><br>value: <em>array of values</em><br>id: <em>single element id</em><br>id: <em>array of element ids</em><br>index: <em>a single 16-digit random index of the element</em>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |         |
| value()<br><br>value(values, parameters) | Gets or sets selected values.                                                                                                                                       | If neither values nor parameters are specified the method gets the selected value of the non-multiple &lt;select&gt; element or the array of values for the multiple &lt;select&gt; element.<br><br>Accepted values are:<br>1. single value for a non-multiple &lt;select&gt; element (the first element will be taken as the selected value if an array is provided)<br>2. a single value or an array of values for a multiple &lt;select&gt; element<br><br>Accepted parameters are:<br>{ swap: "true" } (default value) => The new values will be the only selected options.<br>{ swap: "false" } => The new values will be added to the existing selected values.<br>{ disabled: "false" } (default value) => Disabled options will NOT be set as selected if their value is provided.<br>{ disabled: "true" } => Disabled options will be set selected if their value is provided.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |         |
| disabled(parameters)                     | Sets the &lt;select&gt; element as disabled or not disabled.                                                                                                        | Accepted parameters are:<br>"true"<br>"false" (default value if the parameter is omitted or is not a boolean)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |         |
| readonly(parameters)                     | Sets the &lt;select&gt; element as readonly. Its effect is similar to the effect of the method <b>disabled</b> but the background of element will remain unchanged. | Accepted parameters are:<br>"true"<br>"false" (default value if the parameter is omitted or is not a boolean)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |         |


