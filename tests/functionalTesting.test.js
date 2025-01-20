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