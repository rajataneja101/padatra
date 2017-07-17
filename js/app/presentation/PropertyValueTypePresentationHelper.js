/**
 * Created by kevin on 3/1/2017.
 */

function PropertyValueTypePresentationHelper() {
    
    function getPresentationOnlyList(propertyType, values) {
        if (propertyType == PropertyDataType.Country) {
            return _.map(values, function (v) { return v.country; });
        }
        else if (propertyType == PropertyDataType.State) {
            return _.map(values, function (v) { return v.state; });
        }
        else if (propertyType == PropertyDataType.City) {
            return _.map(values, function (v) { return v.city; });
        }
        else if (propertyType == PropertyDataType.Date) {
            return _.map(values, function (v) {
                return localizeDate(v);
            });
        }
        else if (propertyType == PropertyDataType.DateTime) {
            return _.map(values, function (v) {
                return localizeDateTime(v);
            });
        }
        // TODO: Add more types as needed
        else {
            return values;
        }
    }

    function getSelectableItemsList(propertyType, values) {
        if (propertyType == PropertyDataType.Country) {
            return _.map(values, function (c) {
                return { id: c.id, value: c.value.country }
            });
        }
        else if (propertyType == PropertyDataType.State) {
            return _.map(values, function (c) {
                return { id: c.id, value: c.value.state }
            });
        }
        else if (propertyType == PropertyDataType.City) {
            return _.map(values, function (c) {
                return { id: c.id, value: c.value.city }
            });
        }
        else if (propertyType == PropertyDataType.Date) {
            return _.map(values, function (d) {
                return {
                    id: d.id, value: localizeDate(d.value)
                };
            });
        }
        else if (propertyType == PropertyDataType.DateTime) {
            return _.map(values, function (d) {
                return {
                    id: d.id, value: localizeDateTime(d.value)
                };
            });
        }
        // TODO: Add more types as needed
        else {
            return values;
        }
    }

    function getLocalizedIfDate(propertyType, value) {
        if (propertyType == PropertyDataType.Date) {
            return localizeDate(value);
        }
        else if (propertyType == PropertyDataType.DateTime) {
            return localizeDateTime(value);
        }
        else {
            return value;
        }
    }

    function localizeDate(value) {
        return new Date(value).toLocaleDateString(navigator.language, {timeZone: "UTC"});
    }

    function localizeDateTime(value) {
        return new Date(value).toLocaleString(navigator.language, {timeZone: "UTC"});
    }

    function getPredicateDefaultValuePresentationList(propertyType, defaultValues) {
        return getValuesPlainPresentationList(propertyType, defaultValues);
    }
    function getPropertyChoicesPresentationList(propertyType, choices) {
        return getValuesPlainPresentationList(
            propertyType,
            _.map(choices, function(c) { return c.value; }));
    }
    function getValuesPlainPresentationList(propertyType, values) {

        var valuesToReturn = [];

        if (propertyType == PropertyDataType.Country) {
            valuesToReturn = getChoicesText(values, function(v) {
                return v.country;
            });
        }
        else if (propertyType == PropertyDataType.State) {
            valuesToReturn = getChoicesText(values, function(v) {
                return v.country + ", " + v.state;
            });
        }
        else if (propertyType == PropertyDataType.City) {
            valuesToReturn = getChoicesText(values, function(v) {
                return v.country + ", " + v.state + ", " + v.city;
            });
        }
        else if (propertyType == PropertyDataType.Date) {
            valuesToReturn = getChoicesText(values, function(v) {
                return localizeDate(v);
            });
        }
        else if (propertyType == PropertyDataType.DateTime) {
            valuesToReturn = getChoicesText(values, function(v) {
                return localizeDateTime(v);
            });
        }
        else {
            valuesToReturn = getChoicesText(values, function(v) {
                return v.toString();
            });
        }

        return valuesToReturn;
    }

    function getPredicateDefaultValueCollapsedPresentation(property, defaultValue) {
        if (property.isList) {
            var values = getValuesDecoratedPresentationList(property.type, defaultValue);
            return new Handlebars.SafeString("[" + values.join(", ") + "]");
        }
        else {
            if (property.type == PropertyDataType.Country) {
                return defaultValue.country;
            }
            else if (property.type == PropertyDataType.State) {
                return "{" + defaultValue.country + ", " + defaultValue.state + "}";

            }
            else if (property.type == PropertyDataType.City) {
                return "{" + defaultValue.country + ", " + defaultValue.state + ", " + defaultValue.city + "}";
            }
            else if (property.type == PropertyDataType.Date) {
                return localizeDate(defaultValue);
            }
            else if (property.type == PropertyDataType.DateTime) {
                return "{" + localizeDateTime(defaultValue) + "}";
            }
            else {
                return new Handlebars.SafeString(defaultValue);
            }
        }
    }
    function getPropertyChoicesCollapsedPresentation(property) {
        if (property.isRestricted) {
            var values = getValuesDecoratedPresentationList(
                property.type, _.map(property.choices, function(c) { return c.value; }));

            return new Handlebars.SafeString(
                '<p class="property-choices-container">' +
                    '<span class="property-choices-title">Choices: </span>' +
                    '<span class="property-choices">' +
                        '[' + values.join(", ") + ']' +
                    '</span>' +
                '</p>');
        }
    }
    function getValuesDecoratedPresentationList(propertyType, values) {

        var valuesToReturn = [];

        if (propertyType == PropertyDataType.Country) {
            valuesToReturn = getCollapsedChoicesText(values, function(v) {
                return v.country;
            });
        }
        else if (propertyType == PropertyDataType.State) {
            valuesToReturn = getCollapsedChoicesText(values, function(v) {
                return "{" + v.country + ", " + v.state + "}";
            });
        }
        else if (propertyType == PropertyDataType.City) {
            valuesToReturn = getCollapsedChoicesText(values, function(v) {
                return "{" + v.country + ", " + v.state + ", " + v.city + "}"
            });
        }
        else if (propertyType == PropertyDataType.Date) {
            valuesToReturn = getCollapsedChoicesText(values, function(v) {
                return localizeDate(v);
            });
        }
        else if (propertyType == PropertyDataType.DateTime) {
            valuesToReturn = getCollapsedChoicesText(values, function(v) {
                return "{" + localizeDateTime(v) + "}";
            });
        }
        else {
            valuesToReturn = getCollapsedChoicesText(values, function(v) {
                if (_.includes(v.toString(), ",")) {
                    return "{" + v.toString() + "}";
                }
                else {
                    return v.toString();
                }
            });
        }

        return valuesToReturn;
    }

    function getCollapsedChoicesText(choices, getValueTextFunction) {

        var values = [];
        var isCollapsed = false;

        _.each(choices, function(c) {
            if (values.join(",").length + getValueTextFunction(c).length <= 90) {
                values.push(getValueTextFunction(c));
            }
            else {
                isCollapsed = true;
            }
        });

        if (isCollapsed) {
            values.push('<span class="show-more">...</span>');
        }

        return values;
    }
    function getChoicesText(choices, getValueTextFunction) {
        return _.map(choices, function(c) {
            return getValueTextFunction(c);
        });
    }

    return {
        getPresentationOnlyList: getPresentationOnlyList,
        getSelectableItemsList: getSelectableItemsList,
        getLocalizedIfDate: getLocalizedIfDate,
        localizeDate: localizeDate,
        localizeDateTime: localizeDateTime,
        getPredicateDefaultValueCollapsedPresentation: getPredicateDefaultValueCollapsedPresentation,
        getPropertyChoicesCollapsedPresentation: getPropertyChoicesCollapsedPresentation,
        getPredicateDefaultValuePresentationList: getPredicateDefaultValuePresentationList,
        getPropertyChoicesPresentationList: getPropertyChoicesPresentationList
    };
}