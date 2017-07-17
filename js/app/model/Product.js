/**
 * Created by kevin on 2/10/2017.
 */

function Product(/*number*/ id, /*string*/ name, /*Predicate array*/ predicates, /*Variant array*/ variants) {

    this.id = id;
    this.name = name;

    this.predicates = predicates;
    this.variants = variants;

    return {
        id: this.id,
        name: this.name,
        predicates: this.predicates,
        variants: this.variants
    };
}