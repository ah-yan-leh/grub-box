var app = app || {};
(module => {

    const MainMenuView = {};

    const markup = `
        <ul id="simple-nav-menu">
            <li data-nav_id="home"><a href="/">Home</a></li>
            <li data-nav_id="about"><a href="/about-us-view">About Us</a></li>
            <li data-nav_id="contact"><a href="/contact-us-view">Contact Us</a></li>
            <li data-nav_id="register"><a href="/register-view">Register</a></li>
            <li data-nav_id="my-favorites"><a href="/my-favorites">My Favorites</a></li>
            <li data-nav_id="login"><a href="/login-view">Login</a></li>
        </ul>
    `;
    const template = Handlebars.compile(markup)

    function renderThings() {
        $('#main-menu-slot').empty()
        $('#main-menu-slot').append(template())
    }
    MainMenuView.init = () => {
        
        $('#main-menu-view').off()
        renderThings()
        $('#main-menu-view').show()
    }
    module.MainMenuView = MainMenuView
})(app)