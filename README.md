# bootstrap-select
Extension class for the Bootstrap select element

This program is written in plain JavaScript and is designed for Bootstrao 5.2.x and modern browsers.

The minimum version of ECMAScript is 2017. I reserve the right to switch to newer versions of ECMAScript at any times without further notice.

Although the W3C Recommendations do not mention it for HTML 5, the HTML 4.01 Recommendations (https://www.w3.org/TR/html401/interact/forms.html#h-17.6) state that: "Note. Implementors are advised that future versions of HTML may extend the grouping mechanism to allow for nested groups (i.e., OPTGROUP elements may nest). This will allow authors to represent a richer hierarchy of choices."
For this reason the bsSelect class is already recursive.

This program is released under the MIT licence.

## Usage

Add these lines in the html &lt;head&gt; section:

    <link rel=\"stylesheet/less\" type=\"text/css\" href=\"bootstrap.select.less\">
    <script src=\"bootstrap.select.js\"></script>

NOTE: the values of "href" and "src" attributes must reproduce the folder structure where the two files are located.

Add to the &lt;select&gt; element the class "bootstrap-select".
The "bootstrap-select" class may also be added dynamically via JavaScript when the DOM is already loaded.
The "selectInserted" CSS animation provides an authomatic way to create a new bsSelect class element.
The new class element can be also added manually via JavaScript without using the "bootstrap-select" class.

