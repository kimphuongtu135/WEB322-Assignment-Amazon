
const product ={
    fakeDB:[],
    init()
    {
        
         this.fakeDB.push({
            src: "piano2.jpg",
            type: "Keyboard",
            description: "Yamaha - Model YDP144R - Wooden Color, 88 Keys",
            name: "U1 Grand Piano",
            price: "$3000",
            bestseller:true
        });
        
        this.fakeDB.push({
            src: "succulent1.jpg",
            type: "Plant",
            description: "Indoor Succulent",
            name: "Indoor Succulent",
            price: "$7",
            bestseller:false
        });

         this.fakeDB.push({
            src: "piano6.jpg",
            type: "Keyboard",
            description: "Yamaha - Model RockJam - Digital Piano, 88 keys",
            name: "88 Keys Synth Workstation",
            price: "$2199",
            bestseller:false
        });
        this.fakeDB.push({
            src: "chocolatebox.jpg",
            type: "Chocolate",
            description: "Chocolate Gift Box- 250g",
            name: "Assorted Chocolate Collection",
            price: "$35",
            bestseller:false
        });
     
         this.fakeDB.push({
            src: "piano5.jpg",
            type: "Keyboard",
            description: "Yamaha - Digital Piano - Black Color",
            name: "Arius YDP-164 Digital Piano",
            price: "$2500",
            bestseller:true
        });
        this.fakeDB.push({
            src: "succulent2.jpg",
            type: "Plant",
            description: "Indoor Succulent with Pot",
            name: "Succulent with Pot",
            price: "$10",
            bestseller:false
        });

        this.fakeDB.push({
            src: "piano1.jpg",
            type: "Keyboard",
            description: "Yamaha - Model L515Wh",
            name: "88-Key Digital Piano- Black ",
            price: "$1950",
            bestseller:true
        });

        this.fakeDB.push({
            src: "succulent3.jpg",
            type: "Plant",
            description: "Indoor Succulent with Pot",
            name: "Succulent",
            price: "$8",
            bestseller:true
        });
        this.fakeDB.push({
            src: "piano3.jpg",
            type: "Keyboard",
            description: "Yamaha - Digital Organ",
            name: "Vintage Electone Organ ",
            price: "$8500",
            bestseller:false
        });

        this.fakeDB.push({
            src: "piano4.jpg",
            type: "Keyboard",
            description: "Yamaha - USB Midi Keyboard - 49Mk3",
            name: "M-Audio ",
            price: "$1000",
            bestseller:true
        });

        this.fakeDB.push({
            src: "guitar2.jpg",
            type: "Guitar",
            description: "Yamaha - Beginners Guitar",
            name: "F325D Acoustic Guitar ",
            price: "$189",
            bestseller:true
        });

        this.fakeDB.push({
            src: "cookie.jpg",
            type: "Chocolate",
            description: "Chocolate Cookies Gift Box- 150g",
            name: "Cookies Chocolate Collection",
            price: "$15",
            bestseller:false
        });

        this.fakeDB.push({
            src: "guitar3.jpg",
            type: "Guitar",
            description: "Yamaha - Wooden Color- Beginners Guitar",
            name: "FG800M Acoustic Guitar ",
            price: "$249",
            bestseller:true
        });

        this.fakeDB.push({
            src: "against.jpg",
            type: "Boardgame",
            description: "This cards game for group of horrible people",
            name: "Cards Against Hummanity Card Game ",
            price: "$35",
            bestseller:true
        });
        
        this.fakeDB.push({
            src: "guitar-elec1.jpg",
            type: "Guitar",
            description: "Yamaha - Full size, Solid Elctric Guitar Kit",
            name: "500 Seies Bass Guitar ",
            price: "$689",
            bestseller:true
        });

        this.fakeDB.push({
            src: "guitar4.jpg",
            type: "Guitar",
            description: "Yamaha - Wooden Color - Steel Strings",
            name: "AG800M Acoustic Guitar ",
            price: "$500",
            bestseller:true
        });

        this.fakeDB.push({
            src: "uno.jpg",
            type: "Boardgame",
            description: "Card game of matching color and number for group of 2 up 10 people",
            name: "Uno Card Game ",
            price: "$6.95",
            bestseller:true
        });

        this.fakeDB.push({
            src: "poker.jpg",
            type: "Boardgame",
            description: "Poker with 52 cards",
            name: "Plastic Poker Cards ",
            price: "$8",
            bestseller:true
        });
     
    },

    getAllProduct()
    {
        
        return this.fakeDB;

    },

    getBestSeller()
    {
        const fakeBestSeller=[];
        this.fakeDB.forEach(item => {
            if(item.bestseller==true)
        fakeBestSeller.push(item);
        });
        return fakeBestSeller;
    },

   getbyType(itemType)
   {
    const fakeBestSeller=[];
        this.fakeDB.filter(item => {
            if(item.type==itemType)
        fakeBestSeller.push(item);
        });
        return fakeBestSeller;
   }
}
 
product.init();


module.exports=product; 