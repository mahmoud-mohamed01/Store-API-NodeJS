import jwt from "jsonwebtoken";

async function isAuth(req, res, next) {
  let auhorizationHeader = req.get("Authorization");
  if (!auhorizationHeader) {
    return res.status(403).json({ message: "not Authenticated" });
  }

  let token = auhorizationHeader.split(" ")[1];

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "supersecret");
  } catch (error) {
    return res.status(400).json({ message: error });
  }

  req.userId = decodedToken.userId;
  req.userType = decodedToken.type;
  next();
}

export default isAuth;
