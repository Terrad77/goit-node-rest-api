import jwt from "jsonwebtoken";

export const authToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log({ authHeader });

  if (typeof authHeader === "undefined") {
    return res.status(401).send({ message: "Invalid token" });
  }
  const [bearer, token] = authHeader.split(" ", 2);

  console.log({ bearer, token });

  if (bearer !== "Bearer") {
    return res.status(401).send({ message: "Invalid token" });
  }

  jwt.verify(token, process.env.SECRET, (err, decode) => {
    if (err) {
      return res.status(401).send({ message: "Invalid token" });
    }

    console.log({ decode });

    req.user = {
      id: decode.id, // user._id
      email: decode.email, // user.email
    };
    next();
  });

  // passport.authenticate("jwt", { session: false }, (err, user) => {
  //   if (err || !user) {
  //     return res.status(401).json({ message: "Not authorized" });
  //   }
  //   req.user = user;
  //   next();
  // })(req, res, next);
};

export default authToken;
