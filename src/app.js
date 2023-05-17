import express from 'express'
import ProductManager from './ProductManager.js'

const app = express()
const PORT = 8080
const productManager = new ProductManager('./products.json')
const readProducts = productManager.readProducts()

app.get('/products', async(request, response) => {
    let limit = parseInt(request.query.limit)
    if(!limit){ 
        return response.send(await readProducts)
    }
    let allProducts = await readProducts
    let productLimit = allProducts.slice(0, limit)
    return response.send(productLimit)
})

app.get('/products/:id', async(request, response) => {
    let id = parseInt(request.params.id)
    let allProducts = await readProducts
    let productById = allProducts.find(product => product.id === id)
    if(!productById){
        return response.send(`Error! No existe el id(${id}) en esta lista.`)
    }else{
        return response.send(productById) 
    }
})

app.listen(PORT, () => console.log(`Server up in local host ${PORT}`))