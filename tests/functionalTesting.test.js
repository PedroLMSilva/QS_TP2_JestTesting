const request = require("supertest");
const app = require("../App");

describe("CT07: Visualização de Serviços Existentes", () => {
  let serviceIds = []; // Para armazenar os IDs dos serviços criados

  // Pré-condição: criar serviços de teste
  beforeAll(async () => {
    const services = [
      {
        userId: 1,
        userIdClient: 2,
        equipmentType: 1, // ID do tipo de equipamento
        equipmentBrand: 1, // ID da marca do equipamento
        equipmentProcedure: 1, // ID do procedimento
        notes: "Primeiro serviço de teste",
        status: 1, // Status inicial: Em progresso
        priority: 1, // Prioridade
      },
      {
        userId: 1,
        userIdClient: 2,
        equipmentType: 2,
        equipmentBrand: 2,
        equipmentProcedure: 2,
        notes: "Segundo serviço de teste",
        status: 2, // Status alterado: Concluído
        priority: 2,
      },
    ];

    for (const service of services) {
      const response = await request(app).post("/api/createJob").send(service);
      expect(response.status).toBe(200);
    }

    // Obter os IDs dos serviços criados
    const jobsResponse = await request(app).post("/api/getListJobs").send({ type: "ALL" });
    expect(jobsResponse.status).toBe(200);

    const jobs = jobsResponse.body.jobs;
    expect(jobs).toBeInstanceOf(Array);
    expect(jobs.length).toBeGreaterThanOrEqual(services.length);

    // Armazenar os IDs dos serviços criados para posterior validação e limpeza
    for (const service of services) {
      const createdService = jobs.find((job) => job.NOTES === service.notes);
      expect(createdService).toBeDefined();
      serviceIds.push(createdService.JOB_ID);
    }
  });

  it("Deve carregar a lista de serviços com todas as informações necessárias", async () => {
    const jobsResponse = await request(app).post("/api/getListJobs").send({ type: "ALL" });
    expect(jobsResponse.status).toBe(200);

    const jobs = jobsResponse.body.jobs;
    expect(jobs).toBeInstanceOf(Array);

    for (const serviceId of serviceIds) {
      const job = jobs.find((j) => j.JOB_ID === serviceId);
      expect(job).toBeDefined();

      // Validar as informações esperadas
      expect(job).toMatchObject({
        JOB_ID: serviceId,
        CLIENT_NAME: expect.any(String),
        STATUS_PROGRESS_DESCRIPTION: expect.any(String),
        PRIORITY_DESCRIPTION: expect.any(String),
        NOTES: expect.any(String),
      });
    }
  });
});



describe("CT08: Criação de Serviços", () => {
  it("Deve criar um serviço e garantir que aparece na lista com os dados corretos", async () => {
    const newService = {
      userId: 1,
      userIdClient: 2,
      equipmentType: 1, // Tipo de equipamento
      equipmentBrand: 1, // Marca do equipamento
      equipmentProcedure: 1, // Procedimento
      notes: "Serviço para teste de criação",
      status: 1, // Status inicial: Em progresso
      priority: 1, // Prioridade
    };

    // Criar o serviço
    const createResponse = await request(app).post("/api/createJob").send(newService);
    expect(createResponse.status).toBe(200);

    // Buscar o ID do serviço criado
    const jobsResponse = await request(app).post("/api/getListJobs").send({ type: "ALL" });
    expect(jobsResponse.status).toBe(200);

    const jobs = jobsResponse.body.jobs;
    expect(jobs).toBeInstanceOf(Array);

    const createdService = jobs.find((job) => job.NOTES === newService.notes);
    expect(createdService).toBeDefined();

    // Verificar os dados do serviço criado
    expect(createdService).toMatchObject({
      NOTES: newService.notes,
      STATUS_PROGRESS_DESCRIPTION: expect.any(String),
      PRIORITY_DESCRIPTION: expect.any(String),
      CLIENT_NAME: expect.any(String),
    });
  });
});


