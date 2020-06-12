const bcrypt = require("bcryptjs")

const router = require("express").Router()

const Users = require("../users/user-models.js")

// endpoint /auth/ 
router.post('/register', async (req,res) => {
    let user = req.body   
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;
 
    try {
      const saved = await Users.add(user);
      res.status(201).json(saved);
    } catch(err) {
      console.log(err)
      res.status(500).json(err)
    }
 })

 // endpoint /auth/ 
router.post("/login", (req, res) => {
  const { usernmae, password } = req.body

  Users.findBy({ usernmae })
    .then(([user]) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = usernmae
        res.status(200).json({ message: `Welcome ${usernmae}`})
      } else {
        res.status(401).json({ message: "Invalid Login" })
      }
    }).catch(err => {
      res.status(500).json({ message: "Error logging in", err })
    }) 
})


// endpoint /auth/ 
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if(err) {
      res.send("Unable to logout")
    } else {
      res.send("You are now logged out")
    }
  }) 
})




module.exports = router;