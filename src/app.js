const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require('uuidv4')

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateId(request, response, next){

  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).json({error: 'Invalid project ID.'})
  }

  return next();
}

app.use('/repositories/:id', validateId);

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {

  const {title, url, techs} = request.body;
  
  const newRepositorie = { 
    id: uuid(), 
    title: title, 
    url: url, 
    techs: techs, 
    likes: 0 
  }

  repositories.push(newRepositorie);

  return response.json(newRepositorie)

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const {title, url, techs} = request.body;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);

  // if(repositorieIndex < 0){ //retorna -1 quando não acha, da pra tratar a msg de erro aqui
  //   //N encontrou
  //   //Coloca o status, pq é erro tratado nosso, se não ele vai receber 200
  //   return response.status(400).json({error:'Repositorie ID not found.'})
  // } 

  const newRepositorie = repositories[repositorieIndex] = { 
    ...repositories[repositorieIndex],
    title, 
    url, 
    techs
  }

  return response.json(newRepositorie)

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);

  // if(repositorieIndex < 0){ //retorna -1 quando não acha, da pra tratar a msg de erro aqui
  //   //N encontrou
  //   //Coloca o status, pq é erro tratado nosso, se não ele vai receber 200
  //   return response.status(400).json({error:'Repositorie ID not found.'})
  // } 

  repositories.splice(repositorieIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);

  // if(repositorieIndex < 0){ //retorna -1 quando não acha, da pra tratar a msg de erro aqui
  //   //N encontrou
  //   //Coloca o status, pq é erro tratado nosso, se não ele vai receber 200
  //   return response.status(400).json({error:'Repositorie ID not found.'})
  // } 

  const newRepositorie = repositories[repositorieIndex] = { 
    ...repositories[repositorieIndex],
    likes: repositories[repositorieIndex].likes + 1 
  }

  return response.json(newRepositorie)


});

module.exports = app;