describe("CT10: Filtro de Serviços por Estado", () => {
  let serviceIds = [];

  beforeAll(async () => {
    const services = [
      {
        userId: 1,
        userIdClient: 2,
        equipmentType: 1,
        equipmentBrand: 1,
        equipmentProcedure: 1,
        notes: "Serviço em progresso",
        status: 1, // Em progresso
        priority: 1,
      }
    ];

    // Criar os serviços
    for (const service of services) {
      const response = await request(app).post("/api/createJob").send(service);
      expect(response.status).toBe(200);
    }

    // Adicionar um delay para garantir sincronização
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Buscar os IDs dos serviços criados
    const jobsResponse = await request(app).post("/api/getListJobs").send({ type: "ALL" });
    expect(jobsResponse.status).toBe(200);

    const jobs = jobsResponse.body.jobs;
    expect(jobs).toBeInstanceOf(Array);

    // Registar os IDs dos serviços criados
    for (const service of services) {
      const createdService = jobs.find((job) => job.NOTES === service.notes);
      expect(createdService).toBeDefined();
      serviceIds.push(createdService.JOB_ID);
    }
  });

  it("Deve filtrar serviços pelo estado 'Em progresso'", async () => {
    const jobsResponse = await request(app).post("/api/getListJobs").send({ type: 1 }); // Filtrar por estado 'Em progresso'
    expect(jobsResponse.status).toBe(200);

    const jobs = jobsResponse.body.jobs;
    expect(jobs).toBeInstanceOf(Array);
    expect(jobs.every((job) => job.STATUS_PROGRESS_CODE === "1")).toBe(true);
  });
});


describe("CT16 e CT18: Gestão de Clientes", () => {
  let clientId; // Para armazenar o ID do cliente criado

  // Teste para criação de clientes
  it("Deve criar um cliente com todos os campos obrigatórios preenchidos", async () => {
    const newClient = {
      name: "Cliente Teste",
      address: "Rua de Teste, 123",
      postCode: "1234-567",
      email: "cliente.teste@example.com",
      nif: "123456789",
    };

    // Criar cliente
    const createResponse = await request(app).post("/api/createClient").send(newClient);
    expect(createResponse.status).toBe(200);

    // Verificar se o cliente aparece na lista
    const clientsResponse = await request(app).get("/api/getClients");
    expect(clientsResponse.status).toBe(200);
    expect(clientsResponse.body.clients).toBeInstanceOf(Array);

    const createdClient = clientsResponse.body.clients.find(
      (client) => client.name === newClient.name && client.nif === newClient.nif
    );
    expect(createdClient).toBeDefined();

    clientId = createdClient.id; // Guardar o ID para o próximo teste
  });

  // Teste para eliminação de clientes
  it("Deve eliminar um cliente existente", async () => {
    expect(clientId).toBeDefined();

    // Eliminar cliente
    const deleteResponse = await request(app).delete(`/api/deleteClient/${clientId}`);
    expect(deleteResponse.status).toBe(200);

    // Verificar se o cliente foi removido da lista
    const clientsResponse = await request(app).get("/api/getClients");
    expect(clientsResponse.status).toBe(200);
    expect(clientsResponse.body.clients).toBeInstanceOf(Array);

    const deletedClient = clientsResponse.body.clients.find((client) => client.id === clientId);
    expect(deletedClient).toBeUndefined();
  });
});

describe("CT09: Edição de Serviços", () => {
  let serviceId;

  it("Deve criar um serviço", async () => {
    const newService = {
      userId: 1,
      userIdClient: 2,
      equipmentType: 1, // Tipo de equipamento representado por um ID numérico
      equipmentBrand: 1, // Marca do equipamento como ID numérico
      equipmentProcedure: 1, // Procedimento como ID numérico
      notes: "nota teste",
      status: 1, // Status inicial: Em progresso
      priority: 1, // Prioridade representada como numérico
    };

    const response = await request(app).post("/api/createJob").send(newService);
    expect(response.status).toBe(200);

    // Buscar o ID do serviço criado
    const jobsResponse = await request(app)
      .post("/api/getListJobs")
      .send({ type: "ALL" }); // Pede todos os serviços
    expect(jobsResponse.status).toBe(200);

    const jobs = jobsResponse.body.jobs;
    expect(jobs).toBeInstanceOf(Array);
    expect(jobs.length).toBeGreaterThan(0);

    // Obtém o último serviço criado
    const createdService = jobs[jobs.length - 1];
    serviceId = createdService.JOB_ID;
    expect(serviceId).toBeDefined();
  });

  it("Deve editar um serviço existente", async () => {
    const updatedService = {
      id: serviceId, // Usa o ID obtido do teste anterior
      userId: 1,
      userIdClient: 2,
      equipmentType: 1,
      equipmentBrand: 1,
      equipmentProcedure: 1,
      notes: "Updated notes", // Notas atualizadas
      status: 2, // Status alterado (e.g., Concluído)
      priority: 1,
    };

    const response = await request(app).put("/api/editJobInfo").send(updatedService);
    expect(response.status).toBe(200);
  });
});


