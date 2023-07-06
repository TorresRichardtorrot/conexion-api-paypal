const { Router } = require("express");
const { HOST,PAYPAL_API,PAYPAL_KEY_CLIENT,PAYPAL_KEY_SECRET } = require('../config')
const axios = require("axios")

const router = Router();


router.post('/crear-orden', async (req,res)=>{

    const orden = {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: "105.70",
            },
          },
        ],
        application_context: {
          brand_name: "ShadowSell.com",
          landing_page: "NO_PREFERENCE",
          user_action: "PAY_NOW",
          return_url: `${HOST}/capturar-orden`,
          cancel_url: `${HOST}/orden-cancelada`,
        },
      };
    
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');

    const {data: { access_token } } = await axios.post(`${PAYPAL_API}/v1/oauth2/token`, params, {
        auth:{
            username: PAYPAL_KEY_CLIENT,
            password: PAYPAL_KEY_SECRET
        }
    })
    

    const response = await axios.post(`${PAYPAL_API}/v2/checkout/orders`, orden, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      });
        
        return res.json(response.data)
});


 
 router.get('/capturar-orden', async (req,res)=>{
    const { token } = req.query

    const response = await axios.post(`${PAYPAL_API}/v2/checkout/orders/${token}/capture`,{},{
        auth:{
            username: PAYPAL_KEY_CLIENT,
            password: PAYPAL_KEY_SECRET
        }
    })

    console.log(response.data)

    return res.send('pagado')
 });

 router.get('/orden-cancelada',(req,res)=>
 res.redirect('/'));

module.exports = router;
