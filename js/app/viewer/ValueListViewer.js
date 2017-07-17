/**
 * Created by kevin on 2/25/2017.
 */

function ValueListViewer(property, valuesToView, areChoices) {

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

    var viewerContainerSelector = "#viewer-ValueList";
    var viewerTemplateUrl = "templates/viewers/valuelist.tmpl.html";
    var viewerTemplateName = "viewerValueList";

    function display() {
        $(viewerContainerSelector).remove();
        // load the template using handlebars
        var template = Handlebars.getTemplate(viewerTemplateName, viewerTemplateUrl);

        var presentationHelper = new PropertyValueTypePresentationHelper();
        var valuesToShow = areChoices ?
            presentationHelper.getPropertyChoicesPresentationList(property.type, valuesToView) :
            presentationHelper.getPredicateDefaultValuePresentationList(property.type, valuesToView);

        // generate html with template and context object.
        var editorHtml = template({
            property: property,
            valuesToShow: valuesToShow
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
