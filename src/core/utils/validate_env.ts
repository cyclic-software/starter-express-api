import { cleanEnv, num, str } from "envalid"

const validateEnv = () => {
    cleanEnv(process.env, {
        NODE_ENV: str(),
        MONGODB_URI: str(),
        JWT_TOKEN_SECRET: str(),
        PAGE_SIZE: num(),
    })
}
export default validateEnv;