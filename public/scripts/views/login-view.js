var app = app || {};
(module => {

    const LoginView = {};

    const markup = `
        <h1>
            Login View
        </h1>
        <form id="userLogForm">
            <input type="email" id="email_logForm" placeholder="Your Email" required>
            <input type="password" id="password_logForm" placeholder="Create Password" required>
            <button type="submit" id="login">Log-in</button>
        </form>
        <div id="user-faves-view" class="page">
            <div id="user-faves-slot"></div>
        </div>
    `
    const template = Handlebars.compile(markup)

    function renderThings() {
        $('#login-slot').empty()
        $('#login-slot').append(template())
    }
    LoginView.init = () => {
        $('#login-view').off()
        renderThings()
        $('#login-view').show()
        $('#userLogForm').off()
        // handle UserForm
        $('#login').on('click', function (e) {
            e.preventDefault()
            var email = $('#email_logForm').val();
            app.Admin.fetchUsers(email,()=>{
                $('#list-view').show()
                page('/')
                app.ListView.init()
            })
        });
        console.log('line 40 of login')
        app.NearbyRes.getFaves()

    }
    module.LoginView = LoginView
})(app)