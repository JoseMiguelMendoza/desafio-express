import fs from 'fs'

export default class ProductManager{
    #products
    #error
    #format
    constructor(path){
        this.path = path
        this.#products = []
        this.#error = undefined
        this.#format = 'utf-8'
    }

    #generateId = () => {
        return (this.#products.length === 0) ? 1 : this.#products[this.#products.length-1].id + 1
    }

    #validateProduct = (title, description, price, thumbnail, code, stock) => {
        if (!title || !description || !price || !thumbnail || !code || !stock){
            this.#error = `[${title}]: Campo incompleto. Todos los campos son obligatorios.`
        }else{
            const found = this.#products.find(item => item.code === code)
            found ? (this.#error = `[${title}]: El code ya existía.`) : this.#error = undefined
        }
    }

    readProducts = async() => {
        if(fs.existsSync(this.path)){
            let lecture = await fs.promises.readFile(this.path, this.#format)
            return JSON.parse(lecture)
        }else{
            return []
        }
    }

    getProducts = async() => {
        let response = await this.readProducts()
        return console.log(response)
    }
    
    getProductById = async(id) => {
        let products = await this.readProducts()
        const product = products.find(item => item.id === id)
        if (!product) console.log(`ID[${id}] not found`) 
        else console.log(product)
    }
    
    addProducts = async(title, description, price, thumbnail, code, stock) => {
        this.#validateProduct(title, description, price, thumbnail, code, stock)
        this.#error === undefined ? this.#products.push({id: this.#generateId(), title, description, price, thumbnail, code, stock}) : console.log(this.#error)
        await fs.promises.writeFile(this.path, JSON.stringify(this.#products, null, '\t'))
    }

    deleteProduct = async(id) => {
        let products = await this.readProducts()
        const product = products.find(item => item.id === id)
        if (!product) console.log(`El producto con ID[${id}] no existe.`)
        else{
            let filterProduct = products.filter(product => product.id != id)
            await fs.promises.writeFile(this.path, JSON.stringify(filterProduct, null, '\t'))
            return console.log(`El producto con ID[${id}] ha sido eliminado.`)
        }
    }

    updateProduct = async ({ id, ...producto }) => {
        let products = await this.readProducts();
        const index = products.findIndex((p) => p.id === id);
        if (index === -1) {
            console.log(`El producto con ID[${id}] no existe.`);
            return;
        }
        products[index] = { id, ...producto };
        await fs.promises.writeFile(
            this.path,
            JSON.stringify(products, null, "\t")
        );
    };
}

// const productManager = new ProductManager('./products.json')

// productManager.addProducts("title 1", "descripcion 1", 100, "Sin Imagen", 10981, 10)
// productManager.addProducts("title 2", "descripcion 2", 120, "Sin Imagen", 10982, 80)
// productManager.addProducts("title 3", "descripcion 3", 140, "Sin Imagen", 10983, 40)
// productManager.addProducts("title 4", "descripcion 4", 150, "Sin Imagen", 10984, 30)
// productManager.addProducts("title 5", "descripcion 5", 160, "Sin Imagen", 10985, 20)
// productManager.addProducts("title 6", "descripcion 6", 170, "Sin Imagen", 10986, 60)
// productManager.addProducts("title 7", "descripcion 7", 190, "Sin Imagen", 10987, 50)