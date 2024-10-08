
import { AutoCompleteActiviteOption, NomenclatureActivityOption } from "../../../interface/lunatic-edt";
import { findItemInAutoCompleteRef, findItemInCategoriesNomenclature } from "./activityUtils";

describe("findItemInCategoriesNomenclature", () => {
    const jsonRef: NomenclatureActivityOption[] = [
        {
            "label": "Temps personnel (dormir, se laver, manger …)",
            "rang": 1,
            "id": "100",
        },
        {
            "label": "Tâches domestiques (ménage, cuisine, courses …)",
            "rang": 1,
            "id": "300",
            "subs": [
                {
                    "label": "Tâches ménagères",
                    "rang": 2,
                    "id": "301",
                    "subs": [
                        {
                            "label": "Cuisine",
                            "rang": 3,
                            "id": "310",
                            "subs": [
                                {
                                    "label": "cuisiner",
                                    "rang": 4,
                                    "id": "311",
                                },
                                {
                                    "label": "mettre la table",
                                    "rang": 4,
                                    "id": "313",
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ];

    it("should find item in json referentiel", () => {
        const id = "310";
        expect(findItemInCategoriesNomenclature(id, jsonRef, undefined)?.item?.id).toEqual(id);
    });

    it("should not find item in json referentiel", () => {
        expect(findItemInCategoriesNomenclature("312", jsonRef, undefined)?.item).toBeUndefined();
    });

    it("should find parent in json referentiel", () => {
        const parentId = "310";
        const id = "311";
        expect(findItemInCategoriesNomenclature(id, jsonRef, undefined)?.item?.id).toEqual(id);
        expect(findItemInCategoriesNomenclature(id, jsonRef, undefined)?.parent?.id).toEqual(parentId);
    });

    it("should not find parent in json referentiel", () => {
        const id = "100";
        expect(findItemInCategoriesNomenclature(id, jsonRef, undefined)?.item?.id).toEqual(id);
        expect(findItemInCategoriesNomenclature(id, jsonRef, undefined)?.parent).toBeUndefined();
    });
});

describe("findItemInAutoCompleteRef", () => {
    const ref: AutoCompleteActiviteOption[] = [
        {
            "label": "DORMIR (HORS SIESTE)",
            "synonymes":
                "sommeil,  lit,  endormi, dodo, réveil, éveil, nuit, dormir, s’endormir, je dors",
            "id": "111",
        },
        {
            "label": "SE COUCHER (au lit avant le sommeil)",
            "synonymes":
                "heure du coucher, sommeil, lit, repos, se recoucher, se coucher, je me couche, je vais me coucher",
            "id": "113",
        },
    ];

    it("should find item", () => {
        const id = "111";
        expect(findItemInAutoCompleteRef(id, ref)?.id).toEqual(id);
    });

    it("should not find item", () => {
        const id = "112";
        expect(findItemInAutoCompleteRef(id, ref)?.id).toBeUndefined();
    });
});
