# Authentication & Authorization - MySQL, REACT, EXPRESS, NODE.JS, PASSPORT.JS

![Image of HeaderPage](https://github.com/oneil213/MsqlCrud-Auth/blob/9b70bb704754aa5474a317f71891933b08c448f5/client/src/assets/img/header.jpg)
A simple boilerplate application for authentication and authorization using the MERN STACK.

This Application includes some security features listed below

```
1. limitation on the body payload using body-parser
   app.use(express.json({limit: '10kb})) // This limits the data size a user can pass.

2. Express-rate-limit-dependency. This basically sets the maximum request per each user before they get locked out
   const limit = rateLimit({
   max: 100, // max requests
   windowMs: 60 _ 60 _ 1000, // 1 Hour
   message: "Too many requests", // message to send
   });

3. xss-clean used to prevent XSS Attacks
   app.use(xss())

4. Then finally helmet which is a collection of middleware functions
   app.use(helmet())
```

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Things you need to install the software and how to install them

```
Make sure you have node.js  and npm . node v10.16.3 (https://nodejs.org/en/download/)installed
How to install node.js and NPM on windows (https://treehouse.github.io/installation-guides/windows/node-windows.html)
How to install node.js and NPM on mac (https://treehouse.github.io/installation-guides/mac/node-mac.html)
```

```
Make sure you have installed MySQL on your local machine (https://dev.mysql.com/downloads/mysql/)
How to install MySQL (https://dev.mysql.com/doc/mysql-getting-started/en/)
```

```
Make sure you have installed MySQL Benchmark Tool (https://dev.mysql.com/downloads/benchmarks.html)
You only need this to easily manage your database
```

```
Create an email testing account with Ethereal (https://ethereal.email/create)
```

### Installing

A step by step series of examples that tell you how to get a development env running

```
Download or fork this repo

```

```
cd to the root folder

```

open the .env file and provide the following...

```
JWT_SECRET='your own secret'
DB_PASSWORD='the database password you created in MySQL'
DB_USER='your MySQL username'
EMAIL_ADDRESS='the email address you created in ethereal for testing nodemailer'
EMAIL_PASSWORD='your password to the email address on ethereal'

```

open the db.config.js file in the config folder and provide the following

```
HOST: "localhost",
USER: process.env.DB_USER, // this remain the same
PASSWORD: process.env.DB_PASSWORD, // this remain the same
DB: "the name you gave the scheme you created in the MySQL server you downloaded earlier",
dialect: "mysql", // this remain the same

```

open the email.config.js file in the config folder and provide the following

```
module.exports = {
USER: process.env.EMAIL_ADDRESS, // no need to change anything here
PASS: process.env.EMAIL_PASSWORD, // no need to change anything here
};

This were all set in your .env file

```

open the server.js file
Find the //database

Anytime you want to drop the whole table simply un-comment

this

```
db.sequelize
.sync({
force: true,
})
.then(() => {
console.log("Drop and Resync Database with { force: true }");
initial();
});
```

and comment this out

```
// db.sequelize
// .sync()
// .then(() => console.log("database connected"))
// .catch((error) => console.log("This error occurred", error));

```

Open your terminal

```

type : npm install

```

Cd into the client folder

```
open the .env file
make sure your PORT setup is the same as setup in your cors-option in the server file.
PORT=5051

```

open the package.json file and ensure you have your proxy set up

```
 "proxy": "http://localhost:5050" // I listened on port 5050 in this case.

This is needful in other not to repeat the directory all the time in the frontend request.
It gets add automatically.
```

Open your terminal

```
type : npm install //make sure now you are in the client folder

```

in the terminal opened for the root folder

```
type : npm start

```

in the terminal opened for the client folder

```
type: npm start

```

## Deployment

Depending on your deployment platform

## Built With

- [Node](https://nodejs.org/en/download/) - The web framework used
- [ReactStrap](https://reactstrap.github.io) - The web framework used
- [Mysql](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwjJxLuPw8rqAhWN3oUKHR83De4Q0gIoATAAegQIAxAI&url=https%3A%2F%2Fdev.mysql.com%2Fdownloads%2F&usg=AOvVaw0sgOa3GBI0b7wNx3SlFMDn) - Used to create local database

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository]().

## Authors

- **Adeola Oni** - _Initial work_ - [Oneil213](https://github.com/oneil213/)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- CREATIVE TIM
