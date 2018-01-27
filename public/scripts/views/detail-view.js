var app = app || {};
(module => {

    const DetailView = {};

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
    <div id="googleMap" style="width:70%;height:300px;"></div>
</div>
            
        
        
    `
    const template = Handlebars.compile(markup)

    function renderThings(res_id) {
        $('#detail-slot').append((template(app.NearbyRes.res_id)))
        googleMap()
    }
    DetailView.init = (id) => {
        console.log(app.NearbyRes.res_id.latitude,app.NearbyRes.res_id.longitude)
        function googleMap() {
            var gMapslong = app.NearbyRes.res_id.longitude * 1;
            var gMapslat = app.NearbyRes.res_id.latitude * 1;
            var myCenter = new google.maps.LatLng(gMapslat, gMapslong);
            var mapCanvas = document.getElementById("googleMap");
            var mapOptions = {
                center: myCenter,
                zoom: 14
            };
            var map = new google.maps.Map(mapCanvas, mapOptions);
            var marker = new google.maps.Marker({
                position: myCenter
            });
            marker.setMap(map);
        }
        $('#detail-view').off()
        $('#detail-slot').empty()
        renderThings(id)
        $('#detail-view').show()
        
            
        $("#fave-detail").on('click',function(){
            console.log('fave-detail clicked')
            var faveIt = $(this).attr('data-res_id');
            app.NearbyRes.faveIt(faveIt);
            console.log($(this).attr('data-res_id'));
        })
    }
    module.DetailView = DetailView
})(app)
