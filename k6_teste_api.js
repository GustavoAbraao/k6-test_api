import http from 'k6/http';
import { check } from 'k6';

export let options = {
  vus: 1,
  iterations: 1,
};

let url = 'https://serverest.dev/';

export default function () {
  // Definir os headers para a solicitação POST
  const headers = {
    'accept': 'application/json',
    'Content-Type': 'application/json',
  };

  // Definir o payload como um objeto JSON
  const payload = {
    "nome": "Joaquim Alves",
    "email": "joaquimalves@qa.com.br",
    "password": "teste",
    "administrador": "true"
  };

  // Fazer uma solicitação POST para o URL `/usuarios`
  const res = http.post(`${url}usuarios`, JSON.stringify(payload), { headers });

  // Extrair o ID do recurso criado pelo POST da resposta
  const id = JSON.parse(res.body)._id;
  console.log("ID do recurso criado:", id);

  // Verificar se o código de status da resposta é 201 usando check()
  check(res, {
    'Status is 201': (r) => r.status === 201,
  });
  console.log(`Status do POST: ${res.status}`);
  
  // Exibir o corpo da resposta da API no console
  console.log("Corpo da resposta da API:", res.body);

  // Fazer uma solicitação GET para o recurso específico usando o ID
  const res1 = http.get(`${url}usuarios/${id}`);

  // Verificar se o código de status da resposta é 200 usando check()
  check(res1, {
    'Status is 200': (r) => r.status === 200,
  });

  // Verificar se o corpo da resposta contém o nome que foi incluído no POST
  check(res1, {
    'Nome incluído no POST': (r) => r.body.indexOf("Joaquim Alves") !== -1,
  });
// Fazer uma solicitação DELETE para remover o recurso específico usando o ID
  const res2 = http.del(`${url}usuarios/${id}`);

// Verificar se o código de status da resposta é 200 usando check()
  check(res2, {
  'Status is 200': (r) => r.status === 200,
});

// Exibir a mensagem de sucesso da resposta do DELETE
  console.log("Mensagem da resposta do DELETE:", res2.body);
  check(res2, {
    'Mensagem de exclusão bem-sucedida': (r) => r.body.indexOf("Registro excluído com sucesso") !== -1,
  });
}