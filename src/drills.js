require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
})

console.log('knex and driver installed correctly');

// Get all items that contain text
function searchByItemName(searchTerm) {
    knexInstance
        .select('*')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(result => {
        console.log('SEARCH TERM', { searchTerm })
        console.log(result)
        })
}

searchByItemName('kale')

// Get all items paginated
function paginateList(page) {
  const listPerPage = 6
  const offset = listPerPage * (page - 1)
  knexInstance
    .select('*')
    .from('shopping_list')
    .limit(listPerPage)
    .offset(offset)
    .then(result => {
        console.log('PAGINATE LIST', { page })
        console.log(result)
    })
}

paginateList(2)

// Get all items added after date
function listAddedDaysAgo(daysAgo) {
    knexInstance
      .select('id', 'name', 'price', 'date_added', 'checked', 'category')
      .from('shopping_list')
      .where(
        'date_added',
        '>',
        knexInstance.raw(`now() - '?? days':: INTERVAL`, daysAgo)
      )
      .then(results => {
        console.log('LIST ADDED DAYS AGO')
        console.log(results)
      })
  }
  
  listAddedDaysAgo(4)


//   Get the total cost for each category
function costPerCategory() {
    knexInstance
      .select('category')
      .sum('price as total')
      .from('shopping_list')
      .groupBy('category')
      .then(result => {
        console.log('COST PER CATEGORY')
        console.log(result)
      })
  }
  
  costPerCategory()

  