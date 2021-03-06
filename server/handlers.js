const request = require("request-promise");

const { v4: uuidv4 } = require("uuid");

const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "./.env" });
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const checkUser = async (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;

  const client = new MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db("food");
    const findUser = await db
      .collection("users")
      .findOne({ userName: userName, password: password });
    if (findUser) {
      res.status(200).json({ status: 200, data: findUser });
    } else {
      res
        .status(400)
        .json({ status: 400, message: "username or password is incorrect" });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: "unknown error" });
  } finally {
    client.close();
  }
};

const getUser = async (req, res) => {
  const userName = req.body.userName;

  const client = new MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db("food");
    const findUser = await db
      .collection("users")
      .findOne({ userName: userName });
    if (findUser) {
      res.status(200).json({ status: 200, data: findUser });
    } else {
      res.status(400).json({ status: 400, message: "username is incorrect" });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: "unknown error" });
  } finally {
    client.close();
  }
};

const addUser = async (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;
  const repeatPassword = req.body.repeatPassword;
  const email = req.body.email;
  const mailformat =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!email.match(mailformat)) {
    return res.status(400).json({
      status: 400,
      message: "Your email doest not match the email format",
    });
  }
  if (password !== repeatPassword) {
    return res
      .status(400)
      .json({ status: 400, message: "check your password" });
  }
  const client = new MongoClient(MONGO_URI, options);
  const _id = uuidv4();
  const body = {
    _id: _id,
    userName: userName,
    password: password,
    email: email,
    restaurants: [],
    receipes: [],
  };

  try {
    await client.connect();
    const db = client.db("food");
    const addUser = await db.collection("users").insertOne(body);
    if (addUser) {
      res.status(200).json({ status: 200, data: addUser });
    } else {
      res.status(400).json({ status: 400, message: "err adding user" });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: "unknown error" });
  } finally {
    client.close();
  }
};

const addRestaurantToUser = async (req, res) => {
  const userName = req.body.userName;
  const restaurant = req.body.restaurant;
  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("food");
    const findUser = await db
      .collection("users")
      .findOne({ userName: userName });
    if (findUser) {
      // { $push: { scores: { $each: [ 90, 92, 85 ] } } }
      const updateUser = await db.collection("users").updateOne(
        { userName: userName },
        {
          $push: {
            restaurants: {
              $each: [restaurant],
            },
          },
        }
      );
      if (updateUser) {
        res.status(200).json({ status: 200, data: updateUser });
      } else {
        res.status(400).json({ status: 400, message: "err update user" });
      }
    } else {
      res.status(400).json({ status: 400, message: "err finding user" });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: "unknown error" });
  } finally {
    client.close();
  }
};

const removeRestaurantFromUser = async (req, res) => {
  const userName = req.body.userName;
  const name = req.body.name;

  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("food");
    const findUser = await db
      .collection("users")
      .findOne({ userName: userName });
    if (findUser) {
      // { $push: { scores: { $each: [ 90, 92, 85 ] } } }
      const updateUser = await db.collection("users").updateOne(
        { userName: userName },
        {
          $pull: {
            restaurants: {
              name: name,
            },
          },
        }
      );
      if (updateUser) {
        res.status(200).json({ status: 200, data: updateUser });
      } else {
        res.status(400).json({ status: 400, message: "err update user" });
      }
    } else {
      res.status(400).json({ status: 400, message: "err finding user" });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: "unknown error" });
  } finally {
    client.close();
  }
};

const addReceipeToUser = async (req, res) => {
  const userName = req.body.userName;
  const receipe = req.body.receipe;
  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("food");
    const findUser = await db
      .collection("users")
      .findOne({ userName: userName });
    if (findUser) {
      // { $push: { scores: { $each: [ 90, 92, 85 ] } } }
      const updateUser = await db.collection("users").updateOne(
        { userName: userName },
        {
          $push: {
            receipes: {
              $each: [receipe],
            },
          },
        }
      );
      if (updateUser) {
        res.status(200).json({ status: 200, data: updateUser });
      } else {
        res.status(400).json({ status: 400, message: "err update user" });
      }
    } else {
      res.status(400).json({ status: 400, message: "err finding user" });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: "unknown error" });
  } finally {
    client.close();
  }
};

const removeReceipeFromUser = async (req, res) => {
  const userName = req.body.userName;
  const label = req.body.label;
  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("food");
    const findUser = await db
      .collection("users")
      .findOne({ userName: userName });
    if (findUser) {
      const updateUser = await db.collection("users").updateOne(
        { userName: userName },
        {
          $pull: {
            receipes: {
              label: label,
            },
          },
        }
      );
      if (updateUser) {
        res.status(200).json({ status: 200, data: updateUser });
      } else {
        res.status(400).json({ status: 400, message: "err update user" });
      }
    } else {
      res.status(400).json({ status: 400, message: "err finding user" });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: "unknown error" });
  } finally {
    client.close();
  }
};

const getReceipe = async (req, res) => {
  const receipeId = req.params.receipeId;
  let url = `https://api.edamam.com/api/recipes/v2/${receipeId}?type=public&app_id=10880cda&app_key=e35c7e28e89152af9ab4b7a40d2d7344`;
  const options = {
    method: "GET",
    url: url,
    headers: {
      Accept: "application/json",
    },
    json: true,
  };

  try {
    const result = await request(options);
    if (result) {
      res.status(200).json({ status: "200", data: result });
    } else {
      res.status(400).json({ status: 400, message: "err getting receipe" });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: "unknown error" });
  }
};

