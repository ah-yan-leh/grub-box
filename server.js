const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
const superagent = require('superagent');
const pg = require('pg');
const fs = require('fs');
// const conString = 'postgres://postgres:1234@localhost:5432/grub';
const conString = 'postgres://hryuwfriqtupwb:cf75445230798129c0d80c2b139243f2c1deae553f55b5f139d0c37ec7b5c696@ec2-50-19-126-219.compute-1.amazonaws.com:5432/d6370nnudbrrjd';

const client = new pg.Client(conString);

client.connect();

const PORT = process.env.PORT || 3000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('./public'));
app.use(cors())
app.get('/', (req, res) => {
  res.sendFile('index.html')
})
app.get('/api/v2.1/geocode', (req, res) => {
    const url = `https://developers.zomato.com/api/v2.1/geocode?lat=${req.query.latitude}&lon=${req.query.longitude}`;
    console.log('url for geo code',url)
    superagent.get(url)
      .set(`user-key`, `c432c4bb526c687aabed6e596d23735f`)
      .then(
        data => res.send(data.text),
        err => res.send(err)
      )
  })
//https://developers.zomato.com/api/v2.1/reviews?res_id=16726738&count=100
app.get('/api/v2.1/reviews', (req, res) => {
    const url = `https://developers.zomato.com/api/v2.1/reviews?res_id=${req.query.id}&count=100`;
    console.log('new url',url)
    superagent.get(url)
      .set(`user-key`, `c432c4bb526c687aabed6e596d23735f`)
      .then(
        data => res.send(data.text),
        err => res.send(err)
      )
  })

  app.get('/users', (request, response) => {

    client.query('SELECT * FROM users;')
      .then(function(result) {
        response.send(result.rows);
      })
      .catch(function(err) {
        console.error(err)
      })
  });

  app.post('/user', (request, response) => {

    client.query(
      `INSERT INTO
      users(name, email, password)
      VALUES ($1, $2, $3);
      `,
      [
        request.body.name,
        request.body.email,
        request.body.password
      ]
    )
      .then(function() {
        response.send('insert complete')
      })
      .catch(function(err) {
        console.error(err);
      });
  });

  app.post('/faves', (request, response) => {

    client.query(
      `INSERT INTO
      faveRestaurants(
        average_cost_for_two,
        cuisines,
        featured_image,
        has_online_delivery,
        has_table_booking,
        id,
        address,
        city,
        locality,
        locality_verbose,
        longitude,
        latitude,
        zipcode,
        menu_url,
        name,
        photos_url,
        price_range,
        aggregate_rating,
        rating_color,
        rating_text,
        votes,
        user_id
      )
      VALUES ($1, $2, $3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22);
      `,
      [
        request.body.average_cost_for_two,
        request.body.cuisines,
        request.body.featured_image,
        request.body.has_online_delivery,
        request.body.has_table_booking,
        request.body.id,
        request.body.address,
        request.body.city,
        request.body.locality,
        request.body.locality_verbose,
        request.body.longitude,
        request.body.latitude,
        request.body.zipcode,
        request.body.menu_url,
        request.body.name,
        request.body.photos_url,
        request.body.price_range,
        request.body.aggregate_rating,
        request.body.rating_color,
        request.body.rating_text,
        request.body.votes,
        request.body.user_id
      ]
    )
      .then(function(result) {
        response.send(result.rows)
      })
      .catch(function(err) {
        console.error(err);
      });
  });
app.get('/allfaves', (request, response) => {

  client.query('SELECT * FROM faveRestaurants;')
    .then(function(result) {
      response.send(result.rows);
    })
    .catch(function(err) {
      console.error(err)
    })
});
  
app.get('/faves/:id', (request, response) => {

client.query(
    `SELECT * FROM faveRestaurants WHERE fave_id=$1;`,
    [request.params.id]
)
    .then(function(result) {
    response.send(result.rows);
    })
    .catch(err => {
    console.error(err);
    });
});
app.delete('/faves/:id', (request, response) => {
    client.query(
      `DELETE FROM faveRestaurants WHERE fave_id=$1;`,
      [request.params.id]
    )
      .then(() => {
        response.send('Delete complete')
      })
      .catch(err => {
        console.error(err);
      });
  });
app.get('/*', cors(),(request, response) => {
    response.sendFile('index.html', { root: './public' });
})
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

loadDB();

/////database loader //////
function loadUsers() {
  client.query('SELECT COUNT(*) FROM users')
    .then(result => {
      if(!parseInt(result.rows[0].count)) {
        fs.readFile('./public/scripts/sample_users.json', 'utf8', (err, fd) => {
          JSON.parse(fd).forEach(ele => {
            client.query(`
              INSERT INTO
              users(name, email, password)
              VALUES ($1, $2, $3);
            `,
              [ele.name, ele.email, ele.password]
            )
          })
        })
      }
    })
}

function loadDB() {
  client.query(`
    CREATE TABLE IF NOT EXISTS users (
      user_id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL);`
  )
    .then(() => {
      loadUsers();
    })
    .catch(err => {
      console.error(err);
    });
    client.query(`
      CREATE TABLE IF NOT EXISTS faveRestaurants (
        fave_id SERIAL PRIMARY KEY,
        average_cost_for_two VARCHAR(255) NOT NULL,
        cuisines VARCHAR(255) NOT NULL,
        featured_image VARCHAR(255) NOT NULL,
        has_online_delivery VARCHAR(255) NOT NULL,
        has_table_booking VARCHAR(255) NOT NULL,
        id VARCHAR(20) NOT NULL,
        address VARCHAR(255) NOT NULL,
        city VARCHAR(255) NOT NULL,
        locality VARCHAR(50) NOT NULL,
        locality_verbose VARCHAR(50) NOT NULL,
        longitude VARCHAR(20) NOT NULL,
        latitude VARCHAR(20) NOT NULL,
        zipcode VARCHAR(20) NOT NULL,
        menu_url VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        photos_url VARCHAR(255) NOT NULL,
        price_range VARCHAR(20) NOT NULL,
        aggregate_rating VARCHAR(20) NOT NULL,
        rating_color VARCHAR(20) NOT NULL,
        rating_text VARCHAR(20) NOT NULL,
        votes VARCHAR(20) NOT NULL,
        user_id  VARCHAR(20) NOT NULL 
    );`
    )
      .then(() => {
        //console.log('success')
      })
      .catch(err => {
        console.error(err);
      });
}
