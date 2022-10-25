const { Dog } = require('../db')
const axios = require('axios')

module.exports = async (req,res,next) => {
    try{
        const all = Dog.findAll()
        
        if(!all.length){
            const {data} = await axios.get(`https://api.thedogapi.com/v1/breeds`,{headers:{"x-api-key": process.env.API_KEY}})
            data.forEach(info => (info.height = info.height.metric) && (info.weight = info.weight.metric))
            await data.forEach(data => Dog.findOrCreate({where: {name: data.name, height: data.height, weight: data.weight, life_span: data.life_span, image: data.image.url}}))
        }
        
    }catch(e){
        console.log(e)
        res.send(`${e}`)
    }
    next();
}