const getReceipes = async (req, res) => {
  const ingredient = req.params.ingredient;
  const diet = req.body.diet;
  const dishType = req.body.dishType;
  const mealType = req.body.mealType;
  const cuisineType = req.body.cuisineType;
  const allergies = req.body.allergies;
  const caloriesFrom = req.body.caloriesFrom;
  const caloriesTo = req.body.caloriesTo;
  const IngredientsUpTo = req.body.ingredientsUpTo;

  let url = `https://api.edamam.com/api/recipes/v2?type=public&q=${ingredient}&app_id=10880cda&app_key=e35c7e28e89152af9ab4b7a40d2d7344`;

  if (diet) {
    diet.forEach((element) => {
      url += `&diet=${element}`;
    });
  }
  if (dishType) {
    dishType.forEach((element) => {
      url += `&dishType=${element}`;
    });
  }
  if (mealType) {
    mealType.forEach((element) => {
      url += `&mealType=${element}`;
    });
  }
  if (cuisineType) {
    cuisineType.forEach((element) => {
      url += `&cuisineType=${element}`;
    });
  }
  if (allergies) {
    allergies.forEach((element) => {
      url += `&excluded=${element}`;
    });
  }
  if (caloriesFrom && caloriesTo) {
    url += `&calories=${caloriesFrom}-${caloriesTo}`;
  }
  if (caloriesFrom && !caloriesTo) {
    url += `&calories=${caloriesFrom}%2B`;
  }
  if (caloriesTo && !caloriesFrom) {
    url += `&calories=${caloriesTo}`;
  }
  if (IngredientsUpTo) {
    url += `&ingr=${IngredientsUpTo}`;
  }

  const options = {
    method: "GET",
    url: url,
    headers: {
      Accept: "application/json",
    },
    json: true,
  };

  try {
    const result = await request(options);
    if (result.hits.length > 0) {
      res.status(200).json({ status: "200", data: result });
    } else {
      res.status(400).json({ status: 400, message: "err getting receipe" });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: "unknown error" });
  }
};

const getIngredients = async (req, res) => {
  const ingredient = req.params.ingredient;

  let url = `https://api.edamam.com/auto-complete?app_id=444091a5&app_key=a560be6d6962c1c6f62f88facbd86504&q=${ingredient}`;
  const options = {
    method: "GET",
    url: url,
    headers: {
      Accept: "application/json",
    },
    json: true,
  };

  try {
    const result = await request(options);
    if (result.length > 0) {
      res.status(200).json({ status: "200", data: result });
    } else {
      res.status(400).json({ status: 400, message: "err getting receipe" });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: "unknown error" });
  }
};

const getLocations = async (req, res) => {
  const location = req.params.location;

  let url = "https://travel-advisor.p.rapidapi.com/locations/v2/auto-complete";

  const options = {
    method: "GET",
    url: url,
    qs: { query: `${location}`, lang: "en_US", units: "km" },
    headers: {
      "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
      "X-RapidAPI-Key": "25c748514emsh2c3de03a1abb44ap14639fjsn411cd9e23f93",
    },
    json: true,
  };

  try {
    const result = await request(options);
    if (result) {
      res.status(200).json({ status: "200", data: result.data });
    } else {
      res.status(400).json({ status: 400, message: "err getting locations" });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: "unknown error" });
  }
};

const getRestaurants = async (req, res) => {
  const locationId = req.params.locationId;

  let url = "https://travel-advisor.p.rapidapi.com/restaurants/list";

  const options = {
    method: "GET",
    url: url,
    qs: {
      location_id: `${locationId}`,
      currency: "CAD",
      lunit: "km",
      limit: "30",
      open_now: "false",
      lang: "en_US",
    },
    headers: {
      "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
      "X-RapidAPI-Key": "25c748514emsh2c3de03a1abb44ap14639fjsn411cd9e23f93",
    },
    json: true,
  };

  try {
    const result = await request(options);
    if (result) {
      res.status(200).json({ status: "200", data: result.data });
    } else {
      res.status(400).json({ status: 400, message: "err getting locations" });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: "unknown error" });
  }
};

const getRestaurant = async (req, res) => {
  const locationId = req.params.locationId;

  let url = "https://travel-advisor.p.rapidapi.com/restaurants/get-details";

  const options = {
    method: "GET",
    url: url,
    qs: {
      location_id: `${locationId}`,
      currency: "CAD",
      lang: "en_US",
    },
    headers: {
      "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
      "X-RapidAPI-Key": "25c748514emsh2c3de03a1abb44ap14639fjsn411cd9e23f93",
    },
    json: true,
  };

  try {
    const result = await request(options);
    if (result) {
      res.status(200).json({ status: "200", data: result });
    } else {
      res.status(400).json({ status: 400, message: "err getting locations" });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: "unknown error" });
  }
};

module.exports = {
  getReceipes,
  getIngredients,
  getLocations,
  getRestaurants,
  getRestaurant,
  checkUser,
  addUser,
  addRestaurantToUser,
  removeRestaurantFromUser,
  getUser,
  addReceipeToUser,
  removeReceipeFromUser,
  getReceipe,
};
