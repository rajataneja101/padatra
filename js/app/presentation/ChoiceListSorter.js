/**
 * Created by kevin on 3/7/2017.
 */

function ChoiceListSorter() {

    var sortDirectionFunctions = {
        'ascending': function (a, b) {
            if ($(a).text().trim() == $(b).text().trim()) return 0;
            else if ($(a).text().trim() < $(b).text().trim()) return -1;
            else return 1;
        },

        'descending': function (a, b) {
            if ($(a).text().trim() == $(b).text().trim()) return 0;
            else if ($(a).text().trim() < $(b).text().trim()) return 1;
            else return -1;
        }
    };

    function sortListItems(listItems, sortAscending) {
        return listItems.sort(sortDirectionFunctions[sortAscending ? 'ascending' : 'descending']);
    }

    return {
        sortListItems: sortListItems
    };
}