describe("CT12: Remoção de Serviços Após Conclusão", () => {
    let serviceId;
  
    // Passo 1: Criar um serviço
    it("Deve criar um serviço", async () => {
      const newService = {
        userId: 1,
        userIdClient: 2,
        equipmentType: 1,
        equipmentBrand: 1,
        equipmentProcedure: 1,
        notes: "Serviço para teste de remoção",
        status: 1, // Status inicial: Em progresso
        priority: 1,
      };
  
      const response = await request(app).post("/api/createJob").send(newService);
      expect(response.status).toBe(200);
  
      // Buscar o ID do serviço criado
      const jobsResponse = await request(app).post("/api/getListJobs").send({ type: "ALL" });
      expect(jobsResponse.status).toBe(200);
  
      const jobs = jobsResponse.body.jobs;
      expect(jobs).toBeInstanceOf(Array);
      expect(jobs.length).toBeGreaterThan(0);
  
      // Obtém o último serviço criado
      const createdService = jobs[jobs.length - 1];
      serviceId = createdService.JOB_ID;
      expect(serviceId).toBeDefined();
    });
  
    // Passo 2: Atualizar o serviço para "Concluído"
    it("Deve marcar o serviço como 'Concluído'", async () => {
      const updatedService = {
        id: serviceId,
        userId: 1,
        userIdClient: 2,
        equipmentType: 1,
        equipmentBrand: 1,
        equipmentProcedure: 1,
        notes: "Serviço concluído",
        status: 4, // Status: Concluído
        priority: 1,
      };
  
      const response = await request(app).put("/api/editJobInfo").send(updatedService);
      expect(response.status).toBe(200);
    });
  
    // Passo 3: Verificar que o serviço não está mais na lista de serviços ativos
    it("Deve remover o serviço concluído da lista de serviços ativos", async () => {
      const jobsResponse = await request(app).post("/api/getListJobs").send({ type: "ALL" });
      expect(jobsResponse.status).toBe(200);
  
      const jobs = jobsResponse.body.jobs;
      expect(jobs).toBeInstanceOf(Array);
  
      // Verifica se o serviço concluído não aparece mais na lista
      const removedService = jobs.find((job) => job.JOB_ID === serviceId);
      expect(removedService).toBeUndefined();
    });
  });



describe("CT20: Pesquisa de Utilizadores", () => {
    // Testar a pesquisa de utilizadores por Nome
    it("Deve retornar utilizadores correspondentes ao critério de pesquisa por Nome", async () => {
      // Simulação de um critério de pesquisa por Nome
      const searchName = "Alcirio Reis";
  
      // Chamar a rota que retorna a lista de utilizadores
      const response = await request(app).get("/api/getUsers");
      expect(response.status).toBe(200);
  
      const users = response.body.users;
      expect(users).toBeInstanceOf(Array);
      expect(users.length).toBeGreaterThan(0);
  
      // Filtrar os utilizadores no teste para validar o critério de pesquisa
      const filteredUsers = users.filter((user) => user.name.includes(searchName));
  
      // Validar que os utilizadores retornados pelo backend correspondem ao critério
      expect(filteredUsers.length).toBeGreaterThan(0);
      filteredUsers.forEach((user) => {
        expect(user.name).toContain(searchName);
      });
    });
  
    // Testar a pesquisa de utilizadores por Email
    it("Deve retornar utilizadores correspondentes ao critério de pesquisa por Email", async () => {
      // Simulação de um critério de pesquisa por Email
      const searchEmail = "renato@gmail.com";
  
      // Chamar a rota que retorna a lista de utilizadores
      const response = await request(app).get("/api/getUsers");
      expect(response.status).toBe(200);
  
      const users = response.body.users;
      expect(users).toBeInstanceOf(Array);
      expect(users.length).toBeGreaterThan(0);
  
      // Filtrar os utilizadores no teste para validar o critério de pesquisa
      const filteredUsers = users.filter((user) => user.email.includes(searchEmail));
  
      // Validar que os utilizadores retornados pelo backend correspondem ao critério
      expect(filteredUsers.length).toBeGreaterThan(0);
      filteredUsers.forEach((user) => {
        expect(user.email).toContain(searchEmail);
      });
    });
  });


