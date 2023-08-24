## Florian Council App

# Description

Introducing Florin County Council app: Empower Your Ideas for a Better Community

Imagine having the ability to directly influence the positive transformation of your town. With the Florin County Council App, your suggestions for improving key aspects of our community – recycling, public services, landscape, and skills – can be heard and put into action.

**1. Revolutionize Recycling:**
Be a catalyst for change in our town's recycling practices. The Florin County Council provides you with a platform to propose innovative recycling solutions, share insights on reducing waste, and even suggest locations for additional recycling bins. Your ideas can drive a more sustainable future for our environment.

**2. Elevate Public Services:**
Make your voice heard when it comes to public services. Whether it's improving road infrastructure, enhancing safety measures, or suggesting new community amenities, the app enables you to actively participate in shaping the services that impact your daily life.

**3. Transform Our Landscape:**
Envision a more beautiful and inviting town landscape. With the Florin County Council App, you can propose landscaping projects, recommend enhancements for parks and public spaces, and even initiate community clean-up events. Together, we can nurture a town that reflects our pride and unity.

**4. Share Skills, Enrich Lives:**
The Florin County Council App is not just a platform; it's a community hub for knowledge sharing. Whether you have expertise in arts, crafts, education, or any other skill, you can organize workshops, mentor others, and contribute to the cultural and educational growth of our town.

# Installation & Usage

1. Copy the SSH key on the GitHub Repo.
2. Open your terminal and navigate to the desired directory using the command `cd <write file path here>`.
3. Run the command `git clone <Paste SSH key here>`.
6. Run the command `npm install` to install the required dependencies.
7. Run the command `code .` in the terminal to open the project in VSCode.
8. Open your Docker app in your computer
9. Create  `docker-compose.yaml` file and add the following amending when required: 

```
version: '3.8'
services:
  client:
    image: node:18
    container_name: <give it a name>
    ports:
      - 8080:8080
    volumes:
      - type: bind
        source: ./client
        target: /code
    working_dir: /code
    command: bash -c "npm install && npm run dev"
    depends_on:
      - api

  api:
    image: node:18
    container_name: <give it a name>
    environment:
      - DB_URL=postgres://<user_name>:<password>@localhost:5432/<database_name>
      - PORT=3000
    ports:
      - 3000:3000
    volumes:
      - type: bind
        source: ./server
        target: /code
    working_dir: /code
    command: bash -c "npm install && npm run dev"
    depends_on:
      - db

  db:
    image: postgres
    container_name: <give it a name>
    ports:
      - 5432:5432
    volumes:
      - dbdata:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=<database name>
      - POSTGRES_USER=<username>
      - POSTGRES_PASSWORD=<password>

volumes:
  dbdata:
    name: <give it a name>
```

1. In the server folder create a file called `.env`.
2. In this file paste the following
`PORT = 3000 DB_URL = <Paste the Database URL format from docker TEST_DB_URL = <Repeat the process of making a new database if you need to do testing> BCRYPT_SALT_ROUNDS = 12`
3. Run the commands `cd server` & `npm run dev` in the terminal.
4. Open the project using live server from the `index.html` file located inside the client and homepage directories.

# Running the App From the Browser

- If you do not want to develop the app further but would like to see it in action, there is a hosted version available from the following URL

# Planned Improvements

- Time - Stamp: Add time-stamp of when a suggestion was made.
- Implemented Suggestions: Add page showing what suggestions have already been implemented
- Profile - Section: Expanded profiles with icons, detailed contributions and badges.
- Language - Dropdown: Dropdown menu that selects your chosen language. Lots of translation work.

# **Technologies**

- HTML
- SQL
- CSS
- Docker
- JavaScript
- Jest
- Express
- SuperTest
- Node
- Render

# Contributors

- Charlie Mitchell
- Barbara Fajardo
- Sam McGinnes
- Rubina Kumari
