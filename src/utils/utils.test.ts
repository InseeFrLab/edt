import { describe, beforeEach, afterEach, it, expect } from "vitest";
import { addArrayToSession, getArrayFromSession } from "./utils.ts";

describe("Session Storage Functions", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });

    describe("addArrayToSession", () => {
        it("should store an array of primitive values", () => {
            const testArray = [1, 2, 3, 4, 5];
            addArrayToSession("TestNumbers", testArray);

            const storedItem = localStorage.getItem("sessionTestNumbers");
            expect(storedItem).toBe("1;;2;;3;;4;;5");
        });

        it("should store an array of objects", () => {
            const testArray = [
                { id: 1, name: "John" },
                { id: 2, name: "Jane" },
            ];
            addArrayToSession("TestObjects", testArray);

            const storedItem = localStorage.getItem("sessionTestObjects");
            expect(storedItem).toBe('{"id":1,"name":"John"};;{"id":2,"name":"Jane"}');
        });

        it("should handle an empty array", () => {
            const testArray: any[] = [];
            addArrayToSession("EmptyArray", testArray);

            const storedItem = localStorage.getItem("sessionEmptyArray");
            expect(storedItem).toBe("");
        });
    });

    describe("getArrayFromSession", () => {
        it("should retrieve an array of primitive values", () => {
            localStorage.setItem("sessionTestNumbers", "1;;2;;3;;4;;5");

            const retrievedArray = getArrayFromSession("TestNumbers");
            expect(retrievedArray).toEqual([1, 2, 3, 4, 5]);
        });

        it("should retrieve an array of objects", () => {
            const testObjects = [
                { id: 1, name: "John" },
                { id: 2, name: "Jane" },
            ];
            localStorage.setItem("sessionTestObjects", '{"id":1,"name":"John"};;{"id":2,"name":"Jane"}');

            const retrievedArray = getArrayFromSession("TestObjects");
            expect(retrievedArray).toEqual(testObjects);
        });

        it("should return an empty array if no item exists", () => {
            const retrievedArray = getArrayFromSession("NonExistentKey");
            expect(retrievedArray).toEqual([]);
        });
    });
});
