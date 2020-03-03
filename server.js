//serv config
const express = require("express") //pegar o express de dentro do node_modules
const server = express()

//serv config para apresentar arquivos estáticos
server.use(express.static('public'))

//habilitar body do formulario
server.use(express.urlencoded({ extended: true}))

//configurar a conexao com o banco de dados
const Pool = require('pg').Pool
const db = new Pool ({
    username:'postgres',
    password:'0000',
    host:'localhost',
    port: 5432,
    database:'doadores'
})


//config template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./",{
    express: server,
    noCache: true,
})



//config o que vai aparecer na pagina
server.get("/", function(req, res){
    const donors = []
    return res.render("index.html",{ donors })
})


server.post("/",function(req,res) {
    //pegar dados do form    
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    //esse fluxo ta ok, refere-se ao caso do nao preenchimento de um local.
    if (name == "" || email =="" || blood =="") {
        
        return res.send("All fields are required.")

    }

    //coloco valores no banco de dados
    const query = `
        INSERT INTO donors("name","email","blood") 
        VALUES($1, $2, $3)`

    const values = [name,email,blood]

    db.query( query, values, function(err) {
        //fluxo de erro
        if (err) return res.send("database error")

        //fluxo ideal
        else return res.redirect("/")

    })

    
})

//ligar o servidor e permitir o acesso na porta 3000
server.listen(3000,function(){
    console.log("server on")
}) 