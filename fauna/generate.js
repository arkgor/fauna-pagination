const Fakerator = require("fakerator");
const fake = Fakerator();
const faunadb = require("faunadb"),
  q = faunadb.query;
const client = new faunadb.Client({
  secret: "<fauna_secret>",
});

const fakeSentence = fake.lorem.sentence;
const fakeName = fake.names.name;

// RUN MAIN SCRIPT
main();

async function main() {
  let [Students, Projects, Tests] = await Promise.all([
    generateIDs(10),
    generateIDs(5),
    generateIDs(550),
  ]);

  const dummyStudents = Students.map(
    pipe(createBaseObject, addName(fakeName), saveStudent)
  );
  const dummyProjects = Projects.map(
    pipe(
      createBaseObject,
      addName(fakeSentence),
      assignStudent(randomStudent),
      saveProject
    )
  );
  const dummyTest = Tests.map(
    pipe(
      createBaseObject,
      addName(fakeSentence),
      assignStudent(randomStudent),
      assignProject(randomProject),
      saveTest
    )
  );

  await Promise.all([dummyStudents, dummyProjects, dummyTest]);

  function randomStudent() {
    return Students[randomNumber(0, Students.length - 1)];
  }

  function randomProject() {
    return Projects[randomNumber(0, Projects.length - 1)];
  }
}

function pipe(...fns) {
  return (x) => fns.reduce((v, f) => f(v), x);
}

function queue(_, index) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), index * 175);
  });
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * max) + min;
}

function newID() {
  return client.query(q.NewId());
}

function generateIDs(length) {
  return Promise.all(new Array(length).fill("").map(pipe(queue, newID)));
}

function assignStudent(studentID) {
  return (obj) => {
    obj.data.student = q.Ref(q.Collection("Student"), studentID());
    return obj;
  };
}

function assignProject(projectID) {
  return (obj) => {
    obj.data.project = q.Ref(q.Collection("Project"), projectID());
    return obj;
  };
}

function saveStudent(student) {
  return client.query(
    q.Create(q.Ref(q.Collection("Student"), student.id), {
      data: student.data,
    })
  );
}

function saveProject(project) {
  return client.query(
    q.Create(q.Ref(q.Collection("Project"), project.id), {
      data: project.data,
    })
  );
}

function saveTest(test) {
  return client.query(
    q.Create(q.Ref(q.Collection("Test"), test.id), {
      data: test.data,
    })
  );
}

function addName(name) {
  return (obj) => {
    obj.data.name = name();
    return obj;
  };
}

function createBaseObject(id) {
  return {
    id,
    data: {},
  };
}
