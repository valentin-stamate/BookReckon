import {User} from "../interface/interfaces";
import {ResponseError} from "../middleware/middleware";
import {ResponseMessage, StatusCode} from "../const/const";
import {JwtService} from "./jwt.service";
import {Mop} from "../mop/mop";
import {PrismaClient} from '@prisma/client'

export class UserService {

    private static prismaClient = new PrismaClient();

    static async createUser(user: User) {
        if (user.genres != null) {
            user.genres = {
                create: user.genres,
            } as any;
        }

        if (user.sentiments != null) {
            user.sentiments = {
                create: user.sentiments,
            } as any;
        }

        await this.prismaClient.user.create({
            data: user as any,
        });
    }

    static async getUserInfo(id: number): Promise<any> {
        Mop.startCall("The monitor for getUser method from UserService is called with: " + id);

        const result = await this.prismaClient.user.findFirst({
            where: {
                id: id,
            },
            include: {
                sentiments: true,
                genres: true,
            },
        }) as User;

        if (result == null) {
            throw new ResponseError(ResponseMessage.NOT_FOUND, StatusCode.NOT_FOUND);
        }

        result.password = '';

        Mop.endCall(result);
        return result;
    }

    static async loginUser(user: User) {
        Mop.startCall("The monitor for loginUser method from UserService is called with: " + user);
        if (user.username == null || user.password == null) {
            throw new ResponseError(ResponseMessage.INVALID_CREDENTIALS, StatusCode.BAD_REQUEST);
        }

        const userModel: User | null = await this.prismaClient.user.findFirst({
            where: {
                username: user.username,
            }
        });

        Mop.endCall(userModel);

        if (userModel == null) {
            throw new ResponseError(ResponseMessage.NOT_FOUND, StatusCode.NOT_FOUND);
        }

        return JwtService.generateAccessTokenForStudent(userModel);
    }

    static async signupUser(user: User) {
        Mop.startCall("The monitor for signupUser method from UserService is called with: " + user);
        if (user.username == null || user.email == null || user.password == null) {
            throw new ResponseError(ResponseMessage.COMPLETE_ALL_FIELDS, StatusCode.BAD_REQUEST);
        }

        const existingUser = await this.prismaClient.user.findFirst({
            where: {
                OR: [
                    {
                        username: user.username,
                    },
                    {
                        email: user.email,
                    }
                ]
            }
        });

        if (existingUser != null) {
            throw new ResponseError(ResponseMessage.USER_ALREADY_EXISTS, StatusCode.BAD_REQUEST);
        }

        const newUser = {
            username: user.username,
            email: user.email,
            password: user.password,
        };

        await this.prismaClient.user.create({
            data: {
                username: user.username,
                email: user.email,
                password: user.password,
            },
        });

        Mop.endCall(newUser);

        return JwtService.generateAccessTokenForStudent(newUser as User);
    }

    static async updatePreferences(userId: number, genres: string[], sentiments: string[]) {
        await this.prismaClient.genrePreference.deleteMany({
            where: {
                userId: userId,
            }
        });

        await this.prismaClient.sentimentPreference.deleteMany({
            where: {
                userId: userId,
            }
        });

        const user = await this.prismaClient.user.findFirst({
            where: {
                id: userId,
            }
        });

        if (user == null) {
            throw new ResponseError(ResponseMessage.NOT_FOUND, StatusCode.NOT_FOUND);
        }

        await this.prismaClient.genrePreference.createMany({
            data: genres.map(item => {
                return {
                    name: item,
                    userId: user.id,
                }
            })
        });

        await this.prismaClient.sentimentPreference.createMany({
            data: sentiments.map(item => {
                return {
                    name: item,
                    userId: user.id,
                }
            })
        });
    }

}