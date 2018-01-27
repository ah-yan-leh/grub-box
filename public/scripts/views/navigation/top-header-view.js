var app = app || {};
(module => {

    const TopHeaderView = {};

    const markup = `
        <div>
            <h4 class="rest-local"> Restaurants in {{zip}} {{city_name}} </h4>

        </div>
        <hr>
    `
    const template = Handlebars.compile(markup)

    function renderThings() {
        var zip = localStorage.getItem('zipData');
        var zipGeo = JSON.parse(zip)

        $('#top-header-slot').append((template(zipGeo)))
    }
    TopHeaderView.init = () => {
        $('#top-header-view').off()
        $('#top-header-slot').empty()

        renderThings()
        $('#top-header-view').show()
    }
    module.TopHeaderView = TopHeaderView
})(app)