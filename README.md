# 🛒 API Interna de Sincronización de Productos

Este repositorio contiene un sistema backend con autenticación de usuarios y sincronización de productos desde un marketplace externo simulado.

## 📁 Estructura del Proyecto

```
├── controllers
│   ├── auth.controller.js
│   └── product.controller.js
├── middlewares
│   └── validateRequest.js
├── models
│   ├── index.js
│   ├── Product.js
│   ├── ProductMarketplaceData.js
│   ├── ProductInternalData.js
│   └── Users.js
├── routes
│   ├── auth.routes.js
│   └── products.routes.js
├── schemas
│   ├── loginSchema.js
│   └── registerSchema.js
├── config
│   ├── db.js
│   └── config.js
├── seeders.js
├── .env
├── index.js
├── README.md
└── package.json
```

---

## 🚀 Cómo ejecutar el proyecto

### 1. Clona el repositorio

```bash
git clone https://github.com/susanaromero8/marketsync-back.git
cd marketsync-back
```

### 2. Instala las dependencias

```bash
npm install
```

### 3. Configura las variables de entorno

Edita el archivo `.env` con tu configuración:

```
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=marketplace_db
DB_DIALECT=postgres
SECRET_JWT_KEY=clave_super_secreta
NODE_ENV=development
```

### 4. Inicializa la base de datos

```bash
npx sequelize-cli db:create
npx sequelize-cli db:migrate
```

### 5. Ejecuta el seeder (opcional, para datos de prueba)

```bash
node src/seeder.js
```

Esto insertará productos de prueba en la base de datos que puedes consultar a través de los endpoints.

### 6. Ejecuta el servidor

```bash
npm run dev
```

El servidor estará corriendo en `http://localhost:3000`.

---

## 🧪 Endpoints disponibles

### 🔐 Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/refresh`
- `GET /api/auth/protected`

### 🏩 Productos (requieren token)

- `GET /api/products/sync`: sincroniza productos desde el marketplace externo y retorna la data de productos actualizada
- `GET /api/products/:id`: trae información local y externa de un producto
- `PUT /api/products/update-marketplace`: actualiza datos en el marketplace externo

---

## 🛠️ Stack

- **Node.js** + **Express**
- **Sequelize** + **PostgreSQL**
- **JWT** para autenticación
- **Zod** para validación
- **Axios** para comunicación con el mock externo
