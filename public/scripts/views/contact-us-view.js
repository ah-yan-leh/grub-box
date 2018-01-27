var app = app || {};
(module => {

    const ContactUsView = {};

    const markup = `
        <div>
        <img class="featured-image" src="http://lorempixel.com/output/food-q-c-640-480-8.jpg"> <strong>We've got a hunger for your feedback. </strong>
        <br> 
        {{{write_up}}}
        </div>
    `
    const template = Handlebars.compile(markup)

    function renderThings() {
        $('#contact-us-slot').empty()
        $('#contact-us-slot').append(template())
    }
    ContactUsView.init = () => {
        $('#contact-us-view').off()
        renderThings()
        $('#contact-us-view').show()
    }
    module.ContactUsView = ContactUsView
})(app)