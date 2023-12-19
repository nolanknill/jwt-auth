# Installation

1. Update `/server/knexfile.js` with your database credentials.

2. Create a database called `jwt_auth`, or update `/server/knexfile.js` with the name of a newly created database of your choosing.

3. Open two terminals.

4. In first terminal, run:
    - `cd client`
    - `npm i`
    - `npm run dev`

5. In second terminal, run:
    - `cd server`
    - `npm i`
    - `npm run migrate`
    - `npm run dev`