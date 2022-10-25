const axios = require('axios')
const { Temperaments } = require('../db')

const Temps = {
    temperaments: async (req, res) => {
        try{
            // const {data} = await axios.get(`https://api.thedogapi.com/v1/breeds`,{headers:{"x-api-key": process.env.API_KEY}})
            const all = await Temperaments.findAll()
            res.status(201).send(all)

        }catch(e){
            res.send(`${e}`)
        }
        
    }
}

module.exports = Temps