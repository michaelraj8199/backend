var express = require("express");
var router = express.Router();
var { dburl, MongoClient, mongodb } = require("../dbSchema");
var {
  hashPassword,
  hashCompare,
  createToken,
  verifyToken,
} = require("../auth1");
const { compare } = require("bcryptjs");
const { verify } = require("jsonwebtoken");

//signup;
router.post("/register", async (req, res) => {
  const client = await MongoClient.connect(dburl);
  try {
    console.log(req.body);

    let db = client.db("express-mongo");
    let user = db.collection("users").find({ email: req.body.email });

    if (user.length > 0) {
      res.json({
        statuscode: 400,
        message: "user already exits",
      });
    } else {
      let hashedPassword = await hashPassword(req.body.password);
      req.body.password = hashedPassword;
      let user = await db.collection("users").insertOne(req.body);
      console.log(user);
      return res.json({
        statuscode: 200,
        message: " users signup sucessful   ",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      statuscode: 500,
      message: "Internal server issue ",
    });

    {
    }
  } finally {
    client.close();
  }
});
//login; //
router.post("/login", async (req, res) => {
  const client = await MongoClient.connect(dburl);
  try {
    let db = await client.db("express-mongo");
    let user = await db.collection("users").findOne({ email: req.body.email });

    // if (user.length > 0)

    // {
    //   res.json({
    //     statuscode: 400,
    //     message: "user already exits",
    //   });
    // } else
    if (user) {
      console.log(user);
      let compare = await hashCompare(req.body.password, user.password);
      if (compare) {
        let token = await createToken(user.email, user.fisrtname, user.role);
        return res.json({
          statuscode: 200,
          role: user.role,
          fisrtname: user.fisrtname,
          email: user.email,
          token,
        });
      } else {
        return res.json({
          statuscode: 400,
          message: "invalid Password ",
        });
      }

      // let hashedPassword = await hashPassword(req.body.password);
      // req.body.password = hashedPassword;
      // let user = await db.collection("users").insertOne(req.body);
      // return res.json({
      //   statuscode: 200,
      //   message: " users signup sucessful   ",
      // });
    } else {
      return res.json({
        statuscode: 404,
        message: "user not found ",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      statuscode: 500,
      message: "Internal server issue ",
    });

    {
    }
  } finally {
    client.close();
  }
});

router.post("/auth", verifyToken, async (req, res) => {
  console.log("token", req.body.purpose);

  res.json({
    statuscode: 200,
    message: req.body.purpose,
  });
});

module.exports = router;
