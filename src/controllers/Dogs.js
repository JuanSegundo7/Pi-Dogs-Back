const axios = require('axios')
const { Dog, Temperaments } = require('../db')

const Dogs = {
    getDogs: async (req, res) => {
        try{
            const {name} = req.query
            const {data} = await axios.get(`https://api.thedogapi.com/v1/breeds`,{headers:{"x-api-key": process.env.API_KEY}})
            var Dogs = await Dog.findAll({include: {model: Temperaments, attributes: ['name']}})

            console.log(Dogs)

            if(name){
                const filteredDog = data.filter(dog => dog.name.toLowerCase().includes(name.toLowerCase()))
                var filteredDogDb = Dogs.filter(dog => dog.name.toLowerCase().includes(name.toLowerCase()))

                console.log(filteredDog)
                console.log(filteredDogDb)

                if(filteredDog.length > 0){
                    
                    let info = filteredDog.map((data) => {
                        let temps = [data.temperament]
                        
                        return {
                            id: data.id,
                            name: data.name,
                            min_height: data.height.metric.split("-")[0].trim(),
                            max_height: data.height.metric.split("-").reverse()[0].trim(),
                            min_weight: data.weight.metric.split("-")[0].trim(),
                            max_weight: data.weight.metric.split("-").reverse()[0].trim(),
                            life_span: data.life_span,
                            origin: data.origin,
                            temperaments: temps.map(tem => tem === undefined ? [] : tem.toLowerCase().split(", ")).join().split(",").filter(i => i !== ""),
                            image: data.image.url
                        }
                    })

                    return res.send(info)
                }

                if(filteredDogDb.length > 0){
                    filteredDogDb = filteredDogDb.map((e) => {
                        return {
                          ...e.dataValues,
                          temperaments: e.temperaments.map((e) => {
                            return e.name.toLowerCase();
                          }),
                        };
                    });

                    return res.send(filteredDogDb)
                }
                
                    
                if(filteredDog.length == 0 && filteredDogDb.length == 0) throw new Error("The searched dog is not available")
                
            }
            
            
            let info = data.map((data) => {
                let temps = [data.temperament]
                
                return {
                    id: data.id,
                    name: data.name,
                    min_height: data.height.metric.split("-")[0].trim(),
                    max_height: data.height.metric.split("-").reverse()[0].trim(),
                    min_weight: data.weight.metric.split("-")[0].trim(),
                    max_weight: data.weight.metric.split("-").reverse()[0].trim(),
                    life_span: data.life_span,
                    origin: data.origin,
                    temperaments: temps.map(tem => tem === undefined ? [] : tem.toLowerCase().split(", ")).join().split(",").filter(i => i !== ""),
                    image: data.image.url
                }
            })

            Dogs = Dogs.map((e) => {
                return {
                  ...e.dataValues,
                  temperaments: e.temperaments.map((e) => {
                    return e.name.toLowerCase();
                  }),
                };
            });

            
            let array = [
                ...info,
                ...Dogs
            ]
            
            
            return res.send(array)            
            
        }catch(e){
            console.log(e)
            res.status(404).send(`${e}`)
        }
    },
    oneDog: async (req, res) => {
        try{
            const id = req.params.id

            if(isNaN(id)){
                const DogDB = await Dog.findByPk(id, {include: {model: Temperaments, attributes: ['name']}})
                return res.send(DogDB)
            }
            
            const {data} = await axios.get(`https://api.thedogapi.com/v1/breeds`,{headers:{"x-api-key": process.env.API_KEY}})
            const filteredDog = data.filter(dog => dog.id == id)

            
            
            let info = filteredDog.map((data) => {
                let temps = [data.temperament]
                return {
                    id: data.id,
                    name: data.name,
                    min_height: data.height.metric.split("-")[0].trim(),
                    max_height: data.height.metric.split("-").reverse()[0].trim(),
                    min_weight: data.weight.metric.split("-")[0].trim(),
                    max_weight: data.weight.metric.split("-").reverse()[0].trim(),
                    life_span: data.life_span,
                    origin: data.origin,
                    temperaments: temps.map(tem => tem === undefined ? [] : tem.toLowerCase().split(", ")).join().split(",").filter(i => i !== ""),
                    image: data.image.url
                }
            })

            res.send(info[0])
            
        }catch(e){
            console.log(e)
        }
    },
    post: async (req, res) => {
        try{
            const {name, min_height, max_height, min_weight, max_weight, life_span, image, temperaments} = req.body
            if(!name || !min_height || !max_height || !min_weight || !max_weight) return res.status(404).send("Missing all the required values")
            
            let obj = {
                name,
                min_height: parseInt(min_height),
                max_height: parseInt(max_height),
                min_weight: parseInt(min_weight),
                max_weight: parseInt(max_weight),
                life_span,
                image
            }

            
            const dogCreated = await Dog.findOrCreate({where: obj})

            const temperamentDb = await Temperaments.findAll({
                where: {
                  name: temperaments,
                },
            });

            console.log(dogCreated)

            await dogCreated[0].addTemperaments(temperamentDb);

            res.status(201).send("The dog has been created successfully")

        }catch(e){
            console.log(e)
            res.status(404).send("Error in some of the previewed values")
        }
    }
}

module.exports = Dogs