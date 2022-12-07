const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
// const expressHbs = require('express-handlebars')
const errorController = require('./controllers/error')

const sequelize = require('./util/database')

const Product = require('./models/product')
const User = require('./models/user')
// const Cart = require('./models/cart')
// const CartItem = require('./models/cart-item')
// const Order = require('./models/order')
// const OrderItem = require('./models/order-itme')

const app = express();

// app.set('view engine', 'ejs')
app.set('view engine', 'pug')
app.set('views', 'views')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user
            next()
        })
        .catch(err => console.log(err))
})

// User.hasOne(Cart)
// Cart.belongsToMany(Product, { through: CartItem })
// Product.belongsToMany(Cart, { through: CartItem })
// Order.belongsTo(User)
// User.hasMany(Order)
// Order.belongsToMany(Product, { through: OrderItem })


app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(errorController.get404)


Product.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE'
})

User.hasMany(Product)



// Cart.hasMany(CartItem)


// sync() method looks at all the models defined, which we created using sequelize.define
// in our product.js file in the model folder, and creates tables for them
// sync() also defines relations in our DB, but the problem is if we already have created tables in
// the DB, it will not define the relations in DB that we defined here such as Product.belongsTo(User)
// so we pass { force: true } to forcefully define our relations even after tables are created.
sequelize.sync()
    .then(result => {
        return User.findByPk(1)
    })
    .then(user => {
        if (!user) {
            return User.create({ name: 'Max', email: 'test@gmail.com' })
        }
        return user
    })
    .then(cart => {
        app.listen(3001, () => {
            console.log('listening to port 3001')
        })
    })
    .catch(err => console.log(err))