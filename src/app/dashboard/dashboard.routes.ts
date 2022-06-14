
import { DetalleComponent } from "../ingreso-egreso/detalle/detalle.component";
import { EstadisticaComponent } from "../ingreso-egreso/estadistica/estadistica.component";
import { IngresoEgresoComponent } from "../ingreso-egreso/ingreso-egreso.component";
import { Routes } from '@angular/router';



export const dashBoardroutes: Routes = [
    {
        path: '', component: EstadisticaComponent
    },
    {
        path: 'ingreso-egreso', component: IngresoEgresoComponent
    },
    {
        path: 'detalle', component: DetalleComponent
    },
];
