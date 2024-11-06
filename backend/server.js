const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
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

// Modèle Utilisateur
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
        validate: {
            isEmail: true, // Valide que c'est un email
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true, // Vérifie que le champ n'est pas vide
        }
    },
}, {
    tableName: 'users', // Assurez-vous que le nom de la table correspond à celui de votre base de données
    timestamps: false, // Si votre table n'a pas de colonnes `createdAt` et `updatedAt`
});

// Route pour obtenir tous les utilisateurs
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Échec de la récupération des utilisateurs' });
    }
});

// Route pour créer un utilisateur avec hachage de mot de passe
app.post('/api/users', async (req, res) => {
    const { nom, prenom, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hachage du mot de passe
        const user = await User.create({ nom, prenom, email, password: hashedPassword });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Échec de la création de l’utilisateur' });
    }
});

// Route pour valider si l'utilisateur existe en vérifiant nom, prénom, email et mot de passe
app.post('/api/validate-user', async (req, res) => {
    const { nom, prenom, email, password } = req.body;
    try {
        const user = await User.findOne({
            where: {
                nom,
                prenom,
                email
            }
        });

        if (user) {
            // Comparaison du mot de passe haché
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (isPasswordValid) {
                return res.status(200).json({ exists: true });
            }
        }
        return res.status(200).json({ exists: false });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la vérification de l’existence de l’utilisateur' });
    }
});

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
