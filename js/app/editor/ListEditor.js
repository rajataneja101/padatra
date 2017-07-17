/**
 * Created by kevin on 2/24/2017.
 */

function ListEditor(/*VariantPredicateValue*/ variantPredicateValue, property,
                    saveCallback, valueContainer) {

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

    var editorContainerSelector = "#editor-List";
    var editorTemplateUrl = "templates/editors/list.tmpl.html";
    var editorTemplateName = "listEditor";

    registerTemplateHelpers();

    function registerTemplateHelpers() {

        Handlebars.registerHelper("isChoiceChecked", function (choice, templateContext) {

            if (_.includes(templateContext.currentValues, choice.value)) {
                return new Handlebars.SafeString('checked="checked"');
            }
            else {
                return new Handlebars.SafeString("");
            }
        });
    }

    // Setup Inheritance
    // var base = new BaseEditor(variantPredicateValue, editorContainerSelector, editorTemplateUrl,
    //     editorTemplateName, propertyName, getModifiedValue, saveCallback, valueContainer);

    var sortAscending = true;

    function display() {
        $(editorContainerSelector).remove();
        // load the template using handlebars
        var template = Handlebars.getTemplate(editorTemplateName, editorTemplateUrl);

        var presentationHelper = new PropertyValueTypePresentationHelper();

        var choices = presentationHelper.getSelectableItemsList(property.type, property.choices);
        var currentValues = presentationHelper.getPresentationOnlyList(property.type, variantPredicateValue.values);

        // generate html with template and context object.
        var editorHtml = template({
            property: property,
            choices: choices,
            currentValues: currentValues,
            predicateId: variantPredicateValue.predicateId,
            variantId: variantPredicateValue.variantId
            //variantPredicateValueId: variantPredicateValue.id
        });

        // append html to the end of the document.
        $("body").append(editorHtml);

        // setup click event handler
        $(editorContainerSelector).find("a.editor-close").unbind();
        $(editorContainerSelector).find("input.editor-submit").unbind();
        $(editorContainerSelector).find("input.select-all").unbind();
        $(editorContainerSelector).find("input.select-none").unbind();
        $(editorContainerSelector).find("input.sort").unbind();

        $(editorContainerSelector).find("a.editor-close").on("click", function () {
            close();
        });
        $(editorContainerSelector).find("input.editor-submit").on("click", function () {

            var newValues;

            if (property.isList) {

                var newValuesCheckboxes = $(editorContainerSelector).find("td.new-value")
                    .find("ul.editor-choices-container").find("input[type='checkbox'][name='choice']");

                newValues = [];
                _.each(newValuesCheckboxes, function(cb) {
                    if ($(cb).is(":checked")) {
                        newValues.push(parseInt($(cb).val()));
                    }
                });
            }
            else {

                var newValueInput = $(editorContainerSelector).find("td.new-value")
                    .find("select.editor-choices-container");

                newValues = [parseInt(newValueInput.val())];
            }

            save(variantPredicateValue, newValues);
            close();
        });

        $(editorContainerSelector).find("input.select-all").on("click", function () {

            var newValuesCheckboxes = $(editorContainerSelector).find("td.new-value")
                .find("ul.editor-choices-container").find("input[type='checkbox'][name='choice']");

            _.each(newValuesCheckboxes, function(cb) {
                $(cb).prop("checked", true);
            })

        });
        $(editorContainerSelector).find("input.select-none").on("click", function () {

            var newValuesCheckboxes = $(editorContainerSelector).find("td.new-value")
                .find("ul.editor-choices-container").find("input[type='checkbox'][name='choice']");

            _.each(newValuesCheckboxes, function(cb) {
                $(cb).prop("checked", false);
            })
        });
        $(editorContainerSelector).find("input.sort").on("click", function () {

            var newValuesListItems = $(editorContainerSelector).find("td.new-value")
                .find("ul.editor-choices-container").find("li.editor-choice");

            var sorter = new ChoiceListSorter();
            newValuesListItems = sorter.sortListItems(newValuesListItems, sortAscending);
            sortAscending = !sortAscending;

            $(editorContainerSelector).find("td.new-value").find("ul.editor-choices-container").empty();

            _.each(newValuesListItems, function(li) {
                $(editorContainerSelector).find("td.new-value").find("ul.editor-choices-container").append(li);
            });

        });

        // jquery dialog set up
        var dataEditor = $(editorContainerSelector).dialog(dialogOptions);
        dataEditor.dialog( "option", "position",
            { my: "center bottom", at: "center top", of: valueContainer, collision: "flipfit" });

        // jquery dialog display
        dataEditor.dialog('open');
      /*  var newTopVal = valueContainer.position().top - ( $('.ui-dialog').outerHeight()/2 )+'px';
        var newLeftVal = valueContainer.position().left -  ( $('.ui-dialog').outerWidth() ) +'px';
    //    console.log(newTopVal);
    //    console.log(newLeftVal);
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

    function save(variantPredicateValue, newValues) {
        saveCallback(
            new VariantPredicateValue(
                //variantPredicateValue.id,
                variantPredicateValue.predicateId,
                variantPredicateValue.variantId,
                newValues, true)
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

