/**
 * Created by kevin on 2/15/2017.
 */

function NumberEditor(/*VariantPredicateValue*/ variantPredicateValue, propertyName, saveCallback, valueContainer) {

    var editorContainerSelector = "#editor-Number";
    var editorTemplateUrl = "templates/editors/number.tmpl.html";
    var editorTemplateName = "numberEditor";
    var getModifiedValue = function() {
        return parseInt($(editorContainerSelector).find("td.new-value input.editor-input").val());
    };

    // Setup Inheritance
    var base = new BaseEditor(variantPredicateValue, editorContainerSelector, editorTemplateUrl,
        editorTemplateName, propertyName, getModifiedValue, saveCallback, valueContainer);

    return {
        display: base.display
    };
}
