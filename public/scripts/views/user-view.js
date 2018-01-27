var app = app || {};
(module => {

    const UserView = {};

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
            <a data-res_id="{{id}}" id="fave" class="delete-fave" style="position: absolute; right: 20px;">delete</a>
        </div>
    </div>
</div>
    `
    const template = Handlebars.compile(markup)

    function renderThings() {
        $('#user-slot').empty()
        for(var i=0;i<app.NearbyRes.user_favorites.length;i++){
            var resHolder = app.NearbyRes.user_favorites[i];
            for(var i=0; i<resHolder.length; i++){
                console.log(resHolder[i])
                $('#user-slot').append((template(resHolder[i])))
            }
        }
    }
    UserView.init = () => {
        console.log('line 41 of user-view')
        $('#user-view').off()
        renderThings()
        $('#user-view').show()
        app.NearbyRes.getFaves(()=>{
            renderThings()
        },()=>{
              $( ".rst-top-level" ).on('click',function ( event ) {
                  var fav_id = $( this ).children( ".all-rst-info" ).find('.delete-fave').attr('data-res_id');
                  console.log('fav_id',fav_id);
                  var fav_name = $( this ).children('.all-rst-info').find( ".rst-name" ).text();
                  console.log('fav_name',fav_name);

                  confirm('Delete '+$( this ).find( ".rst-title" ).text())
                  app.NearbyRes.deletefaveIt($( this ).children( ".all-rst-info" ).find('.delete-fave').attr('data-res_id'));
                  $(this).remove()
                  console.log('line 58',$( this ).children( ".all-rst-info" ).find('.delete-fave').attr('data-res_id'))
                  app.NearbyRes.deleteFaveArray($( this ).children( ".all-rst-info" ).find('.delete-fave').attr('data-res_id'))
                  event.preventDefault();
                });
            })
    }
    module.UserView = UserView
})(app)