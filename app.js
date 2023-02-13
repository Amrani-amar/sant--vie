


const express = require('express');
const path = require('path');

const app = express();

app.use(express.static('public'));

// Importation de la bibliothèque MySQL
var mysql = require('mysql');

// Définition du répertoire des vues
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(express.json())
// Utilisation du moteur de rendu EJS
app.set('view engine', 'ejs');

// Création d'une connexion à la base de données
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'cabinet'
});

// Connexion à la base de données
connection.connect(function(err) {
  if (err) {
    console.error('Erreur lors de la connexion à la base de données: ' + err.stack);
    return;
  }
  console.log('Connexion à la base de données réussie avec ID de connexion: ' + connection.threadId);
});

// Route pour le rendu de la page d'accueil
app.get('/', function(req, res) {

  let sql="select * from patients;";
 connection.query(sql, function (error, results, fields) {
    if (error) {
      console.log(error);

    
    } else { 
      const patients = results;
      res.render('index',{patients});
   
    }
     
    });
    
   
 
});
app.get('/patients', function(req, res) {
  res.render('bstr');
});

// Route pour ajouter un nouveau patient
app.post('/patients', function (req, res) {
  // Récupération des données envoyées par l'utilisateur
  let date = req.body.dateTime;
  let nom = req.body.nom;
  let prenom = req.body.prenom;
  let sexe = req.body.sexe;
  let age = req.body.age;
  let notes = req.body.notes;

  // Requête SQL pour ajouter un nouveau patient dans la base de données
  let sql = "INSERT INTO patients (date,nom, prenom, age, sexe,notes) VALUES (?,?,?,?,?,?)";
  let values = [date, nom, prenom, age, sexe, notes];

  // Exécution de la requête SQL
  connection.query(sql, values, function (error, results, fields) {
    if (error) {
      console.log(error);
      res.sendStatus(500);
    } else {
      console.log("Enregistrement réussi");
      res.redirect('/');
    }
  });
});

app.get('/delete/:id', function(req, res) {
  let sql = 'DELETE FROM patients WHERE id = ?';
  let values = [req.params.id];

  
  
  connection.query(sql, values, function(error, results, fields) {
  if (error) {
  console.log(error);
  res.sendStatus(500);
  } else {
  res.redirect('/');
  }
  });
  });

  // const tableau = document.getElementById('myChart').getContext('2d');
  // const myChart = new Chart(tableau, {
  //   type: 'line',
  //   data: {
  //     labels: [],
  //     datasets: [{
  //       label: 'Données en temps réel',
  //       data: [],
  //       backgroundColor: 'rgba(255, 99, 132, 0.2)',
  //       borderColor: 'rgba(255, 99, 132, 1)',
  //       borderWidth: 1
  //     }]
  //   },
  //   options: {
  //     scales: {
  //       yAxes: [{
  //         ticks: {
  //           beginAtZero: true
  //         }
  //       }]
  //     }
  //   }
  // });
  
  // var table = document.getElementById("table");
  // var cells = table.getElementsByTagName("td");
  // for (var i = 0; i < cells.length; i++) {
  //   myChart.data.labels.push(cells[i].innerHTML);
  //   myChart.data.datasets[0].data.push(cells[i].innerHTML);
  // }
  // myChart.update();
  






// Port d'écoute de l'application
const port = 3000;

// Démarrage de l'application
app.listen(port, () => console.log(`Notre application est démarrée sur http://localhost:${port}`));


