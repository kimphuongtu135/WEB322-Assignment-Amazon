
const categories ={
    fakeDB:[],


    init()
    {
        
         this.fakeDB.push({
            src: "/images/pianocata.jpg",
            name: "Pianos",
        });
     
         this.fakeDB.push({
            src: "/images/pianoguitar.jpg",
            name: "Guitars",
        });
     
         this.fakeDB.push({
            src: "/images/chocolate.jpg",
            name: "Chocolate",
        });

        this.fakeDB.push({
            src: "/images/plants.jpg",
            name: "Plants",
        });

        this.fakeDB.push({
            src: "/images/boardgame.jpg",
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