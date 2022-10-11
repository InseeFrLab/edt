import Dexie from "dexie";

export interface LunaticDatabase {
    save(id: string, data: LunaticData): Promise<string>;
    get(id: string): Promise<LunaticData | undefined>;
}

class LunaticDatabaseImpl extends Dexie implements LunaticDatabase {
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
}

class MemoryLunaticDatabaseImpl implements LunaticDatabase {
    lunaticData = new Map<String, LunaticData>();

    public save(id: string, data: LunaticData): Promise<string> {
        data.id = id;
        this.lunaticData.set(id, data);
        return Promise.resolve(id);
    }

    public get(id: string): Promise<LunaticData | undefined> {
        return Promise.resolve(this.lunaticData.get(id));
    }
}

class PromiseProxyLunaticDatabaseImpl implements LunaticDatabase {
    lunaticDatabasePromise = new Map<String, LunaticData>();
    constructor(private promise: Promise<LunaticDatabase>) {}

    public save(id: string, data: LunaticData): Promise<string> {
        return lunaticDatabasePromise.then(database => database.save(id, data));
    }

    public get(id: string): Promise<LunaticData | undefined> {
        return lunaticDatabasePromise.then(database => database.get(id));
    }
}

export interface Collected {
    COLLECTED: string | boolean | null;
    EDITED: any;
    FORCED: any;
    INPUTED: any;
    PREVIOUS: any;
}

export interface LunaticData {
    id?: string;
    EXTERNAL?: any;
    CALCULATED?: any;
    COLLECTED?: Map<string, Collected>;
}

// this is somewhat complexe as browser sometime cannot work with dexie in private mode
export const lunaticDatabasePromise = new Promise<LunaticDatabase>(resolve => {
    // validate dexie is working on this computer
    const database = new LunaticDatabaseImpl();
    database
        .get("")
        .then(() => resolve(database))
        .catch(e => {
            console.warn("- Dexie will not work in this environment. We will use a memory database.");
            console.debug(e);
            resolve(new MemoryLunaticDatabaseImpl());
        });
});

export const lunaticDatabase = new PromiseProxyLunaticDatabaseImpl(lunaticDatabasePromise);
