const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connexion à la base de données MySQL avec les variables d'environnement
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_CONNECTION,
});

// Vérifiez la connexion
sequelize.authenticate()
    .then(() => console.log('La connexion à MySQL a été établie avec succès.'))
    .catch(err => console.error('Impossible de se connecter à la base de données :', err));

// Exemple de modèle Utilisateur, il doit correspondre à votre table existante
const User = sequelize.define('User', {
    nom: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    prenom: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'users', // Assurez-vous que le nom de la table correspond à celui de votre base de données
    timestamps: false, // Si votre table n'a pas de colonnes `createdAt` et `updatedAt`
});

// Routes API
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Échec de la récupération des utilisateurs' });
    }
});

app.post('/api/users', async (req, res) => {
    const { nom, prenom, email, password } = req.body;
    try {
        const user = await User.create({ nom, prenom, email, password });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Échec de la création de l’utilisateur' });
    }
});

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
