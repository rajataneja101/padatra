/**
 * Created by kevin on 2/10/2017.
 */

function Predicate(/*number*/ id, /*number*/ propertyId, /*Operator*/ operator, defaultValue, property) {

    this.id = id;
    this.propertyId = propertyId;
    this.operator = operator;
    this.defaultValue = defaultValue;
    this.property = property;

    return {
        id: this.id,
        propertyId: this.propertyId,
        operator: this.operator,
        defaultValue: this.defaultValue,
        property: this.property
    };
}