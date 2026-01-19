# Mishwar - Plateforme de Talents Créatifs

## 🌍 À propos du projet

Mishwar est une plateforme intelligente qui connecte les entreprises aux talents créatifs locaux dans le monde arabe. La plateforme offre un environnement organisé et fiable pour rechercher et collaborer avec des talents créatifs.

## ✨ Fonctionnalités principales

1. **Matching intelligent** - Système de matching automatique entre entreprises et talents
2. **Portfolios créatifs** - Portfolio complet pour chaque talent créatif
3. **Système de recommandations** - Recommandations basées sur les évaluations et performances
4. **Espace de collaboration** - Gestion de projets, chat et partage de fichiers
5. **Ressources & Formation** - Tutoriels et guides pour améliorer les compétences

## 🛠️ Technologies utilisées

- **HTML5** - Structure des pages
- **CSS3** - Design et style
- **Bootstrap 5** - Framework CSS
- **JavaScript (Vanilla)** - Fonctionnalités interactives
- **Node.js & Express** - Serveur et API
- **SQLite** - Base de données

## 🚀 Installation et démarrage

### Prérequis

- Node.js 14+ 
- npm ou yarn

### Étapes d'installation

1. **Installer les dépendances**
```bash
npm install
```

2. **Créer le fichier d'environnement**
```bash
# Créer le fichier .env
echo "PORT=3000" > .env
echo "JWT_SECRET=your-secret-key-here" >> .env
```

3. **Démarrer le serveur**
```bash
npm start
```

Ou pour le développement avec rechargement automatique :
```bash
npm run dev
```

4. **Ouvrir le navigateur**
Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur

## 📁 هيكل المشروع

```
Mishwar/
├── index.html              # الصفحة الرئيسية
├── search.html             # صفحة البحث
├── dashboard.html          # لوحة التحكم
├── projects.html           # صفحة المشاريع
├── auth/                   # صفحات المصادقة
│   ├── login.html
│   └── register.html
├── assets/
│   ├── css/
│   │   └── style.css       # التنسيقات المخصصة
│   └── js/
│       ├── main.js         # الملف الرئيسي
│       ├── search.js        # وظائف البحث
│       ├── register.js      # وظائف التسجيل
│       ├── login.js         # وظائف تسجيل الدخول
│       ├── dashboard.js    # وظائف لوحة التحكم
│       └── projects.js     # وظائف المشاريع
├── server.js               # خادم Express
└── package.json            # ملف المشروع
```

## 🔐 Types d'utilisateurs

- **Entreprises (COMPANY)** - Peuvent rechercher des talents et créer des projets
- **Talents créatifs (FREELANCE)** - Peuvent gérer leur portfolio et accepter des projets

## 📝 Points d'API

### Authentification
- `POST /api/auth/register` - Créer un compte
- `POST /api/auth/login` - Se connecter

### Talents
- `GET /api/freelances` - Liste des talents
- `GET /api/freelances/search` - Rechercher des talents

### Projets
- `GET /api/projects` - Liste des projets
- `POST /api/projects` - Créer un nouveau projet

## 🌐 Pages disponibles

- `/` - Page d'accueil
- `/search.html` - Rechercher des talents
- `/auth/login.html` - Connexion
- `/auth/register.html` - Créer un compte
- `/dashboard.html` - Tableau de bord
- `/projects.html` - Projets

## 📝 Notes

- La base de données SQLite est créée automatiquement au premier démarrage
- Assurez-vous de changer `JWT_SECRET` dans le fichier `.env` en production
- Vous pouvez utiliser Prisma Studio ou un outil similaire pour gérer la base de données

## 📄 Licence

MIT
# Mishwar
https://cxl-gif.github.io/Mishwar/

