/**
 * Created by kevin on 2/15/2017.
 */

function BaseEditor(variantPredicateValue, editorContainerSelector, editorTemplateUrl,
                    editorTemplateName, propertyName, getModifiedValue, saveCallback, valueContainer,
                    currentValueOverride) {

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
        dialogClass: "no-title-dialog",
    };

    function display() {
        $(editorContainerSelector).remove();
        // load the template using handlebars
        var template = Handlebars.getTemplate(editorTemplateName, editorTemplateUrl);

        // generate html with template and context object.
        var editorHtml = template({
            propertyName: propertyName,
            currentValue: currentValueOverride ? currentValueOverride : variantPredicateValue.values[0],
            predicateId: variantPredicateValue.predicateId,
            variantId: variantPredicateValue.variantId
            //variantPredicateValueId: variantPredicateValue.id
        });

        // append html to the end of the document.
        $("body").append(editorHtml);

        // setup click event handler
        $(editorContainerSelector).find("a.editor-close").unbind();
        $(editorContainerSelector).find("input.editor-submit").unbind();

        $(editorContainerSelector).find("a.editor-close").on("click", function () {
            close();
        });
        $(editorContainerSelector).find("input.editor-submit").on("click", function () {
            var newValue = getModifiedValue();
            save(variantPredicateValue, newValue);
            close();
        });

        // jquery dialog set up
        var dataEditor = $(editorContainerSelector).dialog(dialogOptions);
        dataEditor.dialog( "option", "position",
            { my: "center bottom", at: "center top", of: valueContainer, collision: "flipfit" });

       

        dataEditor.dialog('open');
        // jquery dialog display
 /*        var newTopVal = valueContainer.position().top - ( $('.ui-dialog').outerHeight()/2 )+'px';
        var newLeftVal = valueContainer.position().left -  ( $('.ui-dialog').outerWidth() ) +'px';
      //  console.log(newTopVal);
        //console.log(newLeftVal);
        $('.data-editor').parent().css('left', newLeftVal);
        $('.data-editor').parent().css('top', newTopVal);*/
         if ($(editorContainerSelector).offset().top > $(valueContainer).offset().top) {  //Important bit
           $('.bubble-triangle').hide();
            $('.bubble-triangle-top').show();
            console.log("yo");
        } else {
            $('.bubble-triangle').show();
            $('.bubble-triangle-top').hide();
               console.log("hey");
        }
    }

    function save(variantPredicateValue, newValue) {
        saveCallback(
            new VariantPredicateValue(
                //variantPredicateValue.id,
                variantPredicateValue.predicateId,
                variantPredicateValue.variantId,
                [newValue], true)
        );
    }

    function close() {
        $(editorContainerSelector).dialog('close');
        $(editorContainerSelector).remove();
    }

    return {
        display: display
    };
}
