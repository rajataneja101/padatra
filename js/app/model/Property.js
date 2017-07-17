/**
 * Created by kevin on 2/10/2017.
 */

function Property(/*number*/ id, /*string*/ name, /*string*/ description,
                  /*PropertyDataType*/ type, /*boolean*/ isList, /*object array*/ choices,
                  /*boolean*/ isRestricted) {

    this.id = id;
    this.name = name;
    this.description = description;
    this.type = type;
    this.isList = isList;
    this.isRestricted = isRestricted;
    this.choices = choices; // Optional. Will have choices only if is list.

    return {
        id: this.id,
        name: this.name,
        description: this.description,
        type: this.type,
        isList: this.isList,
        isRestricted: this.isRestricted,
        choices: this.choices
    };
}