/**
 * Created by kevin on 2/20/2017.
 */

function PropertySelector(repository, setPropertyCallback, invokePropertyCreatorCallback) {

    var dialogOptions = {
        autoOpen: false,
        show: {
            effect: "fadeIn",
            duration: 100
        },
        hide: {
            effect: "fadeOut",
            duration: 100
        },
        resizable: false,
        stack: true,
        height: 'auto',
        width: '60%',
        modal: true,
        dialogClass: "no-title-dialog"
    };

    var selectorTemplateName = "property-selector";
    var selectorTemplateUrl = "templates/selectors/property.tmpl.html";

    var selectorContainerSelector = "#property-selector";

    var table = {};

    registerTemplateHelpers();

    function registerTemplateHelpers() {
        Handlebars.registerHelper("getChoices", function (property) {
            var presentationHelper = new PropertyValueTypePresentationHelper();
            return presentationHelper.getPropertyChoicesCollapsedPresentation(property);
        });
    }

    function display() {
        $(selectorContainerSelector).remove();
        // load the template using handlebars
        var template = Handlebars.getTemplate(selectorTemplateName, selectorTemplateUrl);

        // generate html with template and context object.
        var selectorHtml = template({});

        // append html to the end of the document.
        $("body").append(selectorHtml);

        setUpDataTable();

        // setup click event handler
        $(selectorContainerSelector).find("a.close-dialog").unbind();
        $(selectorContainerSelector).find("input.select-property").unbind();
        $(selectorContainerSelector).find("a.create-new-property").unbind();

        $(selectorContainerSelector).find("a.close-dialog").on("click", function () {
            close();
        });

        $(selectorContainerSelector).find("input.select-property").on("click", function () {
            var selectedPropertyId = table.row({ selected: true, page: 'current' }).data().id;
            setPropertyCallback(selectedPropertyId, function() {
                close();
            });
        });

        $(selectorContainerSelector).find("a.create-new-property").on("click", function () {
            invokePropertyCreatorCallback();
            close();
        });

        // jquery dialog set up
        var selectorDialog = $(selectorContainerSelector).dialog(dialogOptions);
        selectorDialog.dialog( "option", "position", { my: "center top", at: "center top+50", of: window });

        // jquery dialog display
        selectorDialog.dialog('open');
    }

    function setUpDataTable() {

        table = $('#properties-table').DataTable({
            ajax: function (data, renderDataCallback, settings) {

                repository.getProperties(data.start, data.length, function(result) {

                    result.properties = convertToDataTableFriendlyData(result.properties);

                    renderDataCallback({
                        recordsTotal: result.count,
                        recordsFiltered: result.count,
                        data: result.properties
                    });

                });
            },
            columns: [
                {
                    data: 'name',
                    render: function(data, type, row) {

                        var context = {
                            name: row.name,
                            type: row.type,
                            description: row.description,
                            isList: row.isList,
                            isRestricted: row.isRestricted,
                            choices: row.choices
                        };

                        var template = Handlebars.compile(
                            '<div class="property-detail-container">' +

                                '<p class="property-data-container">' +
                                    '<span class="property-name"> {{name}} </span>' +
                                    '<span class="property-type">' +
                                    '({{#if isList}}Collection of {{/if}}{{type}}) ' +
                                    '</span>' +
                                '</p>' +

                                '{{ getChoices this }}' +

                                '<p class="property-description">{{description}}</p>' +

                            '</div>'
                        );

                        return template(context);
                    }
                }
            ],
            select: {
                info: false,
                items: 'row',
                style: 'single'
            },
            pageLength: 10,
            processing: true,
            serverSide: true,
            searching: false,
            ordering: false,
            scrollY: "300px",
            scrollCollapse: true
        });

        table.on('select', function() {
            $(selectorContainerSelector).find("input.select-property").removeAttr('disabled');
        });

        table.on('deselect', function() {
            $(selectorContainerSelector).find("input.select-property").attr('disabled', 'disabled');
        });

        table.on('page', function () {
            $(".dataTables_scrollBody").scrollTop(0);
            $(selectorContainerSelector).find("input.select-property").attr('disabled', 'disabled');
        });

        table.on('click', "span.show-more", function() {
            var propertyId = $(this).closest("tr").attr("id");

            repository.getProperty(propertyId, function(property) {
                var viewer = new ValueListViewer(property, property.choices, true);
                viewer.display();
            });
        });
    }

    function convertToDataTableFriendlyData(properties) {
        var dataToReturn = _.map(properties, function(p, i) {
            p["DT_RowId"] = p.id;
            return p;
        });

        return dataToReturn;
    }

    function close() {
        $(selectorContainerSelector).dialog('close');
        $(selectorContainerSelector).remove();
    }

    return {
        display: display
    };
}