/**
 * Created by kevin on 2/20/2017.
 */

function PredicateCreator(repository, createCallback) {

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
        width: '60%',
        modal: true,
        dialogClass: "no-title-dialog"
    };

    var creatorContainerSelector = "#predicate-creator";
    var creatorTemplateName = "predicate-creator";
    var creatorStep2TemplateName = "predicate-creator-step2";
    var creatorStep3TemplateName = "predicate-creator-step3";
    var creatorTemplateUrl = "templates/creators/predicate/predicate.tmpl.html";
    var creatorStep2TemplateUrl = "templates/creators/predicate/steps/predicate.step2.tmpl.html";
    var creatorStep3TemplateUrl = "templates/creators/predicate/steps/predicate.step3.tmpl.html";

    var supportedOperatorsPerPropertyDataType = {
        "Number": [Operator.Equals, Operator.LessThan, Operator.GreaterThan],
        "Boolean": [Operator.Equals],
        "String": [Operator.Equals],
        "Date": [Operator.Equals, Operator.LessThan, Operator.GreaterThan],
        "DateTime": [Operator.Equals, Operator.LessThan, Operator.GreaterThan],
        "Country": [Operator.Equals],
        "State": [Operator.Equals],
        "City": [Operator.Equals]
    };

    //TODO eliminate magic strings with this:
    //supportedOperatorsPerPropertyDataType[PropertyDataType.Number] = [Operator.Equals, Operator.LessThan, Operator.GreaterThan];

    function registerTemplateHelpers() {
        Handlebars.registerHelper("getInputForProperty", function(property) {

            if (property.isRestricted) {

                if (property.isList) {

                    var template = Handlebars.compile(
                        '<ul class="predicate-default-value-container">' +
                            '{{#each choices}}' +
                                '<li class="predicate-default-value">' +
                                    '<input type="checkbox" value="{{id}}" name="default-value" />' +
                                    '{{value}}' +
                                '</li>' +
                            '{{/each}}' +
                        '</ul>' +
                         '<div class="list-choices-action-button-container">' +
                             '<input type="button" class="select-all" value="Select all" />' +
                             '<input type="button" class="select-none" value="Select none" />' +
                             '<input type="button" class="sort" value="Sort" />' +
                         '</div>');
                }
                else {

                    var template = Handlebars.compile(
                        '<select class="predicate-default-value-container">' +
                            '{{#each choices}}' +
                                '<option class="predicate-default-value" value="{{id}}">{{value}}</option>' +
                            '{{/each}}' +
                        '</select>'
                    );
                }

                var presentationHelper = new PropertyValueTypePresentationHelper();
                property.choices = presentationHelper.getSelectableItemsList(property.type, property.choices);

                return new Handlebars.SafeString(template({ choices: property.choices }));
            }
            else {
                if (property.type == PropertyDataType.Number) {
                    return new Handlebars.SafeString('<input type="number" class="predicate-default-value" />');
                }
                else if (property.type == PropertyDataType.Boolean) {
                    return new Handlebars.SafeString(
                        '<select class="predicate-default-value">' +
                            '<option value="true">true</option>' +
                            '<option value="false">false</option>' +
                        '</select>');
                }
                else if (property.type == PropertyDataType.String) {
                    return new Handlebars.SafeString('<input type="text" class="predicate-default-value" />');
                }
                else if (property.type == PropertyDataType.Date) {
                    return new Handlebars.SafeString(
                        '<input type="text" class="predicate-default-value displayed" />' +
                        '<input type="text" class="predicate-default-value hidden" />');
                }
                else if (property.type == PropertyDataType.DateTime) {
                    return new Handlebars.SafeString(
                        '<input type="datetime" class="predicate-default-value displayed" />' +
                        '<input type="datetime" class="predicate-default-value hidden" />');
                }
                else if (property.type == PropertyDataType.Country) {
                    return new Handlebars.SafeString(
                        '<select class="predicate-default-value select-country"></select>');
                }
                else if (property.type == PropertyDataType.State) {
                    return new Handlebars.SafeString(
                        '<div>Country</div>' +
                        '<select class="predicate-default-value select-country"></select>' +
                        '<div>State</div>' +
                        '<select class="predicate-default-value select-state"></select>'
                    );
                }
                else if (property.type == PropertyDataType.City) {
                    return new Handlebars.SafeString(
                        '<div>Country</div>' +
                        '<select class="predicate-default-value select-country"></select>' +
                        '<div>State</div>' +
                        '<select class="predicate-default-value select-state"></select>' +
                        '<div>City</div>' +
                        '<select class="predicate-default-value select-city"></select>'
                    );
                }
                else {
                    alert("PredicateCreator still can't deal with the " + property.type +" data type");
                    return "PredicateCreator still can't deal with the " + property.type +" data type";
                }
            }
        });

        Handlebars.registerHelper("getChoices", function (property) {
            var presentationHelper = new PropertyValueTypePresentationHelper();
            return presentationHelper.getPropertyChoicesCollapsedPresentation(property);
        });
    }

    registerTemplateHelpers();

    function display() {
        $(creatorContainerSelector).remove();
        // load the template using handlebars
        var template = Handlebars.getTemplate(creatorTemplateName, creatorTemplateUrl);

        // generate html with template and context object.
        var editorHtml = template({});

        // append html to the end of the document.
        $("body").append(editorHtml);

        // setup click event handler
        $(creatorContainerSelector).find("a.close-dialog").unbind();
        $(creatorContainerSelector).find("a.create-property").unbind();
        $(creatorContainerSelector).find("a.select-property").unbind();

        $(creatorContainerSelector).find("a.close-dialog").on("click", function () {
            close();
        });

        $(creatorContainerSelector).find("a.create-property").on("click", function () {
            var propertyCreator = new PropertyCreator(repository, setProperty);
            propertyCreator.display();

            predicateCreatorDialog.dialog('close');
        });

        $(creatorContainerSelector).find("a.select-property").on("click", function () {
            var propertySelector = new PropertySelector(repository, setProperty, invokePropertyCreator);
            propertySelector.display();

            predicateCreatorDialog.dialog('close');
        });

        // jquery dialog set up
        var predicateCreatorDialog = $(creatorContainerSelector).dialog(dialogOptions);
        predicateCreatorDialog.dialog( "option", "position", { my: "center top", at: "center top+50", of: window });

        // jquery dialog display
        predicateCreatorDialog.dialog('open');

        // Start by opening the property selection popup
        $(creatorContainerSelector).find("a.select-property").click();
    }

    function invokePropertyCreator() {
        var propertyCreator = new PropertyCreator(repository, setProperty);
        propertyCreator.display();

        var predicateCreatorDialog = $(creatorContainerSelector).dialog(dialogOptions);
        predicateCreatorDialog.dialog('close');
    }

    function setProperty(propertyId, callback) {
        repository.getProperty(propertyId, function(selectedProperty) {
            var predicateCreatorDialog = $(creatorContainerSelector).dialog(dialogOptions);
            predicateCreatorDialog.dialog('open');

            callback();

            displayStep2(selectedProperty);
            displayStep3(selectedProperty);
        });
    }

    function displayStep2(selectedProperty) {
        // load the template using handlebars
        var step2template = Handlebars.getTemplate(creatorStep2TemplateName, creatorStep2TemplateUrl);

        // generate html with template and context object.
        var step2Html = step2template(selectedProperty);

        // append html to the end of the document.
        $(creatorContainerSelector).find("div.step-2").empty();
        $(creatorContainerSelector).find("div.step-2").append(step2Html);

        $(creatorContainerSelector).find("div.step-2").fadeIn();
    }

    var sortAscending = true;

    function displayStep3(selectedProperty) {
        var step3template = Handlebars.getTemplate(creatorStep3TemplateName, creatorStep3TemplateUrl);

        var step3Html = step3template({
            supportedOperators: getSupportedOperators(selectedProperty),
            property: selectedProperty
        });

        $(creatorContainerSelector).find("div.step-3").empty();
        $(creatorContainerSelector).find("div.step-3").append(step3Html);

        // Setting up special GUI components
        if (!selectedProperty.isRestricted) { serUpGeolocationPropertyDataTypes(selectedProperty); }

        if (selectedProperty.type == PropertyDataType.DateTime) { setUpDateTimeDataType(); }
        else if (selectedProperty.type == PropertyDataType.Date) { setUpDateDataType(); }

        $(creatorContainerSelector).find("div.step-3").find("input.create-predicate").unbind();
        $(creatorContainerSelector).find("div.step-3").find("input.select-all").unbind();
        $(creatorContainerSelector).find("div.step-3").find("input.select-none").unbind();

        $(creatorContainerSelector).find("div.step-3").find("input.create-predicate").on("click", function() {

            var selectedOperator =
                $(creatorContainerSelector).find("div.step-3")
                    .find("select.predicate-operators option:selected").val();

            var defaultValue;

            if (selectedProperty.isRestricted) {

                if (selectedProperty.isList) {

                    var defaultValuesCheckboxes = $(creatorContainerSelector).find("div.step-3")
                        .find("ul.predicate-default-value-container").find("input[type='checkbox']");

                    defaultValue = [];

                    _.each(defaultValuesCheckboxes, function(cb) {
                        if ($(cb).is(":checked")) {
                            defaultValue.push(parseInt($(cb).val()));
                        }
                    });
                }
                else {

                    defaultValueInput = $(creatorContainerSelector).find("div.step-3")
                        .find("select.predicate-default-value-container");

                    defaultValue = [parseInt(defaultValueInput.val())];
                }
            }
            else {

                var defaultValueInput = $(creatorContainerSelector).find("div.step-3")
                    .find("input.predicate-default-value");

                if (selectedProperty.type == PropertyDataType.Number) {
                    defaultValue = parseInt(defaultValueInput.val());
                }
                else if (selectedProperty.type == PropertyDataType.Boolean) {

                    defaultValueInput = $(creatorContainerSelector).find("div.step-3")
                        .find("select.predicate-default-value");

                    defaultValue = defaultValueInput.val() == "true";
                }
                else if (selectedProperty.type == PropertyDataType.String) {
                    defaultValue = defaultValueInput.val();
                }
                else if (selectedProperty.type == PropertyDataType.Date) {
                    defaultValueInput = $(creatorContainerSelector).find("div.step-3")
                        .find("input.predicate-default-value.hidden");

                    defaultValue = defaultValueInput.val();
                }
                else if (selectedProperty.type == PropertyDataType.DateTime) {
                    defaultValueInput = $(creatorContainerSelector).find("div.step-3")
                        .find("input.predicate-default-value.hidden");

                    defaultValue = defaultValueInput.val().replace(" ", "T");
                }
                else if (selectedProperty.type == PropertyDataType.Country) {

                    defaultValueInput = $(creatorContainerSelector).find("div.step-3")
                        .find("select.predicate-default-value.select-country");

                    defaultValue = parseInt(defaultValueInput.val());
                }
                else if (selectedProperty.type == PropertyDataType.State) {

                    defaultValueInput = $(creatorContainerSelector).find("div.step-3")
                        .find("select.predicate-default-value.select-state");

                    defaultValue = parseInt(defaultValueInput.val());
                }
                else if (selectedProperty.type == PropertyDataType.City) {

                    defaultValueInput = $(creatorContainerSelector).find("div.step-3")
                        .find("select.predicate-default-value.select-city");

                    defaultValue = parseInt(defaultValueInput.val());
                }
                else {
                    alert("PredicateCreator still can't deal with the " + selectedProperty.type +" data type");
                    return "PredicateCreator still can't deal with the " + selectedProperty.type +" data type";
                }
            }

            createCallback(
                new Predicate(0, selectedProperty.id, selectedOperator, defaultValue, null),
                function(result) {
                    if (result.success) {
                        close();
                    }
                    else {
                        alert(result.message);
                    }
                });
        });
        $(creatorContainerSelector).find("div.step-3").find("input.select-all").on("click", function () {

            var newValuesCheckboxes = $(creatorContainerSelector).find("div.step-3")
                .find("ul.predicate-default-value-container").find("input[type='checkbox'][name='default-value']");

            _.each(newValuesCheckboxes, function(cb) {
                $(cb).prop("checked", true);
            })

        });
        $(creatorContainerSelector).find("div.step-3").find("input.select-none").on("click", function () {

            var newValuesCheckboxes = $(creatorContainerSelector).find("div.step-3")
                .find("ul.predicate-default-value-container").find("input[type='checkbox'][name='default-value']");

            _.each(newValuesCheckboxes, function(cb) {
                $(cb).prop("checked", false);
            })
        });
        $(creatorContainerSelector).find("div.step-3").find("input.sort").on("click", function () {

            var defaultValuesListItems = $(creatorContainerSelector).find("div.step-3")
                .find("ul.predicate-default-value-container").find("li.predicate-default-value");

            var sorter = new ChoiceListSorter();
            defaultValuesListItems = sorter.sortListItems(defaultValuesListItems, sortAscending);
            sortAscending = !sortAscending;

            $(creatorContainerSelector).find("div.step-3").find("ul.predicate-default-value-container").empty();

            _.each(defaultValuesListItems, function(li) {
                $(creatorContainerSelector).find("div.step-3").find("ul.predicate-default-value-container").append(li);
            });

        });

        $(creatorContainerSelector).find("div.step-3").fadeIn();
    }

    function setUpDateDataType() {
        var presentationHelper = new PropertyValueTypePresentationHelper();

        $(creatorContainerSelector).find("div.step-3").find("input.predicate-default-value.hidden")
            .datepicker({ dateFormat: 'yy-mm-dd' });

        $(creatorContainerSelector).find("div.step-3")
            .find("input.predicate-default-value.hidden").on("change", function() {

            var selectedDate = $(creatorContainerSelector).find("div.step-3")
                .find("input.predicate-default-value.hidden").val();

            var localizedDate = presentationHelper.localizeDate(selectedDate);

            $(creatorContainerSelector).find("div.step-3")
                .find("input.predicate-default-value.displayed").val(localizedDate);
        });
    }

    function setUpDateTimeDataType() {
        var presentationHelper = new PropertyValueTypePresentationHelper();

        $(creatorContainerSelector).find("div.step-3").find("input.predicate-default-value.hidden")
            .datetimepicker({ format:'Y-m-d H:i:00' });

        $(creatorContainerSelector).find("div.step-3")
            .find("input.predicate-default-value.hidden").on("change", function() {

            var selectedDate = $(creatorContainerSelector).find("div.step-3")
                .find("input.predicate-default-value.hidden").val();
            selectedDate = selectedDate.replace(" ", "T");

            var localizedDate = presentationHelper.localizeDateTime(selectedDate);

            $(creatorContainerSelector).find("div.step-3")
                .find("input.predicate-default-value.displayed").val(localizedDate);
        });
    }

    function getSupportedOperators(selectedProperty) {

        if (!selectedProperty.isList && selectedProperty.isRestricted) {
            return [Operator.Equals];
        }
        else if (selectedProperty.isList && selectedProperty.isRestricted) {
            return [Operator.In];
        }
        else if (!selectedProperty.isRestricted) {
            return supportedOperatorsPerPropertyDataType[selectedProperty.type];
        }
    }


    // TODO: Refactor this code out of this class. This is pretty much identical to what we have in PropertyCreator
    function selectizeCountries() {
        var selectCountry = selectizeGeolocation("select.predicate-default-value.select-country");
        selectCountry.addOption(repository.getCountries());
    }

    function selectizeStates() {
        return selectizeGeolocation("select.predicate-default-value.select-state");
    }

    function selectizeCities() {
        return selectizeGeolocation("select.predicate-default-value.select-city");
    }

    function selectizeGeolocation(elementSelector) {
        var $select = $(creatorContainerSelector).find("div.step-3").find(elementSelector).selectize({
                valueField: "id",
                labelField: "name",
                searchField: "name",
                create: false
            });

        return $select[0].selectize;
    }

    function serUpGeolocationPropertyDataTypes(selectedProperty){

        if (selectedProperty.type == PropertyDataType.Country) {
            selectizeCountries();
        }
        else if (selectedProperty.type == PropertyDataType.State) {

            selectizeCountries();
            var selectState = selectizeStates();

            $(creatorContainerSelector).find("div.step-3")
                .find("select.predicate-default-value.select-country").on("change", function() {

                var selectedCountry = $(creatorContainerSelector).find("div.step-3")
                    .find("select.predicate-default-value.select-country").val();

                var states = repository.getStatesForCountry(selectedCountry);

                selectState.clearOptions();
                selectState.addOption(states);
                selectState.enable();
            });

            selectState.disable();
        }
        else if (selectedProperty.type == PropertyDataType.City) {

            selectizeCountries();
            var selectState = selectizeStates();
            var selectCity = selectizeCities();

            $(creatorContainerSelector).find("div.step-3")
                .find("select.predicate-default-value.select-country").on("change", function() {

                var selectedCountry = $(creatorContainerSelector).find("div.step-3")
                    .find("select.predicate-default-value.select-country").val();

                var states = repository.getStatesForCountry(selectedCountry);

                selectState.clearOptions();
                selectState.addOption(states);
                selectState.enable();

                selectCity.clearOptions();
                selectCity.disable();
            });

            $(creatorContainerSelector).find("div.step-3")
                .find("select.predicate-default-value.select-state").on("change", function() {

                var selectedState = $(creatorContainerSelector).find("div.step-3")
                    .find("select.predicate-default-value.select-state").val();

                var cities = repository.getCitiesForState(selectedState);

                selectCity.clearOptions();
                selectCity.addOption(cities);
                selectCity.enable();
            });

            selectState.disable();
            selectCity.disable();
        }
    }


    function close() {
        $(creatorContainerSelector).dialog('close');
        $(creatorContainerSelector).remove();
    }

    return {
        display: display
    };
}
