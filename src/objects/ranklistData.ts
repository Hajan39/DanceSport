export interface Ranklist {
    selection: Selection;
    rank: Rank;
    expireAt: string
}

export interface Rank {
    id: number;
    datum: string;
    prubezny: boolean;
    profi: boolean;
    vekKtg: string;
    disciplina: string;
    nazev: string;
    koefMcr: number;
    koefTliga: number;
    koefWdsf: number;
    pary: Pary[];
    nazevDivize: null;
}

export interface Pary {
    id: number;
    poradi_od: number;
    poradi_do: number;
    partner_clen_id: number;
    partner_idt: number;
    partner_jmn: string;
    partnerka_clen_id: number;
    partnerka_idt: number;
    partnerka_jmn: string;
    body_celkem: number;
    body_tliga: number;
    body_mcr: number;
    body_wdsf: number;
    vyssi_vek_ktg: boolean;
}

export interface Selection {
    datum: string;
    vekKtg: string;
    disciplina: string;
    divize: number;
    seznamVekovychKategorii: Seznam[];
    seznamDisciplin: Seznam[];
    seznamDatumu: Seznam[];
    seznamDivizi: SeznamDivizi[];
}

export interface Seznam {
    Key: string;
    Value: string;
}

export interface SeznamDivizi {
    Key: number;
    Value: string;
}
