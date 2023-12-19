const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const knex = require("knex")(require("../knexfile"));

// ## POST /api/user/register
// - Creates a new user.
// - Expected body: { first_name, last_name, phone, address, email, password }
router.post("/register", async (req, res) => {
  const { first_name, last_name, phone, address, email, password } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).send("Please enter the required fields.");
  }

  // encrypt password
  const encrypted = bcrypt.hashSync(password);

  // Create the new user
  const newUser = {
    first_name,
    last_name,
    phone,
    address,
    email,
    password: encrypted,
  };

  // Insert it into our database
  try {
    await knex("users").insert(newUser);
    res.status(201).send("Registered!");
  } catch (e) {
    res.status(400).send("failed reg");
  }
});

// ## POST /api/user/login
// -   Generates and responds a JWT for the user to use for future authorization.
// -   Expected body: { email, password }
// -   Response format: { token: "JWT_TOKEN_HERE" }
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Please enter the required fields");
  }

  // find user (using the 'first' method)
  const user = await knex("users").where({ email }).first();

  if (!user) {
    return res.status(400).send("no user with that email");
  }

  // Validate the password
  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(400).send("Invalid password");
  }

  // Generate a token
  const token = jwt.sign({ email: user.email, id: user.id, jon: "is the best" }, process.env.JWT_SECRET);

  // send back to client
  res.json({ token });
});

// ## GET /api/user/current
// calls 'authorize' middleware
router.get("/current", authorize, async (req, res) => {
  // respond with the 'user' obj added in the 'authorize' fn
  res.json(req.user);
});

// -   Gets information about the currently logged in user.
// -   If no valid JWT is provided, will respond with 401 Unauthorized.
// -   Expected headers: { Authorization: "Bearer JWT_TOKEN_HERE" }
async function authorize(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).send("no auth");
  }

  // Parse out the bearer token
  const token = authorization.split(" ")[1];

  try {
    // verify the jwt.  
    // 'payload' will contain the payload encoded when the jwt was generated (signed) when we logged in.
    // If this part fails to verify, we end up in 'catch' block
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // get user (using 'first' again)
    const user = await knex("users").where({ id: payload.id }).first();

    // create a variable called 'userSansPW' that is,
    // the user without the 'password' property
    const { password, ...userSansPW } = user;

    // add to new prop on 'req' obj called 'user'
    req.user = userSansPW;

    // and go on to next fn in handler
    next();
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: e });
  }
}

module.exports = router;
