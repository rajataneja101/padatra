function CountryEditor(/*VariantPredicateValue*/ variantPredicateValue, propertyName, saveCallback, valueContainer,
                       repository) {

    var editorContainerSelector = "#editor-Country";
    var editorTemplateUrl = "templates/editors/country.tmpl.html";
    var editorTemplateName = "countryEditor";
    var getModifiedValue = function() {
        return $(editorContainerSelector).find("td.new-value select.editor-input.select-country").val();
    };

    // Setup Inheritance
    var base = new BaseEditor(variantPredicateValue, editorContainerSelector, editorTemplateUrl,
        editorTemplateName, propertyName, getModifiedValue, saveCallback, valueContainer,
        repository.getCountry(variantPredicateValue.values[0]).name);

    function display() {
        base.display();

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
    }

    return {
        display: display
    };
}
