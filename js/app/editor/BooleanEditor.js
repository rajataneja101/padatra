/**
 * Created by kevin on 2/15/2017.
 */

function BooleanEditor(/*VariantPredicateValue*/ variantPredicateValue, propertyName, saveCallback, valueContainer) {

    var editorContainerSelector = "#editor-Boolean";
    var editorTemplateUrl = "templates/editors/boolean.tmpl.html";
    var editorTemplateName = "booleanEditor";
    var getModifiedValue = function() {
        return $(editorContainerSelector).find("td.new-value select.editor-input").val() == "true";
    };

    // Setup Inheritance
    var base = new BaseEditor(variantPredicateValue, editorContainerSelector, editorTemplateUrl,
        editorTemplateName, propertyName, getModifiedValue, saveCallback, valueContainer);

    return {
        display: base.display
    };
}
