var app = app || {};

(module => {

    Admin.all = [];
    Admin.aboutUs = [];
    UserLocation.all = [];
    NearbyRes.all = [];
    NearbyRes.user_favorites = [];
    Reviews.all = [];
    function Admin(user) {
        Object.keys(user).forEach(key => this[key] = user[key]);
    }
    // location
    function UserLocation(title, city_id, latitude, longitude, city_name) {
        this.title = title;
        this.city_id = city_id;
        this.latitude = latitude;
        this.longitude = longitude;
        this.city_name = city_name;
    }
    // nearbyRes
    function NearbyRes(data) {
        this.average_cost_for_two = data.average_cost_for_two;
        this.cuisines = data.cuisines;
        this.featured_image = data.featured_image === "" ? "http://clk.com.au/img/no-photo.jpg" : data.featured_image;
        this.has_online_delivery = data.has_online_delivery;
        this.has_table_booking = data.has_table_booking;
        this.id = data.id;
        this.address = data.location.address;
        this.city = data.location.city;
        this.locality = data.location.locality;
        this.locality_verbose = data.location.locality_verbose;
        this.longitude = data.location.longitude;
        this.latitude = data.location.latitude;
        this.zipcode = data.location.zipcode;
        this.menu_url = data.menu_url;
        this.name = data.name;
        this.photos_url = data.photos_url;
        this.price_range = data.price_range;
        this.aggregate_rating = data.user_rating.aggregate_rating;
        this.rating_color = data.user_rating.rating_color;
        this.rating_text = data.user_rating.rating_text;
        this.votes = data.user_rating.votes;
    }
    function Reviews(
        comments_count,
        id,
        likes,
        rating,
        rating_color,
        rating_text,
        review_text,
        review_time_friendly,
        timestamp,
        foodie_color,
        foodie_level,
        foodie_level_num,
        name,
        profile_deeplink,
        profile_image,
        profile_url) {
        this.comments_count
        this.id = id;
        this.likes = likes;
        this.rating = rating;
        this.rating_color = rating_color;
        this.rating_text = rating_text;
        this.review_text = review_text;
        this.review_time_friendly = review_time_friendly;
        this.timestamp = timestamp;
        this.foodie_color = foodie_color
        this.foodie_level = foodie_level
        this.foodie_level_num = foodie_level_num
        this.name = name
        this.profile_deeplink = profile_deeplink
        this.profile_image = profile_image
        this.profile_url = profile_url
    }
    NearbyRes.fetchAll = (callback) => {
        navigator.geolocation.watchPosition(function (position) {
            var zipData;
            if (localStorage.zipData == undefined) {
                zipData = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    city_name: ""
                }
                console.log('Permission ACCEPTED', 'SET: zipData', zipData)
                localStorage.setItem('zipData', JSON.stringify(zipData))
            }
            var zLocal = localStorage.getItem('zipData')
            var zParsed = JSON.parse(zLocal)
            console.log('line 94',zParsed)
            $.get('/api/v2.1/geocode', zParsed)
                .then(function (data) {
                    var res = JSON.parse(data)
                    for (index in res.nearby_restaurants) {
                        NearbyRes.all.push(new NearbyRes(res.nearby_restaurants[index].restaurant))
                    }
                    zipData = {
                        latitude: res.location.latitude,
                        longitude: res.location.longitude,
                        city_name: res.location.city_name
                    }
                    localStorage.setItem('zipData', JSON.stringify(zipData))
                    app.TopHeaderView.init()
                    app.SideNavView.init()
                }).then(() => {

                    callback()
                })
                .catch(function (err) {
                    /*
                    in the event of error, load test data. This is a work-around to deal with Zomato IP block at Ayanle's office network :)
                    */
                    $.get('/scripts/sampleNearByRes.json')
                        .then(function (testData) {
                            // for (index in testData.nearby_restaurants) {
                            //   NearbyRes.all.push(new NearbyRes(testData.nearby_restaurants[index].restaurant))
                            // }
                            // zipData = {
                            //     latitude:testData.location.latitude,
                            //     longitude:testData.location.longitude,
                            //     city_name:testData.location.city_name
                            // }
                            // localStorage.setItem('zipData', JSON.stringify(zipData))
                            // Topcuisines.all.push(new Topcuisines(
                            //   testData.popularity.top_cuisines
                            // ));
                            // app.TopHeaderView.init()
                            // app.SideNavView.init()
                        }).then(() => {
                            callback()
                        })
                    //console.error(err)
                });
        },
            /*****/
            // Start of zip look-up
            /*****/
            function (error) {
                if (error.code == error.PERMISSION_DENIED) {
                    console.log('GEO Permission BLOCKED');
                    if (localStorage.zipData == undefined) {
                        app.ZipSearchView.init()
                    }
                    else {
                        var zip = localStorage.getItem('zipData');
                        var zipGeo = JSON.parse(zip)
                        console.log('line 149',zipGeo)
                        $.get('/api/v2.1/geocode', zipGeo)
                            .then(function (data) {
                                var res = JSON.parse(data)
                                for (index in res.nearby_restaurants) {
                                    NearbyRes.all.push(new NearbyRes(res.nearby_restaurants[index].restaurant))
                                }
                                UserLocation.all.push(new UserLocation(
                                    res.location['place name'],
                                    "0",
                                    res.location.latitude,
                                    res.location.longitude,
                                    res.location['place name']
                                ));
                                app.TopHeaderView.init()
                                app.SideNavView.init()
                            }).then(() => {

                                callback()
                            })
                            .catch(function (err) {

                                callback()
                            });
                    }

                }
            });
    }



    NearbyRes.fetchOne = (id, callback) => {
        var res_id = {
            id: id
        };
        for (index in NearbyRes.all) {
            if (id == NearbyRes.all[index].id) {
                NearbyRes.res_id = NearbyRes.all[index];
            }
        }
        $.get('/api/v2.1/reviews', res_id)
            .then(function (reviews) {
                Reviews.all = [];
                var parsed_reviews = JSON.parse(reviews);
                for (index in parsed_reviews.user_reviews) {
                    Reviews.all.push(new Reviews(
                        parsed_reviews.user_reviews[index].review.comments_count,
                        parsed_reviews.user_reviews[index].review.id,
                        parsed_reviews.user_reviews[index].review.likes,
                        parsed_reviews.user_reviews[index].review.rating,
                        parsed_reviews.user_reviews[index].review.rating_color,
                        parsed_reviews.user_reviews[index].review.rating_text,
                        parsed_reviews.user_reviews[index].review.review_text,
                        parsed_reviews.user_reviews[index].review.review_time_friendly,
                        parsed_reviews.user_reviews[index].review.timestamp,
                        parsed_reviews.user_reviews[index].review.user.foodie_color,
                        parsed_reviews.user_reviews[index].review.user.foodie_level,
                        parsed_reviews.user_reviews[index].review.user.foodie_level_num,
                        parsed_reviews.user_reviews[index].review.user.name,
                        parsed_reviews.user_reviews[index].review.user.profile_deeplink,
                        parsed_reviews.user_reviews[index].review.user.profile_image,
                        parsed_reviews.user_reviews[index].review.user.profile_url,
                    ));
                }

                app.ReviewsView.init()
                app.DetailView.init()

                /************
                 //* PLEASE NOTE =====> THIS IS FOR BLOCKED URL @ AYANLE'S WORK
                        console.log('ERROR with API. Work-around initiated')
                        $.get('/scripts/sampleReviews.json')
                        .then(function(reviewsTestData){
                            console.log('RUNNING sampleReviews.json')
                            
                            for(index in reviewsTestData.user_reviews){
                                Reviews.all.push(new Reviews(
                                    reviewsTestData.user_reviews[index].review.comments_count,
                                    reviewsTestData.user_reviews[index].review.id,
                                    reviewsTestData.user_reviews[index].review.likes,
                                    reviewsTestData.user_reviews[index].review.rating,
                                    reviewsTestData.user_reviews[index].review.rating_color,
                                    reviewsTestData.user_reviews[index].review.rating_text,
                                    reviewsTestData.user_reviews[index].review.review_text,
                                    reviewsTestData.user_reviews[index].review.review_time_friendly,
                                    reviewsTestData.user_reviews[index].review.timestamp,
                                    reviewsTestData.user_reviews[index].review.user.foodie_color,
                                    reviewsTestData.user_reviews[index].review.user.foodie_level,
                                    reviewsTestData.user_reviews[index].review.user.foodie_level_num,
                                    reviewsTestData.user_reviews[index].review.user.name,
                                    reviewsTestData.user_reviews[index].review.user.profile_deeplink,
                                    reviewsTestData.user_reviews[index].review.user.profile_image,
                                    reviewsTestData.user_reviews[index].review.user.profile_url,
                                ));
                        }
                        
                        app.ReviewsView.init()
                        })
                        .catch(function(err){
                            console.log('FILE: ERROR with sampleReviews.json',err)
                        });
                ********/
            })
            .catch(function (err) {
                console.error(err)
            })
    }
    NearbyRes.faveIt = (id) => {
        console.log('line 260 of restaurants')
        var res_id = {
            id: id
        };
        for (index in NearbyRes.all) {
            if (id == NearbyRes.all[index].id) {
                NearbyRes.fave = NearbyRes.all[index];
                var u = JSON.parse(localStorage.loggedInUser)
                NearbyRes.fave.user_id = u.user_id;
                $.post('/faves', NearbyRes.fave)
                    .then(data => {
                        if (callback) callback();

                    });
            }
        }
    }
    NearbyRes.deletefaveIt = (id) => {
        $.ajax({
            url: '/faves/' + id,
            method: 'DELETE'
        })
            .then(data => {
                if (callback) callback();
            });
    }
    NearbyRes.getFaves = (callback, callback2) => {
        
        console.log('line 287 of restaurants')
        //TO DO: load faves by user
        $.get('/allfaves')
            .then(data => {
                // console.log('data',data)
                NearbyRes.user_favorites.push(data);
                // console.log('NearbyRes.user_favorites',NearbyRes.user_favorites)
                if (callback) callback();
                if (callback2) callback2();

            })
            .catch((err)=>{
                console.log(err)
            })
            ;
    }
    NearbyRes.deleteFaveArray = (id) => {
        for(var i=0;i<app.NearbyRes.user_favorites.length;i++){
            var resHolder = app.NearbyRes.user_favorites[i];
            for(var i=0; i<resHolder.length; i++){
    
                 if(id == resHolder[i].id){
                console.log(delete resHolder[i])
                }
            }
        }
    }
    Admin.checkUserStat = () => {
        if (localStorage.loggedInUser) {
            var localU = localStorage.getItem('loggedInUser')
            var u = JSON.parse(localU);
            if (u.loggedIn == true && u !== undefined) {


                setTimeout(function(){ 
                    $('#list-slot').find('.faver').show();
                    $('#detail-slot').find('.faver').show()
                }, 1000);
                $('li[data-nav_id="my-favorites"]').show()
                $('li[data-nav_id="login"]').hide()
                $('li[data-nav_id="admin"]').hide()
                $('li[data-nav_id="register"]').hide()
            }
            else {
                $('li[data-nav_id="my-favorites"]').hide()
                $('li[data-nav_id="login"]').show()
                $('li[data-nav_id="admin"]').show()
                $('li[data-nav_id="register"]').show()
            }
        }
        else{
            $('li[data-nav_id="my-favorites"]').hide()
            setTimeout(function(){ 
                $('#list-slot').find('.faver').hide();
                $('#detail-slot').find('.faver').hide()
        }, 1000);
        }
    }
    Admin.fetchUsers = (email,callback) => {
        $.ajax({
            url: '/users',
            method: 'get'
        })
            .then(data => {
                localStorage.setItem('users', JSON.stringify(data))
                for (var index in data) {
                    if (email == data[index].email) {
                        var loggedInUser = {
                            user_id: data[index].user_id,
                            email: data[index].email,
                            name: data[index].name,
                            password: data[index].password,
                            loggedIn: true
                        }
                        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser))
                    }
                }
                console.log('line 358')
            })
            .then(()=>{
                console.log('line 361')
                callback()
            })
            ;
    }
    Admin.fetchAboutUs = (callback) => {
        Admin.aboutUs = [];
        var url = '/scripts/about-us.json';
        $.get(url)
            .then(function(reviewsTestData){
            for(var index in reviewsTestData){
                var result = reviewsTestData[index];
                for(var i=0; i<result.length; i++){                  
                    Admin.aboutUs.push(result[i]);
                }
            }
        }).then(()=>{
            callback()
        })
    }

    module.Admin = Admin;
    module.NearbyRes = NearbyRes;
    module.UserLocation = UserLocation;
    module.Reviews = Reviews;

})(app)