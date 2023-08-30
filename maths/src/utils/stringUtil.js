const { isValidObjectId, Types } = require("mongoose");

const badWord =
  /crap|ugly|brat|fool|fuck|fucking|f\*cking|f\*ck|bitch|b\*tch|shit|sh\*t|fool|dumb|couch potato|arse|arsehole|asshole|\*ssh\*l\*|\*\*\*\*|c\*ck|\*\*\*\*sucker|c\*cks\*ck\*r|\*\*\*\*|c\*nt|dickhead|d\*c\*h\*a\*|\*\*\*\*|f\*c\*|\*\*\*\*wit|f\*ckw\*t|fuk|f\*k|fuking|f\*k\*ng|mother\*\*\*\*er|m\*th\*rf\*ck\*r|\*\*\*\*\*\*|n\*gg\*r|pussy|p\*ssy|\*\*\*\*|sh\*t|wanker|w\*nk\*r|wankers|w\*nk\*rs|whore|wh\*r\*|slag| sl\*g|\*\*\*\*\*|b\*tch|f u c k|f\*c\*|b.i.t.c.h|b\*tch|d-i-c-k|d\*\*\*/gi;

exports.replaceBadWords = (badTxt) => {
  if (badTxt && typeof badTxt === "string") {
    return badTxt.replaceAll(badWord, "****");
  }
  return badTxt;
};

exports.isValidObjectId = (objId) => {
  return isNaN(objId) && isValidObjectId(objId);
};

exports.convertToObjectId = (str) => {
  if (isValidObjectId(str)) {
    return new Types.ObjectId(str);
  }
  return null;
};
