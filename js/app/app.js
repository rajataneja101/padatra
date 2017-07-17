/**
 * Created by kevin on 2/13/2017.
 */

/* Code for bootstrapping the app and generic utilities */

Handlebars.getTemplate = function(name, templateUrl) {
    if (Handlebars.templates === undefined || Handlebars.templates[name] === undefined) {
        $.ajax({
            url : templateUrl,
            success : function(data) {
                if (Handlebars.templates === undefined) {
                    Handlebars.templates = {};
                }
                Handlebars.templates[name] = Handlebars.compile(data);
            },
            async : false
        });
    }
    return Handlebars.templates[name];
};

$(document).ajaxStart(function() {
    $.blockUI({
        message: "processing...",
        css: {
            border: 'none',
            padding: '15px',
            backgroundColor: '#000',
            'border-radius': '10px',
            opacity: .5,
            color: '#fff'
        }
    });
});

$( document ).ajaxStop(function() {
    $.unblockUI();
});

var app = { };
