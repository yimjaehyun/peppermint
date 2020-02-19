# peppermint
Mint alternative built using React, Material UI, Node, Express, MongoDB, Victory

<h2> Prerequisites </h2>
Add a .env file to your backend:

```
DB_CONNTECTION=<your connection string here>
PORT=<Port # here>
CLIENT_ID=<Plaid Client ID here>
PUBLIC_KEY=<Plaid public key here>
SECRET=<plaid SECRET here>
ENV=<sandbox or development>
JWT_SECRET=<your jwt secret here>
```
Add a .env file to your frontend:

```
REACT_APP_PUBLIC_KEY=<Plaid public key here>
REACT_APP_PLAID_ENV=<sandbox or development>
```

<h2> To run </h2>
run the frontend:

```
cd Frontend
npm start
```
in another terminal, run the backend:
```
cd Backend
nodemon server.js
```

