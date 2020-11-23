import { NgModule } from '@angular/core';

import { SearchResultPipe } from './pipes/search.result.pipe';
import { OrdinalPipe } from './pipes/ordinal.pipe';

@NgModule({
    imports: [
               
     ],
    declarations: [
        OrdinalPipe,
        SearchResultPipe,
    ],
    exports: [
        OrdinalPipe,
        SearchResultPipe
    ]
})
  
export class SharedModule {}