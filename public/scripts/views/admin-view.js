var app = app || {};
(module => {

    const AdminView = {};

    const markup = `
        <h1>
            Admin View
        </h1>
        <div style="margin-left:10%;">
        <p>Name: {{name}}, Email: {{email}}
        </div>
    `
    const template = Handlebars.compile(markup)

    function renderThings() {
        app.Admin.fetchUsers()
        $('#admin-slot').empty()
        app.Admin.all.forEach(res => {
            $('#admin-slot').append((template(res)))
        })
    }
    AdminView.init = () => {
        //alert($('#admin-slot').children().length)
        $('#admin-slot').empty()
        $('#admin-view').off()
        renderThings()
        $('#admin-view').show()
    }
    module.AdminView = AdminView
})(app)