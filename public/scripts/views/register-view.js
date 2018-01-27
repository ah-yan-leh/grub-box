var app = app || {};
(module => {

    const RegisterView = {};

    const markup = `
        <h1 id="RegisterUser">
            Register as a user on Grub 'round Here. 
        </h1>

        <form id="userRegForm"
        method="post" action="/user">
<p id="whyRegister"> (This will allow you to save restaurants) </p>
            <input type="text" id="name_regForm" placeholder="Your Name" required>
            <input type="email" id="email_regForm" placeholder="Your Email" required>
            <input type="password" id="password_regForm" placeholder="Create Password" required>
            <button type="submit" id="register">Register</button>
        </form>
    `
    const template = Handlebars.compile(markup)

    function renderThings() {
        $( "#register-slot" ).each(function() {
            $(this).empty()
          });
        $('#register-slot').append(template())
    }
    RegisterView.init = () => {
        $('#zip').hide()
        $('#searchByZIP').hide()
        $('#register-view').off()
        renderThings()
        $('#register-view').show()
        $('#userRegForm').off()
        // handle UserForm
 
        $('#register').on('click',function(e){
            e.preventDefault()
    
            if(
                $('#email_regForm').val() !="" ||
                $('#password_regForm').val() !=""
            ){
               var NewUserAccount = {
                    name:  $('#name_regForm').val(),
                    email: $('#email_regForm').val(),
                    password: $('#password_regForm').val()
                }
                
                // NewUserAccount = JSON.stringify(NewUserAccount)
                console.log(NewUserAccount)
                    $.post('/user',NewUserAccount)
                      .then(data => {
                        console.log(data);
                        
                        page('/login-view')
                        if (callback) callback();
                    
                      });

                $('#userRegForm').fadeOut( "slow");
            }
            else{
                if($('#name_regForm').val() == ""){$('#name_regForm').css("background-color", "yellow");}
                if($('#email_regForm').val() == ""){$('#email_regForm').css("background-color", "yellow");}
                if($('#password_regForm').val() == ""){$('#password_regForm').css("background-color", "yellow");}
            }
        });

        
    }
    module.RegisterView = RegisterView
})(app)