import Dexie, { PromiseExtended } from "dexie";
import { LunaticData } from "../interface/lunatic/Lunatic";

export interface LunaticDatabase {
    save(id: string, data: LunaticData): Promise<string>;
    get(id: string): Promise<LunaticData | undefined>;
    clear(): Promise<void>;
}

/**
 * Database implementation that stores data in IndexedDB using Dexie
 */
class LunaticIndexedDB extends Dexie implements LunaticDatabase {
    lunaticData!: Dexie.Table<LunaticData, string>;

    public constructor() {
        super("Database");
        this.version(1).stores({
            lunaticData: "id++",
        });
    }

    public save(id: string, data: LunaticData): Promise<string> {
        data.id = id;
        return this.lunaticData.put(data);
    }

    public get(id: string): Promise<LunaticData | undefined> {
        return this.lunaticData.get(id);
    }

    public clear(): PromiseExtended<void> {
        return this.lunaticData.clear();
    }
}

/**
 * In-Memory database implementation, used as a fallback if Dexie fails to initialize
 */
class LunaticMemoryDB implements LunaticDatabase {
    lunaticData = new Map<string, LunaticData>();

    public save(id: string, data: LunaticData): Promise<string> {
        data.id = id;
        this.lunaticData.set(id, data);
        return Promise.resolve(id);
    }

    public get(id: string): Promise<LunaticData | undefined> {
        return Promise.resolve(this.lunaticData.get(id));
    }

    public clear(): Promise<void> {
        return Promise.resolve(this.lunaticData.clear());
    }
}

/**
 * Proxy the calls to the right database implementation according to browser support
 */
class BrowserDatabase implements LunaticDatabase {
    private db: Promise<LunaticDatabase>;

    constructor() {
        this.db = new Promise(resolve => {
            const database = new LunaticIndexedDB();
            database
                .get("")
                .then(() => resolve(database))
                .catch(e => {
                    console.warn(
                        "- Dexie will not work in this environment. We will use a memory database.",
                    );
                    console.debug(e);
                    resolve(new LunaticMemoryDB());
                });
        });
    }

    public save(id: string, data: LunaticData): Promise<string> {
        return this.db.then(database => database.save(id, data));
    }

    public get(id: string): Promise<LunaticData | undefined> {
        return this.db.then(database => database.get(id));
    }

    public clear(): Promise<void> {
        return this.db.then(database => database.clear());
    }
}

export const lunaticDatabase = new BrowserDatabase();
