import { DataStoredInToken, TokenData } from '@modules/auth';
import UserSchema from './users.model'
import RegisterDto from './dtos/register.dto';
import { isEmptyObject } from '@core/utils';
import { HttpException } from '@core/exceptions';
import gravatar from 'gravatar';
import bcryptjs from 'bcryptjs'
import IUser from './users.interface';
import jwt from 'jsonwebtoken';
import { parse } from 'dotenv';
import { IPagination } from '@core/interface';
class UserService {
    public UserSchema = UserSchema;

    public async createUser(model: RegisterDto): Promise<TokenData> {
        if (isEmptyObject(model)) {
            throw new HttpException(400, 'Model is empty');
        }
        const user = await this.UserSchema.findOne({ email: model.email }).exec();
        if (user) {
            throw new HttpException(409, `Your email ${user.email} already exists.`);
        }
        const avatar = gravatar.url(model.email!, {
            size: '200',
            rating: 'g',
            default: 'mm'
        });
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(model.password!, salt);
        const createdUser: IUser = await this.UserSchema.create({
            ...model,
            password: hashedPassword,
            avatar: avatar,
            date: Date.now()
        });
        return this.createToken(createdUser);

    }

    public async updateUser(userId: string, model: RegisterDto): Promise<IUser> {
        if (isEmptyObject(model)) {
            throw new HttpException(400, 'Model is empty');
        }
        const user = await this.UserSchema.findById({ _id: userId }).exec();
        if (!user) {
            throw new HttpException(400, `User id is not exists.`);
        }

        // if (user.email === model.email) {
        //     throw new HttpException(400, `You must using the different email`);
        // }
        let updateUserById: IUser;
        if (user.password) {
            const salt = await bcryptjs.genSalt(10);
            const hashedPassword = await bcryptjs.hash(model.password!, salt);
            updateUserById = await this.UserSchema.findByIdAndUpdate(userId, {
                ...model,
                password: hashedPassword
            }).exec() as IUser;
        }
        else {
            updateUserById = await this.UserSchema.findByIdAndUpdate(userId, {
                ...model,
            }).exec() as IUser;
        }
        if (!updateUserById) throw new HttpException(409, 'You are not allowed to update');
        return updateUserById;
    }

    public async getUserById(userId: string): Promise<IUser> {
        const user = await this.UserSchema.findById({ _id: userId }).exec();
        if (!user) {
            throw new HttpException(404, `User is not exists.`);
        }
        return user;
    }

    public async getAll(): Promise<Array<IUser>> {
        const user: Array<IUser> = await this.UserSchema.find().exec();
        return user;
    }

    public async getAllPaging(keyword: string, page: number): Promise<IPagination<IUser>> {
        const pageSize: number = Number(process.env.PAGE_SIZE) || 10;
        let query;
        if (keyword) {
            query = this.UserSchema.find({
                $or: [
                    { email: keyword },
                    { frist_name: keyword },
                    { last_name: keyword }
                ],
            }).sort({ date: -1 });
        }
        else {
            query = this.UserSchema.find().sort({ date: -1 })
        }

        // Use the query for the users query
        const users: Array<IUser> = await query.skip((page - 1) * pageSize).limit(pageSize).exec();

        // Create a new query instance for the count operation
        const countQuery = keyword ? this.UserSchema.countDocuments({
            $or: [
                { email: keyword },
                { frist_name: keyword },
                { last_name: keyword }
            ],
        }) : this.UserSchema.countDocuments();

        // Use the countQuery instance for the count operation
        const rowCount: number = await countQuery.exec();

        return {
            total: rowCount,
            page: page,
            pageSize: pageSize,
            items: users,
        } as IPagination<IUser>
    }
    private createToken(user: IUser): TokenData {
        const dataInToken: DataStoredInToken = { id: user._id };
        const secret: string = process.env.JWT_TOKEN_SECRET!;
        const exporesIn: number = 3600;
        return {
            token: jwt.sign(dataInToken, secret, { expiresIn: exporesIn })
        }
    }
}

export default UserService;