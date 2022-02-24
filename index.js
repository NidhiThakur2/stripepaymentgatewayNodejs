const cors=require("cors");
const express=require("express");
const stripe=require("stripe")("sk_test_51KTzIuF48lX8FulrdptohcGeLMbrizFgfvJVSBDoWN8ukAlvggQqMnng9ijVwhQwspJgENPy9CY48p6c64kJIJN300qhTfSXXE");
//const uuid=require("uuid/");

const app=express();

//middleware
app.use(express.json());
app.use(cors())

//routes
app.get("/",(req,res)=>{
    res.send("WELCOME");
});

app.post("/payment",(req,res)=>{
    const{product,token}=req.body;
    console.log("PRODUCT ", product);
    console.log("PRICE ", product.price);
    const idempotencyKey=1;

    return stripe.customers.create({
        email: token.email,
        source: token.id
    }).then(customer=>{
        stripe.charges.create({
            amount: product.price *100,
            currency:'sgd',
            customer:customer.id,
            receipt_email: token.email,
            description:`purchase of ${product.name}`,
            shipping:{
                name:token.card.name,
                address:{
                    country:token.card.address_country
                }
            }
        },{idempotencyKey})
    })
    .then(result=> res.status(200).json(result))
    .catch(err=>console.log(err))

});

//listen
app.listen(8282,()=> console.log("LISTENING AT PORT 8282"));