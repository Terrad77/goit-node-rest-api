// import { decode } from "jsonwebtoken";
import passport from "./passport.js";

export const authTokenUsePassport = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    req.user = user;
    // req.user = {
    //   id: decode.id,
    //   name: decode.name,
    // };
    next();
  })(req, res, next);
};

export default authTokenUsePassport;
