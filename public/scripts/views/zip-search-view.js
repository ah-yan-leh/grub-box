var app = app || {};
(module => {

    const ZipSearchView = {};

    const markup = `
    <h3>Enter a zip code to find restaurants</h3>
        <form>
            <input type="text" id="zip">
            <button type="submit" id="searchByZIP">Search</button>
        </form>
    `
    const template = Handlebars.compile(markup)

    function renderThings() {
        $('#zip-search-slot').empty()
        //list-slot
        
        $('#list-slot').empty()
        $('#zip-search-slot').append(template())
    }
    ZipSearchView.init = () => {

        $('#zip-search-view').off()
        renderThings()
        $('#zip-search-view').show()
        
    }
    module.ZipSearchView = ZipSearchView
})(app)