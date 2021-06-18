### Project structure and code convention

This project follow Clean Architecture and mainly inspired by:

- Original "Uncle Bob" presentation: https://youtu.be/Nsjsiz2A9mg
- Java sample by Mattia Battiston: https://github.com/mattia-battiston/clean-architecture-example

**Not thing perfect**. Before coding follow Clean Architecture, there are some trade-offs values to maximize other values that we need to know

- Trade-offs values:

  - **Code duplication**. There are some duplicating code we're gonna write to follow this architecture
  - **Time-taking** for initiate a new use case: it takes more time to start a new interactor, we have to think about naming, logic error, gateway methods, configuration, inject gateways, inject to entrypoints instead of just call directly dbModel and Kafka method like we did.

- Maximize values:
  - **Logic-focus and Logic-consistences**: we can easily adding more entrypoints to support client like SOAP, RESTFul, GraphQL ... and confidence that all the entrypoints will run with the same logic without rewrite it in each entrypoints.
  - **Decoupling**: We can easily later add or change external resources without touching our application logic.
  - **Screaming**: We can quickly find out which-is-doing-what by looking at the folder structure instead of reading code in many files.

**Folder roles**:

- `entities`: Where we store the things related to business and use for the whole system.
- `application`: Where we write the main application logic.
- `entrypoints`: where the client call in our app: RESTful, websocket, gRPC, ...
- `infrastructure` where we write the code to use external resource like: database, event bus.

**Where to initiate the instances**:

- `src/entrypoints/index.js` is where to start the entrypoints of application.
- `src/infrastructure/index.js` is where to start the instances that need to be singleton like: database connection, kafka connection, ... then expose some methods allows to to get new instances of adapters.

**Convention coding**: we are follow Airbnb coding convention, please read and follow: https://github.com/airbnb/javascript




## Unit tests in API development

### Unit testing and why it matters

- If a new API or feature has been rolled out to the production environment, unit testing is one of several steps that must be passed during the deployment. Needless to say: `what is unit testing or its benefits`, there are a lot of articles talk about unit testing on the Internet with countless tips, style advice, and best practices information.

