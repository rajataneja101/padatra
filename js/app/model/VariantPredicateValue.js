/**
 * Created by kevin on 2/13/2017.
 */

function VariantPredicateValue(/*number id,*/ /*number*/ predicateId, /*number*/ variantId,
                               /*object array*/ values, /*Boolean*/ isOverride) {

    //this.id = id;
    this.predicateId = predicateId;
    this.variantId = variantId;
    // "values" can be just one for non list properties and can also be many for list
    // properties where these could be a subset of the entire list of values
    // supported by a property
    this.values = values;
    this.isOverride = isOverride;

    return {
        //id: this.id,
        predicateId: this.predicateId,
        variantId: this.variantId,
        values: this.values,
        // True if this value was specified in the incoming data from the server.
        // False if it didn't come and was created based on the predicate's default values
        isOverride: this.isOverride
    };
}
