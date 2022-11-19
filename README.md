# bootstrap-select
Extension class for the Bootstrap select element

This program is written in plain JavaScript and is designed for Bootstrao 5.2.x and modern browsers.

The minimum version of ECMAScript is 2017. I reserve the right to switch to newer versions of ECMAScript at any times without further notice.

Although the W3C Recommendations do not mention it for HTML 5, the HTML 4.01 Recommendations (https://www.w3.org/TR/html401/interact/forms.html#h-17.6) state that: "Note. Implementors are advised that future versions of HTML may extend the grouping mechanism to allow for nested groups (i.e., OPTGROUP elements may nest). This will allow authors to represent a richer hierarchy of choices."
For this reason the bsSelect class is already recursive.

The bsSelect class uses the Input and the Dropdown element of Bootstrap for a maximum level of compatibility.

This program is released under the MIT licence.

## Usage

Add these lines in the html &lt;head&gt; section:

    <link rel=\"stylesheet/less\" type=\"text/css\" href=\"bootstrap.select.less\">
    <script src=\"bootstrap.select.js\"></script>

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
	    let mySelectElement = new bsSelect("myselect", randomIndex)

## Optional classes for the &lt;select&gt; element



## Optional properties for &lt;select&gt; element



## Optional attributes for the &lt;option&gt; element

| Attribute                         | Type         | Description                                                                                                                                                                                                |
|-----------------------------------|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| data-bs-select-option-icon        | text         | The name of the Bootstrap icon which will be prepended to the text of the option element (without "bi-").                                                                                                    |
| data-bs-select-option-icon-class  | text         | The name of the class which will be added to the &lt;i&gt; element of the icon.                                                                                                                            |
| data-bs-select-option-image       | text         | The "src" attribute of the image which will be inserted at the very right of the text of the option element.                                                                                               |
| data-bs-select-option-image-class | text         | The name of the class which will be added to the &lt;img&gt; element of the option image.                                                                                                                  |
| data-bs-select-option-comment     | text or html | The content of the comment which will be inserted below the text of the option element. The comment has a default style. All additional styles must be specified in the html as classes or inline styles.  |


## Optional properties for the &lt;option&gt; element
		