describe("CT22: Edição de Dados de Utilizadores", () => {
  let userId;

  beforeAll(async () => {
      const newUser = {
          userName: "Test User",
          name: "testuser",
          email: "testuser@example.com",
          password: "password123",
          role: "A",
      };

      const response = await request(app).post("/api/createUser").send(newUser);
      expect(response.status).toBe(200);

      const usersResponse = await request(app).get("/api/getUsers");
      expect(usersResponse.status).toBe(200);
      expect(usersResponse.body.users).toBeInstanceOf(Array);

      const createdUser = usersResponse.body.users.find(
          (user) => user.userName === newUser.name && user.name === newUser.userName
      );

      expect(createdUser).toBeDefined();
      userId = createdUser ? Number(createdUser.id) : undefined;
  });

  it("Deve editar os dados de um utilizador existente", async () => {
      expect(userId).toBeDefined();

      const updatedUser = {
          id: userId,
          name: "Updated User",
          email: "updateduser@example.com",
          role: "A"
      };

      // Enviar a alteração para a API
      const response = await request(app).put("/api/editUser").send(updatedUser);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Adicionar um delay para garantir consistência (se necessário)
      await new Promise((resolve) => setTimeout(resolve, 100));

      const usersResponse = await request(app).get("/api/getUsers");
      expect(usersResponse.status).toBe(200);
      expect(usersResponse.body.users).toBeInstanceOf(Array);


      const editedUser = usersResponse.body.users.find(
          (user) => Number(user.id) === userId
      );

      expect(editedUser).toBeDefined();

      // Verificar os valores atualizados usando `toMatchObject`
      expect(editedUser).toMatchObject({
          name: updatedUser.name,
          email: updatedUser.email,
          roleCode: updatedUser.role,
      });
  });

  afterAll(async () => {
      if (userId) {
          const response = await request(app).delete(`/api/deleteUser/${userId}`);
          expect(response.status).toBe(200);
      }
  });
});



// Para este teste é necessário fazer mock por não exitir a rota /api/sendMessage
const messagingHandlers = require("../scripts/messaging-handlers");

// Mock apenas para a parte de mensagens
jest.mock("../scripts/messaging-handlers");

describe("CT25: Envio de Mensagens Instantâneas", () => {
  let senderId;
  let recipientId;

  beforeAll(async () => {
    const sender = {
      userName: "senderUser",
      name: "Sender",
      email: "sender@example.com",
      password: "password123",
      role: "A",
    };

    const recipient = {
      userName: "recipientUser",
      name: "Recipient",
      email: "recipient@example.com",
      password: "password123",
      role: "A",
    };

    // Criar utilizadores para o teste
    await request(app).post("/api/createUser").send(sender);
    await request(app).post("/api/createUser").send(recipient);

    const usersResponse = await request(app).get("/api/getUsers");
    expect(usersResponse.status).toBe(200);

    const users = usersResponse.body.users;
    senderId = users.find((user) => user.userName === sender.name)?.id;
    recipientId = users.find((user) => user.userName === recipient.name)?.id;

    expect(senderId).toBeDefined();
    expect(recipientId).toBeDefined();
  });

  it("Deve enviar e verificar uma mensagem instantânea", async () => {
    // Mock da função `messagingInsertNew` para simular envio de mensagem
    messagingHandlers.messagingInsertNew.mockImplementation((message, callback) => {
      callback(1); // Simula sucesso ao inserir mensagem
    });

    // Mock do endpoint `/api/sendMessage`
    app.post("/api/sendMessage", (req, res) => {
      const { from, to, message, seen } = req.body;
      if (from && to && message !== undefined && seen !== undefined) {
        res.status(200).json({ success: true, messageId: 1 });
      } else {
        res.status(400).json({ success: false });
      }
    });

    // Simular envio de mensagem
    const message = {
      from: senderId,
      to: recipientId,
      message: "Olá, esta é uma mensagem de teste!",
      seen: false,
    };

    const sendMessageResponse = await request(app).post("/api/sendMessage").send(message);
    expect(sendMessageResponse.status).toBe(200);
    expect(sendMessageResponse.body.success).toBe(true);

    // Mock da consulta das mensagens
    messagingHandlers.loadWebSocketMessages.mockImplementation((req, res) => {
      res.json([
        {
          MESSAGE_FROM_ID: senderId,
          MESSAGE_TO_ID: recipientId,
          MESSAGE: message.message,
        },
      ]);
    });

    // Simular consulta das mensagens recebidas
    const recipientMessagesResponse = await request(app)
      .post("/api/loadWebSocketMessages")
      .send({ id: recipientId });
    expect(recipientMessagesResponse.status).toBe(200);
    expect(recipientMessagesResponse.body).toBeInstanceOf(Array);

    const receivedMessage = recipientMessagesResponse.body.find(
      (msg) => msg.MESSAGE_FROM_ID === senderId && msg.MESSAGE_TO_ID === recipientId
    );

    expect(receivedMessage).toBeDefined();
    expect(receivedMessage.MESSAGE).toBe(message.message);
  });

  afterAll(async () => {
    if (senderId) {
      await request(app).delete(`/api/deleteUser/${senderId}`);
    }
    if (recipientId) {
      await request(app).delete(`/api/deleteUser/${recipientId}`);
    }
  });
});