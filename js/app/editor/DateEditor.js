
function DateEditor(/*VariantPredicateValue*/ variantPredicateValue, propertyName, saveCallback, valueContainer) {

    var editorContainerSelector = "#editor-Date";
    var editorTemplateUrl = "templates/editors/date.tmpl.html";
    var editorTemplateName = "dateEditor";
    var getModifiedValue = function() {
        return $(editorContainerSelector).find("td.new-value input.hidden-editor-input").val();
    };

    var presentationHelper = new PropertyValueTypePresentationHelper();

    // Setup Inheritance
    var base = new BaseEditor(variantPredicateValue, editorContainerSelector, editorTemplateUrl,
        editorTemplateName, propertyName, getModifiedValue, saveCallback, valueContainer,
        presentationHelper.localizeDate(variantPredicateValue.values[0]));

    function display() {
        base.display();

        $(editorContainerSelector).find("td.new-value input.hidden-editor-input")
            .datepicker({ dateFormat: 'yy-mm-dd' });

        $(editorContainerSelector).find("td.new-value input.hidden-editor-input").on("change", function () {
            var selectedDate = $(editorContainerSelector).find("td.new-value input.hidden-editor-input").val();

            var localizedDate = presentationHelper.localizeDate(selectedDate);

            $(editorContainerSelector).find("td.new-value input.editor-input").val(localizedDate);
        });
    }

    return {
        display: display
    };
}
