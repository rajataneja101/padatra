/**
 * Created by kevin on 2/15/2017.
 */

function StringEditor(/*VariantPredicateValue*/ variantPredicateValue, propertyName, saveCallback, valueContainer) {

    var editorContainerSelector = "#editor-String";
    var editorTemplateUrl = "templates/editors/string.tmpl.html";
    var editorTemplateName = "stringEditor";
    var getModifiedValue = function() {
        return $(editorContainerSelector).find("td.new-value input.editor-input").val();
    };

    // Setup Inheritance
    var base = new BaseEditor(variantPredicateValue, editorContainerSelector, editorTemplateUrl,
        editorTemplateName, propertyName, getModifiedValue, saveCallback, valueContainer);

    return {
        display: base.display
    };
}
