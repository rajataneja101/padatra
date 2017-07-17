/**
 * Created by kevin on 2/22/2017.
 */

function PredicateSelector(/*AppRepository*/ repository, selectPredicateCallback, invokePredicateCreatorCallback) {

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

    var selectorTemplateName = "predicate-selector";
    var selectorTemplateUrl = "templates/selectors/predicate.tmpl.html";

    var selectorContainerSelector = "#predicate-selector";

    var table = {};

    registerTemplateHelpers();

    function registerTemplateHelpers() {
        Handlebars.registerHelper("getDefaultValue", function (templateContext) {
            var presentationHelper = new PropertyValueTypePresentationHelper();
            return presentationHelper
                .getPredicateDefaultValueCollapsedPresentation(templateContext.property,
                    templateContext.rawDefaultValue);
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
        $(selectorContainerSelector).find("input.select-predicate").unbind();
        $(selectorContainerSelector).find("a.create-new-predicate").unbind();
        $(selectorContainerSelector).find("span.show-more").unbind();

        $(selectorContainerSelector).find("a.close-dialog").on("click", function () {
            close();
        });
        $(selectorContainerSelector).find("input.select-predicate").on("click", function () {
            var selectedPredicateId = table.row({ selected: true, page: 'current' }).data().id;
            selectPredicateCallback(selectedPredicateId, function(result) {
                if (result.success) {
                    close();
                }
                else {
                    alert(result.message);
                }
            });
        });
        $(selectorContainerSelector).find("a.create-new-predicate").on("click", function () {
            invokePredicateCreatorCallback();
            close();
        });

        // jquery dialog set up
        var selectorDialog = $(selectorContainerSelector).dialog(dialogOptions);
        selectorDialog.dialog( "option", "position", { my: "center top", at: "center top+50", of: window });

        // jquery dialog display
        selectorDialog.dialog('open');
    }

    function setUpDataTable() {

        table = $(selectorContainerSelector).find('#predicates-table').DataTable({
            ajax: function (data, renderDataCallback, settings) {

                repository.getPredicates(data.start, data.length, function(result) {

                    result.predicates = convertToDataTableFriendlyData(result.predicates);

                    renderDataCallback({
                        recordsTotal: result.count,
                        recordsFiltered: result.count,
                        data: result.predicates
                    });

                });

            },
            columns: [
                {
                    data: 'name',
                    render: function(data, type, row) {

                        var context = {
                            rawDefaultValue: row.defaultValue,
                            operator: row.operator,
                            property: row.property
                        };

                        var template = Handlebars.compile(
                            '<div class="predicate-detail-container">' +
                                '<p class="property-data-container">' +
                                    '<span class="property-name"> {{property.name}} </span>' +
                                    '<span class="property-type">' +
                            //'({{#if property.isRestricted}}Restricted {{/if}}{{#if property.isList}}Collection of {{/if}}{{property.type}}) ' +
                                        '({{#if property.isList}}Collection of {{/if}}{{property.type}}) ' +
                                    '</span>' +
                                '</p>' +
                                '<p class="predicate-data-container">' +
                                    'Value' +
                                    '<span class="predicate-operator"> {{operator}} </span>' +
                                    '<span class="predicate-default-value"> {{ getDefaultValue this }} </span>' +
                                '</p>' +
                                '<p class="property-description">{{property.description}}</p>' +
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
            $(selectorContainerSelector).find("input.select-predicate").removeAttr('disabled');
        });

        table.on('deselect', function() {
            $(selectorContainerSelector).find("input.select-predicate").attr('disabled', 'disabled');
        });

        table.on('page', function () {
            $(".dataTables_scrollBody").scrollTop(0);
            $(selectorContainerSelector).find("input.select-predicate").attr('disabled', 'disabled');
        });

        table.on('click', "span.show-more", function() {
            var predicateId = $(this).closest("tr").attr("id");

            repository.getPredicate(predicateId, function(predicate) {
                var viewer = new ValueListViewer(predicate.property, predicate.defaultValue, false);
                viewer.display();
            });
        });
    }

    function convertToDataTableFriendlyData(predicates) {
        var dataToReturn = _.map(predicates, function(p, i) {
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
