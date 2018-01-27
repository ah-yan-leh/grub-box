var app = app || {};
(module => {

    const ErrorView = {};

    const markup = `
        <h1>
            Error View
        </h1>
    `
    const template = Handlebars.compile(markup)

    function renderThings() {
        $('#error-slot').empty()
        $('#error-slot').append(template())
    }
    ErrorView.init = () => {
        $('#error-view').off()
        renderThings()
        $('#error-view').show()
    }
    module.ErrorView = ErrorView
})(app)