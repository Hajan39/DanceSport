import * as React from 'react';

import { Ranklist } from '../objects/ranklistData';
import getCachedUrlContent from './storageServerCommunicator';

export async function GetRanklistData(ageCategory: string | null = null, disc: string | null = null, date: string | null = null, division: number | null = null): Promise<Ranklist> {


    //http://www.csts.cz/api/ranklist-csts/ranklist?vekKtg=ML&disciplina=L&datum=2018-12-31&divize=2
    return await getCachedUrlContent<Ranklist>(url);
}


