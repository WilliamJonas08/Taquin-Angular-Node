export class Piece {
    id: number;
    finalPlace: number;
    imageUrl: string;

    constructor(id : number){
        this.id=id
        this.finalPlace = id
        this.imageUrl = "/assets/"+id+".jpg";
    }

  }