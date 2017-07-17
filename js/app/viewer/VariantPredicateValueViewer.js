/**
 * Created by kevin on 2/25/2017.
 */

function VariantPredicateValueViewer(propertyName, propertyType,
                                     /*VariantPredicateValue*/ variantPredicateValue, valueContainer) {

    var dialogOptions = {
        autoOpen: false,
        show: {
            effect: "fadeIn",
            duration: 100
        },
        hide: {
            effect: "fadeOut",
            duration: 100
        },
        resizable: false,
        stack: true,
        height: 'auto',
        width: 'auto',
        modal: true,
        dialogClass: "no-title-dialog"
    };

    var viewerContainerSelector = "#viewer-VariantPredicateValue";
    var viewerTemplateUrl = "templates/viewers/variantpredicatevalue.tmpl.html";
    var viewerTemplateName = "viewerVariantPredicateValue";

    function display() {
        $(viewerContainerSelector).remove();
        // load the template using handlebars
        var template = Handlebars.getTemplate(viewerTemplateName, viewerTemplateUrl);

        var presentationHelper = new PropertyValueTypePresentationHelper();
        var currentValues = presentationHelper.getPresentationOnlyList(propertyType, variantPredicateValue.values);

        // generate html with template and context object.
        var editorHtml = template({
            propertyName: propertyName,
            currentValues: currentValues
        });

        // append html to the end of the document.
        $("body").append(editorHtml);

        // setup click event handler
        $(viewerContainerSelector).find("a.editor-close").unbind();

        $(viewerContainerSelector).find("a.editor-close").on("click", function () {
            close();
        });

        // jquery dialog set up
        var dataEditor = $(viewerContainerSelector).dialog(dialogOptions);
        dataEditor.dialog( "option", "position",
            { my: "center bottom", at: "center top", of: valueContainer, collision: "fit" });

        // jquery dialog display
        dataEditor.dialog('open');
    }

    function close() {
        $(viewerContainerSelector).dialog('close');
        $(viewerContainerSelector).remove();
    }

    return {
        display: display
    };
}
