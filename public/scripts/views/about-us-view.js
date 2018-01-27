var app = app || {};
(module => {

    const AboutUsView = {};

    const markup = `

        <div class= "profile";>
        <img class="featured-image-profile" src={{img_src}}>
    
        <h2 class = "name"><strong id ="name_id">{{name}}</strong></h2>
        <br> <div class = "write_about">
        {{{write_up}}}
        <div>
        </div>
    `
    const template = Handlebars.compile(markup)

    function renderThings() {
        console.log('render things')
        $('#about-us-slot').empty()
        app.Admin.aboutUs.forEach(res => {
            console.log('inside aboutus loop')
            $('#about-us-slot').append((template(res)))
        })
        
        $('#about-us-view').show()
    }
    AboutUsView.init = () => {
        $('#about-us-view').off()
        app.Admin.fetchAboutUs(()=>{
            renderThings();
        },()=>{
            $('#about-us-view').show()
        })
    }
    module.AboutUsView = AboutUsView
})(app)