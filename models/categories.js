
const categories ={
    fakeDB:[],


    init()
    {
        
         this.fakeDB.push({
            src: "pianocata.jpg",
            name: "Pianos",
        });
     
         this.fakeDB.push({
            src: "pianoguitar.jpg",
            name: "Guitars",
        });
     
         this.fakeDB.push({
            src: "chocolate.jpg",
            name: "Chocolate",
        });

        this.fakeDB.push({
            src: "plants.jpg",
            name: "Plants",
        });

        this.fakeDB.push({
            src: "boardgame.jpg",
            name: "BoardGame",
        }); 
     
    },

    getAllProduct()
    {
        
        return this.fakeDB;

    },

    
    
}
categories.init();//get all product we need return

module.exports=categories; // this is important it needs it for exports