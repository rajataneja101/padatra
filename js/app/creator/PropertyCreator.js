    /**
 * Created by kevin on 2/20/2017.
 */

function PropertyCreator(repository, setPropertyCallback) {

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

    var creatorTemplateName = "property-creator";
    var creatorTemplateUrl = "templates/creators/property.tmpl.html";

    var creatorContainerSelector = "#property-creator";

    var listSupportPerPropertyDataType = {
        "Number": true,
        "Boolean": false,
        "String": true,
        "Date": true,
        "DateTime": true,
        "Country": true,
        "State": true,
        "City": true
    };

    var restrictedSupportPerPropertyDataType = {
        "Number": true,
        "Boolean": false,
        "String": true,
        "Date": true,
        "DateTime": true,
        "Country": false,
        "State": false,
        "City": false
    };

    var isRestrictedDefaultValuePerPropertyDataType = {
        "Number": false,
        "Boolean": true,
        "String": false,
        "Date": false,
        "DateTime": false,
        "Country": true,
        "State": true,
        "City": true
    };

    var choiceInputHtmlPerPropertyDataType = {
        "Number": '<input type="number" class="new-property-input add-choice-input" disabled="disabled" />',
        "Boolean": '<input type="boolean" class="new-property-input add-choice-input" disabled="disabled" />',
        "String": '<input type="text" class="new-property-input add-choice-input" disabled="disabled" />',

        "Date": '<input type="text" class="new-property-input add-choice-input displayed" disabled="disabled" />' +
                '<input type="text" class="new-property-input add-choice-input hidden" disabled="disabled" />',

        "DateTime": '<input type="datetime" class="new-property-input add-choice-input displayed" disabled="disabled" />' +
                    '<input type="datetime" class="new-property-input add-choice-input hidden" disabled="disabled" />',

        "Country": '<select class="new-property-input add-choice-input select-country" disabled="disabled"></select>',

        "State":
            '<div>Country</div>' +
            '<select class="new-property-input select-country" disabled="disabled"></select>' +
            '<div>State</div>' +
            '<select class="new-property-input add-choice-input select-state" disabled="disabled"></select>',

        "City":
            '<div>Country</div>' +
            '<select class="new-property-input select-country" disabled="disabled"></select>' +
            '<div>State</div>' +
            '<select class="new-property-input select-state" disabled="disabled"></select>' +
            '<div>City</div>' +
            '<select class="new-property-input add-choice-input select-city" disabled="disabled"></select>'
    };

    jQuery.validator.addMethod(
        "hasData",
        function(value, element) {
            return ($(element).find("option").length > 0);
        },
        "The choices field is required.");

    var validationOptions = {
        rules: {
            name: {
                required: true
            },
            description: {
                required: true
            },
            type: {
                required: true
            },
            choices: {
                hasData: {
                    depends: function(elem) {
                        return $(creatorContainerSelector).find("input#isRestricted").is(":checked");
                    }
                }
            }
        },

        messages: {
            name: {
                required: "The name field is required."
            },
            description: {
                required: "The description field is required."
            },
            type: {
                required: "The type field is required."
            },
            choices: {
                hasData: "The choices field is required."
            }
        },

        errorElement : 'div',
        errorLabelContainer: '.validation-error-container'
    };

    function isPropertyTypeWithSelectInput(propertyType) {
        return propertyType == PropertyDataType.Country ||
            propertyType == PropertyDataType.State ||
            propertyType == PropertyDataType.City;
    }

    var selectizedCountrySelect = null;
    var selectizedStateSelect = null;
    var selectizedCitySelect = null;

    function display() {
        $(creatorContainerSelector).remove();
        // load the template using handlebars
        var template = Handlebars.getTemplate(creatorTemplateName, creatorTemplateUrl);

        // generate html with template and context object.
        var creatorHtml = template({
            dataTypes: PropertyDataType
        });

        // append html to the end of the document.
        $("body").append(creatorHtml);

        // setup click event handler
        $(creatorContainerSelector).find("a.close-dialog").unbind();
        $(creatorContainerSelector).find("select#type").unbind();
        $(creatorContainerSelector).find("input#isList").unbind();
        $(creatorContainerSelector).find("input#isRestricted").unbind();
        $(creatorContainerSelector).find("input.add-choice").unbind();
        $(creatorContainerSelector).find("input.select-property").unbind();
        $(creatorContainerSelector).find("select#choices").unbind();
        $(creatorContainerSelector).find("input.remove-choice").unbind();

        $(creatorContainerSelector).find("a.close-dialog").on("click", function () {
            close();
        });

        $(creatorContainerSelector).find("select#type").on("change", function () {

            // Clear all input fields
            $(creatorContainerSelector).find("input#isList").prop('checked', false);
            $(creatorContainerSelector).find("input#isList").change();
            //$(creatorContainerSelector).find("input#isRestricted").removeAttr("checked");
            //$(creatorContainerSelector).find("input#isRestricted").change();
            $(creatorContainerSelector).find(".add-choice-input").val("");
            $(creatorContainerSelector).find("select#choices").empty();

            var selectedType = $(creatorContainerSelector).find("select#type").val();
            var supportsList = doesDataTypeSupportList(selectedType);
            var supportsRestricted = doesDataTypeSupportRestricted(selectedType);

            if (supportsList) {
                $(creatorContainerSelector).find("input#isList").prop('disabled', false);
            }
            else {
                $(creatorContainerSelector).find("input#isList").prop('disabled', true);
            }

            if (supportsRestricted) {
                $(creatorContainerSelector).find("input#isRestricted").prop('disabled', false);
            }
            else {
                $(creatorContainerSelector).find("input#isRestricted").prop('disabled', true);
            }

            var addChoiceInputContainer = $(creatorContainerSelector).find("div.add-choice-input-container");
            addChoiceInputContainer.empty();
            addChoiceInputContainer.append(getChoiceInputHtmlForDataType(selectedType));

            setUpCustomInputTypes(selectedType);

            $(creatorContainerSelector).find("input#isRestricted")
                .prop('checked', getDefaultIsRestrictedValueForDataType(selectedType));
            $(creatorContainerSelector).find("input#isRestricted").change();
        });

        $(creatorContainerSelector).find("input#isList").on("change", function () {

            var isList = $(creatorContainerSelector).find("input#isList").is(":checked");

            var isRestrictedInput = $(creatorContainerSelector).find("input#isRestricted");

            if (isList) {
                isRestrictedInput.prop('checked', true);
                isRestrictedInput.prop('disabled', true);
                isRestrictedInput.change();
            }
            else {
                isRestrictedInput.prop('disabled', false);
                isRestrictedInput.prop('checked', false);
                isRestrictedInput.change();
            }
        });

        $(creatorContainerSelector).find("input#isRestricted").on("change", function () {

            $(creatorContainerSelector).find("select#choices").empty();
            $(creatorContainerSelector).find(".add-choice-input").val("");

            var isRestricted = $(creatorContainerSelector).find("input#isRestricted").is(":checked");

            if (isRestricted) {

                var selectedType = $(creatorContainerSelector).find("select#type").val();

                if (selectedType == PropertyDataType.Boolean) {
                    // Boolean is the only data type that when used in a "restricted" property, can't have choices added.
                    // Also, the system ONLY supports properties of type boolean to be restricted
                    disableChoices();
                }
                else {
                    enableChoices();
                }
            }
            else {
                disableChoices();
            }
        });

        $(creatorContainerSelector).find("input.add-choice").on("click", function () {

            var selectedType = $(creatorContainerSelector).find("select#type").val();

            var newChoice;

            if (isPropertyTypeWithSelectInput(selectedType)) {
                newChoice = {
                    id: $(creatorContainerSelector).find("select.add-choice-input").val(),
                    label: $(creatorContainerSelector)
                        .find("select.add-choice-input option:selected").text()
                };
            }
            else if (selectedType == PropertyDataType.DateTime || selectedType == PropertyDataType.Date) {
                newChoice = {
                    id: $(creatorContainerSelector).find("input.add-choice-input.hidden").val(),
                    label: $(creatorContainerSelector).find("input.add-choice-input.displayed").val()
                };

                $(creatorContainerSelector).find("input.add-choice-input").val("");
            }
            else {
                newChoice = {
                    id: $(creatorContainerSelector).find("input.add-choice-input").val(),
                    label: $(creatorContainerSelector).find("input.add-choice-input").val()
                };

                $(creatorContainerSelector).find("input.add-choice-input").val("");
            }

            if (newChoice.id && newChoice.label) {
                var currentChoices =
                    _.map($(creatorContainerSelector).find("select#choices").find("option"), function(option) {
                        return { id: $(option).val(), label: $(option).text() };
                    });

                currentChoices.push(newChoice);

                $(creatorContainerSelector).find("select#choices").empty();

                _.each(currentChoices, function(choice) {
                    $(creatorContainerSelector).find("select#choices")
                        .append('<option value="' + choice.id + '">' + choice.label + '</option>');
                });
            }


        });

        $(creatorContainerSelector).find("input.create-property").on("click", function () {

            var propertyCreatorForm = $(creatorContainerSelector).find("form#property-creator-form");
            propertyCreatorForm.validate(validationOptions);

            if (!propertyCreatorForm.valid()) {
                return;
            }

            var name = $(creatorContainerSelector).find("input#name").val();
            var description = $(creatorContainerSelector).find("textarea#description").val();
            var type = $(creatorContainerSelector).find("select#type").val();
            var isList = $(creatorContainerSelector).find("input#isList").is(":checked");
            var isRestricted = $(creatorContainerSelector).find("input#isRestricted").is(":checked");;
            var choices = [];

            if (isRestricted) {

                choices = _.map($(creatorContainerSelector).find("select#choices").find("option"),
                    function(option) {
                        return { id: $(option).val(), label: $(option).text() };
                    });

                if (type == PropertyDataType.Number) {
                    choices = _.map(choices, function(c) {
                        return parseInt(c.label);
                    });
                }
                else if (type == PropertyDataType.String) {
                    choices = _.map(choices, function(c) {
                        return c.label;
                    });
                }
                else if (type == PropertyDataType.Date) {
                    choices = _.map(choices, function(c) {
                        return c.id;
                    });
                }
                else if (type == PropertyDataType.DateTime) {
                    choices = _.map(choices, function(c) {
                        return c.id.replace(" ", "T");
                    });
                }
                else if (type == PropertyDataType.Country ||
                         type == PropertyDataType.State ||
                         type == PropertyDataType.City) {
                    choices = _.map(choices, function(c) {
                        return parseInt(c.id);
                    });
                }
            }

            repository.createProperty(
                new Property(0, name, description, type, isList, choices, isRestricted),
                function(result) {
                    if (result.success) {
                        setPropertyCallback(result.createdProperty.id, function() {
                            close();
                        });
                    }
                    else {
                        console.log(result);
                        alert(result.message);
                    }
                }
            );
        });

        $(creatorContainerSelector).find("select#choices").on("change", function () {
            $(creatorContainerSelector).find("input.remove-choice").removeAttr("disabled");
        });

        $(creatorContainerSelector).find("input.remove-choice").on("click", function () {
            $(creatorContainerSelector).find("select#choices").find("option:selected").remove();
            $(creatorContainerSelector).find("input.remove-choice").attr("disabled", "disabled");
        });

        // jquery dialog set up
        var creatorDialog = $(creatorContainerSelector).dialog(dialogOptions);

        // jquery dialog display
        creatorDialog.dialog('open');
    }

    function enableChoices() {
        var selectedType = $(creatorContainerSelector).find("select#type").val();

        $(creatorContainerSelector).find("input.add-choice").prop('disabled', false);
        $(creatorContainerSelector).find(".add-choice-input").prop('disabled', false);
        $(creatorContainerSelector).find("select#choices").prop('disabled', false);
        $(creatorContainerSelector).find("select#choices").removeClass("disabled-choices-list");

        setUpGeolocationPropertyDataTypes(selectedType, true);
    }
    function disableChoices() {
        $(creatorContainerSelector).find("input.add-choice").prop('disabled', true);
        $(creatorContainerSelector).find(".add-choice-input").prop('disabled', true);
        $(creatorContainerSelector).find("select#choices").prop('disabled', true);
        $(creatorContainerSelector).find("select#choices").addClass("disabled-choices-list");

        if (selectizedCountrySelect) { selectizedCountrySelect.disable(); }
        if (selectizedStateSelect) { selectizedStateSelect.disable(); }
        if (selectizedCitySelect) { selectizedCitySelect.disable(); }
    }

    function setUpCustomInputTypes(selectedType) {
        if (selectedType == PropertyDataType.Country ||
            selectedType == PropertyDataType.State ||
            selectedType == PropertyDataType.City) {
            setUpGeolocationPropertyDataTypes(selectedType);
        }
        else if (selectedType == PropertyDataType.Date) {
            setUpDateDataType();
        }
        else if (selectedType == PropertyDataType.DateTime) {
            setUpDateTimeDataType();

        }
    }

    function setUpDateDataType() {

        var presentationHelper = new PropertyValueTypePresentationHelper();

        $(creatorContainerSelector).find("input.add-choice-input.hidden")
            .datepicker({ dateFormat: 'yy-mm-dd' });

        $(creatorContainerSelector).find("input.add-choice-input.hidden").on("change", function() {

            var selectedDate = $(creatorContainerSelector).find("input.add-choice-input.hidden").val();
            var localizedDate = presentationHelper.localizeDate(selectedDate);

            $(creatorContainerSelector).find("input.add-choice-input.displayed").val(localizedDate);
        })

    }

    function setUpDateTimeDataType() {
        var presentationHelper = new PropertyValueTypePresentationHelper();

        $(creatorContainerSelector).find("input.add-choice-input.hidden")
            .datetimepicker({ format:'Y-m-d H:i:00' });

        $(creatorContainerSelector).find("input.add-choice-input.hidden").on("change", function() {

            var selectedDate = $(creatorContainerSelector).find("input.add-choice-input.hidden").val();
            selectedDate = selectedDate.replace(" ", "T");

            var localizedDate = presentationHelper.localizeDateTime(selectedDate);

            $(creatorContainerSelector).find("input.add-choice-input.displayed").val(localizedDate);
        })
    }

    function doesDataTypeSupportList(selectedType) {
        return listSupportPerPropertyDataType[selectedType];
    }

    function doesDataTypeSupportRestricted(selectedType) {
        return restrictedSupportPerPropertyDataType[selectedType];
    }

    function getDefaultIsRestrictedValueForDataType(selectedType) {
        return isRestrictedDefaultValuePerPropertyDataType[selectedType];
    }

    function getChoiceInputHtmlForDataType(selectedType) {
        return choiceInputHtmlPerPropertyDataType[selectedType];
    }

    // TODO: Refactor this code out of this class. This is pretty much identical to what we have in PredicateCreator
    function selectizeCountries() {
        var selectCountry = selectizeGeolocation("select.select-country");

        repository.getCountries(function(countries) {
            selectCountry.addOption(countries);
        });

        return selectCountry;
    }

    function selectizeStates() {
        return selectizeGeolocation("select.select-state");
    }

    function selectizeCities() {
        return selectizeGeolocation("select.select-city");
    }

    function selectizeGeolocation(elementSelector) {
        var $select = $(creatorContainerSelector).find(elementSelector).selectize({
            valueField: "id",
            labelField: "name",
            searchField: "name",
            create: false
        });

        return $select[0].selectize;
    }

    function setUpGeolocationPropertyDataTypes(selectedPropertyType, enable){

        var selectCountry = null;
        var selectState = null;
        var selectCity = null;

        if (selectedPropertyType == PropertyDataType.Country) {
            selectCountry = selectizeCountries();
            if (enable) { selectCountry.enable(); }
        }
        else if (selectedPropertyType == PropertyDataType.State) {

            selectCountry = selectizeCountries();
            selectState = selectizeStates();

            if (enable) { selectCountry.enable(); }
            if (enable) { selectState.enable(); }

            $(creatorContainerSelector).find("select.select-country").on("change", function() {
                var selectedCountry = $(creatorContainerSelector).find("select.select-country").val();

                repository.getStatesForCountry(selectedCountry, function(states) {
                    selectState.clearOptions();
                    selectState.addOption(states);
                    selectState.enable();
                });
            });

            selectState.disable();
        }
        else if (selectedPropertyType == PropertyDataType.City) {

            selectCountry = selectizeCountries();
            selectState = selectizeStates();
            selectCity = selectizeCities();

            if (enable) { selectCountry.enable(); }
            if (enable) { selectState.enable(); }
            if (enable) { selectCity.enable(); }

            $(creatorContainerSelector).find("select.select-country").on("change", function() {
                var selectedCountry = $(creatorContainerSelector).find("select.select-country").val();

                repository.getStatesForCountry(selectedCountry, function(states) {
                    selectState.clearOptions();
                    selectState.addOption(states);
                    selectState.enable();

                    selectCity.clearOptions();
                    selectCity.disable();
                });
            });

            $(creatorContainerSelector).find("select.select-state").on("change", function() {
                var selectedState = $(creatorContainerSelector).find("select.select-state").val();

                repository.getCitiesForState(selectedState, function(cities) {
                    selectCity.clearOptions();
                    selectCity.addOption(cities);
                    selectCity.enable();
                });
            });

            selectState.disable();
            selectCity.disable();
        }

        selectizedCountrySelect = selectCountry;
        selectizedStateSelect = selectState;
        selectizedCitySelect = selectCity;
    }


    function close() {
        $(creatorContainerSelector).dialog('close');
        $(creatorContainerSelector).remove();
    }

    return {
        display: display
    };
}