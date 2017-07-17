/**
 * Created by kevin on 2/10/2017.
 */

function Variant(/*number*/ id, /*number*/ productId, /*string*/ name,
                 /*VariantPredicateValue array*/ variantPredicateValues) {

    this.id = id;
    this.productId = productId;
    this.name = name;
    this.variantPredicateValues = variantPredicateValues;

    return {
        id: this.id,
        productId: this.productId,
        name: this.name,
        variantPredicateValues: this.variantPredicateValues
    };
}
