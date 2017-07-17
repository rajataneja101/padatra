/**
 * Created by kevin on 2/10/2017.
 */
/* The main script file associated with the edit_scholarship.html page (i.e. "view")
* Think of this as a controller of sorts. We'll have all of the logic here for:
* 1. data presentation.
* 2. looking for and compiling/drawing templates.
* 3. responding to the view's events triggered by user interaction.
* 4. communicating with the underlying model (which right now is just the data
* repository but could become more complex later).
* This is the creamy center of the oreo cookie.*/

function AppViewModel(/*AppRepository*/ repository) {

    // Initializing
    var productId = ""; // The product being shown
    var selectedVariantIds = [];

    registerTemplateHelpers();

    function start() {
        $.urlParam = function(name){
            var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
            if (results==null){
                return null;
            }
            else{
                return results[1] || 0;
            }
        };

        productId = $.urlParam('product_id');
        displayProductDetail();
    }

    function registerTemplateHelpers() {

        Handlebars.registerHelper("getDeleteVariantsActionButtonClass", function (product) {
            if (product.variants.length > 1) {
                return new Handlebars.SafeString("delete-variant");
            }
            else {
                return new Handlebars.SafeString("disabled");
            }
        });

        Handlebars.registerHelper("getVariantValueIsOverrideMarker", function(predicate, variantPredicateValues) {

            var variantPredicateValue = _.find(variantPredicateValues, function(vpv) {
                return vpv.predicateId === predicate.id;
            });

            if (variantPredicateValue) {
                if (!variantPredicateValue.isOverride) {
                    return new Handlebars.SafeString('<div class="value-override-marker"></div>');
                }
            }

            return "";
        });

        Handlebars.registerHelper("getVariantPredicateValueForPredicate",
            function(predicate, variantPredicateValues, isList) {

            var variantPredicateValue = _.find(variantPredicateValues, function(vpv) {
                return vpv.predicateId === predicate.id;
            });


            if (variantPredicateValue) {
                if (isList) {
                    var htmlToReturn =
                        "<div class='list-value-container'>" +
                            "<ul>";

                    _.each(variantPredicateValue.values, function(v, i) {
                        if (i < 3) {
                            htmlToReturn += "<li class='variant-predicate-value'>" + v + "</li>";
                        }
                    });

                    if (variantPredicateValue.values.length > 3) {
                        htmlToReturn += "<li class='variant-predicate-value'>...</li>";
                    }

                    htmlToReturn +=
                            "</ul>" +
                        "</div>";

                    return new Handlebars.SafeString(htmlToReturn);
                }
                else {
                    return new Handlebars.SafeString(
                        "<span class='variant-predicate-value'>" +
                            variantPredicateValue.values[0] +
                        "</span>");
                }
            }
        });

        Handlebars.registerHelper("getReadableIndex", function(index) {
            return index + 1;
        });

        Handlebars.registerHelper("isVariantSelected", function(variantId) {
            if (_.includes(selectedVariantIds, variantId)) {
                return "selected";
            }
            else {
                return "";
            }
        });
    }

    function displayProductDetail() {
        repository.getProduct(productId, function(productToPresent) {

            var context = createTemplateContext(productToPresent);
            var template = Handlebars.getTemplate("productDetail", "templates/product.tmpl.html");
            var view = template(context);

            $("#main-content").empty();
            $("#main-content").append(view);

            setUpProductDetailView($("#main-content"));
        });
    }

    function createTemplateContext(productToPresent) {
        if (selectedVariantIds.length == 0)
        {
            productToPresent.selectedVariants = [productToPresent.variants[0]];
            selectedVariantIds = [productToPresent.selectedVariants[0].id];
        }
        else {
            productToPresent.selectedVariants =
                _.map(selectedVariantIds, function(variantId) {
                    return _.find(productToPresent.variants, function(v) { return v.id == variantId; });
                });

            selectedVariantIds = _.map(productToPresent.selectedVariants, function(v) { return v.id; });
        }

        return productToPresent;
    }

    function setUpProductDetailView(productDetailViewContainer) {
        // TODO: we could be binding this stuff with knockout.
        $(productDetailViewContainer).find('td.variant-predicate-value-container').find('a.action-button.view').unbind();
        $(productDetailViewContainer).find('td.variant-predicate-value-container').find('a.action-button.edit').unbind();
        $(productDetailViewContainer).find("th.variants-header").find("a.action-button.show-variant").unbind();
        $(productDetailViewContainer).find("th.variants-header").find("a.action-button.create-variant").unbind();
        $(productDetailViewContainer).find("th.variants-header").find("a.action-button.delete-variant").unbind();
        $(productDetailViewContainer).find("th.properties-header").find("a.action-button.add-predicate").unbind();
        $(productDetailViewContainer).find("th.properties-header").find("a.action-button.select-predicate").unbind();
        $(productDetailViewContainer).find("td.property-name").find("a.action-button.delete-predicate").unbind();

        $(productDetailViewContainer)
            .find('td.variant-predicate-value-container').find('a.action-button.view').on("click", function() {

            var cell = $(this).closest('td');

            var propertyName = cell.attr("data-property-name");
            var propertyType = cell.attr("data-property-data-type");
            var variantId = cell.attr("data-variant-id");
            var predicateId = cell.attr("data-predicate-id");

            repository.getVariantPredicateValue(variantId, predicateId, function(variantPredicateValue) {
                var viewer = new VariantPredicateValueViewer(propertyName, propertyType, variantPredicateValue, cell);
                viewer.display();
            });
        });

        $(productDetailViewContainer)
            .find('td.variant-predicate-value-container').find('a.action-button.edit').on("click", function() {
            var cell = $(this).closest('td');

            var propertyName = cell.attr("data-property-name");
            var variantPropertyDataType = cell.attr("data-property-data-type");
            //var variantPropertyIsList = cell.attr("data-property-is-list") == 'true';
            var variantPropertyIsRestricted = cell.attr("data-property-is-restricted") == 'true';
            var variantId = cell.attr("data-variant-id");
            var predicateId = cell.attr("data-predicate-id");

            repository.getVariantPredicateValue(variantId, predicateId, function(variantPredicateValue) {
                if (variantPropertyIsRestricted) {
                    var propertyId = cell.attr("data-property-id");

                    repository.getProperty(propertyId, function(property) {

                        var editor = new ListEditor(variantPredicateValue, property,
                            saveVariantPredicateValueAndRefresh, cell);
                        editor.display();
                    });
                }
                else {
                    if (variantPropertyDataType === PropertyDataType.String) {
                        var editor = new StringEditor(variantPredicateValue,
                            propertyName, saveVariantPredicateValueAndRefresh, cell);
                        editor.display();
                    }
                    else if (variantPropertyDataType === PropertyDataType.Number) {
                        var editor = new NumberEditor(variantPredicateValue,
                            propertyName, saveVariantPredicateValueAndRefresh, cell);
                        editor.display();
                    }
                    else if (variantPropertyDataType === PropertyDataType.Boolean) {
                        var editor = new BooleanEditor(variantPredicateValue,
                            propertyName, saveVariantPredicateValueAndRefresh, cell);
                        editor.display();
                    }
                    else if (variantPropertyDataType == PropertyDataType.Country) {
                        var editor = new CountryEditor(variantPredicateValue,
                            propertyName, saveVariantPredicateValueAndRefresh, cell, repository);
                        editor.display();
                    }
                    else if (variantPropertyDataType == PropertyDataType.State) {
                        var editor = new StateEditor(variantPredicateValue,
                            propertyName, saveVariantPredicateValueAndRefresh, cell, repository);
                        editor.display();
                    }
                    else if (variantPropertyDataType == PropertyDataType.City) {
                        var editor = new CityEditor(variantPredicateValue,
                            propertyName, saveVariantPredicateValueAndRefresh, cell, repository);
                        editor.display();
                    }
                    else if (variantPropertyDataType == PropertyDataType.Date) {
                        var editor = new DateEditor(variantPredicateValue,
                            propertyName, saveVariantPredicateValueAndRefresh, cell);
                        editor.display();
                    }
                    else if (variantPropertyDataType == PropertyDataType.DateTime) {
                        var editor = new DatetimeEditor(variantPredicateValue,
                            propertyName, saveVariantPredicateValueAndRefresh, cell);
                        editor.display();
                    }
                    else {
                        alert("I still don't know how to handle the " + variantPropertyDataType + " data type.");
                    }
                }
            });
        });

        $(productDetailViewContainer).find("th.variants-header").find("a.action-button.show-variant").on("click", function() {

            var sender = $(this);

            if (sender.hasClass("selected")) {
                sender.removeClass("selected");
            }
            else {
                sender.addClass("selected");
            }

            selectedVariantIds =
                _.map($(productDetailViewContainer).find("div.variant-selection-buttons-container").find("a.selected"),
                      function(value) { return $(value).attr("data-variant-id"); });

            displayProductDetail();
        });

        $(productDetailViewContainer).find("th.variants-header").find("a.action-button.create-variant").on("click", function() {
            addVariantAndRefresh();
        });

        $(productDetailViewContainer).find("tr.variants-names-container").find("a.action-button.delete-variant").on("click", function() {

            if (confirm("Are you sure you want to delete this variant?")) {

                var variantIdToDelete = parseInt($(this).closest("th.variant-name").attr("data-variant-id"));

                repository.deleteVariant(productId, variantIdToDelete, function (result) {

                    if (result.success) {

                        var indexOfVariantToRemove = $.inArray(variantIdToDelete, selectedVariantIds);

                        if (indexOfVariantToRemove > -1) {
                            //This deletes an element from the array
                            selectedVariantIds.splice(indexOfVariantToRemove, 1);
                        }

                        displayProductDetail();
                    }
                    else {
                        alert(result.message);
                    }
                });
            }
        });

        $(productDetailViewContainer).find("th.properties-header").find("a.action-button.add-predicate").on("click", function () {
            var predicateCreator = new PredicateCreator(repository, createPredicateAndRefresh);
            predicateCreator.display();
        });

        $(productDetailViewContainer).find("th.properties-header").find("a.action-button.select-predicate").on("click", function () {
            var predicateSelector = new PredicateSelector(repository, addPredicateAndRefresh, invokePredicateCreator);
            predicateSelector.display();
        });

        $(productDetailViewContainer).find("td.property-name").find("a.action-button.delete-predicate").on("click", function() {

            if (confirm("Are you sure you want to delete this predicate?")) {

                var predicateIdToDelete = parseInt($(this).closest("td.property-name").attr("data-predicate-id"));

                repository.deletePredicate(productId, predicateIdToDelete, function(result) {
                    if (result.success) {
                        displayProductDetail();
                    }
                    else {
                        alert(result.message);
                    }
                });
            }
        });
    }

    function invokePredicateCreator() {
        var predicateCreator = new PredicateCreator(repository, createPredicateAndRefresh);
        predicateCreator.display();
    }

    function saveVariantPredicateValueAndRefresh(variantPredicateValueToSave) {
        repository.saveVariantPredicateValue(variantPredicateValueToSave, function(result) {
            if (!result.success) {
                console.log(result);
                alert(result.message);
            }

            displayProductDetail();
        });
    }

    function createPredicateAndRefresh(predicateToCreate, callback) {
        repository.createPredicateAndAddToProduct(predicateToCreate, productId, function(result) {
            if (result.success) {
                displayProductDetail();
            }

            callback(result);
        });
    }

    function addVariantAndRefresh() {
        repository.createVariantForProduct(productId, function(result) {
            if (result.success) {
                selectedVariantIds.push(result.createdVariantId);
                displayProductDetail();
            }
            else {
                alert(result.message);
            }
        });
    }

    function addPredicateAndRefresh(predicateId, callback) {
        repository.addPredicateToProduct(predicateId, productId, function(result) {
            if (result.success) {
                displayProductDetail();
            }

            callback(result);
        });
    }

    return {
        start: start
    }
}

// Initializing the page
$(document).ready(function() {

    var viewModel = new AppViewModel(new AppRepository());
    viewModel.start();

});

