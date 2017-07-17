function MasterViewModel(/*AppRepository*/ repository) {

    // Initializing
    var self = this;
    self.repository = repository;
    var table = {};

    function start() {
        self.repository.getProducts(function(products) {

            var data = convertToDataTableFriendlyData(products);

            table = $('#master').DataTable({
                data: data,
                columns: [
                    {"data": "name"}
                ]
            });

            $('#master').find('tr').on("click", function() {
                var clicked_id = $(this).attr('id');
                window.location.href = "edit_scholarship.html?product_id=" + clicked_id;
            });
        });
    }

    function convertToDataTableFriendlyData(/*Product array*/ products) {
        var dataToReturn = [];
        $.each(products, function(index, product) {
            dataToReturn.push({
                "DT_RowId": product.id,
                "name": product.name,
            })
        });
        return dataToReturn;
    }

    return {
        start: start
    }
}

$(document).ready(function() {
    var viewModel = new MasterViewModel(new AppRepository());
    viewModel.start();

});