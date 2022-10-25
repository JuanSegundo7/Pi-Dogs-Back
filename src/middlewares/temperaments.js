const { Temperaments } = require('../db')
const axios = require('axios')

module.exports = async (req,res,next) => {
    try{
        const all = await Temperaments.findAll()
        
        if(!all.length){
            const {data} = await axios.get(`https://api.thedogapi.com/v1/breeds`,{headers:{"x-api-key": process.env.API_KEY}})
            const temperaments = data.map(dog => dog.temperament)
            const temps = temperaments.map(tem => tem === undefined ? [] : tem.split(", ")).join().split(",").filter(i => i !== "");
            await temps.forEach(data => Temperaments.findOrCreate({where: {name: data}}))
        }

        
    }catch(e){
        res.send(`${e}`)
    }
    next();
}
