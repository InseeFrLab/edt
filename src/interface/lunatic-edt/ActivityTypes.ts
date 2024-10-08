export type NomenclatureActivityOption = {
    label: string;
    id: string;
    rang: number;
    subs?: NomenclatureActivityOption[];
};

export type SelectedActivity = {
    id?: string;
    suggesterId?: string;
    label?: string;
    isFullyCompleted?: boolean;
    historyInputSuggester?: string;
};

export type AutoCompleteActiviteOption = {
    id: string;
    label: string;
    synonymes: string;
};

export type responseType = {
    [name: string]: string;
};

export type responsesType = {
    response: responseType;
    id?: string;
    label?: string;
};
