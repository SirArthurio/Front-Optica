export interface Refaccion{
    surcurzal:string,
    comentario:string,
    cedula:string,
    ojoizquierdo:{
        esfera:number,
        cilindro:number,
        eje:number,
        add:number,
        dnp:number,
        agudeza_visual_sc:number,
        agudeza_visual_cc:number,
    },
    ojoderecho:{
        esfera:number,
        cilindro:number,
        eje:number,
        add:number,
        dnp:number,
        agudeza_visual_sc:number,
        agudeza_visual_cc:number,
    }

}