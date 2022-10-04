import Dexie, { PromiseExtended } from "dexie";

export interface LunaticDatabase {
    save(id: string, data: LunaticData): PromiseExtended<string>;
    get(id: string): PromiseExtended<LunaticData | undefined>;
}

class LunaticDatabaseImpl extends Dexie implements LunaticDatabase {
    lunaticData!: Dexie.Table<LunaticData, string>;

    public constructor() {
        super("Database");
        this.version(1).stores({
            lunaticData: "id++",
        });
    }

    public save(id: string, data: LunaticData): PromiseExtended<string> {
        data.id = id;
        return this.lunaticData.put(data);
    }

    public get(id: string): PromiseExtended<LunaticData | undefined> {
        return this.lunaticData.get(id);
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

export const lunaticDatabase: LunaticDatabase = new LunaticDatabaseImpl();
