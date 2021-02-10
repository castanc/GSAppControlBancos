import { KeyValuePair } from "./KeyValuePair";

export class Cache {
    static coll = new Array<KeyValuePair<string,string>>();
}