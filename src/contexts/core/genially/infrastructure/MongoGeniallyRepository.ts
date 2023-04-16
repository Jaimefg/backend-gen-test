import Genially from "../domain/Genially";
import GeniallyRepository from "../domain/GeniallyRepository";
import {MongoClient, ServerApiVersion} from "mongodb";

//-----------------------//
//This should be configured as env variables or an external configuration, created here for simplicity in this test
const dbConfig = {
    dbUser: "user1",
    dbPassword: "user1Pass",
    //connectionString: "mongodb+srv://<mongouser>:<password>@geniallycluster.oqc3yul.mongodb.net/?retryWrites=true&w=majority"
    connectionString: "mongodb://user:pass@localhost:27017/?authMechanism=DEFAULT"
};

export default class MongoGeniallyRepository implements GeniallyRepository {
    private static client: MongoClient;
    private DB_INFO = {
        DB_NAME: {
            genially: "genially",
        },
        DB_COLLECTIONS: {
            geniallys: "geniallys",
            analytics: "analytics"
        }
    }
    constructor() {
        const connectionString = dbConfig.connectionString
            .replace("<password>", dbConfig.dbPassword)
            .replace("<mongouser>", dbConfig.dbUser);

        if(!MongoGeniallyRepository.client) {
            MongoGeniallyRepository.client = new MongoClient(connectionString, { serverApi: ServerApiVersion.v1, monitorCommands: true });
            MongoGeniallyRepository.client.connect();
        }
    }


    async save(genially: Genially): Promise<void> {
        await MongoGeniallyRepository.client.connect();
        await this.delete(genially.id);
        const collection = MongoGeniallyRepository.client.db(this.DB_INFO.DB_NAME.genially).collection<Genially>(this.DB_INFO.DB_COLLECTIONS.geniallys);
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        await collection.insertOne(genially);
    }

    async find(id: string): Promise<Genially> {
        try {
            await MongoGeniallyRepository.client.connect();
            const collection = MongoGeniallyRepository.client.db(this.DB_INFO.DB_NAME.genially).collection(this.DB_INFO.DB_COLLECTIONS.geniallys);
            const query = { _id: id };
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            const item = await collection.findOne(query, {});
            return item ? new Genially(item._id.toString(), item._name, item._description).fromObject(item) : null;
        } catch (e) {
            //Error should be logged
            return null;
        }
    }

    async search(page: number, size: number): Promise<Genially[]> {
        try {
            //Connect and get collection
            await MongoGeniallyRepository.client.connect();
            const collection = MongoGeniallyRepository.client.db(this.DB_INFO.DB_NAME.genially).collection(this.DB_INFO.DB_COLLECTIONS.geniallys);
            // DB operation
            const cursor = collection.find({}).limit(size).skip(page*size);
            const allItems = await cursor.toArray();
            //Cast result to expected response
            return allItems.map((g) => new Genially(g._id.toString(), g._name, g._description).fromObject(g));
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    async delete(id: string): Promise<void> {
        await MongoGeniallyRepository.client.connect();
        const collection = MongoGeniallyRepository.client.db(this.DB_INFO.DB_NAME.genially).collection<Genially>(this.DB_INFO.DB_COLLECTIONS.geniallys);
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        await collection.deleteOne({ _id: id });
    }

    async increase(amount: number = 1) {
        await MongoGeniallyRepository.client.connect();
        const collection = MongoGeniallyRepository.client.db(this.DB_INFO.DB_NAME.genially).collection(this.DB_INFO.DB_COLLECTIONS.analytics);
        const query = { name: "analytics" };
        const analytics = await collection.findOne({ name: "analytics" });
        const update = { $set: { name: "analytics", inventory: { geniallys: analytics.inventory.geniallys + amount}}};
        collection.updateOne(query, update, { upsert: true });
        return;
    }
}
