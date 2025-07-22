import authSwagger from "./auth.swagger";
import userSwagger from "./user.swagger";
import adminSwagger from "./admin.swagger";
import courseSwagger from "./course.swagger";

const paths = {
  ...userSwagger,
  ...authSwagger,
  ...adminSwagger,
};

export default paths;