![alt text](https://memegenerator.net/img/instances/64979138.jpg)

### Unit testing is painful

- Yes, I’ve met many developers talk about unit testing, and some completely hate it. Not just because it can take time and hopeless to write, but also because it requires them to update their existed code to make it more testable and complex as well as slow down development speed. Furthermore, it's difficult to apply unit tests while continuously maintain someone else code.

![alt text](https://memegenerator.net/img/instances/67770835/unit-testing-aint-nobody-got-time-for-that.jpg)

### But it really helps you!

- In some instances, a feature can be hard to test if there are a lot of client-side interaction and you may think about yourself, why should I write a lot of test cases or mocking up all states of external related things to test only 20 lines of code? Let’s think about the risk of those 20 lines of code, that could make a bit of damage to an already functioning or some worked-well services on production, those tests could save you from having to debug your (or your teammate) code, then prevent you from submit a hotfix pull request or have to write an incident report to teams despite of it's a beautiful Sunday.

- Not only check the code you have written but pre-testing the existing code base to ensure the integration of your function will not fluff up other already functioning.  While there are some failure test cases in red that notify us about the problem with the code base, each passed unit tests can give us the confidence that we are going to get fewer errors.


![alt text](https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT4drB3bDqqIkLXOjSdIo_s7vmOwH5j_RXtpA&usqp=CAU)

- The only purpose of my writing is to explain why we should apply unit tests during the development, hope you (as a developer, who may hate unit tests 😆) could approach our practices easier and feel more comfortable.

### Rules to write a unit test

- In order to consistent our unit test on all services, we need a guideline for developers following during their implementation, we also apply the unit test guideline to reviewing pull request.

- We applying unit tests in the development, of course, unit tests are required when any developer submits their PR. But during the code review, there are a lot of practices that our developers used to write their unit tests, this article proposes a test pattern we should apply to implement a new feature or API, to make the code review upon unit tests following for more consistency to everyone.

`We using NodeJS to implement most APIs, so I will use Javascript for all examples and Jest to run unit tests in this article, but the concepts described could apply to other languages.`

## Build a to-do API, and unit tests

- Here I want to build unit tests for a simple APIs for my todo app: an API create new todo. Let’s start with the structure, we will need some resources below:
- 1.An HTTP server to handle client requests (entrypoints).
- 2.A database (using Postgres) to handle the todo object (infrastructure). We create a data-gateway to interact with data, using Postgres as a provider and have a method is a create-todo.
  `The create-todo method should do one thing: create a new record to the database. Here are the test cases for this method.`

```javascript
/**
 * File path: /infrastructure/data-gateway/methods/create-todo.test.js
 */
const createTodo = require("./create-todo");

let mockError;
let mockInput;
let mockTodo;
let mockPgPrimary;

beforeEach(() => {
 mockError = new Error("Oops");
 mockPgPrimary = jest.createMockFromModule('../providers/pgPrimary')
 mockPgPrimary.query = jest.fn()

 mockInput = {
   title: "Check-out at company",
   status: "undone",
 };
 mockTodo = {
   id: "0002",
   title: "Check-out at company",
   status: "undone",
   created_at: new Date(),
 };
});

describe("Testing create todo method", () => {
 test("Should throw an error if postgres is not work", () => {
   mockPgPrimary.query.mockRejectedValue(mockError);

   let actualError;
   try {
     await createTodo(mockInput);
   } catch (error) {
     actualError = error;
   }

   const expectedError = new Error("Oops");
   expect(actualError.message).toBe(expectedError.message);
   expect(actualError.code).toBe(expectedError.code);
 });
 test("Should return a todo record", async () => {
   mockPgPrimary.query.mockRejectedValue({mockTodo});

   const result = await bindFn(mockInput);

   expect(result).toEqual(expectedResult);
 });
});
```
 
`Should declare all mocking variables before declaring test cases, because you can reuse it in several test cases after.`

`Should test the exception cases first, because if any exception case is failed, there is no reason to run the next case. A function should make sure that all the exception cases we can define will be caught before it returns a result.`

`Use .toEqual() for test two objects, because it compares recursively all properties of object instances (also known as "deep" equality)`


- 3.An interactions (aka controllers) to handle create todo. The create-todo interactor receives the todo object as the input and returns a todo entity as the output.

  `This function calls data-gateway to create a todo record, and returns a todo object or throw an error. We create a draft version of this interactor before write test cases to determine it’s construction.`

```javascript
/**
 * File path: /controller/todo/create-todo/interactor.js
 */
const dataGateway = require("../../../infrastructure/data-gateway/data-gateway");

module.exports = async ({}) => {
  try {
  } catch (error) {}
};
```

```javascript
/**
 * File path: /application/interactors/create-todo/interactor.test.js
 */
const interactor = require("./interactor");

let mockError;
let mockInput;
let mockTodo;
let mockDataGateway;

beforeEach(() => {
  mockError = new Error("Oops");

  mockDataGateway = jest.createMockFromModule(
    "../../../infrastructure/data-gateway/data-gateway"
  );
  mockDataGateway.createTodo = jest.fn();

  mockInput = {
    title: "Check-out at company",
    status: "undone",
  };
  mockTodo = {
    ...mockInput,
    id: "0003",
    created_at: new Date(),
  };
});

test("Should throw an error if data gateway create todo error", async () => {
  mockDataGateway.createTodo.mockRejectedValue(mockError);

  let actualError;
  try {
    await interactor(mockInput);
  } catch (error) {
    actualError = error;
  }

  const expectedError = new Error("Oops");https://www.npmjs.com/package/node-pg-migrate: 
  expect(actualError.message).toBe(expectedError.message);
  expect(actualError.code).toBe(expectedError.code);
});

test("Should return a todo object", async () => {
  mockDataGateway.createTodo.mockResolvedValue(mockTodo);

  const result = await interactor(mockInput);

  expect(result).toEqual(mockTodo);
});
```

`
- If there are many test cases, should use beforeEach() to reset all mocking variables before each test case and declare all mocking variables with full attributes for the success case. In the case of invalid input, we can delete the mocking input object attributes to adapt the test case, it helps you unneeded to remember what attribute you have declared in the test case before, just delete or modify which you need in the current test case.

- Some naming conventions should follow to make all test files consistency:

- Mock function input should be mockInput.

- Mock function error should be mockError.
it message
￼
Target Branch
￼
￼Commit changesCancel

- Mock function object should be mockObjectname.

- The success test case should naming follow the format: Should return a <resource_result>.

- The exception test case should naming follow the format: Should throw an error if <some_reasons>.

- For the exception test cases, should use a try-catch statement, declare the actualError object, and assign it from the error in the catch statement, to avoid your test code run passthrough the catch statement. Create a new expectedError in each exception case to compare with the actual error, this variable is specified for every single case, so we should not use it as the general variable as mocking object.

- Should compare both error code and error message instead of using .toEqual() for the actual and the expected error, because only the message property of an Error is considered for equality.

These examples above have been covering the basic cases of unit testing, find more information on our Github repository. When a PR was being submitted, we just follow the rules in this article for review, to make all developers on the same page. Any contribution is welcome for improving. 
https://gitlab.com/hoangthequyen01/base_code