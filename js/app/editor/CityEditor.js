function CityEditor(/*VariantPredicateValue*/ variantPredicateValue, propertyName, saveCallback,
                     valueContainer, repository) {

    var editorContainerSelector = "#editor-City";
    var editorTemplateUrl = "templates/editors/city.tmpl.html";
    var editorTemplateName = "cityEditor";
    var getModifiedValue = function() {
        return $(editorContainerSelector).find("td.new-value select.editor-input.select-city").val();
    };

    // Setup Inheritance
    var base = new BaseEditor(variantPredicateValue, editorContainerSelector, editorTemplateUrl,
        editorTemplateName, propertyName, getModifiedValue, saveCallback, valueContainer,
        repository.getCity(variantPredicateValue.values[0]).name);

    function display() {
        base.display();

        // $(editorContainerSelector).find("select.editor-input.select-country").selectize({
        //     create: false
        // });
        var $selectCountry = $(editorContainerSelector).find("select.editor-input.select-country").selectize({
            valueField: "id",
            labelField: "name",
            searchField: "name",
            create: false
        });

        var selectCountry = $selectCountry[0].selectize;

        repository.getCountries(function(countries) {
            selectCountry.addOption(countries);
        });

        var $selectState = $(editorContainerSelector).find("select.editor-input.select-state").selectize({
            valueField: "id",
            labelField: "name",
            searchField: "name",
            create: false
        });
        var $selectCity = $(editorContainerSelector).find("select.editor-input.select-city").selectize({
            valueField: "id",
            labelField: "name",
            searchField: "name",
            create: false
        });

        var selectState = $selectState[0].selectize;
        var selectCity = $selectCity[0].selectize;

        $(editorContainerSelector).find("select.editor-input.select-country").on("change", function() {
            var selectedCountry = $(editorContainerSelector).find("select.editor-input.select-country").val();
            repository.getStatesForCountry(selectedCountry, function(states) {
                selectState.clearOptions();
                selectState.addOption(states);
                selectState.enable();

                selectCity.clearOptions();
                selectCity.disable();
            });
        });

        $(editorContainerSelector).find("select.editor-input.select-state").on("change", function() {
            var selectedState = $(editorContainerSelector).find("select.editor-input.select-state").val();
            repository.getCitiesForState(selectedState, function(cities) {
                selectCity.clearOptions();
                selectCity.addOption(cities);
                selectCity.enable();
            });
        });

        selectState.disable();
        selectCity.disable();
    }

    return {
        display: display
    };
}