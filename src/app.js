const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function isIdValid( request, response, next){
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).send();
  }
  
  const repository = repositories.find(repository => repository.id === id);

  if (!repository) {
    return response.status(400).json({ error: "Repository not found" });
  }
  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  response.json(repository);
});

app.put("/repositories/:id", isIdValid, (request, response) => {
  const { id } = request.params;

  const { title: newTitle, url: newUrl, techs: newTechs } = request.body;


  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  repositories[repositoryIndex].title = newTitle;
  repositories[repositoryIndex].url = newUrl;
  repositories[repositoryIndex].techs = newTechs;

  return response.status(200).json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", isIdValid, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", isIdValid, (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id === id);

  repository.likes += 1;

  return response.json({ likes: repository.likes });
});



module.exports = app;
