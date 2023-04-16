import Genially from "../../../../contexts/core/genially/domain/Genially";

describe("Domain Genially suite", () => {
    it("Should exists", () => {
        expect(Genially).not.toBe(null);
    });

    it("Should create a instance of a genially", () => {
        const genData = { id: "testId", name: "testName", description: "testDescription" };
        const genially = new Genially(genData.id, genData.name, genData.description);
        
        expect(genially).not.toBe(null);
        expect(genially.id).toEqual(genData.id);
        expect(genially.name).toEqual(genData.name);
        expect(genially.description).toEqual(genData.description);
        expect(genially.createdAt).not.toBe(null);
    });

    it("Should be modified when rename is called", () => {
        const genData = { id: "testId", name: "testName", description: "testDescription" };
        const newName = "newName";
        const genially = new Genially(genData.id, genData.name, genData.description);
        genially.rename("newName");
        expect(genially).not.toBe(null);
        expect(genially.id).toEqual(genData.id);
        expect(genially.name).toEqual(newName);
        expect(genially.description).toEqual(genData.description);
        expect(genially.createdAt).not.toBe(null);
        expect(genially.modifiedAt).not.toBe(null);
    });

    it("Should be modified when delete is called", () => {
        const genData = { id: "testId", name: "testName", description: "testDescription" };
        const genially = new Genially(genData.id, genData.name, genData.description);
        genially.delete();
        expect(genially).not.toBe(null);
        expect(genially.id).toEqual(genData.id);
        expect(genially.name).toEqual(genData.name);
        expect(genially.description).toEqual(genData.description);
        expect(genially.createdAt).not.toBe(null);
        expect(genially.deletedAt).not.toBe(null);
    });

    it("Should create a instance based on a plain object", () => {
        const genData = {
            _id: "testId",
            _name: "testName",
            _description: "testDescription",
            _createdAt: new Date(),
            _modifiedAt: new Date(),
            _deletedAt: new Date()
        };
        const genially = new Genially(genData._id, genData._name, genData._description);
        const geniallyFromObj = genially.fromObject(genData);
        expect(geniallyFromObj).not.toBe(null);
        expect(geniallyFromObj.id).toEqual(genData._id);
        expect(geniallyFromObj.name).toEqual(genData._name);
        expect(geniallyFromObj.description).toEqual(genData._description);
        expect(geniallyFromObj.createdAt).toBe(genData._createdAt);
        expect(geniallyFromObj.modifiedAt).toBe(genData._modifiedAt);
        expect(geniallyFromObj.deletedAt).toBe(genData._deletedAt);
    });
});