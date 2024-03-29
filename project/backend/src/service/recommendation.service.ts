import {Book} from "../interface/interfaces";
import {PrismaClient} from "@prisma/client";
import axios from "axios";


export class RecommendationService {
    private static prismaClient = new PrismaClient();

    public static async getRecommendations(userId: number): Promise<Book[]> {
        const result = (await axios.post('http://localhost:8080/api/user_recommendation', {
            id: userId,
        })).data;

        return result as Book[];
    }
    public static async getBaseRecommendation(keywords: string[]): Promise<Book[]> {
        const searchByGenre = keywords.map(item => {
            return {
                genre: item,
            }
        });

        const searchByDescription = keywords.map(item => {
            return {
                description: {
                    contains: item,
                }
            }
        });

        return await this.prismaClient.book.findMany({
            where: {
                OR: searchByGenre.concat(searchByDescription as any),
            }
        });
    }

    public static async getBooksRecommendationsBasedOkBooks(bookId: number): Promise<Book[]> {
        const result = (await axios.post('http://localhost:8080/api/recommendation', {
            id: bookId,
        })).data;

        return result as Book[];
    }

}