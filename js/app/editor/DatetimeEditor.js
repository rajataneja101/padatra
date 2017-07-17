
function DatetimeEditor(/*VariantPredicateValue*/ variantPredicateValue, propertyName, saveCallback, valueContainer) {

    var editorContainerSelector = "#editor-Datetime";
    var editorTemplateUrl = "templates/editors/datetime.tmpl.html";
    var editorTemplateName = "datetimeEditor";
    var getModifiedValue = function() {
        return $(editorContainerSelector).find("td.new-value input.hidden-editor-input").val().replace(" ", "T");
    };

    var presentationHelper = new PropertyValueTypePresentationHelper();

    // Setup Inheritance
    var base = new BaseEditor(variantPredicateValue, editorContainerSelector, editorTemplateUrl,
        editorTemplateName, propertyName, getModifiedValue, saveCallback, valueContainer,
        presentationHelper.localizeDateTime(variantPredicateValue.values[0]));

    function display() {
        base.display();

        $(editorContainerSelector).find("td.new-value input.hidden-editor-input")
            .datetimepicker({
                format:'Y-m-d H:i:00',
                value: variantPredicateValue.values[0]
            });

        $(editorContainerSelector).find("td.new-value input.hidden-editor-input").on("change", function () {
            var selectedDate = $(editorContainerSelector).find("td.new-value input.hidden-editor-input").val();
            selectedDate = selectedDate.replace(" ", "T");

            var localizedDate = presentationHelper.localizeDateTime(selectedDate);

            $(editorContainerSelector).find("td.new-value input.editor-input").val(localizedDate);
        });
    }

    return {
        display: display
    };
}
