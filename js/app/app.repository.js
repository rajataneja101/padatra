/**
 * Created by kevin on 2/10/2017.
 */
/* Provides an API for CRUDding all the data that the app needs to work
 * Let's begin by creating just one file/class that manipulates all of the model.
 * If/when it later becomes too big then we can do it by the book and create separate repos
 * for each model. This will talk to the server to get and post data.
 * */

function AppRepository() {

    var MAX_NUMBER_OF_VARIANTS_PER_PRODUCT = 8;
    var API_ROOT = "http://padatra.com:8080/api/v1";

    function getCountries(callback) {
        // /geolocations/countries/select
        var url = API_ROOT + "/geolocations/countries/select";

        var settings = {
            "async": true,
            //"crossDomain": true,
            "url": url,
            "method": "GET"
        };

        var result;

        $.ajax(settings)
            .done(function (response, textStatus, jqXHR) {
                result = response;

                callback(_.map(result, function (rawCountry) {
                    return {
                        id: rawCountry.id,
                        name: rawCountry.value.country
                    };
                }));
            })
            .fail(function (jqXHR, textStatus, error) {
                console.log(error);
            });
    }
    function getStatesForCountry(countryId, callback) {
        // /geolocations/countries/:country_id/states/select
        var url = API_ROOT + "/geolocations/countries/" + countryId + "/states/select";

        var settings = {
            "async": true,
            //"crossDomain": true,
            "url": url,
            "method": "GET"
        };

        var result;

        $.ajax(settings)
            .done(function (response, textStatus, jqXHR) {
                result = response;

                callback(_.map(result, function (rawState) {
                    return {
                        id: rawState.id,
                        name: rawState.value.state
                    };
                }));
            })
            .fail(function (jqXHR, textStatus, error) {
                console.log(error);
            });
    }
    function getCitiesForState(stateId, callback) {
        // /geolocations/states/:state_id/cities/select
        var url = API_ROOT + "/geolocations/states/" + stateId + "/cities/select";

        var settings = {
            "async": true,
            //"crossDomain": true,
            "url": url,
            "method": "GET"
        };

        var result;

        $.ajax(settings)
            .done(function (response, textStatus, jqXHR) {
                result = response;

                callback(_.map(result, function (rawCity) {
                    return {
                        id: rawCity.id,
                        name: rawCity.value.city
                    };
                }));
            })
            .fail(function (jqXHR, textStatus, error) {
                console.log(error);
            });
    }

    function getCountry(countryId) {
        // /geolocations/countries/:country_id/select
        var url = API_ROOT + "/geolocations/countries/" + countryId + "/select";

        var settings = {
            "async": false,
            //"crossDomain": true,
            "url": url,
            "method": "GET"
        };

        var rawCountry;

        $.ajax(settings)
            .done(function (response, textStatus, jqXHR) {
                rawCountry = response;
            })
            .fail(function (jqXHR, textStatus, error) {
                console.log(error);
            });

        return {
            id: rawCountry.id,
            name: rawCountry.country
        };
    }
    function getState(stateId) {
        // /geolocations/states/:state_id/select
        var url = API_ROOT + "/geolocations/states/" + stateId + "select";

        var settings = {
            "async": false,
            //"crossDomain": true,
            "url": url,
            "method": "GET"
        };

        var rawState;

        $.ajax(settings)
            .done(function (response, textStatus, jqXHR) {
                rawState = response;
            })
            .fail(function (jqXHR, textStatus, error) {
                console.log(error);
            });

        return {
            id: rawState.id,
            name: rawState.state
        };
    }
    function getCity(cityId) {
        // /geolocations/cities/:city_id/select
        var url = API_ROOT + "/geolocations/cities/" + cityId + "/select";

        var settings = {
            "async": false,
            //"crossDomain": true,
            "url": url,
            "method": "GET"
        };

        var rawCity;

        $.ajax(settings)
            .done(function (response, textStatus, jqXHR) {
                rawCity = response;
            })
            .fail(function (jqXHR, textStatus, error) {
                console.log(error);
            });

        return {
            id: rawCity.id,
            name: rawCity.city
        };
    }


    var operators = [
        { id: 1, name: Operator.Equals },
        { id: 2, name: Operator.LessThan },
        { id: 3, name: Operator.GreaterThan },
        { id: 4, name: Operator.In }
    ];
    var propertyTypes = [
        { id: 1, name: PropertyDataType.Number },
        { id: 2, name: PropertyDataType.Boolean },
        { id: 3, name: PropertyDataType.String },
        { id: 4, name: PropertyDataType.Date },
        { id: 5, name: PropertyDataType.DateTime },
        //{ id: 6, name: PropertyDataType.Number },
        { id: 7, name: PropertyDataType.Country },
        { id: 8, name: PropertyDataType.State },
        { id: 9, name: PropertyDataType.City },
    ];

    function getOperator(operatorId) {
        return _.find(operators, function (o) { return o.id ==  operatorId}).name;
    }
    function getOperatorId(operatorName) {
        return _.find(operators, function (o) { return o.name ==  operatorName}).id;
    }
    function getPropertyType(propertyTypeId) {
        return _.find(propertyTypes, function (pt) { return pt.id ==  propertyTypeId}).name;
    }
    function getPropertyTypeId(propertyTypeName) {
        return _.find(propertyTypes, function (pt) { return pt.name ==  propertyTypeName}).id;
    }
    function getIsList(propertyFlags) {
        return !(_.includes(propertyFlags, "atomic"));
    }
    function getIsRestricted(propertyFlags) {
        return _.includes(propertyFlags, "restricted");
    }
    function getVariantName(rawVariant) {
        return "Variant #" + rawVariant.id;
    }

    function getProducts(callback) {
        // /scholarships/select
        var url = API_ROOT + "/scholarships/select";

        var settings = {
            "async": true,
            //"crossDomain": true,
            "url": url,
            "method": "GET"
        };

        var result;

        $.ajax(settings)
            .done(function (response, textStatus, jqXHR) {
                result = response;

                callback(_.map(result, function (rawProduct) {
                    return new Product(rawProduct.id, rawProduct.title, [], []);
                }));
            })
            .fail(function (jqXHR, textStatus, error) {
                console.log(response);
            });
    }
    function getProduct(productId, callback) {
        // /scholarships/:scholarship_id/describe

        var url = API_ROOT + "/scholarships/" + productId + "/describe";

        var settings = {
            "async": true,
            //"crossDomain": true,
            "url": url,
            "method": "GET"
        };

        var result;

        $.ajax(settings)
            .done(function (response, textStatus, jqXHR) {
                result = response;

                var productToReturn = new Product(result.id, result.title, [], []);

                _.each(result.predicates, function (rawPredicate) {

                    var predicateToAdd = new Predicate(rawPredicate.id, rawPredicate.property.id,
                        getOperator(rawPredicate.operator_id), {}, {});

                    var predicateDefaultValues = result.defaults[rawPredicate.id.toString()];

                    predicateToAdd.defaultValue = _.map(predicateDefaultValues, function (dv) {
                        return dv.value;
                    });

                    predicateToAdd.property = new Property(rawPredicate.property.id, rawPredicate.property.name,
                        rawPredicate.property.description, getPropertyType(rawPredicate.property.type_id),
                        getIsList(rawPredicate.property.flags), null /*rawPredicate.property.value*/,
                        getIsRestricted(rawPredicate.property.flags));

                    productToReturn.predicates.push(predicateToAdd);
                });

                _.each(result.variants, function (rawVariant) {

                    var variantToAdd = new Variant(rawVariant.id, rawVariant.scholarship_id, getVariantName(rawVariant), []);

                    _.each(productToReturn.predicates, function (predicate) {

                        var rawVariantValueForThisPredicate = rawVariant.value[predicate.id.toString()];

                        if (rawVariantValueForThisPredicate != undefined) {

                            var values = extractValuesIfGeolocation(
                                _.map(rawVariantValueForThisPredicate, function (dv) {
                                    return dv.value;
                                }),
                                predicate.property);

                            variantToAdd.variantPredicateValues.push(
                                new VariantPredicateValue(predicate.id,
                                    variantToAdd.id, values, /*isOverride:*/ true));
                        }
                        else {
                            var values = extractValuesIfGeolocation(predicate.defaultValue, predicate.property);

                            variantToAdd.variantPredicateValues.push(
                                new VariantPredicateValue(predicate.id,
                                    variantToAdd.id, values, /*isOverride:*/ false));
                        }
                    });

                    productToReturn.variants.push(variantToAdd);
                });

                callback(productToReturn);
            })
            .fail(function (jqXHR, textStatus, error) {
                console.log(error);
            });


    }

    function extractValuesIfGeolocation(values, property) {
        var presentationHelper = new PropertyValueTypePresentationHelper();
        values = presentationHelper.getPresentationOnlyList(property.type, values);

        return values;
    }

    function getPredicates(offset, limit, callback) {
        // http://padatra.com:8080/api/v1/predicates/describe
        var url = API_ROOT + "/predicates/describe?offset=" + offset + "&limit=" + limit;

        var settings = {
            "async": true,
            //"crossDomain": true,
            "url": url,
            "method": "GET"
        };

        var result;

        $.ajax(settings)
            .done(function (response, textStatus, jqXHR) {
                result = response;

                var objectToReturn = {
                    start: result.start,
                    limit: result.limit,
                    count: result.count
                };

                objectToReturn.predicates = _.map(result.data, function (rawPredicate) {

                    var predicateToReturn = new Predicate(rawPredicate.id, rawPredicate.property.id,
                        getOperator(rawPredicate.operator_id), {}, {});

                    if (getIsList(rawPredicate.property.flags)) {
                        predicateToReturn.defaultValue = _.map(rawPredicate.value, function (dv) {
                            return dv.value;
                        });
                    }
                    else {
                        if (rawPredicate.value.length > 0) {
                            predicateToReturn.defaultValue = rawPredicate.value[0].value;
                        }
                        else {
                            predicateToReturn.defaultValue = "";
                        }
                    }

                    predicateToReturn.property = new Property(rawPredicate.property.id, rawPredicate.property.name,
                        rawPredicate.property.description, getPropertyType(rawPredicate.property.type_id),
                        getIsList(rawPredicate.property.flags), null /*rawPredicate.property.value*/,
                        getIsRestricted(rawPredicate.property.flags));

                    return predicateToReturn;
                });

                callback(objectToReturn);

            })
            .fail(function (jqXHR, textStatus, error) {
                console.log(error);
            });
    }
    function getPredicate(predicateId, callback) {
        // /predicates/:predicate_id/describe
        var url = API_ROOT + "/predicates/" + predicateId + "/describe";

        var settings = {
            "async": true,
            "url": url,
            "method": "GET"
        };

        var rawPredicate = {};

        $.ajax(settings)
            .done(function (response, textStatus, jqXHR) {
                rawPredicate = response;

                var predicateToReturn = new Predicate(rawPredicate.id, rawPredicate.property.id,
                    getOperator(rawPredicate.operator_id), {}, {});

                if (getIsList(rawPredicate.property.flags)) {
                    predicateToReturn.defaultValue = _.map(rawPredicate.value, function (dv) {
                        return dv.value;
                    });
                }
                else {
                    if (rawPredicate.value.length > 0) {
                        predicateToReturn.defaultValue = rawPredicate.value[0].value;
                    }
                    else {
                        predicateToReturn.defaultValue = "";
                    }
                }

                predicateToReturn.property = new Property(rawPredicate.property.id, rawPredicate.property.name,
                    rawPredicate.property.description, getPropertyType(rawPredicate.property.type_id),
                    getIsList(rawPredicate.property.flags), null /*rawPredicate.property.value*/,
                    getIsRestricted(rawPredicate.property.flags));

                callback(predicateToReturn);

            })
            .fail(function (jqXHR, textStatus, error) {
                console.log(error);
            });
    }
    function createPredicateAndAddToProduct(predicateToCreate, productId, callback) {
        // /predicates/insert
        var url = API_ROOT + "/predicates/insert";

        var settings = {
            "async": true,
            "url": url,
            "method": "POST",
            "data": JSON.stringify({
                "property_id": predicateToCreate.propertyId,
                "operator_id": getOperatorId(predicateToCreate.operator),
                "value": $.isArray(predicateToCreate.defaultValue) ?
                    predicateToCreate.defaultValue : [predicateToCreate.defaultValue]
            })
        };

        var result;

        $.ajax(settings)
            .done(function (response, textStatus, jqXHR) {
                result = {
                    success: true,
                    response: response
                };

                addPredicateToProduct(result.response.id, productId, function (addResult) {
                    addResult.innerResult = result;
                    callback(addResult);
                });
            })
            .fail(function (jqXHR, textStatus, error) {
                result = {
                    success: false,
                    error: error,
                    message: "There was an error while creating the predicate."
                };

                callback(result);
            });
    }
    function addPredicateToProduct(predicateId, productId, callback) {

        getProduct(productId, function(product) {
            var predicateIdsOfProduct = _.map(product.predicates, function(pred) {
                return pred.id;
            });

            if (_.includes(predicateIdsOfProduct, predicateId)) {
                callback({
                    success: false,
                    message: "Can't use the selected predicate. The product is already associated with this same predicate"
                });
            }

            ///scholarship/:scholarship_id/predicates/:predicate_id/insert
            var url = API_ROOT + "/scholarship/" + productId + "/predicates/" + predicateId + "/insert";

            var settings = {
                "async": true,
                "url": url,
                "method": "POST"
            };

            var result;

            $.ajax(settings)
                .done(function (response, textStatus, jqXHR) {
                    result = {
                        success: true,
                        response: response
                    };

                    callback(result);
                })
                .fail(function (jqXHR, textStatus, error) {
                    result = {
                        success: false,
                        error: error,
                        message: "There was an error while adding the predicate."
                    };

                    callback(result);
                });
        });
    }
    function deletePredicate(productId, predicateId, callback) {
        // scholarship/:scholarship_id/predicates/:predicate_id/delete
        var url = API_ROOT + "/scholarship/" + productId + "/predicates/" + predicateId + "/delete";

        var settings = {
            "async": true,
            "url": url,
            "method": "POST"
        };

        var result;

        $.ajax(settings)
            .done(function (response, textStatus, jqXHR) {
                result = {
                    success: true,
                    response: response
                };

                callback(result);
            })
            .fail(function (jqXHR, textStatus, error) {
                result = {
                    success: false,
                    error: error,
                    message: "There was an error while deleting the predicate."
                };

                callback(result);
            });
    }

    function getProperties(offset, limit, callback) {
        // http://padatra.com:8080/api/v1/properties/describe
        var url = API_ROOT + "/properties/describe?offset=" + offset + "&limit=" + limit;

        var settings = {
            "async": true,
            //"crossDomain": true,
            "url": url,
            "method": "GET"
        };

        var result;

        $.ajax(settings)
            .done(function (response, textStatus, jqXHR) {
                result = response;

                var objectToReturn = {
                    start: result.start,
                    limit: result.limit,
                    count: result.count
                };

                objectToReturn.properties = _.map(result.data, function (rawProperty) {

                    return new Property(
                        rawProperty.id,
                        rawProperty.name,
                        rawProperty.description,

                        getPropertyType(rawProperty.type_id),
                        getIsList(rawProperty.flags),

                        _.map(rawProperty.value, function(p) {
                            return {
                                id: p.id,
                                value: p.value
                            };
                        }),

                        getIsRestricted(rawProperty.flags)
                    );
                });

                callback(objectToReturn);

            })
            .fail(function (jqXHR, textStatus, error) {
                console.log(error);
            });
    }
    function getProperty(propertyId, callback) {
        ///properties/:property_id/describe
        var url = API_ROOT + "/properties/" + propertyId + "/describe";

        var settings = {
            "async": true,
            "url": url,
            "method": "GET"
        };

        var rawProperty = {};

        $.ajax(settings)
            .done(function (response, textStatus, jqXHR) {
                rawProperty = response;

                callback(new Property(
                    rawProperty.id,
                    rawProperty.name,
                    rawProperty.description,

                    getPropertyType(rawProperty.type_id),
                    getIsList(rawProperty.flags),

                    // TODO: create property choice model
                    _.map(rawProperty.value, function(p) {
                        return {
                            id: p.id,
                            value: p.value
                        };
                    }),

                    getIsRestricted(rawProperty.flags)
                ));
            })
            .fail(function (jqXHR, textStatus, error) {
                console.log(error);
            });
    }
    function createProperty(property, callback) {
        var url = API_ROOT + "/properties/insert";

        var flags = [];

        if (!property.isList) { flags.push("atomic"); }
        if (property.isRestricted) { flags.push("restricted"); }

        var settings = {
            "async": true,
            "url": url,
            "method": "POST",
            "data": JSON.stringify({
                "name": property.name,
                "type_id": getPropertyTypeId(property.type),
                "description": property.description,
                "flags": flags.join(","),
                "value": property.choices
            })
        };

        var result;

        $.ajax(settings)
            .done(function (response, textStatus, jqXHR) {
                result = {
                    success: true,
                    response: response
                };

                result.createdProperty = property;
                result.createdProperty.id = result.response.id;

                callback(result);
            })
            .fail(function (jqXHR, textStatus, error) {
                result = {
                    success: false,
                    error: error,
                    message: "There was an error while creating the property."
                };

                callback(result);
            });
    }

    function createVariantForProduct(productId, callback) {

        getProduct(productId, function(productToAddVariantTo) {
            if (productToAddVariantTo.variants.length >= MAX_NUMBER_OF_VARIANTS_PER_PRODUCT) {
                callback({
                    success: false,
                    message: "Can't create more Variants. This Product has reached it's maximum number of Variants."
                });
            }

            var url = API_ROOT + "/scholarship/" + productId + "/variants/insert";

            var settings = {
                "async": true,
                "url": url,
                "method": "POST"
            };

            var result;

            $.ajax(settings)
                .done(function (response, textStatus, jqXHR) {
                    result = {
                        success: true,
                        response: response
                    };

                    result.createdVariantId = result.response.id;

                    callback(result);
                })
                .fail(function (jqXHR, textStatus, error) {
                    result = {
                        success: false,
                        error: error,
                        message: "There was an error while creating the variant."
                    };

                    callback(result);
                });
        });
    }
    function deleteVariant(productId, variantId, callback) {

        getProduct(productId, function(productToDeleteVariantFrom) {

            if (productToDeleteVariantFrom.variants.length == 1) {
                callback({
                    success: false,
                    message: "Can't delete this Variant. This is the last Variant of this Product"
                });
            }

            // /scholarship/:scholarship_id/variants/:variant_id/delete
            var url = API_ROOT + "/scholarship/" + productId + "/variants/" + variantId + "/delete";

            var settings = {
                "async": true,
                "url": url,
                "method": "POST"
            };

            var result;

            $.ajax(settings)
                .done(function (response, textStatus, jqXHR) {
                    result = {
                        success: true,
                        response: response
                    };

                    callback(result);
                })
                .fail(function (jqXHR, textStatus, error) {
                    result = {
                        success: false,
                        error: error,
                        message: "There was an error while deleting the variant."
                    };

                    callback(result);
                });
        });
    }

    function getVariantPredicateValue(variantId, predicateId, callback) {
        // /variants/:variant_id/predicates/:predicate_id/select
        var url = API_ROOT + "/variants/" + variantId + "/predicates/" + predicateId + "/select";

        var settings = {
            "async": true,
            "url": url,
            "method": "GET"
        };

        var result;

        $.ajax(settings)
            .done(function (response, textStatus, jqXHR) {
                result = response;



                var values = [];
                var isOverride = false;

                if (result) {
                    if (result.length > 0) {

                        isOverride = true;

                        values = _.map(result, function (v) {
                            return v.value;
                        });
                    }
                }

                if (!isOverride) {
                    getPredicate(predicateId, function(predicate) {

                        if (predicate.property.isList) {
                            values = predicate.defaultValue;
                        }
                        else {
                            values = [predicate.defaultValue];
                        }

                        callback(new VariantPredicateValue(predicateId, variantId, values, isOverride));
                    });
                }
                else {
                    callback(new VariantPredicateValue(predicateId, variantId, values, isOverride));
                }

            })
            .fail(function (jqXHR, textStatus, error) {
                console.log(error);
            });
    }
    function saveVariantPredicateValue(variantPredicateValue, callback) {
        // /variants/:variant_id/predicates/:predicate_id/insert
        var url = API_ROOT + "/variants/" + variantPredicateValue.variantId +
            "/predicates/" + variantPredicateValue.predicateId + "/insert";

        var data = {
            value: variantPredicateValue.values
        };

        var settings = {
            "async": true,
            "url": url,
            "method": "POST",
            "headers": {
                "content-type": "application/json"
            },
            "data": JSON.stringify(data)
        };

        var result;

        $.ajax(settings)
            .done(function (response, textStatus, jqXHR) {
                result = {
                    success: true,
                    response: response
                };

                callback(result);
            })
            .fail(function (jqXHR, textStatus, error) {
                result = {
                    success: false,
                    error: error,
                    message: "There was an error while updating the variant value."
                };

                callback(result);
            });
    }

    return {
        getProducts: getProducts,
        getProduct: getProduct,
        getPredicates: getPredicates,
        getPredicate: getPredicate,
        createPredicateAndAddToProduct: createPredicateAndAddToProduct,
        addPredicateToProduct: addPredicateToProduct,
        deletePredicate: deletePredicate,
        getProperties: getProperties,
        getProperty: getProperty,
        createProperty: createProperty,
        createVariantForProduct: createVariantForProduct,
        deleteVariant: deleteVariant,
        getVariantPredicateValue: getVariantPredicateValue,
        saveVariantPredicateValue: saveVariantPredicateValue,
        getCountries: getCountries,
        getStatesForCountry: getStatesForCountry,
        getCitiesForState: getCitiesForState,
        getCountry: getCountry,
        getState: getState,
        getCity: getCity
    };
}