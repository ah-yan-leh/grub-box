var app = app || {};
(module => {

    const ListView = {};

    const markup = `
    <div class="rst-top-level">
    <div class="img-info">
        <div class="rst-img">
        <a class="rst-name" href="/detail-view/{{id}}"><h4 class="rst-title">{{name}}</h4></a>
            <img class="featured-image" src={{featured_image}}>
        </div>

    </div>
    <div class="all-rst-info">
        <p class="rating-expanded">Rating</p>
        <p class="rating" style="background-color:#{{rating_color}}">{{aggregate_rating}}</p>
        <p class="locality">{{locality_verbose}}</p>
        <p class="address">Address: {{address}}</p>
        CUISINES: {{cuisines}}
        <br> COST FOR TWO: $ {{average_cost_for_two}}</p>
        <div id="menu-save">
            <a href="{{menu_url}}">Menu</a>
            <a data-res_id="{{id}}" id="fave" class="faver" style="position: absolute; right: 20px;">save</a>
        </div>
    </div>
</div>
    `
    const template = Handlebars.compile(markup)

    function renderThings() {
        $('#list-slot').empty()
        app.NearbyRes.all.forEach(res => {
            $('#list-slot').append((template(res)))
        })
    }
    ListView.init = () => {
        $('#list-slot').empty()
        $('#list-view').off()
        renderThings()
        app.NearbyRes.fetchAll(function(){
            renderThings()
            
            $(".faver").on('click',function(){
                console.log('res_id',$(this).attr('data-res_id'));
                app.NearbyRes.faveIt($(this).attr('data-res_id'));
            })
        });
        $('#list-view').show()
    }
    module.ListView = ListView
})(app)